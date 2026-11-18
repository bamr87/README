#!/usr/bin/env python3
"""
Documentation processing script for the centralized docs aggregator.
Copies markdown files from raw_docs into docs/{repo_name}/ preserving
the original directory structure, and adds YAML front matter.

The preserved directory structure is the navigation contract: the context
engine's navigator turns docs/{repo_name}/** straight into the published
sidebar, so this stage must keep the upstream hierarchy intact and leave
every page safe to place in a navigation entry.

Upstream docs are third-party input, read by agents and pasted into AI
prompts, so this stage also drops hidden carriers (strip_hidden): text a
reader never sees but a model does.

Every page also passes the secret screen (scripts/context_engine/redact.py):
a credential committed upstream by mistake is replaced with
[REDACTED:<kind>] before the page is written, listed in
docs/results/secret_screen.json by project, path, line and kind (never by
value), and the run exits 1 so the scheduled crawl stops before its commit.
A clean run writes no report.
"""

import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from fix_frontmatter_icons import normalize_frontmatter  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.context_engine.redact import redact  # noqa: E402

# Configuration
RAW_DIR = 'raw_docs'
ORGANIZED_DIR = 'docs'
SECRET_SCREEN_PATH = Path(ORGANIZED_DIR) / 'results' / 'secret_screen.json'

# --- hidden carriers ----------------------------------------------------------
#
# HTML comments and zero-width formatting controls render as nothing, so a
# reader cannot see what they say, but an agent reading the corpus (directly,
# over MCP, or as AI prompt facts) does. Ingest drops them; nothing visible is
# removed (issue #52).

# Zero-width and bidirectional formatting controls, removed everywhere, code
# included (a bidi override inside a code sample is the Trojan Source attack):
# U+200B zero-width space, U+202A-U+202E bidi embeddings and overrides,
# U+2060-U+206F word joiner, invisible operators, bidi isolates and the
# deprecated format controls, U+FEFF zero-width no-break space.
_INVISIBLE = re.compile('[\u200b\u202a-\u202e\u2060-\u206f\ufeff]')
# Unicode tag characters smuggle invisible ASCII. Their one legitimate use, an
# emoji subdivision flag (U+1F3F4, tag letters, U+E007F), is kept.
_TAGS = re.compile(
    '(\U0001F3F4[\U000E0020-\U000E007E]{1,8}\U000E007F)|[\U000E0000-\U000E007F]')
# Zero-width (non-)joiners only do something between two non-ASCII characters
# (emoji ZWJ sequences, Indic and Persian scripts); anywhere else they hide
# text or split a keyword.
_JOINERS = re.compile('[\u200c\u200d]')

# Fenced and inline code are content: an HTML comment in a code sample stays.
_CODE_OR_COMMENT = re.compile(
    r'(?P<fence>^[ \t]*(?:`{3,}|~{3,}))|(?P<ticks>(?<!\\)`+)|(?P<comment><!--)',
    re.M)
_BLANK_LINE = re.compile(r'\n[ \t]*\n')
# What is left of a line once its comments are gone, when that is only block
# syntax: a list, heading or quote marker, a setext underline, a thematic
# break, a fence or a table delimiter. Left bare, it changes how the page
# renders: `- <!-- note -->` stripped to `-` turns the list item above into a
# heading. Such a line keeps an empty comment instead, which hides nothing.
_BLOCK_SYNTAX_ONLY = re.compile(r'[ \t\d.)*+_=#>`~|:-]+')
_EMPTY_COMMENT = '<!---->'


def _joins(char: str) -> bool:
    return (ord(char) > 0x7F and not char.isspace()
            and unicodedata.category(char) != 'Cf')


def strip_invisible(text: str) -> str:
    """Drop zero-width and bidirectional formatting characters."""
    text = _INVISIBLE.sub('', text)
    text = _TAGS.sub(lambda m: m.group(1) or '', text)

    def joiner(match: 're.Match[str]') -> str:
        i = match.start()
        prev = text[i - 1] if i else ''
        nxt = text[i + 1] if i + 1 < len(text) else ''
        keep = prev and nxt and _joins(prev) and _joins(nxt)
        return match.group(0) if keep else ''

    return _JOINERS.sub(joiner, text)


def _code_span_end(text: str, start: int, end: int) -> int:
    """End of the code span opened by the backtick run text[start:end], or
    `end` when the run is literal (no closing run before a blank line)."""
    closer = re.compile(r'(?<!`)`{%d}(?!`)' % (end - start))
    match = closer.search(text, end)
    if match and not _BLANK_LINE.search(text, end, match.start()):
        return match.end()
    return end


