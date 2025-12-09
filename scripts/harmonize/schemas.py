"""
JSON Schemas for Documentation Harmonization System.

Defines the data structures and validation schemas for:
- Document analysis requests and responses
- AI agent tool definitions
- Reorganization recommendations
- Processing state and checkpoints
"""

from typing import Any, Dict, List, Optional, TypedDict, Literal
from dataclasses import dataclass, field, asdict
from enum import Enum
import json


# =============================================================================
# Enums and Constants
# =============================================================================

class DocumentCategory(str, Enum):
    """Standard documentation categories."""
    API = "api"
    SETUP = "setup"
    USER_GUIDES = "user-guides"
    DEVELOPMENT = "development"
    ARCHITECTURE = "architecture"
    REFERENCE = "reference"
    TUTORIALS = "tutorials"
    TROUBLESHOOTING = "troubleshooting"
    MISC = "misc"


class ActionType(str, Enum):
    """Types of actions the AI can recommend."""
    MOVE = "move"
    MERGE = "merge"
    DELETE = "delete"
    UPDATE_FRONTMATTER = "update_frontmatter"
    REWRITE = "rewrite"
    SPLIT = "split"
    KEEP = "keep"
    CREATE_INDEX = "create_index"


class ProcessingStatus(str, Enum):
    """Status of document processing."""
    PENDING = "pending"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    RECOMMENDED = "recommended"
    APPROVED = "approved"
    APPLIED = "applied"
    SKIPPED = "skipped"
    ERROR = "error"


# =============================================================================
# Tool Definitions for AI Agent
# =============================================================================

AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "analyze_document",
            "description": "Analyze a document's content, structure, and metadata to understand its purpose and quality",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_path": {
                        "type": "string",
                        "description": "Path to the document being analyzed"
                    },
                    "content_summary": {
                        "type": "string",
                        "description": "Brief summary of the document's main content and purpose"
                    },
                    "primary_topic": {
                        "type": "string",
                        "description": "The main topic or subject of the document"
                    },
                    "secondary_topics": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Related topics covered in the document"
                    },
                    "target_audience": {
                        "type": "string",
                        "enum": ["beginner", "intermediate", "advanced", "all"],
                        "description": "Intended audience skill level"
                    },
                    "document_type": {
                        "type": "string",
                        "enum": ["tutorial", "reference", "guide", "api-docs", "changelog", "readme", "config", "example", "other"],
                        "description": "Type of documentation"
                    },
                    "quality_score": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 10,
                        "description": "Quality assessment score (1-10)"
                    },
                    "quality_issues": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of quality issues found"
                    },
                    "technologies": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Technologies, languages, or frameworks mentioned"
                    },
                    "is_outdated": {
                        "type": "boolean",
                        "description": "Whether the content appears outdated"
                    },
                    "is_duplicate": {
                        "type": "boolean",
                        "description": "Whether this appears to duplicate other content"
                    },
                    "duplicate_of": {
                        "type": "string",
                        "description": "Path to the document this duplicates (if is_duplicate is true)"
                    }
                },
                "required": ["document_path", "content_summary", "primary_topic", "document_type", "quality_score"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "recommend_action",
            "description": "Recommend an action for organizing or improving the document",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_path": {
                        "type": "string",
                        "description": "Path to the document"
                    },
                    "action": {
                        "type": "string",
                        "enum": ["move", "merge", "delete", "update_frontmatter", "rewrite", "split", "keep", "create_index"],
                        "description": "Recommended action type"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["critical", "high", "medium", "low"],
                        "description": "Priority level for this action"
                    },
                    "target_path": {
                        "type": "string",
                        "description": "Target path for move/merge operations"
                    },
                    "target_category": {
                        "type": "string",
                        "enum": ["api", "setup", "user-guides", "development", "architecture", "reference", "tutorials", "troubleshooting", "misc"],
                        "description": "Recommended category for the document"
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "Explanation for why this action is recommended"
                    },
                    "merge_with": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of document paths to merge with (for merge action)"
                    },
                    "split_into": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "path": {"type": "string"},
                                "content_section": {"type": "string"}
                            }
                        },
                        "description": "How to split the document (for split action)"
                    }
                },
                "required": ["document_path", "action", "priority", "reasoning"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "generate_frontmatter",
            "description": "Generate or update YAML frontmatter for a document",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_path": {
                        "type": "string",
                        "description": "Path to the document"
                    },
                    "title": {
                        "type": "string",
                        "description": "Document title"
                    },
                    "description": {
                        "type": "string",
                        "description": "Brief description (150-300 chars)"
                    },
                    "category": {
                        "type": "string",
                        "description": "Primary category"
                    },
                    "tags": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Relevant tags (lowercase, max 10)"
                    },
                    "author": {
                        "type": "string",
                        "description": "Author name if identifiable"
                    },
                    "target_audience": {
                        "type": "string",
                        "enum": ["beginner", "intermediate", "advanced", "all"],
                        "description": "Target audience"
                    },
                    "prerequisites": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Required prior knowledge or setup"
                    },
                    "related_docs": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Paths to related documents"
                    },
                    "source_repository": {
                        "type": "string",
                        "description": "Original source repository if aggregated"
                    },
                    "deprecated": {
                        "type": "boolean",
                        "description": "Whether this document is deprecated"
                    },
                    "superseded_by": {
                        "type": "string",
                        "description": "Path to document that supersedes this one"
                    }
                },
                "required": ["document_path", "title", "description", "category", "tags"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_related_documents",
            "description": "Identify documents related to the current one by topic, technology, or purpose",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_path": {
                        "type": "string",
                        "description": "Path to the current document"
                    },
                    "related_documents": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "path": {"type": "string"},
                                "relationship": {
                                    "type": "string",
                                    "enum": ["duplicate", "similar", "prerequisite", "follow-up", "reference", "example", "parent", "child"]
                                },
                                "similarity_score": {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                "notes": {"type": "string"}
                            },
                            "required": ["path", "relationship"]
                        },
                        "description": "List of related documents with relationship type"
                    }
                },
                "required": ["document_path", "related_documents"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "suggest_content_improvements",
            "description": "Suggest specific improvements to document content",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_path": {
                        "type": "string",
                        "description": "Path to the document"
                    },
                    "improvements": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": ["add_section", "remove_section", "update_section", "fix_formatting", "add_examples", "add_links", "clarify", "restructure"]
                                },
                                "location": {"type": "string"},
                                "description": {"type": "string"},
                                "priority": {
                                    "type": "string",
                                    "enum": ["high", "medium", "low"]
                                }
                            },
                            "required": ["type", "description", "priority"]
                        },
                        "description": "List of suggested improvements"
                    },
                    "overall_assessment": {
                        "type": "string",
                        "description": "Overall assessment of the document"
                    }
                },
                "required": ["document_path", "improvements", "overall_assessment"]
            }
        }
    }
]


