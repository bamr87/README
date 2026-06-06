"""
Document Analyzer Module.

Extracts content, structure, and metadata from documentation files.
Provides utilities for comparing and finding related documents.
"""

import hashlib
import re
from dataclasses import dataclass, field
from datetime import datetime
from fnmatch import fnmatch
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

try:
    import yaml
except ImportError:
    raise ImportError("PyYAML is required. Install with: pip install pyyaml")


@dataclass
class DocumentContent:
    """Extracted content from a document."""
    path: str
    filename: str
    extension: str
    category: str
    repository: Optional[str]
    
    # Content
    raw_content: str
    body_content: str
    frontmatter: Dict[str, Any]
    
    # Structure
    headings: List[Dict[str, Any]]
    code_blocks: List[Dict[str, Any]]
    links: Dict[str, List[str]]
    
    # Metrics
    word_count: int
    line_count: int
    content_hash: str
    
    # Extracted info
    title: Optional[str]
    description: Optional[str]
    tags: List[str]
    
    # File info
    file_size: int
    modified_time: str


class DocumentAnalyzer:
    """Analyzes documentation files and extracts structured information."""
    
    def __init__(self, docs_root: str = "docs"):
        self.docs_root = Path(docs_root)
        self._document_cache: Dict[str, DocumentContent] = {}
        self._index_cache: Optional[Dict[str, Any]] = None
    
    def load_index(self, index_path: str = "docs/docs_index.json") -> Dict[str, Any]:
        """Load the documentation index if available."""
        import json
        
        if self._index_cache is not None:
            return self._index_cache
        
        index_file = Path(index_path)
        if index_file.exists():
            with open(index_file, 'r', encoding='utf-8') as f:
                self._index_cache = json.load(f)
        else:
            self._index_cache = {}
        
        return self._index_cache
    
    def parse_frontmatter(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Parse YAML frontmatter from document content."""
        if not content.startswith('---'):
            return {}, content
        
        try:
            end_idx = content.find('---', 3)
            if end_idx == -1:
                return {}, content
            
            raw_fm = content[3:end_idx]
            body = content[end_idx + 3:].lstrip('\n')
            
            fm = yaml.safe_load(raw_fm)
            return (fm or {}), body
        except yaml.YAMLError:
            return {}, content
    
    def extract_headings(self, content: str) -> List[Dict[str, Any]]:
        """Extract all headings from markdown content."""
        headings = []
        pattern = r'^(#{1,6})\s+(.+?)(?:\s+#*)?$'
        
        for match in re.finditer(pattern, content, re.MULTILINE):
            level = len(match.group(1))
            text = match.group(2).strip()
            anchor = re.sub(r'[^\w\s-]', '', text.lower())
            anchor = re.sub(r'[\s_]+', '-', anchor).strip('-')
            
            headings.append({
                'level': level,
                'text': text,
                'anchor': anchor,
                'line': content[:match.start()].count('\n') + 1
            })
        
        return headings
    
    def extract_code_blocks(self, content: str) -> List[Dict[str, Any]]:
        """Extract code block information from content."""
        code_blocks = []
        pattern = r'```(\w*)\n(.*?)```'
        
        for match in re.finditer(pattern, content, re.DOTALL):
            language = match.group(1) or 'plaintext'
            code = match.group(2)
            line_count = len(code.strip().split('\n')) if code.strip() else 0
            
            code_blocks.append({
                'language': language,
                'lines': line_count,
                'preview': code[:200] if code else ''
            })
        
        return code_blocks
    
    def extract_links(self, content: str) -> Dict[str, List[str]]:
        """Extract internal and external links from content."""
        links = {'internal': [], 'external': [], 'images': []}
        
        # Markdown links [text](url)
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        for match in re.finditer(link_pattern, content):
            url = match.group(2)
            if url.startswith(('http://', 'https://', '//')):
                links['external'].append(url)
            elif url.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                links['images'].append(url)
            elif not url.startswith('#'):
                links['internal'].append(url)
        
        # Image references ![alt](url)
        img_pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
        for match in re.finditer(img_pattern, content):
            links['images'].append(match.group(2))
        
        return links
    
    def extract_keywords(self, content: str, max_keywords: int = 20) -> List[str]:
        """Extract potential keywords from content."""
        # Remove code blocks and links for cleaner text
        clean_text = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        clean_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean_text)
        clean_text = re.sub(r'[#*_`\[\]()]', '', clean_text)
        
        # Extract words
        words = re.findall(r'\b[a-zA-Z][a-zA-Z0-9_-]{2,}\b', clean_text.lower())
        
        # Count frequency
        word_freq: Dict[str, int] = {}
        stopwords = {'the', 'and', 'for', 'are', 'with', 'that', 'this', 'from', 
                     'have', 'you', 'can', 'will', 'your', 'use', 'not', 'all',
                     'but', 'they', 'was', 'been', 'has', 'when', 'what', 'which'}
        
        for word in words:
            if word not in stopwords and len(word) > 2:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        # Return top keywords
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, _ in sorted_words[:max_keywords]]
    
    def analyze_document(self, file_path: Path) -> DocumentContent:
        """Analyze a single document and extract all information."""
        rel_path = str(file_path.relative_to(self.docs_root))
        
        # Check cache
        if rel_path in self._document_cache:
            return self._document_cache[rel_path]
        
        # Read content
        content = file_path.read_text(encoding='utf-8')
        frontmatter, body = self.parse_frontmatter(content)
        
        # Extract path components
        parts = file_path.relative_to(self.docs_root).parts
        category = parts[0] if len(parts) > 1 else 'root'
        repository = parts[1] if len(parts) > 2 else None
        
        # Extract title
        title = frontmatter.get('title')
        if not title:
            headings = self.extract_headings(body)
            if headings and headings[0]['level'] == 1:
                title = headings[0]['text']
            else:
                title = file_path.stem
        
        # Get file stats
        stat = file_path.stat()
        
        doc = DocumentContent(
            path=rel_path,
            filename=file_path.name,
            extension=file_path.suffix,
            category=category,
            repository=repository,
            raw_content=content,
            body_content=body,
            frontmatter=frontmatter,
            headings=self.extract_headings(body),
            code_blocks=self.extract_code_blocks(body),
            links=self.extract_links(body),
            word_count=len(re.findall(r'\w+', body)),
            line_count=len(content.splitlines()),
            content_hash=hashlib.md5(content.encode('utf-8')).hexdigest(),
            title=title,
            description=frontmatter.get('description') or frontmatter.get('summary'),
            tags=frontmatter.get('tags', []),
            file_size=stat.st_size,
            modified_time=datetime.fromtimestamp(stat.st_mtime).isoformat()
        )
        
        self._document_cache[rel_path] = doc
        return doc
    
    def find_documents_by_scope(self, include_patterns: List[str], 
                                 exclude_patterns: List[str] = None) -> List[Path]:
        """Find documents matching scope patterns."""
        exclude_patterns = exclude_patterns or []
        matched_files: Set[Path] = set()
        
        for pattern in include_patterns:
            # Handle ** glob patterns
            if '**' in pattern:
                for file_path in self.docs_root.rglob('*.md'):
                    rel_path = str(file_path.relative_to(self.docs_root.parent))
                    if fnmatch(rel_path, pattern):
                        matched_files.add(file_path)
            else:
                for file_path in self.docs_root.glob(pattern.replace('docs/', '')):
                    if file_path.is_file():
                        matched_files.add(file_path)
        
        # Apply exclusions
        result = []
        for file_path in matched_files:
            rel_path = str(file_path.relative_to(self.docs_root.parent))
            excluded = any(fnmatch(rel_path, pat) for pat in exclude_patterns)
            if not excluded and file_path.suffix == '.md':
                result.append(file_path)
        
        return sorted(result)
    
    def find_related_by_content(self, doc: DocumentContent, 
                                 all_docs: List[DocumentContent],
                                 threshold: float = 0.3) -> List[Tuple[DocumentContent, float]]:
        """Find documents related by content similarity."""
        if not doc.body_content:
            return []
        
        doc_keywords = set(self.extract_keywords(doc.body_content))
        related = []
        
        for other in all_docs:
            if other.path == doc.path:
                continue
            
            other_keywords = set(self.extract_keywords(other.body_content))
            
            # Calculate Jaccard similarity
            if doc_keywords and other_keywords:
                intersection = len(doc_keywords & other_keywords)
                union = len(doc_keywords | other_keywords)
                similarity = intersection / union if union > 0 else 0
                
                if similarity >= threshold:
                    related.append((other, similarity))
        
        # Sort by similarity
        related.sort(key=lambda x: x[1], reverse=True)
        return related[:10]  # Top 10 related
    
    def find_potential_duplicates(self, doc: DocumentContent,
                                   all_docs: List[DocumentContent],
                                   similarity_threshold: float = 0.7) -> List[Tuple[DocumentContent, float]]:
        """Find potential duplicate documents."""
        duplicates = []
        
        for other in all_docs:
            if other.path == doc.path:
                continue
            
            # Check content hash first (exact duplicates)
            if doc.content_hash == other.content_hash:
                duplicates.append((other, 1.0))
                continue
            
            # Check title similarity
            if doc.title and other.title:
                title_sim = self._string_similarity(doc.title.lower(), other.title.lower())
                if title_sim > 0.8:
                    duplicates.append((other, title_sim))
                    continue
            
            # Check content similarity for high overlap
            doc_words = set(re.findall(r'\w+', doc.body_content.lower()))
            other_words = set(re.findall(r'\w+', other.body_content.lower()))
            
            if doc_words and other_words:
                intersection = len(doc_words & other_words)
                smaller_set = min(len(doc_words), len(other_words))
                overlap = intersection / smaller_set if smaller_set > 0 else 0
                
                if overlap >= similarity_threshold:
                    duplicates.append((other, overlap))
        
        duplicates.sort(key=lambda x: x[1], reverse=True)
        return duplicates
    
    def _string_similarity(self, s1: str, s2: str) -> float:
        """Calculate similarity between two strings."""
        if not s1 or not s2:
            return 0.0
        
        # Simple character-based similarity
        longer = max(len(s1), len(s2))
        if longer == 0:
            return 1.0
        
        # Count matching characters
        matches = sum(c1 == c2 for c1, c2 in zip(s1, s2))
        return matches / longer
    
    def get_document_summary(self, doc: DocumentContent, max_length: int = 500) -> str:
        """Generate a summary of the document for AI analysis."""
        summary_parts = []
        
        # Basic info
        summary_parts.append(f"Path: {doc.path}")
        summary_parts.append(f"Title: {doc.title or 'Unknown'}")
        summary_parts.append(f"Category: {doc.category}")
        if doc.repository:
            summary_parts.append(f"Repository: {doc.repository}")
        
        # Frontmatter
        if doc.frontmatter:
            fm_keys = list(doc.frontmatter.keys())[:10]
            summary_parts.append(f"Frontmatter fields: {', '.join(fm_keys)}")
        
        # Structure
        if doc.headings:
            h1_h2 = [h['text'] for h in doc.headings if h['level'] <= 2][:5]
            summary_parts.append(f"Main sections: {', '.join(h1_h2)}")
        
        # Metrics
        summary_parts.append(f"Words: {doc.word_count}, Lines: {doc.line_count}")
        summary_parts.append(f"Code blocks: {len(doc.code_blocks)}")
        
        # Content preview
        body_preview = doc.body_content[:max_length]
        if len(doc.body_content) > max_length:
            body_preview += "..."
        summary_parts.append(f"\n--- Content Preview ---\n{body_preview}")
        
        return "\n".join(summary_parts)
    
    def batch_analyze(self, file_paths: List[Path], 
                       progress_callback=None) -> List[DocumentContent]:
        """Analyze multiple documents with optional progress callback."""
        results = []
        total = len(file_paths)
        
        for i, file_path in enumerate(file_paths):
            try:
                doc = self.analyze_document(file_path)
                results.append(doc)
            except Exception as e:
                print(f"Error analyzing {file_path}: {e}")
            
            if progress_callback:
                progress_callback(i + 1, total)
        
        return results
    
    def clear_cache(self):
        """Clear the document cache."""
        self._document_cache.clear()
        self._index_cache = None


def create_context_for_ai(doc: DocumentContent, 
                          related_docs: List[DocumentContent] = None,
                          max_content_length: int = 4000) -> str:
    """Create a context string for AI analysis."""
    context_parts = []
    
    # Main document
    context_parts.append("=== DOCUMENT TO ANALYZE ===")
    context_parts.append(f"Path: {doc.path}")
    context_parts.append(f"Filename: {doc.filename}")
    context_parts.append(f"Current Category: {doc.category}")
    if doc.repository:
        context_parts.append(f"Source Repository: {doc.repository}")
    
    # Existing frontmatter
    if doc.frontmatter:
        context_parts.append("\n--- Existing Frontmatter ---")
        import yaml
        context_parts.append(yaml.dump(doc.frontmatter, default_flow_style=False))
    
    # Structure
    context_parts.append("\n--- Document Structure ---")
    context_parts.append(f"Word count: {doc.word_count}")
    context_parts.append(f"Line count: {doc.line_count}")
    context_parts.append(f"Code blocks: {len(doc.code_blocks)}")
    
    if doc.headings:
        context_parts.append("\nHeadings:")
        for h in doc.headings[:15]:
            indent = "  " * (h['level'] - 1)
            context_parts.append(f"{indent}- {h['text']}")
    
    if doc.code_blocks:
        langs = set(cb['language'] for cb in doc.code_blocks)
        context_parts.append(f"\nCode languages: {', '.join(langs)}")
    
    # Content (truncated)
    context_parts.append("\n--- Document Content ---")
    content = doc.body_content[:max_content_length]
    if len(doc.body_content) > max_content_length:
        content += f"\n\n[... Content truncated, {len(doc.body_content) - max_content_length} more characters ...]"
    context_parts.append(content)
    
    # Related documents context
    if related_docs:
        context_parts.append("\n=== POTENTIALLY RELATED DOCUMENTS ===")
        for rd in related_docs[:5]:
            context_parts.append(f"\n- Path: {rd.path}")
            context_parts.append(f"  Title: {rd.title}")
            context_parts.append(f"  Category: {rd.category}")
            if rd.description:
                context_parts.append(f"  Description: {rd.description[:200]}")
    
    return "\n".join(context_parts)


if __name__ == "__main__":
    # Test the analyzer
    analyzer = DocumentAnalyzer("docs")
    
    # Find all API docs
    from schemas import get_scope_config
    scope = get_scope_config("api")
    
    files = analyzer.find_documents_by_scope(
        scope.include_patterns,
        scope.exclude_patterns
    )
    
    print(f"Found {len(files)} documents in scope '{scope.name}'")
    
    if files:
        # Analyze first document
        doc = analyzer.analyze_document(files[0])
        print(f"\nFirst document: {doc.path}")
        print(f"Title: {doc.title}")
        print(f"Words: {doc.word_count}")
        print(f"Headings: {len(doc.headings)}")