def _comment_spans(text: str) -> List[Tuple[int, int]]:
    """Every closed HTML comment with content, outside fenced and inline code."""
    spans: List[Tuple[int, int]] = []
    pos = 0
    while True:
        match = _CODE_OR_COMMENT.search(text, pos)
        if match is None:
            return spans
        if match.group('fence'):
            run = match.group('fence').lstrip(' \t')
            line_end = text.find('\n', match.end())
            line_end = len(text) if line_end == -1 else line_end
            if run[0] == '`' and '`' in text[match.end():line_end]:
                # A backtick "fence" with backticks in its info string is
                # inline code (CommonMark), not a fence.
                pos = _code_span_end(text, match.end() - len(run), match.end())
                continue
            closer = re.compile(r'^[ \t]*%s{%d,}[ \t]*$' % (re.escape(run[0]), len(run)),
                                re.M)
            close = closer.search(text, min(line_end + 1, len(text)))
            pos = close.end() if close else len(text)   # unclosed: code to the end
        elif match.group('ticks'):
            pos = _code_span_end(text, match.start(), match.end())
        else:
            start = match.start()
            if text.startswith('<!-->', start) or text.startswith('<!--->', start):
                pos = start + 5   # empty comments hide nothing; leave them
                continue
            end = text.find('-->', start + 4)
            if end == -1:   # unclosed: not a comment, leave the text
                pos = match.end()
                continue
            end += 3
            # An empty comment hides nothing; authors use one to split two lists.
            if text[start + 4:end - 3].strip():
                spans.append((start, end))
            pos = end


def strip_comments(text: str) -> str:
    """Remove HTML comments from prose, keeping the block boundary a
    comment-only line made between two paragraphs."""
    spans = _comment_spans(text)
    if not spans:
        return text
    # A sentinel the text does not contain marks each removed comment.
    mark = next(chr(code) for code in range(0xF8FF, 0xE000, -1) if chr(code) not in text)
    parts, pos = [], 0
    for start, end in spans:
        parts += [text[pos:start], mark]
        pos = end
    parts.append(text[pos:])
    joins = re.compile(r'([ \t]*)%s(?:[ \t]*%s)*([ \t]*)' % (mark, mark))

    def tidy(line: str) -> Optional[str]:
        if mark not in line:
            return line
        rest = line.replace(mark, '')
        if not rest.strip():
            return None   # the line held only comments
        if _BLOCK_SYNTAX_ONLY.fullmatch(rest):
            # Keep the line as it renders, with each comment emptied.
            return joins.sub(
                lambda m: m.group(1) + _EMPTY_COMMENT + m.group(2), line)

        def around(match: 're.Match[str]') -> str:
            if match.start() == 0:
                return match.group(1)   # keep the indentation
            if not line[match.end():].strip():
                return ''   # trailing spaces left behind would make a hard break
            return ' ' if match.group(1) or match.group(2) else ''

        return joins.sub(around, line)

    lines = [tidy(line) for line in ''.join(parts).split('\n')]
    out: List[str] = []
    i = 0
    while i < len(lines):
        if lines[i] is not None:
            out.append(lines[i])
            i += 1
            continue
        j = i
        while j < len(lines) and lines[j] is None:
            j += 1
        blank_before = not out or not out[-1].strip()
        blank_after = j == len(lines) or not lines[j].strip()
        if not blank_before and not blank_after:
            out.append('')   # the comment separated two blocks; keep them apart
        elif blank_before and blank_after and j < len(lines):
            j += 1           # one blank line, not two, where the comment stood
        i = j
    return '\n'.join(out)


def strip_hidden(text: str) -> str:
    """
    Drop hidden carriers from a Markdown body: HTML comments in prose and
    zero-width or bidirectional formatting characters anywhere. Idempotent:
    a second pass changes nothing.
    """
    while True:
        cleaned = strip_comments(strip_invisible(text))
        if cleaned == text:
            return cleaned
        text = cleaned


def strip_hidden_values(value):
    """Front matter is not Markdown: only formatting characters go."""
    if isinstance(value, str):
        return strip_invisible(value)
    if isinstance(value, list):
        return [strip_hidden_values(item) for item in value]
    if isinstance(value, dict):
        return {key: strip_hidden_values(item) for key, item in value.items()}
    return value


def extract_title_from_content(content: str) -> Optional[str]:
    """
    Extract title from markdown content (front matter title or first h1).
    """
    # Look for title in front matter first
    if content.startswith('---'):
        fm_match = re.search(r'\n---\s*\n', content[3:])
        if fm_match:
            fm_end = fm_match.start() + 3
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


def generate_front_matter(content: str, filename: str) -> Dict:
    """
    Generate minimal front matter for a documentation file.
    """
    title = extract_title_from_content(content)
    if not title:
        title = Path(filename).stem.replace('_', ' ').replace('-', ' ').title()

    front_matter = {
        'title': title,
        'source_file': filename,
    }

    return front_matter


def source_location(src_path: Path) -> Tuple[str, Path]:
    """The repo name and in-repo path of a raw_docs/{repo_name}/... file."""
    path_parts = src_path.parts
    raw_docs_index = path_parts.index(RAW_DIR) if RAW_DIR in path_parts else 0
    if raw_docs_index + 1 < len(path_parts):
        return path_parts[raw_docs_index + 1], Path(*path_parts[raw_docs_index + 2:])
    return "unknown", Path(src_path.name)


