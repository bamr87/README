"""
Repository operations module for the documentation aggregator.
"""

import re
import shutil
import subprocess
from pathlib import Path
from typing import List


def extract_repo_name(repo_url: str) -> str:
    """
    Extract repository name from URL.
    
    Args:
        repo_url: Repository URL
        
    Returns:
        Repository name
    """
    # Remove .git suffix if present
    repo_url = repo_url.rstrip('.git')
    
    # Extract name from URL
    if '/' in repo_url:
        return repo_url.split('/')[-1]
    
    return repo_url

def is_valid_repo_url(repo_url: str) -> bool:
    """
    Validate repository URL.
    
    Args:
        repo_url: Repository URL to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not repo_url or not isinstance(repo_url, str):
        return False
    
    # Basic URL patterns
    patterns = [
        r'^https://github\.com/[^/]+/[^/]+/?$',
        r'^https://github\.com/[^/]+/[^/]+\.git$',
        r'^git@github\.com:[^/]+/[^/]+\.git$',
        r'^https://gitlab\.com/[^/]+/[^/]+/?$',
        r'^https://gitlab\.com/[^/]+/[^/]+\.git$',
    ]
    
    return any(re.match(pattern, repo_url) for pattern in patterns)

def git_clone_repo(repo_url: str, dest_dir: str) -> bool:
    """
    Clone a git repository.
    
    Args:
        repo_url: Repository URL
        dest_dir: Destination directory
        
    Returns:
        True if successful, False otherwise
    """
    try:
        result = subprocess.run(
            ['git', 'clone', repo_url, dest_dir],
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, subprocess.SubprocessError):
        return False

def git_pull_repo(repo_dir: str) -> bool:
    """
    Pull latest changes from a git repository.
    
    Args:
        repo_dir: Repository directory
        
    Returns:
        True if successful, False otherwise
    """
    try:
        result = subprocess.run(
            ['git', 'pull'],
            cwd=repo_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, subprocess.SubprocessError):
        return False

def find_documentation_files(repo_dir: Path) -> List[Path]:
    """
    Find documentation files in a repository.
    
    Args:
        repo_dir: Repository directory
        
    Returns:
        List of documentation file paths
    """
    doc_files = []
    
    # File patterns to look for
    patterns = ['*.md', 'README*', 'readme*', '*.rst', '*.txt']
    
    for pattern in patterns:
        for file_path in repo_dir.rglob(pattern):
            # Skip .git directory and other hidden directories
            if '.git' in file_path.parts:
                continue
            
            # Skip non-files
            if not file_path.is_file():
                continue
            
            doc_files.append(file_path)
    
    return doc_files

def copy_documentation_files(source_dir: Path, dest_dir: Path) -> List[Path]:
    """
    Copy documentation files from source to destination.
    
    Args:
        source_dir: Source directory
        dest_dir: Destination directory
        
    Returns:
        List of copied file paths
    """
    copied_files = []
    doc_files = find_documentation_files(source_dir)
    
    for file_path in doc_files:
        # Calculate relative path
        rel_path = file_path.relative_to(source_dir)
        dest_file = dest_dir / rel_path
        
        # Create destination directory
        dest_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Copy file
        shutil.copy2(file_path, dest_file)
        copied_files.append(dest_file)
    
    return copied_files

def process_repository(repo_url: str, temp_dir: str, raw_docs_dir: str) -> dict:
    """
    Process a single repository.
    
    Args:
        repo_url: Repository URL
        temp_dir: Temporary directory for cloning
        raw_docs_dir: Directory for raw documentation files
        
    Returns:
        Processing result dictionary
    """
    result = {
        'repo_url': repo_url,
        'success': False,
        'files_found': 0,
        'files_copied': 0,
        'error': None
    }
    
    try:
        # Extract repo name
        repo_name = extract_repo_name(repo_url)
        temp_repo_dir = Path(temp_dir) / repo_name
        raw_repo_dir = Path(raw_docs_dir) / repo_name
        
        # Clone or update repository
        if temp_repo_dir.exists() and (temp_repo_dir / '.git').exists():
            # Update existing repository
            if not git_pull_repo(str(temp_repo_dir)):
                result['error'] = f"Failed to pull repository: {repo_url}"
                return result
        else:
            # Clone new repository
            if not git_clone_repo(repo_url, str(temp_repo_dir)):
                result['error'] = f"Failed to clone repository: {repo_url}"
                return result
        
        # Find and copy documentation files
        doc_files = find_documentation_files(temp_repo_dir)
        result['files_found'] = len(doc_files)
        
        if doc_files:
            copied_files = copy_documentation_files(temp_repo_dir, raw_repo_dir)
            result['files_copied'] = len(copied_files)
        
        result['success'] = True
        
    except Exception as e:
        result['error'] = str(e)
    
    return result
