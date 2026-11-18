import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
FIXERS = ("fix_whitespace.py", "normalize_tags.py", "fix_h1.py")


def run(script: str, cwd: Path):
    p = subprocess.run([sys.executable, str(REPO / "scripts" / script)], cwd=cwd, capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def test_fix_whitespace_and_normalize_tags_and_h1(tmp_path: Path):
    # Each fixer rewrites every Markdown file under ./docs in place, so they run
    # in a directory of this test's own. Run from the repository root, as it
    # was, the test put its sample into the real docs tree and the fixers then
    # rewrote all of it: 1,262 tracked files on 2026-11-17.
    docs_dir = tmp_path / "docs"
    docs_dir.mkdir()
    target = docs_dir / "sample.md"
    target.write_text("""---\ntitle: Sample\ntags: [Foo, foo]\ncategory: misc\n---\nSome text with trailing spaces.   \nno h1 here\n""")

    for script in FIXERS:
        code, out, err = run(script, tmp_path)
        assert code == 0, f"{script}: {err or out}"

    text = target.read_text()
    assert "trailing spaces.   \n" not in text
    assert 'tags:' in text
    assert '# Sample' in text


def test_the_fixers_leave_the_repository_docs_alone(tmp_path: Path):
    """The test above must never reach the checked-in docs tree again."""
    probe = REPO / "docs" / "index.md"
    before = probe.read_bytes() if probe.exists() else None
    (tmp_path / "docs").mkdir()
    for script in FIXERS:
        assert run(script, tmp_path)[0] == 0
    assert (probe.read_bytes() if probe.exists() else None) == before
    assert not list((REPO / "docs").glob(f"{tmp_path.name}-sample.md"))