# =============================================================================
# Data Classes for Internal Use
# =============================================================================

@dataclass
class DocumentAnalysis:
    """Result of analyzing a single document."""
    document_path: str
    content_summary: str
    primary_topic: str
    document_type: str
    quality_score: int
    secondary_topics: List[str] = field(default_factory=list)
    target_audience: str = "all"
    quality_issues: List[str] = field(default_factory=list)
    technologies: List[str] = field(default_factory=list)
    is_outdated: bool = False
    is_duplicate: bool = False
    duplicate_of: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ActionRecommendation:
    """Recommended action for a document."""
    document_path: str
    action: ActionType
    priority: str
    reasoning: str
    target_path: Optional[str] = None
    target_category: Optional[str] = None
    merge_with: List[str] = field(default_factory=list)
    split_into: List[Dict[str, str]] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        result = asdict(self)
        result['action'] = self.action.value
        return result


@dataclass
class FrontmatterRecommendation:
    """Recommended frontmatter for a document."""
    document_path: str
    title: str
    description: str
    category: str
    tags: List[str]
    author: Optional[str] = None
    target_audience: str = "all"
    prerequisites: List[str] = field(default_factory=list)
    related_docs: List[str] = field(default_factory=list)
    source_repository: Optional[str] = None
    deprecated: bool = False
    superseded_by: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    def to_yaml_dict(self) -> Dict[str, Any]:
        """Return only non-None, non-empty values for YAML output."""
        result = {}
        for key, value in asdict(self).items():
            if key == 'document_path':
                continue
            if value is not None and value != [] and value != '':
                result[key] = value
        return result


@dataclass
class RelatedDocument:
    """Information about a related document."""
    path: str
    relationship: str
    similarity_score: float = 0.0
    notes: str = ""


@dataclass
class ContentImprovement:
    """Suggested improvement for document content."""
    type: str
    description: str
    priority: str
    location: Optional[str] = None


