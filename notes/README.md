# Notes

> The hand-written part of the vault: durable notes that belong to the fleet rather than to one repository.

The build copies every Markdown file here to `docs/brain/notes/`, where it joins the graph like any other page, so wikilinks work in both directions. Everything else under `docs/` is generated; this directory is the one place to write by hand.

Add a note with `python3 -m scripts.context_engine save "Title" "Body"` or by creating a file with `title`, `kind: note` and `tags` in its front matter. Then run `python3 -m scripts.context_engine build`.

Write here when knowledge spans repositories or has no owner. When a page belongs to one repository, write it there: the crawl brings it in.
