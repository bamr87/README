"""
Documentation Harmonization Package.

AI-powered documentation analysis and reorganization system.
"""

from .schemas import (
    DocumentCategory,
    ActionType,
    ProcessingStatus,
    AGENT_TOOLS,
    SYSTEM_PROMPT,
    DocumentAnalysis,
    ActionRecommendation,
    FrontmatterRecommendation,
    RelatedDocument,
    ContentImprovement,
    DocumentProcessingResult,
    ProcessingState,
    ScopeConfig,
    PREDEFINED_SCOPES,
    get_scope_config,
)

from .analyzer import (
    DocumentAnalyzer,
    DocumentContent,
    create_context_for_ai,
)

from .grok_agent import (
    GrokConfig,
    GrokClient,
    DocumentAgent,
    MockGrokClient,
    create_agent,
)

from .engine import (
    HarmonizationEngine,
    create_engine,
)

__version__ = "1.0.0"
__all__ = [
    # Enums
    "DocumentCategory",
    "ActionType",
    "ProcessingStatus",
    
    # Schemas
    "AGENT_TOOLS",
    "SYSTEM_PROMPT",
    "DocumentAnalysis",
    "ActionRecommendation",
    "FrontmatterRecommendation",
    "RelatedDocument",
    "ContentImprovement",
    "DocumentProcessingResult",
    "ProcessingState",
    "ScopeConfig",
    "PREDEFINED_SCOPES",
    "get_scope_config",
    
    # Analyzer
    "DocumentAnalyzer",
    "DocumentContent",
    "create_context_for_ai",
    
    # Grok Agent
    "GrokConfig",
    "GrokClient",
    "DocumentAgent",
    "MockGrokClient",
    "create_agent",
    
    # Engine
    "HarmonizationEngine",
    "create_engine",
]