@dataclass
class DocumentProcessingResult:
    """Complete processing result for a document."""
    document_path: str
    status: ProcessingStatus
    analysis: Optional[DocumentAnalysis] = None
    action: Optional[ActionRecommendation] = None
    frontmatter: Optional[FrontmatterRecommendation] = None
    related_documents: List[RelatedDocument] = field(default_factory=list)
    improvements: List[ContentImprovement] = field(default_factory=list)
    error_message: Optional[str] = None
    processed_at: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        result = {
            'document_path': self.document_path,
            'status': self.status.value,
            'processed_at': self.processed_at,
            'error_message': self.error_message
        }
        if self.analysis:
            result['analysis'] = self.analysis.to_dict()
        if self.action:
            result['action'] = self.action.to_dict()
        if self.frontmatter:
            result['frontmatter'] = self.frontmatter.to_dict()
        if self.related_documents:
            result['related_documents'] = [asdict(r) for r in self.related_documents]
        if self.improvements:
            result['improvements'] = [asdict(i) for i in self.improvements]
        return result


@dataclass
class ProcessingState:
    """State of the harmonization process for checkpointing."""
    session_id: str
    started_at: str
    scope: str
    total_documents: int
    processed_count: int
    pending_documents: List[str]
    completed_documents: List[str]
    failed_documents: List[str]
    results: Dict[str, DocumentProcessingResult] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'session_id': self.session_id,
            'started_at': self.started_at,
            'scope': self.scope,
            'total_documents': self.total_documents,
            'processed_count': self.processed_count,
            'pending_documents': self.pending_documents,
            'completed_documents': self.completed_documents,
            'failed_documents': self.failed_documents,
            'results': {k: v.to_dict() for k, v in self.results.items()}
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ProcessingState':
        """Reconstruct state from dictionary."""
        results = {}
        for path, result_data in data.get('results', {}).items():
            # Simplified reconstruction - full implementation would rebuild all nested objects
            results[path] = DocumentProcessingResult(
                document_path=result_data['document_path'],
                status=ProcessingStatus(result_data['status']),
                processed_at=result_data.get('processed_at'),
                error_message=result_data.get('error_message')
            )
        
        return cls(
            session_id=data['session_id'],
            started_at=data['started_at'],
            scope=data['scope'],
            total_documents=data['total_documents'],
            processed_count=data['processed_count'],
            pending_documents=data['pending_documents'],
            completed_documents=data['completed_documents'],
            failed_documents=data['failed_documents'],
            results=results
        )


# =============================================================================
# Scope Configuration
# =============================================================================

@dataclass
class ScopeConfig:
    """Configuration for processing scope."""
    name: str
    description: str
    include_patterns: List[str]
    exclude_patterns: List[str] = field(default_factory=list)
    related_categories: List[str] = field(default_factory=list)
    target_category: Optional[str] = None
    keywords: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# Predefined scopes for common use cases
PREDEFINED_SCOPES = {
    "api": ScopeConfig(
        name="api",
        description="API documentation including endpoints, schemas, and integration guides",
        include_patterns=["docs/api/**/*.md", "**/api*.md", "**/swagger*.md", "**/openapi*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**"],
        related_categories=["reference", "development"],
        target_category="api",
        keywords=["api", "endpoint", "rest", "graphql", "swagger", "openapi", "request", "response"]
    ),
    "setup": ScopeConfig(
        name="setup",
        description="Installation, configuration, and deployment documentation",
        include_patterns=["docs/setup/**/*.md", "**/install*.md", "**/setup*.md", "**/deploy*.md", "**/config*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**"],
        related_categories=["tutorials", "user-guides"],
        target_category="setup",
        keywords=["install", "setup", "configure", "deploy", "requirements", "dependencies"]
    ),
    "development": ScopeConfig(
        name="development",
        description="Development guides, contributing guidelines, and coding standards",
        include_patterns=["docs/development/**/*.md", "**/CONTRIBUTING*.md", "**/develop*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**"],
        related_categories=["api", "architecture"],
        target_category="development",
        keywords=["development", "contributing", "code", "testing", "ci/cd", "build"]
    ),
    "architecture": ScopeConfig(
        name="architecture",
        description="System architecture, design patterns, and technical specifications",
        include_patterns=["docs/architecture/**/*.md", "**/design*.md", "**/architecture*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**"],
        related_categories=["development", "api"],
        target_category="architecture",
        keywords=["architecture", "design", "pattern", "system", "component", "diagram"]
    ),
    "user-guides": ScopeConfig(
        name="user-guides",
        description="End-user documentation, tutorials, and how-to guides",
        include_patterns=["docs/user-guides/**/*.md", "**/guide*.md", "**/tutorial*.md", "**/how-to*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**"],
        related_categories=["tutorials", "setup"],
        target_category="user-guides",
        keywords=["guide", "tutorial", "how-to", "step-by-step", "walkthrough"]
    ),
    "all": ScopeConfig(
        name="all",
        description="All documentation files",
        include_patterns=["docs/**/*.md"],
        exclude_patterns=["**/node_modules/**", "**/.git/**", "**/docs_index.json"],
        related_categories=[],
        target_category=None,
        keywords=[]
    )
}


