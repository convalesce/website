/* Fails when a post in content/blog breaks a rule: a missing front matter
   field, a duplicate or reserved slug, a date in the future, an em dash, a
   ByHand block without its estimate label, and the rest of what
   lib/blog-source.ts checks. The build runs the same checks through
   lib/blog.ts.

     npm run check:blog            check content/blog
     npm run check:blog -- --self  prove each rule still catches its fault */

import { parse, headingsOf, minutesOf, problems, readSources, reservedSlugs } from "../lib/blog-source.ts";

const today = new Date().toISOString().slice(0, 10);

if (process.argv.includes("--self")) {
  const good = `---\ntitle: "A post"\ndescription: "About a thing."\ndate: 2026-01-05\ntags: [incidents]\n---\n\nText.\n\n## One\n\n<ByHand estimate="Our estimate" steps={[]} />\n`;
  const post = (file, raw) => {
    const parsed = parse(raw);
    return { slug: file.replace(/\.mdx$/, ""), file, ...parsed, headings: headingsOf(parsed.body), minutes: minutesOf(parsed.body) };
  };
  const cases = [
    ["a good post passes", [post("a.mdx", good)], null],
    ["missing field", [post("a.mdx", good.replace(/^description:.*\n/m, ""))], 'missing the front matter field "description"'],
    ["duplicate slug", [post("a.mdx", good), post("A.mdx", good)], "duplicate slug"],
    ["reserved slug", [post("integrations.mdx", good)], "is taken by a page"],
    ["future date", [post("a.mdx", good.replace("2026-01-05", "2999-01-01"))], "is in the future"],
    ["impossible date", [post("a.mdx", good.replace("2026-01-05", "2026-02-31"))], "not a real day"],
    ["em dash in body", [post("a.mdx", good.replace("Text.", "Text — more."))], "em dash in the body"],
    ["em dash in title", [post("a.mdx", good.replace("A post", "A — post"))], "em dash in the title"],
    ["ByHand without label", [post("a.mdx", good.replace(' estimate="Our estimate"', ""))], "without its estimate label"],
    ["ByHand label without the word", [post("a.mdx", good.replace("Our estimate", "Our guess"))], "without its estimate label"],
    ["level-one heading", [post("a.mdx", good.replace("## One", "# One"))], "level-one heading"],
    ["image without alt", [post("a.mdx", good.replace("Text.", "![](/x.png)"))], "image without alt text"],
    ["unquoted colon", [post("a.mdx", good.replace('"A post"', "A post: again"))], "double quotes"],
  ];
  let failed = 0;
  for (const [name, sources, expected] of cases) {
    const found = problems(sources, today, ["integrations"]);
    const ok = expected === null ? found.length === 0 : found.some((line) => line.includes(expected));
    if (!ok) failed += 1;
    console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : `\n     got: ${JSON.stringify(found)}`}`);
  }
  process.exit(failed > 0 ? 1 : 0);
}

const sources = readSources();
const found = problems(sources, today, reservedSlugs());
if (found.length > 0) {
  console.error(`content/blog: ${found.length} problem${found.length === 1 ? "" : "s"}\n${found.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}
console.log(`content/blog: ${sources.length} post${sources.length === 1 ? "" : "s"} checked, no problems`);
