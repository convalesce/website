# Writing a post

This file is not rendered. One post is one file, `<slug>.mdx`, and the file name is its address.

- Front matter: `title`, `description`, `date` (`YYYY-MM-DD`, not in the future) and `tags` (a list of lowercase-hyphen words) are required.
- Optional front matter: `updated` (the day the content last changed) and `scenario` (the test scenario a walkthrough follows; for our reference, never shown).
- Quote a value that contains a colon. Reading time is worked out from the text; do not write it.
- Start headings at `##`. The page supplies the `h1`, and the `##` headings become the table of contents.
- Optional front matter: `waited`, a list of who was held up, shown with the facts at the top of the post.
- `<Timeline events={[{ time, what, state?, mark? }]} />`: what went red, in order, with times as `HH:MM`. `state` is `"fail"` or `"ok"`. `mark` is `"started"` on the moment someone started looking and `"found"` on the moment the cause was found. The facts box and the scale at the top of the post are worked out from these.
- `<Window from="08:50" to="09:10" />` on its own line under a `##` heading: the part of the Timeline that section is about. `<Window after />` for what comes after the fix.
- A list whose every item opens with a bold lead is drawn as a box of key points, and its leads appear in the outline. Put `<Checklist>` and `</Checklist>` around such a list, with a blank line inside each, to draw it as a list to tick.
- The first paragraph of each section stays on the page and the rest folds under "The full account", so open each section with the line that matters most.
- `<Trail steps={[{ step, finding }]} />`: numbered investigation steps, each with what it showed.
- `<ByHand estimate="Our estimate for ..." steps={[{ step, minutes, note? }]} />`: the same work done by a person. The `estimate` label is required and must contain the word "estimate"; the total is added up for you.
- `<Callout tone="note|warn" title="...">text</Callout>`: a short aside. Tables, code blocks, quotes, lists and images (with alt text) are plain markdown.
- Write in plain words, short sentences and British spelling. No em dashes: use a comma, a colon or a full stop. No hype words.
- No invented statistics, no customer names, no third-party figures or sources. Label every estimated number as an estimate next to it, and say how it was arrived at.
- Write about the problem. Say nothing of how the product is built inside; what it does belongs in one short closing section.
- Run `npm run check:blog` before committing. The build runs the same checks and stops on a post that fails them.