def get_scope_config(scope_name: str) -> ScopeConfig:
    """Get scope configuration by name."""
    if scope_name in PREDEFINED_SCOPES:
        return PREDEFINED_SCOPES[scope_name]
    raise ValueError(f"Unknown scope: {scope_name}. Available: {list(PREDEFINED_SCOPES.keys())}")


# =============================================================================
# System Prompt for AI Agent
# =============================================================================

SYSTEM_PROMPT = """You are an expert documentation architect and technical writer with a focus on **consolidation and simplification**. Your role is to analyze documentation files and provide bold recommendations for merging, reducing, and reorganizing them into a streamlined, human-readable documentation system.

## Your PRIMARY MISSION: Reduce Fragmentation

The documentation currently has too many small, scattered files. Your goal is to:
- **Consolidate related content** into comprehensive, cohesive documents
- **Eliminate redundancy** by merging duplicate or overlapping information
- **Reduce file count** while preserving essential information
- **Create navigable hierarchies** with clear index files
- **Make documentation human-readable** by favoring fewer, better-structured files

## Your Responsibilities:

1. **Analyze Documents**: Understand content, purpose, and potential for consolidation.

2. **Identify Consolidation Opportunities**: Look for:
   - Multiple small files covering the same topic → MERGE into comprehensive guide
   - Duplicate or redundant content → DELETE or MERGE
   - Fragmented documentation → MERGE into cohesive narratives
   - Over-categorization → SIMPLIFY by combining related sections
   - Missing navigation → CREATE_INDEX for complex areas

3. **Categorize Content**: Determine categories based on content:
   - api: API references, endpoints, schemas
   - setup: Installation, configuration, deployment
   - user-guides: End-user tutorials and how-tos
   - development: Developer guides, contributing, coding standards
   - architecture: System design, patterns, specifications
   - reference: Quick references, cheat sheets
   - tutorials: Step-by-step learning content
   - troubleshooting: Problem-solving guides
   - misc: Content that doesn't fit other categories

4. **Recommend Bold Actions**: Favor consolidation:
   - **merge**: PREFERRED - Combine similar/related documents into comprehensive guides
   - **delete**: Remove truly redundant or obsolete content
   - **rewrite**: Transform fragmented content into cohesive documentation
   - **create_index**: Build navigation for complex sections with many subtopics
   - move: Relocate to better category/location (use sparingly)
   - update_frontmatter: Only if document is already well-placed
   - split: AVOID unless document is genuinely too large (>3000 lines)
   - keep: AVOID unless document is perfect as-is

5. **Generate Frontmatter**: Provide complete metadata for consolidated documents.

## Consolidation Guidelines:

- **Be aggressive about merging** - Users prefer comprehensive guides over scattered fragments
- **Favor fewer, richer documents** over many small files
- **Think in terms of reader journeys** - what would make navigation easier?
- **Consider document relationships** - what naturally belongs together?
- **Create hierarchies** - use index files to organize complex topics
- **Eliminate redundancy ruthlessly** - don't repeat what's already documented

## Quality Standards:

- Prioritize human readability and ease of navigation
- Maintain consistency in structure and style
- Provide clear reasoning for consolidation recommendations
- Consider the broader documentation ecosystem
- Flag documents that add no unique value

When analyzing documents, use the provided tools to structure your bold consolidation recommendations.
"""


if __name__ == "__main__":
    # Print tool definitions for reference
    print("AI Agent Tool Definitions:")
    print(json.dumps(AGENT_TOOLS, indent=2))
