"""
Documentation Harmonization Engine.

Orchestrates the systematic analysis and reorganization of documentation.
Provides incremental processing, checkpointing, and reporting capabilities.
"""

import json
import os
import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

try:
    import yaml
except ImportError:
    raise ImportError("PyYAML is required. Install with: pip install pyyaml")

from .schemas import (
    ActionType,
    DocumentProcessingResult,
    ProcessingState,
    ProcessingStatus,
    ScopeConfig,
    get_scope_config,
    PREDEFINED_SCOPES,
)
from .analyzer import DocumentAnalyzer, DocumentContent, create_context_for_ai
from .grok_agent import DocumentAgent, create_agent


class HarmonizationEngine:
    """
    Main engine for documentation harmonization.
    
    Coordinates document analysis, AI recommendations, and applies changes.
    Supports incremental processing with checkpoints for large document sets.
    """
    
    def __init__(
        self,
        docs_root: str = "docs",
        state_dir: str = "docs/.harmonize",
        use_mock_ai: bool = False,
        dry_run: bool = True
    ):
        """
        Initialize the harmonization engine.
        
        Args:
            docs_root: Root directory containing documentation
            state_dir: Directory for storing state and checkpoints
            use_mock_ai: Use mock AI client for testing
            dry_run: If True, don't actually modify files
        """
        self.docs_root = Path(docs_root)
        self.state_dir = Path(state_dir)
        self.dry_run = dry_run
        
        # Initialize components
        self.analyzer = DocumentAnalyzer(docs_root)
        self.agent = create_agent(use_mock=use_mock_ai)
        
        # Processing state
        self.state: Optional[ProcessingState] = None
        self.current_batch: List[DocumentContent] = []
        
        # Callbacks
        self._progress_callback: Optional[Callable[[int, int, str], None]] = None
        self._result_callback: Optional[Callable[[DocumentProcessingResult], None]] = None
        
        # Ensure state directory exists
        self.state_dir.mkdir(parents=True, exist_ok=True)
    
    def set_progress_callback(self, callback: Callable[[int, int, str], None]):
        """Set callback for progress updates: (current, total, message)."""
        self._progress_callback = callback
    
    def set_result_callback(self, callback: Callable[[DocumentProcessingResult], None]):
        """Set callback for individual results."""
        self._result_callback = callback
    
    def _emit_progress(self, current: int, total: int, message: str = ""):
        """Emit progress update."""
        if self._progress_callback:
            self._progress_callback(current, total, message)
    
    def _emit_result(self, result: DocumentProcessingResult):
        """Emit result update."""
        if self._result_callback:
            self._result_callback(result)
    
    # =========================================================================
    # State Management
    # =========================================================================
    
    def _get_state_path(self, session_id: str) -> Path:
        """Get path for state file."""
        return self.state_dir / f"state_{session_id}.json"
    
    def save_state(self):
        """Save current state to file."""
        if not self.state:
            return
        
        state_path = self._get_state_path(self.state.session_id)
        with open(state_path, 'w', encoding='utf-8') as f:
            json.dump(self.state.to_dict(), f, indent=2, default=str)
    
    def load_state(self, session_id: str) -> Optional[ProcessingState]:
        """Load state from file."""
        state_path = self._get_state_path(session_id)
        if not state_path.exists():
            return None
        
        with open(state_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return ProcessingState.from_dict(data)
    
    def get_latest_session(self) -> Optional[str]:
        """Get the most recent session ID."""
        state_files = list(self.state_dir.glob("state_*.json"))
        if not state_files:
            return None
        
        # Sort by modification time
        state_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        
        # Extract session ID from filename
        latest = state_files[0]
        return latest.stem.replace("state_", "")
    
    def list_sessions(self) -> List[Dict[str, Any]]:
        """List all available sessions."""
        sessions = []
        for state_file in self.state_dir.glob("state_*.json"):
            try:
                with open(state_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                sessions.append({
                    'session_id': data['session_id'],
                    'started_at': data['started_at'],
                    'scope': data['scope'],
                    'total': data['total_documents'],
                    'processed': data['processed_count'],
                    'pending': len(data['pending_documents'])
                })
            except Exception:
                continue
        
        return sorted(sessions, key=lambda x: x['started_at'], reverse=True)
    
    # =========================================================================
    # Document Discovery
    # =========================================================================
    
    def discover_documents(self, scope: ScopeConfig) -> List[Path]:
        """
        Discover documents within a scope.
        
        Also finds related documents in other categories based on keywords.
        """
        # Get primary documents
        primary_docs = self.analyzer.find_documents_by_scope(
            scope.include_patterns,
            scope.exclude_patterns
        )
        
        # Find related documents in other categories if scope has keywords
        related_docs = set()
        if scope.keywords and scope.related_categories:
            for category in scope.related_categories:
                cat_scope = get_scope_config(category) if category in PREDEFINED_SCOPES else None
                if cat_scope:
                    cat_docs = self.analyzer.find_documents_by_scope(
                        cat_scope.include_patterns,
                        cat_scope.exclude_patterns
                    )
                    # Check each document for keyword matches
                    for doc_path in cat_docs:
                        try:
                            content = doc_path.read_text(encoding='utf-8').lower()
                            if any(kw in content for kw in scope.keywords):
                                related_docs.add(doc_path)
                        except Exception:
                            continue
        
        # Combine and deduplicate
        all_docs = set(primary_docs) | related_docs
        return sorted(list(all_docs))
    
    # =========================================================================
    # Processing
    # =========================================================================
    
    def start_session(
        self,
        scope_name: str,
        resume_session: Optional[str] = None,
        batch_size: int = 50
    ) -> str:
        """
        Start a new harmonization session or resume an existing one.
        
        Args:
            scope_name: Name of the scope to process
            resume_session: Session ID to resume (optional)
            batch_size: Number of documents to process per batch
            
        Returns:
            Session ID
        """
        if resume_session:
            # Load existing state
            self.state = self.load_state(resume_session)
            if not self.state:
                raise ValueError(f"Session {resume_session} not found")
            
            print(f"Resuming session {resume_session}")
            print(f"  {len(self.state.pending_documents)} documents remaining")
            return resume_session
        
        # Get scope configuration
        scope = get_scope_config(scope_name)
        
        # Discover documents
        print(f"Discovering documents for scope '{scope_name}'...")
        documents = self.discover_documents(scope)
        print(f"Found {len(documents)} documents")
        
        # Create new session
        session_id = str(uuid.uuid4())[:8]
        
        self.state = ProcessingState(
            session_id=session_id,
            started_at=datetime.now().isoformat(),
            scope=scope_name,
            total_documents=len(documents),
            processed_count=0,
            pending_documents=[str(d.relative_to(self.docs_root)) for d in documents],
            completed_documents=[],
            failed_documents=[]
        )
        
        self.save_state()
        return session_id
    
    def process_batch(
        self,
        batch_size: int = 10,
        delay_between_calls: float = 1.0
    ) -> List[DocumentProcessingResult]:
        """
        Process a batch of documents.
        
        Args:
            batch_size: Number of documents to process
            delay_between_calls: Delay between API calls
            
        Returns:
            List of processing results
        """
        if not self.state:
            raise ValueError("No active session. Call start_session first.")
        
        if not self.state.pending_documents:
            print("No pending documents to process")
            return []
        
        # Get batch
        batch_paths = self.state.pending_documents[:batch_size]
        results = []
        
        print(f"Processing batch of {len(batch_paths)} documents...")
        
        for i, rel_path in enumerate(batch_paths):
            doc_path = self.docs_root / rel_path
            
            self._emit_progress(
                i + 1, 
                len(batch_paths), 
                f"Analyzing: {rel_path}"
            )
            
            try:
                # Analyze document
                doc = self.analyzer.analyze_document(doc_path)
                
                # Find related documents for context
                all_docs = [
                    self.analyzer.analyze_document(self.docs_root / p)
                    for p in self.state.completed_documents[-20:]  # Last 20 processed
                    if (self.docs_root / p).exists()
                ]
                
                related = self.analyzer.find_related_by_content(doc, all_docs)
                related_docs = [r[0] for r in related[:3]]  # Top 3 related
                
                # Create context for AI
                context = create_context_for_ai(doc, related_docs)
                
                # Get AI analysis
                result = self.agent.analyze_document(context)
                result.document_path = rel_path
                result.processed_at = datetime.now().isoformat()
                
                # Update state
                self.state.pending_documents.remove(rel_path)
                self.state.completed_documents.append(rel_path)
                self.state.processed_count += 1
                self.state.results[rel_path] = result
                
                results.append(result)
                self._emit_result(result)
                
            except Exception as e:
                print(f"Error processing {rel_path}: {e}")
                result = DocumentProcessingResult(
                    document_path=rel_path,
                    status=ProcessingStatus.ERROR,
                    error_message=str(e),
                    processed_at=datetime.now().isoformat()
                )
                
                self.state.pending_documents.remove(rel_path)
                self.state.failed_documents.append(rel_path)
                self.state.results[rel_path] = result
                
                results.append(result)
            
            # Save checkpoint
            if (i + 1) % 5 == 0:
                self.save_state()
            
            # Delay between calls
            if i < len(batch_paths) - 1:
                import time
                time.sleep(delay_between_calls)
        
        # Final save
        self.save_state()
        
        return results
    
    def process_all(
        self,
        batch_size: int = 10,
        delay_between_calls: float = 1.0,
        max_batches: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Process all pending documents.
        
        Args:
            batch_size: Documents per batch
            delay_between_calls: Delay between API calls
            max_batches: Maximum number of batches (None for all)
            
        Returns:
            Summary statistics
        """
        if not self.state:
            raise ValueError("No active session")
        
        batch_count = 0
        all_results = []
        
        while self.state.pending_documents:
            if max_batches and batch_count >= max_batches:
                print(f"Reached max batches ({max_batches})")
                break
            
            results = self.process_batch(batch_size, delay_between_calls)
            all_results.extend(results)
            batch_count += 1
            
            print(f"Batch {batch_count} complete. "
                  f"{len(self.state.pending_documents)} documents remaining.")
        
        return self.generate_summary()
    
    # =========================================================================
    # Applying Changes
    # =========================================================================
    
    def apply_recommendations(
        self,
        filter_actions: Optional[List[ActionType]] = None,
        filter_priority: Optional[List[str]] = None,
        require_approval: bool = True
    ) -> Dict[str, Any]:
        """
        Apply recommended actions to documents.
        
        Args:
            filter_actions: Only apply these action types
            filter_priority: Only apply these priorities
            require_approval: Require manual approval before applying
            
        Returns:
            Summary of applied changes
        """
        if not self.state:
            raise ValueError("No active session")
        
        applied = []
        skipped = []
        errors = []
        
        for path, result in self.state.results.items():
            if not result.action:
                continue
            
            action = result.action
            
            # Filter by action type
            if filter_actions and action.action not in filter_actions:
                skipped.append((path, "action type filtered"))
                continue
            
            # Filter by priority
            if filter_priority and action.priority not in filter_priority:
                skipped.append((path, "priority filtered"))
                continue
            
            # Check approval
            if require_approval and result.status != ProcessingStatus.APPROVED:
                skipped.append((path, "not approved"))
                continue
            
            # Apply the action
            try:
                if self.dry_run:
                    print(f"[DRY RUN] Would apply {action.action.value} to {path}")
                    applied.append((path, action.action.value, "dry run"))
                else:
                    self._apply_action(path, result)
                    applied.append((path, action.action.value, "applied"))
                    result.status = ProcessingStatus.APPLIED
            except Exception as e:
                errors.append((path, str(e)))
        
        self.save_state()
        
        return {
            'applied': applied,
            'skipped': skipped,
            'errors': errors
        }
    
    def _apply_action(self, path: str, result: DocumentProcessingResult):
        """Apply a single action to a document."""
        action = result.action
        doc_path = self.docs_root / path
        
        if action.action == ActionType.UPDATE_FRONTMATTER:
            self._update_frontmatter(doc_path, result.frontmatter)
        
        elif action.action == ActionType.MOVE:
            if action.target_path:
                self._move_document(doc_path, self.docs_root / action.target_path)
        
        elif action.action == ActionType.DELETE:
            self._delete_document(doc_path)
        
        elif action.action == ActionType.MERGE:
            if action.merge_with:
                self._merge_documents(doc_path, action.merge_with)
        
        # Other actions might need manual intervention
    
    def _update_frontmatter(self, doc_path: Path, frontmatter):
        """Update document frontmatter."""
        if not frontmatter:
            return
        
        content = doc_path.read_text(encoding='utf-8')
        
        # Parse existing frontmatter
        if content.startswith('---'):
            end_idx = content.find('---', 3)
            if end_idx != -1:
                body = content[end_idx + 3:].lstrip('\n')
            else:
                body = content
        else:
            body = content
        
        # Write new frontmatter
        new_fm = frontmatter.to_yaml_dict()
        new_content = '---\n' + yaml.dump(new_fm, default_flow_style=False, sort_keys=False) + '---\n' + body
        
        doc_path.write_text(new_content, encoding='utf-8')
    
    def _move_document(self, source: Path, target: Path):
        """Move a document to a new location."""
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), str(target))
    
    def _delete_document(self, doc_path: Path):
        """Delete a document (move to archive)."""
        archive_dir = self.state_dir / 'archive'
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        archive_path = archive_dir / f"{doc_path.stem}_{timestamp}{doc_path.suffix}"
        
        shutil.move(str(doc_path), str(archive_path))
    
    def _merge_documents(self, primary: Path, merge_with: List[str]):
        """Merge multiple documents into one."""
        # This is a complex operation - create a combined document
        combined_content = [primary.read_text(encoding='utf-8')]
        
        for merge_path in merge_with:
            merge_doc = self.docs_root / merge_path
            if merge_doc.exists():
                combined_content.append(f"\n\n<!-- Merged from: {merge_path} -->\n")
                combined_content.append(merge_doc.read_text(encoding='utf-8'))
                # Archive the merged document
                self._delete_document(merge_doc)
        
        primary.write_text('\n'.join(combined_content), encoding='utf-8')
    
    # =========================================================================
    # Reporting
    # =========================================================================
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate summary statistics for the current session."""
        if not self.state:
            return {}
        
        # Count actions
        action_counts = {}
        priority_counts = {}
        category_recommendations = {}
        
        for path, result in self.state.results.items():
            if result.action:
                action = result.action.action.value
                action_counts[action] = action_counts.get(action, 0) + 1
                
                priority = result.action.priority
                priority_counts[priority] = priority_counts.get(priority, 0) + 1
                
                if result.action.target_category:
                    cat = result.action.target_category
                    if cat not in category_recommendations:
                        category_recommendations[cat] = []
                    category_recommendations[cat].append(path)
        
        return {
            'session_id': self.state.session_id,
            'scope': self.state.scope,
            'started_at': self.state.started_at,
            'total_documents': self.state.total_documents,
            'processed': self.state.processed_count,
            'pending': len(self.state.pending_documents),
            'failed': len(self.state.failed_documents),
            'action_counts': action_counts,
            'priority_counts': priority_counts,
            'category_recommendations': {
                k: len(v) for k, v in category_recommendations.items()
            }
        }
    
    def generate_report(self, output_path: Optional[str] = None) -> str:
        """Generate a detailed markdown report."""
        if not self.state:
            return "No active session"
        
        summary = self.generate_summary()
        
        lines = [
            "# Documentation Harmonization Report",
            "",
            f"**Session ID:** {summary['session_id']}",
            f"**Scope:** {summary['scope']}",
            f"**Started:** {summary['started_at']}",
            "",
            "## Summary",
            "",
            f"- Total Documents: {summary['total_documents']}",
            f"- Processed: {summary['processed']}",
            f"- Pending: {summary['pending']}",
            f"- Failed: {summary['failed']}",
            "",
            "## Recommended Actions",
            ""
        ]
        
        for action, count in summary.get('action_counts', {}).items():
            lines.append(f"- **{action}**: {count} documents")
        
        lines.extend([
            "",
            "## Priority Distribution",
            ""
        ])
        
        for priority, count in summary.get('priority_counts', {}).items():
            lines.append(f"- **{priority}**: {count} recommendations")
        
        lines.extend([
            "",
            "## Category Recommendations",
            ""
        ])
        
        for category, count in summary.get('category_recommendations', {}).items():
            lines.append(f"- **{category}**: {count} documents")
        
        # Detailed results
        lines.extend([
            "",
            "## Detailed Results",
            ""
        ])
        
        for path, result in sorted(self.state.results.items()):
            lines.append(f"### {path}")
            lines.append("")
            
            if result.analysis:
                lines.append(f"**Summary:** {result.analysis.content_summary}")
                lines.append(f"**Quality Score:** {result.analysis.quality_score}/10")
                lines.append(f"**Type:** {result.analysis.document_type}")
            
            if result.action:
                lines.append(f"**Recommended Action:** {result.action.action.value}")
                lines.append(f"**Priority:** {result.action.priority}")
                lines.append(f"**Reasoning:** {result.action.reasoning}")
                if result.action.target_category:
                    lines.append(f"**Target Category:** {result.action.target_category}")
            
            lines.append("")
        
        report = "\n".join(lines)
        
        if output_path:
            Path(output_path).write_text(report, encoding='utf-8')
        
        return report
    
    def export_results(self, output_path: str):
        """Export results to JSON file."""
        if not self.state:
            return
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.state.to_dict(), f, indent=2, default=str)


def create_engine(
    docs_root: str = "docs",
    use_mock_ai: bool = False,
    dry_run: bool = True
) -> HarmonizationEngine:
    """Factory function to create a harmonization engine."""
    return HarmonizationEngine(
        docs_root=docs_root,
        use_mock_ai=use_mock_ai,
        dry_run=dry_run
    )


if __name__ == "__main__":
    # Test the engine
    engine = create_engine(use_mock_ai=True, dry_run=True)
    
    print("Available scopes:", list(PREDEFINED_SCOPES.keys()))
    
    # Start a test session
    session_id = engine.start_session("api")
    print(f"Started session: {session_id}")
    
    # Process a small batch
    results = engine.process_batch(batch_size=3)
    print(f"Processed {len(results)} documents")
    
    # Generate summary
    summary = engine.generate_summary()
    print(f"Summary: {json.dumps(summary, indent=2)}")
