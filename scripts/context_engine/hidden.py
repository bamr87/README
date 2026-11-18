"""
Hidden carriers: text a reader never sees but an agent reads.

Upstream docs are third-party input, read by agents and pasted into AI
prompts. The collect stage (collect.py) drops what renders as nothing before
anything reads a page: HTML comments in prose, and zero-width or
bidirectional formatting characters anywhere (issue #52). Fenced and inline
code keep their comments, empty comments stay, emoji ZWJ sequences and
subdivision flags stay, and front matter values lose only the formatting
characters. Every pass is idempotent.
"""

import re
import unicodedata
from typing import List, Optional, Tuple

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