def process_markdown_file(src_path: Path, dest_base: Path) -> List[Dict]:
    """
    Process a single markdown file. Output goes to docs/{repo_name}/{relative_path}.

    Returns the page's secret-screen hits, one {project, path, line, kind}
    per credential that was redacted; an empty list means a clean page.
    """
    repo_name, relative_path = source_location(src_path)
    hits = []
    try:
        # utf-8-sig: a leading BOM is an encoding signature, not content, and
        # left in place it hides the front matter from the parser below.
        with open(src_path, 'r', encoding='utf-8-sig') as f:
            # Screen before anything else reads the page, so no credential
            # reaches the corpus, the site, AI prompts or MCP answers.
            content, hits = redact(f.read())

        # Extract existing front matter if any
        if content.startswith('---'):
            fm_match = re.search(r'\n---\s*\n', content[3:])
            if fm_match:
                fm_end = fm_match.start() + 3
                try:
                    existing_fm = yaml.safe_load(content[3:fm_end])
                    body = content[fm_end + fm_match.end() - fm_match.start():]
                except yaml.YAMLError:
                    existing_fm = {}
                    body = content
            else:
                existing_fm = {}
                body = content
        else:
            existing_fm = {}
            body = content

        # Hidden carriers (HTML comments, zero-width and bidi controls) are
        # third-party text no reader sees; drop them before anything reads it.
        body = strip_hidden(body)

        # Generate new front matter
        new_fm = generate_front_matter(body, src_path.name)

        # Merge with existing front matter (new takes precedence)
        updated_fm = strip_hidden_values({**existing_fm, **new_fm})

        # Upstream icon vocabularies (Bootstrap Icons here) crash Material's
        # nav rendering; map them onto bundled icons, keeping the original.
        updated_fm, _ = normalize_frontmatter(updated_fm)

        # Normalize tags: MkDocs requires tags to be a list
        if 'tags' in updated_fm:
            if isinstance(updated_fm['tags'], str):
                updated_fm['tags'] = [updated_fm['tags']]
            elif isinstance(updated_fm['tags'], list):
                # Flatten any nested lists and ensure all items are strings
                flat = []
                for item in updated_fm['tags']:
                    if isinstance(item, list):
                        flat.extend(str(i) for i in item)
                    else:
                        flat.append(str(item))
                updated_fm['tags'] = flat

        # Output: docs/{repo_name}/{original_relative_path}
        dest_dir = dest_base / repo_name / relative_path.parent
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

    return [{"project": repo_name, "path": relative_path.as_posix(),
             "line": hit.line, "kind": hit.kind} for hit in hits]


def write_secret_screen(hits: List[Dict], pages: int,
                        path: Path = SECRET_SCREEN_PATH) -> None:
    """
    Record what the screen found - where, never the value. The report exists
    only after a crawl that redacted something (a run that fails, so it is
    never committed); a clean crawl removes a stale one.
    """
    if not hits:
        if path.exists():
            path.unlink()
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "description": ("Secret screen of the crawled corpus (scripts/process.py): "
                        "each credential found upstream, redacted to "
                        "[REDACTED:<kind>] in docs/. Values are never recorded."),
        "pages_screened": pages,
        "hits": sorted(hits, key=lambda h: (h["project"], h["path"], h["line"], h["kind"])),
    }
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    """
    Main processing function. Returns 1 when the secret screen redacted
    anything, so the crawl that called it stops before committing.
    """
    print("Starting documentation processing...")

    # Create organized directory
    Path(ORGANIZED_DIR).mkdir(exist_ok=True)

    # Process all markdown files
    processed_count = 0
    secret_hits: List[Dict] = []
    for root, dirs, files in os.walk(RAW_DIR):
        for file in files:
            if file.endswith('.md') or file.upper().startswith('README'):
                src_path = Path(root) / file
                secret_hits += process_markdown_file(src_path, Path(ORGANIZED_DIR))
                processed_count += 1

    print(f"Processed {processed_count} documentation files")
    write_secret_screen(secret_hits, processed_count)

    # Clean up raw_docs after processing
    print("Cleaning up raw documentation files...")
    for root, dirs, files in os.walk(RAW_DIR, topdown=False):
        for file in files:
            os.remove(Path(root) / file)
        for d in dirs:
            os.rmdir(Path(root) / d)

    if os.path.exists(RAW_DIR):
        os.rmdir(RAW_DIR)

    if secret_hits:
        print(f"SECRET SCREEN: redacted {len(secret_hits)} credential(s) found upstream "
              f"(listed in {SECRET_SCREEN_PATH}). Revoke each one and remove it from "
              "its source repository, then crawl again:")
        for hit in secret_hits:
            print(f"  {hit['project']}/{hit['path']}:{hit['line']}  {hit['kind']}")
        return 1

    print("Documentation processing completed!")
    return 0


if __name__ == "__main__":
    sys.exit(main())

