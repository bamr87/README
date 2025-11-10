#!/usr/bin/env python3
"""
Documentation processing script for the centralized docs aggregator.
Organizes documentation files and generates YAML front matter.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Optional

import requests
import yaml

# Configuration
RAW_DIR = 'raw_docs'
ORGANIZED_DIR = 'docs'
AI_API_URL = 'https://api.x.ai/v1/chat/completions'  # Placeholder; see https://x.ai/api for setup
AI_API_KEY = os.getenv('XAI_API_KEY')  # Set in GitHub secrets

def categorize_content(content: str) -> str:
    """
    Categorize content based on keywords and patterns.
    Enhanced version with more sophisticated categorization.
    """
    content_lower = content.lower()
    
    # Installation/setup patterns (check first to avoid conflicts)
    setup_patterns = ['install', 'installation', 'setup', 'configuration', 'config', 'deployment']
    if any(pattern in content_lower for pattern in setup_patterns):
        return 'setup'
    
    # API documentation patterns
    api_patterns = ['api', 'endpoint', 'rest', 'graphql', 'swagger', 'openapi', 'reference']
    if any(pattern in content_lower for pattern in api_patterns):
        return 'api'
    
    # User guide patterns
    guide_patterns = ['guide', 'tutorial', 'how-to', 'walkthrough', 'getting started', 'quick start']
    if any(pattern in content_lower for pattern in guide_patterns):
        return 'user-guides'
    
    # Development patterns
    dev_patterns = ['development', 'contributing', 'build', 'testing', 'ci/cd', 'pipeline']
    if any(pattern in content_lower for pattern in dev_patterns):
        return 'development'
    
    # Architecture patterns
    arch_patterns = ['architecture', 'design', 'overview', 'concepts', 'principles']
    if any(pattern in content_lower for pattern in arch_patterns):
        return 'architecture'
    
    return 'misc'

def extract_title_from_content(content: str) -> str:
    """
    Extract title from markdown content (first h1 or filename).
    """
    # Look for title in front matter first
    if content.startswith('---'):
        fm_end = content.find('---', 3)
        if fm_end > 0:
            try:
                fm_content = content[3:fm_end]
                fm_data = yaml.safe_load(fm_content)
                if isinstance(fm_data, dict) and 'title' in fm_data:
                    return fm_data['title']
            except yaml.YAMLError:
                pass
    
    # Look for first h1 heading
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1).strip()
    
    return None

def generate_summary(content: str, max_length: int = 200) -> str:
    """
    Generate a summary from content by extracting the first paragraph or description.
    """
    # Remove front matter if present
    if content.startswith('---'):
        fm_end = content.find('---', 3)
        if fm_end > 0:
            content = content[fm_end + 3:]
    
    # Extract first paragraph
    paragraphs = content.split('\n\n')
    for para in paragraphs:
        para = para.strip()
        if para and not para.startswith('#') and not para.startswith('*') and not para.startswith('-'):
            # Clean up markdown formatting
            para = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', para)  # Remove links
            para = re.sub(r'`([^`]+)`', r'\1', para)  # Remove code formatting
            para = re.sub(r'[#*_-]', '', para)  # Remove markdown formatting
            para = para.strip()
            
            if len(para) > 20:  # Only use substantial paragraphs
                return para[:max_length] + ('...' if len(para) > max_length else '')
    
    return "No summary available"

def generate_tags(content: str) -> List[str]:
    """
    Generate tags based on content analysis.
    """
    content_lower = content.lower()
    tags = []
    
    # Technology tags
    tech_keywords = {
        'python': ['python', 'django', 'flask', 'fastapi'],
        'javascript': ['javascript', 'node', 'react', 'vue', 'angular'],
        'docker': ['docker', 'container', 'dockerfile'],
        'kubernetes': ['kubernetes', 'k8s', 'helm'],
        'aws': ['aws', 'amazon', 's3', 'ec2', 'lambda'],
        'azure': ['azure', 'microsoft'],
        'gcp': ['gcp', 'google cloud', 'gce'],
        'api': ['api', 'rest', 'graphql'],
        'database': ['database', 'sql', 'postgres', 'mysql', 'mongodb'],
        'testing': ['test', 'testing', 'unit test', 'integration test']
    }
    
    for tag, keywords in tech_keywords.items():
        if any(keyword in content_lower for keyword in keywords):
            tags.append(tag)
    
    # Category-based tags
    category = categorize_content(content)
    if category != 'misc':
        tags.append(category)
    
    # Add common tags if none found
    if not tags:
        tags = ['documentation']
    
    return tags[:5]  # Limit to 5 tags

def call_ai_api(content: str) -> Optional[Dict]:
    """
    Call AI API for enhanced content analysis.
    """
    if not AI_API_KEY:
        return None
    
    try:
        payload = {
            'model': 'grok-beta',
            'messages': [
                {
                    'role': 'user', 
                    'content': f"Analyze this documentation and provide a title, summary (max 150 chars), and 3-5 relevant tags. Content: {content[:1000]}"
                }
            ],
            'max_tokens': 200
        }
        
        response = requests.post(
            AI_API_URL, 
            json=payload, 
            headers={'Authorization': f'Bearer {AI_API_KEY}'},
            timeout=30
        )
        
        if response.status_code == 200:
            ai_result = response.json()['choices'][0]['message']['content']
            # Parse AI response (this is a simplified parser)
            return {
                'ai_enhanced': True,
                'ai_analysis': ai_result
            }
    except Exception as e:
        print(f"AI API call failed: {e}")
    
    return None

def generate_front_matter(content: str, filename: str) -> Dict:
    """
    Generate comprehensive front matter for a documentation file.
    """
    # Extract title
    title = extract_title_from_content(content)
    if not title:
        # Use filename as fallback
        title = Path(filename).stem.replace('_', ' ').replace('-', ' ').title()
    
    # Generate summary
    summary = generate_summary(content)
    
    # Generate tags
    tags = generate_tags(content)
    
    # Get category
    category = categorize_content(content)
    
    # Try AI enhancement
    ai_result = call_ai_api(content)
    
    front_matter = {
        'title': title,
        'summary': summary,
        'tags': tags,
        'category': category,
        'source_file': filename,
        'last_updated': None  # Could be enhanced with git info
    }
    
    if ai_result:
        front_matter.update(ai_result)
    
    return front_matter

def process_markdown_file(src_path: Path, dest_base: Path) -> None:
    """
    Process a single markdown file.
    """
    try:
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract existing front matter if any
        if content.startswith('---'):
            fm_end = content.find('---', 3)
            if fm_end > 0:
                try:
                    existing_fm = yaml.safe_load(content[3:fm_end])
                    body = content[fm_end + 3:]
                except yaml.YAMLError:
                    existing_fm = {}
                    body = content
            else:
                existing_fm = {}
                body = content
        else:
            existing_fm = {}
            body = content
        
        # Generate new front matter
        new_fm = generate_front_matter(body, src_path.name)
        
        # Merge with existing front matter (new takes precedence)
        updated_fm = {**existing_fm, **new_fm}
        
        # Determine destination directory
        category = categorize_content(body)
        
        # Extract repo name from path
        path_parts = src_path.parts
        raw_docs_index = path_parts.index(RAW_DIR) if RAW_DIR in path_parts else 0
        if raw_docs_index + 1 < len(path_parts):
            repo_name = path_parts[raw_docs_index + 1]
            relative_path = Path(*path_parts[raw_docs_index + 2:])
        else:
            repo_name = "unknown"
            relative_path = src_path.name
        
        dest_dir = dest_base / category / repo_name / relative_path.parent
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / src_path.name
        
        # Write updated markdown file
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write('---\n')
            yaml.dump(updated_fm, f, default_flow_style=False, allow_unicode=True)
            f.write('---\n')
            f.write(body)
        
        print(f"Processed: {src_path} -> {dest_path}")
        
    except Exception as e:
        print(f"Error processing {src_path}: {e}")

def main():
    """
    Main processing function.
    """
    print("Starting documentation processing...")
    
    # Create organized directory
    Path(ORGANIZED_DIR).mkdir(exist_ok=True)
    
    # Process all markdown files
    processed_count = 0
    for root, dirs, files in os.walk(RAW_DIR):
        for file in files:
            if file.endswith('.md') or file.upper().startswith('README'):
                src_path = Path(root) / file
                process_markdown_file(src_path, Path(ORGANIZED_DIR))
                processed_count += 1
    
    print(f"Processed {processed_count} documentation files")
    
    # Clean up raw_docs after processing
    print("Cleaning up raw documentation files...")
    for root, dirs, files in os.walk(RAW_DIR, topdown=False):
        for file in files:
            os.remove(Path(root) / file)
        for dir in dirs:
            os.rmdir(Path(root) / dir)
    
    if os.path.exists(RAW_DIR):
        os.rmdir(RAW_DIR)
    
    print("Documentation processing completed!")

if __name__ == "__main__":
    main()

