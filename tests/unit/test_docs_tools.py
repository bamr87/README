import os
import tempfile
from pathlib import Path
import subprocess


def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def test_fix_whitespace_and_normalize_tags_and_h1(tmp_path: Path):
    # Setup a sample markdown file
    md = tmp_path / "sample.md"
    md.write_text("""---\ntitle: Sample\ntags: [Foo, foo]\ncategory: misc\n---\nSome text with trailing spaces.   \nno h1 here\n""")

    # Copy into docs directory
    docs_dir = Path('docs')
    docs_dir.mkdir(exist_ok=True)
    target = docs_dir / f"{tmp_path.name}-sample.md"
    target.write_text(md.read_text())

    # Run fixers
    code, out, err = run('python3 scripts/fix_whitespace.py')
    assert code == 0
    code, out, err = run('python3 scripts/normalize_tags.py')
    assert code == 0
    code, out, err = run('python3 scripts/fix_h1.py')
    assert code == 0

    # read file
    text = target.read_text()
    assert not text.endswith('   \n')
    assert 'tags:' in text
    assert '# Sample' in text

    # Cleanup
    target.unlink()
