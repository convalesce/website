# Writing a post

This file is not rendered. One post is one file, `<slug>.mdx`, and the file name is its address.

- Front matter: `title`, `description`, `date` (`YYYY-MM-DD`, not in the future) and `tags` (a list of lowercase-hyphen words) are required.
- Optional front matter: `updated` (the day the content last changed) and `scenario` (the test scenario a walkthrough follows; for our reference, never shown).
- Quote a value that contains a colon. Reading time is worked out from the text; do not write it.
- Start headings at `##`. The page supplies the `h1`, and the `##` headings become the table of contents.
- `<Timeline events={[{ time, what, state? }]} />`: what went red, in order. `state` is `"fail"` or `"ok"`.
- `<Trail steps={[{ step, finding }]} />`: numbered investigation steps, each with what it showed.
- `<ByHand estimate="Our estimate for ..." steps={[{ step, minutes, note? }]} />`: the same work done by a person. The `estimate` label is required and must contain the word "estimate"; the total is added up for you.
- `<Callout tone="note|warn" title="...">text</Callout>`: a short aside. Tables, code blocks, quotes, lists and images (with alt text) are plain markdown.
- Write in plain words, short sentences and British spelling. No em dashes: use a comma, a colon or a full stop. No hype words.
- No invented statistics, no customer names, no third-party figures or sources. Label every estimated number as an estimate next to it, and say how it was arrived at.
- Write about the problem. Say nothing of how the product is built inside; what it does belongs in one short closing section.
- Run `npm run check:blog` before committing. The build runs the same checks and stops on a post that fails them.
