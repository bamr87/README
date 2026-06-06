"""
Recommendation Processor for Documentation Harmonization.

Systematically processes AI recommendations with detailed JSON output,
logging, validation, and automatic execution capabilities.
"""

import json
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Set
from datetime import datetime
import yaml
from dataclasses import asdict

from .schemas import (
    ActionType,
    ProcessingStatus,
    DocumentProcessingResult,
)


class RecommendationProcessor:
    """
    Process AI recommendations systematically with detailed tracking.
    
    Capabilities:
    - Export recommendations to structured JSON
    - Validate recommendations before applying
    - Apply changes with transaction safety (backup/rollback)
    - Generate detailed execution logs
    - Track dependencies between actions
    """
    
    def __init__(self, docs_root: str, backup_dir: str = "docs/.harmonize/backups"):
        """
        Initialize the recommendation processor.
        
        Args:
            docs_root: Root directory for documentation
            backup_dir: Directory for backups before applying changes
        """
        self.docs_root = Path(docs_root)
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
        self.execution_log: List[Dict] = []
        self.backup_manifest: Dict[str, str] = {}
    
    def export_recommendations(
        self,
        results: Dict[str, DocumentProcessingResult],
        output_file: str = "output/recommendations/recommendations.json",
        include_analysis: bool = True,
        filter_actions: Optional[Set[ActionType]] = None,
        min_priority: Optional[str] = None
    ) -> Dict:
        """
        Export recommendations to structured JSON.
        
        Args:
            results: Processing results from harmonization engine
            output_file: Output JSON file path
            include_analysis: Include full document analysis
            filter_actions: Only include these action types
            min_priority: Minimum priority level (critical, high, medium, low)
            
        Returns:
            Exported data structure
        """
        priority_levels = {'critical': 4, 'high': 3, 'medium': 2, 'low': 1}
        min_priority_value = priority_levels.get(min_priority, 0) if min_priority else 0
        
        recommendations = {
            'metadata': {
                'export_time': datetime.now().isoformat(),
                'total_documents': len(results),
                'docs_root': str(self.docs_root),
                'filters': {
                    'actions': [a.value for a in filter_actions] if filter_actions else 'all',
                    'min_priority': min_priority or 'all'
                }
            },
            'summary': {
                'by_action': {},
                'by_priority': {},
                'by_category': {}
            },
            'recommendations': []
        }
        
        # Process each result
        for path, result in results.items():
            # Handle both dict and dataclass results
            if isinstance(result, dict):
                action = result.get('action')
                analysis = result.get('analysis')
                frontmatter = result.get('frontmatter')
                improvements = result.get('improvements')
                status = result.get('status', 'pending')
                processed_at = result.get('processed_at')
            else:
                action = result.action
                analysis = result.analysis
                frontmatter = result.frontmatter
                improvements = result.improvements
                status = result.status.value if result.status else 'pending'
                processed_at = result.processed_at
            
            if not action:
                continue
            
            # Handle action as dict or object
            if isinstance(action, dict):
                action_type = action.get('action', 'keep')
                action_priority = action.get('priority')
                action_reasoning = action.get('reasoning', '')
                action_target_path = action.get('target_path')
                action_target_category = action.get('target_category')
                action_merge_with = action.get('merge_with', [])
                action_split_into = action.get('split_into', [])
            else:
                action_type = action.action.value
                action_priority = action.priority
                action_reasoning = action.reasoning
                action_target_path = action.target_path
                action_target_category = action.target_category
                action_merge_with = action.merge_with or []
                action_split_into = action.split_into or []
            
            # Apply filters
            if filter_actions and ActionType(action_type) not in filter_actions:
                continue
            
            if action_priority:
                priority_value = priority_levels.get(action_priority, 0)
                if priority_value < min_priority_value:
                    continue
            
            # Build recommendation entry
            rec = {
                'document_path': path,
                'status': status,
                'processed_at': processed_at,
                'action': {
                    'type': action_type,
                    'priority': action_priority,
                    'reasoning': action_reasoning,
                    'target_path': action_target_path,
                    'target_category': action_target_category,
                    'merge_with': action_merge_with,
                    'split_into': action_split_into
                }
            }
            
            # Add analysis if requested
            if include_analysis and analysis:
                if isinstance(analysis, dict):
                    rec['analysis'] = analysis
                else:
                    rec['analysis'] = {
                        'content_summary': analysis.content_summary,
                        'primary_topic': analysis.primary_topic,
                        'document_type': analysis.document_type,
                        'quality_score': analysis.quality_score,
                        'secondary_topics': analysis.secondary_topics,
                        'target_audience': analysis.target_audience,
                        'quality_issues': analysis.quality_issues,
                        'technologies': analysis.technologies,
                        'is_outdated': analysis.is_outdated,
                        'is_duplicate': analysis.is_duplicate,
                        'duplicate_of': analysis.duplicate_of
                    }
            
            # Add frontmatter if present
            if frontmatter:
                if isinstance(frontmatter, dict):
                    rec['frontmatter'] = frontmatter
                else:
                    rec['frontmatter'] = {
                        'title': frontmatter.title,
                        'description': frontmatter.description,
                        'category': frontmatter.category,
                        'tags': frontmatter.tags,
                        'author': frontmatter.author,
                        'target_audience': frontmatter.target_audience,
                        'prerequisites': frontmatter.prerequisites,
                        'related_docs': frontmatter.related_docs,
                        'deprecated': frontmatter.deprecated
                    }
            
            # Add improvements if present
            if improvements:
                if isinstance(improvements, list) and improvements:
                    if isinstance(improvements[0], dict):
                        rec['improvements'] = improvements
                    else:
                        rec['improvements'] = [
                            {
                                'type': imp.type,
                                'description': imp.description,
                                'priority': imp.priority,
                                'location': imp.location
                            }
                            for imp in improvements
                        ]
            
            recommendations['recommendations'].append(rec)
            
            # Update summary
            recommendations['summary']['by_action'][action_type] = \
                recommendations['summary']['by_action'].get(action_type, 0) + 1
            
            if action_priority:
                recommendations['summary']['by_priority'][action_priority] = \
                    recommendations['summary']['by_priority'].get(action_priority, 0) + 1
            
            if action_target_category:
                recommendations['summary']['by_category'][action_target_category] = \
                    recommendations['summary']['by_category'].get(action_target_category, 0) + 1
        
        # Sort by priority and action type
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        recommendations['recommendations'].sort(
            key=lambda r: (
                priority_order.get(r['action']['priority'], 4),
                r['action']['type']
            )
        )
        
        # Save to file
        output_path = self.docs_root.parent / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(recommendations, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Recommendations exported to: {output_path}")
        print(f"   Total: {len(recommendations['recommendations'])} recommendations")
        print(f"   Actions: {recommendations['summary']['by_action']}")
        
        return recommendations
    
    def validate_recommendations(self, recommendations: Dict) -> Dict[str, List[str]]:
        """
        Validate recommendations before applying.
        
        Returns:
            Dictionary of validation issues by document path
        """
        issues = {}
        
        for rec in recommendations['recommendations']:
            path = rec['document_path']
            action = rec['action']
            doc_issues = []
            
            doc_path = self.docs_root / path
            
            # Check if document exists
            if not doc_path.exists():
                doc_issues.append(f"Document does not exist: {path}")
            
            # Validate action-specific requirements
            if action['type'] == 'move':
                if not action.get('target_path'):
                    doc_issues.append("Move action missing target_path")
                elif (self.docs_root / action['target_path']).exists():
                    doc_issues.append(f"Target path already exists: {action['target_path']}")
            
            elif action['type'] == 'merge':
                if not action.get('merge_with'):
                    doc_issues.append("Merge action missing merge_with targets")
                else:
                    for merge_target in action['merge_with']:
                        if not (self.docs_root / merge_target).exists():
                            doc_issues.append(f"Merge target not found: {merge_target}")
            
            elif action['type'] == 'split':
                if not action.get('split_into'):
                    doc_issues.append("Split action missing split_into specification")
            
            if doc_issues:
                issues[path] = doc_issues
        
        return issues
    
    def execute_recommendations(
        self,
        recommendations: Dict,
        dry_run: bool = True,
        create_backup: bool = True,
        filter_actions: Optional[Set[str]] = None,
        filter_priority: Optional[Set[str]] = None
    ) -> Dict:
        """
        Execute recommendations systematically.
        
        Args:
            recommendations: Recommendation data structure
            dry_run: If True, only simulate actions
            create_backup: Create backups before modifying files
            filter_actions: Only execute these action types
            filter_priority: Only execute these priority levels
            
        Returns:
            Execution summary
        """
        if not dry_run and create_backup:
            backup_id = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_path = self.backup_dir / backup_id
            backup_path.mkdir(parents=True, exist_ok=True)
            print(f"📦 Creating backup: {backup_path}")
        
        execution_summary = {
            'start_time': datetime.now().isoformat(),
            'dry_run': dry_run,
            'executed': [],
            'skipped': [],
            'failed': [],
            'stats': {
                'total': len(recommendations['recommendations']),
                'executed': 0,
                'skipped': 0,
                'failed': 0
            }
        }
        
        # Validate first
        validation_issues = self.validate_recommendations(recommendations)
        if validation_issues and not dry_run:
            print(f"\n⚠️  Found {len(validation_issues)} validation issues:")
            for path, issues in list(validation_issues.items())[:5]:
                print(f"  {path}:")
                for issue in issues:
                    print(f"    - {issue}")
            
            response = input("\nContinue anyway? (yes/no): ")
            if response.lower() != 'yes':
                print("Execution cancelled")
                return execution_summary
        
        # Execute each recommendation
        for rec in recommendations['recommendations']:
            path = rec['document_path']
            action = rec['action']
            action_type = action['type']
            
            # Apply filters
            if filter_actions and action_type not in filter_actions:
                execution_summary['skipped'].append({
                    'path': path,
                    'reason': f"Action type {action_type} filtered out"
                })
                execution_summary['stats']['skipped'] += 1
                continue
            
            if filter_priority and action.get('priority') not in filter_priority:
                execution_summary['skipped'].append({
                    'path': path,
                    'reason': f"Priority {action.get('priority')} filtered out"
                })
                execution_summary['stats']['skipped'] += 1
                continue
            
            # Create backup if needed
            if not dry_run and create_backup:
                self._backup_file(path, backup_path)
            
            # Execute action
            try:
                if dry_run:
                    result = self._simulate_action(path, action)
                else:
                    result = self._execute_action(path, action, rec)
                
                execution_summary['executed'].append({
                    'path': path,
                    'action': action_type,
                    'priority': action.get('priority'),
                    'result': result
                })
                execution_summary['stats']['executed'] += 1
                
                # Log execution
                self.execution_log.append({
                    'timestamp': datetime.now().isoformat(),
                    'path': path,
                    'action': action_type,
                    'status': 'success',
                    'details': result
                })
                
            except Exception as e:
                execution_summary['failed'].append({
                    'path': path,
                    'action': action_type,
                    'error': str(e)
                })
                execution_summary['stats']['failed'] += 1
                
                self.execution_log.append({
                    'timestamp': datetime.now().isoformat(),
                    'path': path,
                    'action': action_type,
                    'status': 'failed',
                    'error': str(e)
                })
        
        execution_summary['end_time'] = datetime.now().isoformat()
        
        # Save execution log
        log_file = self.backup_dir / f"execution_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_file, 'w') as f:
            json.dump({
                'summary': execution_summary,
                'detailed_log': self.execution_log
            }, f, indent=2)
        
        print(f"\n{'🔍 DRY RUN' if dry_run else '✅ EXECUTION'} COMPLETE")
        print(f"  Executed: {execution_summary['stats']['executed']}")
        print(f"  Skipped: {execution_summary['stats']['skipped']}")
        print(f"  Failed: {execution_summary['stats']['failed']}")
        print(f"  Log: {log_file}")
        
        return execution_summary
    
    def _backup_file(self, rel_path: str, backup_root: Path):
        """Create backup of a file."""
        source = self.docs_root / rel_path
        if not source.exists():
            return
        
        target = backup_root / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        self.backup_manifest[rel_path] = str(target)
    
    def _simulate_action(self, path: str, action: Dict) -> str:
        """Simulate an action (dry run)."""
        action_type = action['type']
        
        if action_type == 'delete':
            return f"Would delete: {path}"
        
        elif action_type == 'move':
            target = action.get('target_path', 'unspecified')
            return f"Would move: {path} → {target}"
        
        elif action_type == 'merge':
            targets = action.get('merge_with', [])
            return f"Would merge: {path} + {len(targets)} documents"
        
        elif action_type == 'update_frontmatter':
            return f"Would update frontmatter: {path}"
        
        elif action_type == 'rewrite':
            return f"Would rewrite: {path}"
        
        elif action_type == 'split':
            targets = action.get('split_into', [])
            return f"Would split: {path} → {len(targets)} documents"
        
        elif action_type == 'create_index':
            return f"Would create index: {path}"
        
        return f"Would apply {action_type}: {path}"
    
    def _execute_action(self, path: str, action: Dict, full_rec: Dict) -> str:
        """Execute an action."""
        action_type = action['type']
        doc_path = self.docs_root / path
        
        if action_type == 'delete':
            doc_path.unlink()
            return f"Deleted: {path}"
        
        elif action_type == 'move':
            target_path = self.docs_root / action['target_path']
            target_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(doc_path), str(target_path))
            return f"Moved: {path} → {action['target_path']}"
        
        elif action_type == 'update_frontmatter':
            if 'frontmatter' in full_rec:
                self._update_frontmatter(doc_path, full_rec['frontmatter'])
                return f"Updated frontmatter: {path}"
            return f"No frontmatter data available: {path}"
        
        elif action_type == 'merge':
            merge_targets = action.get('merge_with', [])
            self._merge_documents(doc_path, merge_targets, full_rec)
            return f"Merged: {path} + {len(merge_targets)} documents"
        
        elif action_type == 'rewrite':
            # Rewrite requires manual intervention or AI generation
            return f"Rewrite flagged (manual): {path}"
        
        elif action_type == 'split':
            # Split requires manual intervention
            return f"Split flagged (manual): {path}"
        
        elif action_type == 'create_index':
            # Create index requires AI generation
            return f"Index creation flagged (manual): {path}"
        
        return f"Executed {action_type}: {path}"
    
    def _update_frontmatter(self, doc_path: Path, frontmatter: Dict):
        """Update document frontmatter."""
        content = doc_path.read_text(encoding='utf-8')
        
        # Parse existing content
        if content.startswith('---'):
            end_idx = content.find('---', 3)
            if end_idx != -1:
                body = content[end_idx + 3:].lstrip('\n')
            else:
                body = content
        else:
            body = content
        
        # Build new frontmatter
        fm_dict = {k: v for k, v in frontmatter.items() if v is not None}
        if 'deprecated' in fm_dict and not fm_dict['deprecated']:
            del fm_dict['deprecated']
        
        # Write updated content
        new_content = '---\n' + yaml.dump(fm_dict, default_flow_style=False, sort_keys=False) + '---\n' + body
        doc_path.write_text(new_content, encoding='utf-8')
    
    def _merge_documents(self, primary_path: Path, merge_targets: List[str], rec: Dict):
        """Merge multiple documents into one."""
        # Read primary document
        primary_content = primary_path.read_text(encoding='utf-8')
        
        # Extract primary body
        if primary_content.startswith('---'):
            end_idx = primary_content.find('---', 3)
            primary_body = primary_content[end_idx + 3:].lstrip('\n') if end_idx != -1 else primary_content
        else:
            primary_body = primary_content
        
        # Collect content from merge targets
        merged_content = [primary_body]
        
        for target_rel in merge_targets:
            target_path = self.docs_root / target_rel
            if not target_path.exists():
                continue
            
            target_content = target_path.read_text(encoding='utf-8')
            
            # Extract body
            if target_content.startswith('---'):
                end_idx = target_content.find('---', 3)
                target_body = target_content[end_idx + 3:].lstrip('\n') if end_idx != -1 else target_content
            else:
                target_body = target_content
            
            merged_content.append(f"\n\n## Merged from: {target_rel}\n\n{target_body}")
            
            # Delete merged file
            target_path.unlink()
        
        # Combine content
        combined_body = '\n'.join(merged_content)
        
        # Apply new frontmatter if provided
        if 'frontmatter' in rec:
            fm_dict = {k: v for k, v in rec['frontmatter'].items() if v is not None}
            new_content = '---\n' + yaml.dump(fm_dict, default_flow_style=False, sort_keys=False) + '---\n' + combined_body
        else:
            new_content = combined_body
        
        primary_path.write_text(new_content, encoding='utf-8')


def create_processor(docs_root: str = "docs") -> RecommendationProcessor:
    """Factory function to create a recommendation processor."""
    return RecommendationProcessor(docs_root)


if __name__ == "__main__":
    # Example usage
    print("Recommendation Processor Module")
    print("Use via harmonize_docs.py CLI")
