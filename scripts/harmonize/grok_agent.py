"""
Grok API Integration for Documentation Harmonization.

Provides AI agent capabilities using xAI's Grok API for:
- Document analysis and categorization
- Action recommendations
- Frontmatter generation
- Related document identification
"""

import json
import os
import time
from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional

try:
    import requests
except ImportError:
    raise ImportError("requests is required. Install with: pip install requests")

from .schemas import (
    AGENT_TOOLS,
    SYSTEM_PROMPT,
    ActionType,
    DocumentAnalysis,
    ActionRecommendation,
    FrontmatterRecommendation,
    RelatedDocument,
    ContentImprovement,
    DocumentProcessingResult,
    ProcessingStatus,
)


@dataclass
class GrokConfig:
    """Configuration for Grok API."""
    api_key: str
    api_url: str = "https://api.x.ai/v1/chat/completions"
    model: str = "grok-4-1-fast-reasoning"
    max_tokens: int = 4096
    temperature: float = 0.3
    timeout: int = 60
    max_retries: int = 3
    retry_delay: float = 2.0


class GrokClient:
    """Client for interacting with Grok API."""
    
    def __init__(self, config: Optional[GrokConfig] = None):
        """Initialize the Grok client."""
        if config is None:
            api_key = os.getenv('XAI_API_KEY') or os.getenv('GROK_API_KEY')
            if not api_key:
                raise ValueError(
                    "Grok API key not found. Set XAI_API_KEY or GROK_API_KEY environment variable."
                )
            config = GrokConfig(api_key=api_key)
        
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        })
    
    def _make_request(self, messages: List[Dict], tools: List[Dict] = None) -> Dict:
        """Make a request to the Grok API with retry logic."""
        payload = {
            'model': self.config.model,
            'messages': messages,
            'max_tokens': self.config.max_tokens,
            'temperature': self.config.temperature
        }
        
        if tools:
            payload['tools'] = tools
            payload['tool_choice'] = 'auto'
        
        last_error = None
        for attempt in range(self.config.max_retries):
            try:
                response = self.session.post(
                    self.config.api_url,
                    json=payload,
                    timeout=self.config.timeout
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    # Rate limited
                    retry_after = float(response.headers.get('Retry-After', self.config.retry_delay * 2))
                    time.sleep(retry_after)
                    continue
                else:
                    response.raise_for_status()
                    
            except requests.exceptions.RequestException as e:
                last_error = e
                if attempt < self.config.max_retries - 1:
                    time.sleep(self.config.retry_delay * (attempt + 1))
                    continue
                raise
        
        raise last_error or Exception("Max retries exceeded")
    
    def chat(self, messages: List[Dict], tools: List[Dict] = None) -> Dict:
        """Send a chat completion request."""
        return self._make_request(messages, tools)
    
    def close(self):
        """Close the session."""
        self.session.close()


class DocumentAgent:
    """AI Agent for analyzing and harmonizing documentation."""
    
    def __init__(self, client: Optional[GrokClient] = None):
        """Initialize the document agent."""
        self.client = client or GrokClient()
        self.tools = AGENT_TOOLS
        self.system_prompt = SYSTEM_PROMPT
        self._tool_results: Dict[str, Any] = {}
    
    def analyze_document(self, context: str, 
                          related_docs_context: str = "") -> DocumentProcessingResult:
        """
        Analyze a document and generate recommendations.
        
        Args:
            context: Document context string (from analyzer.create_context_for_ai)
            related_docs_context: Additional context about related documents
            
        Returns:
            DocumentProcessingResult with analysis, recommendations, and frontmatter
        """
        # Build the user message
        user_message = f"""Analyze the following document and use the provided tools to:

1. First, use `analyze_document` to assess the document's content, quality, and categorization
2. Then, use `recommend_action` to suggest what should be done with this document
3. Use `generate_frontmatter` to create appropriate metadata
4. If you identify related documents, use `find_related_documents` to record the relationships
5. Use `suggest_content_improvements` if you find quality issues

{context}

{related_docs_context}

Please be thorough and systematic in your analysis. Use ALL relevant tools to provide complete recommendations."""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        # Make API call with tools
        try:
            response = self.client.chat(messages, self.tools)
            return self._process_response(response, context)
        except Exception as e:
            # Extract path from context
            path_match = context.split("Path: ")[1].split("\n")[0] if "Path: " in context else "unknown"
            return DocumentProcessingResult(
                document_path=path_match,
                status=ProcessingStatus.ERROR,
                error_message=str(e)
            )
    
    def _process_response(self, response: Dict, context: str) -> DocumentProcessingResult:
        """Process the API response and extract tool calls."""
        # Extract document path from context
        path_match = context.split("Path: ")[1].split("\n")[0] if "Path: " in context else "unknown"
        
        result = DocumentProcessingResult(
            document_path=path_match,
            status=ProcessingStatus.ANALYZING
        )
        
        # Check for choices
        choices = response.get('choices', [])
        if not choices:
            result.status = ProcessingStatus.ERROR
            result.error_message = "No response from API"
            return result
        
        message = choices[0].get('message', {})
        
        # Process tool calls
        tool_calls = message.get('tool_calls', [])
        
        for tool_call in tool_calls:
            function = tool_call.get('function', {})
            name = function.get('name', '')
            
            try:
                arguments = json.loads(function.get('arguments', '{}'))
            except json.JSONDecodeError:
                continue
            
            # Process each tool call
            if name == 'analyze_document':
                result.analysis = self._parse_analysis(arguments)
            elif name == 'recommend_action':
                result.action = self._parse_action(arguments)
            elif name == 'generate_frontmatter':
                result.frontmatter = self._parse_frontmatter(arguments)
            elif name == 'find_related_documents':
                result.related_documents = self._parse_related_docs(arguments)
            elif name == 'suggest_content_improvements':
                result.improvements = self._parse_improvements(arguments)
        
        # If no tool calls, try to extract from content
        if not tool_calls and message.get('content'):
            # The model might have responded with text instead of tools
            # This is a fallback scenario
            pass
        
        # Update status based on what we got
        if result.analysis or result.action:
            result.status = ProcessingStatus.ANALYZED
        
        if result.action:
            result.status = ProcessingStatus.RECOMMENDED
        
        return result
    
    def _parse_analysis(self, args: Dict) -> DocumentAnalysis:
        """Parse analyze_document tool call arguments."""
        return DocumentAnalysis(
            document_path=args.get('document_path', ''),
            content_summary=args.get('content_summary', ''),
            primary_topic=args.get('primary_topic', ''),
            document_type=args.get('document_type', 'other'),
            quality_score=args.get('quality_score', 5),
            secondary_topics=args.get('secondary_topics', []),
            target_audience=args.get('target_audience', 'all'),
            quality_issues=args.get('quality_issues', []),
            technologies=args.get('technologies', []),
            is_outdated=args.get('is_outdated', False),
            is_duplicate=args.get('is_duplicate', False),
            duplicate_of=args.get('duplicate_of')
        )
    
    def _parse_action(self, args: Dict) -> ActionRecommendation:
        """Parse recommend_action tool call arguments."""
        action_str = args.get('action', 'keep')
        try:
            action = ActionType(action_str)
        except ValueError:
            action = ActionType.KEEP
        
        return ActionRecommendation(
            document_path=args.get('document_path', ''),
            action=action,
            priority=args.get('priority', 'medium'),
            reasoning=args.get('reasoning', ''),
            target_path=args.get('target_path'),
            target_category=args.get('target_category'),
            merge_with=args.get('merge_with', []),
            split_into=args.get('split_into', [])
        )
    
    def _parse_frontmatter(self, args: Dict) -> FrontmatterRecommendation:
        """Parse generate_frontmatter tool call arguments."""
        return FrontmatterRecommendation(
            document_path=args.get('document_path', ''),
            title=args.get('title', ''),
            description=args.get('description', ''),
            category=args.get('category', 'misc'),
            tags=args.get('tags', []),
            author=args.get('author'),
            target_audience=args.get('target_audience', 'all'),
            prerequisites=args.get('prerequisites', []),
            related_docs=args.get('related_docs', []),
            source_repository=args.get('source_repository'),
            deprecated=args.get('deprecated', False),
            superseded_by=args.get('superseded_by')
        )
    
    def _parse_related_docs(self, args: Dict) -> List[RelatedDocument]:
        """Parse find_related_documents tool call arguments."""
        related = []
        for doc in args.get('related_documents', []):
            related.append(RelatedDocument(
                path=doc.get('path', ''),
                relationship=doc.get('relationship', 'related'),
                similarity_score=doc.get('similarity_score', 0.0),
                notes=doc.get('notes', '')
            ))
        return related
    
    def _parse_improvements(self, args: Dict) -> List[ContentImprovement]:
        """Parse suggest_content_improvements tool call arguments."""
        improvements = []
        for imp in args.get('improvements', []):
            improvements.append(ContentImprovement(
                type=imp.get('type', 'clarify'),
                description=imp.get('description', ''),
                priority=imp.get('priority', 'medium'),
                location=imp.get('location')
            ))
        return improvements
    
    def batch_analyze(self, contexts: List[str], 
                       progress_callback: Callable[[int, int], None] = None,
                       delay_between_calls: float = 1.0) -> List[DocumentProcessingResult]:
        """
        Analyze multiple documents with rate limiting.
        
        Args:
            contexts: List of document context strings
            progress_callback: Optional callback for progress updates
            delay_between_calls: Delay between API calls to avoid rate limiting
            
        Returns:
            List of processing results
        """
        results = []
        total = len(contexts)
        
        for i, context in enumerate(contexts):
            result = self.analyze_document(context)
            results.append(result)
            
            if progress_callback:
                progress_callback(i + 1, total)
            
            # Delay between calls
            if i < total - 1:
                time.sleep(delay_between_calls)
        
        return results


class MockGrokClient:
    """Mock client for testing without API calls."""
    
    def __init__(self):
        pass
    
    def chat(self, messages: List[Dict], tools: List[Dict] = None) -> Dict:
        """Return mock response with tool calls."""
        # Extract some info from the user message
        user_msg = messages[-1].get('content', '') if messages else ''
        
        # Generate mock tool calls
        mock_tool_calls = [
            {
                "id": "call_1",
                "type": "function",
                "function": {
                    "name": "analyze_document",
                    "arguments": json.dumps({
                        "document_path": "mock/path.md",
                        "content_summary": "Mock document summary",
                        "primary_topic": "documentation",
                        "document_type": "guide",
                        "quality_score": 7,
                        "technologies": ["python", "markdown"]
                    })
                }
            },
            {
                "id": "call_2",
                "type": "function",
                "function": {
                    "name": "recommend_action",
                    "arguments": json.dumps({
                        "document_path": "mock/path.md",
                        "action": "update_frontmatter",
                        "priority": "medium",
                        "reasoning": "Document needs better metadata",
                        "target_category": "user-guides"
                    })
                }
            },
            {
                "id": "call_3",
                "type": "function",
                "function": {
                    "name": "generate_frontmatter",
                    "arguments": json.dumps({
                        "document_path": "mock/path.md",
                        "title": "Mock Document",
                        "description": "This is a mock document for testing",
                        "category": "user-guides",
                        "tags": ["testing", "mock"]
                    })
                }
            }
        ]
        
        return {
            "choices": [{
                "message": {
                    "role": "assistant",
                    "tool_calls": mock_tool_calls
                }
            }]
        }
    
    def close(self):
        pass


def create_agent(use_mock: bool = False) -> DocumentAgent:
    """Factory function to create a document agent."""
    if use_mock:
        return DocumentAgent(client=MockGrokClient())
    return DocumentAgent()


if __name__ == "__main__":
    # Test with mock client
    print("Testing DocumentAgent with mock client...")
    agent = create_agent(use_mock=True)
    
    test_context = """=== DOCUMENT TO ANALYZE ===
Path: test/example.md
Title: Example Document
Category: misc

--- Document Content ---
# Example Document

This is a test document for the harmonization system.
"""
    
    result = agent.analyze_document(test_context)
    print(f"Status: {result.status}")
    if result.analysis:
        print(f"Analysis: {result.analysis.content_summary}")
    if result.action:
        print(f"Action: {result.action.action.value} - {result.action.reasoning}")
    if result.frontmatter:
        print(f"Frontmatter: {result.frontmatter.title}")
