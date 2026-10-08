import {
  CLOSER,
  CONTEXT_SOURCES,
  CTA,
  FAQ,
  HERO,
  INTEGRATIONS,
  LINEAGE,
  PAGES,
  PRINCIPLES,
  SITE,
  STEPS,
  pageUrl,
} from "@/lib/content";
import { POSTS } from "@/lib/blog";

/* Both LLM index files are derived from the same copy the page renders. The
   full text adds one thing the page does not spell out: the example incident
   walked end to end, assembled from the same LINEAGE data the artifacts cite. */

const live = INTEGRATIONS.filter((i) => i.status === "live").map((i) => i.name);
const soon = INTEGRATIONS.filter((i) => i.status === "soon").map((i) => i.name);

const line = (p: (typeof PAGES)[number]) =>
  `- [${p.title}](${pageUrl(p.path)}): ${p.description}`;
const sitePages = PAGES.filter((p) => p.priority > 0.3).map(line).join("\n");
const pages = PAGES.filter((p) => p.priority <= 0.3).map(line).join("\n");
const posts = POSTS.map((p) => `- [${p.title}](${p.url}) (${p.date}): ${p.description}`).join("\n");

export function llmsIndex() {
  return `# ${SITE.company}

> ${SITE.description}

${SITE.company} is a developer tool for data teams. Its agents pick up a failed run, assemble the context around it (lineage, metadata, code, run state), and open a pull request with the fix and the evidence attached. It reads the shape of data (schemas, types, row counts, lineage) all the time, and while investigating a failure may run small read-only queries to confirm a cause: capped, masked, never stored, and switchable off per connection.

## Site

- [Home](${SITE.domain}): ${HERO.head}
- [How it works](${SITE.domain}/#how-it-works): ${STEPS.map((s) => s.title).join(", then ")}
- [Context](${SITE.domain}/#context): what the agent can see
- Live integrations: ${live.join(", ")}; coming: ${soon.join(", ")}
${sitePages}
- [Docs](${SITE.docs}): how to connect each tool
- [Full text](${SITE.domain}/llms-full.txt): every section of the site as plain text

## Blog

${posts}

## Legal

${pages}

## Contact

- App: ${CTA.primary.href}
- Email: ${SITE.email}
- Privacy questions: ${SITE.privacyEmail}
`;
}

export function llmsFull() {
  const steps = STEPS.map(
    (s) =>
      `### ${s.n}. ${s.title}\n\n${s.body}\n\n${s.artifact.caption}:\n${s.artifact.rows
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}`,
  ).join("\n\n");

  const sources = CONTEXT_SOURCES.map(
    (c) => `- **${c.name}**: ${c.question} Reads ${c.reads}.`,
  ).join("\n");

  const integrations = INTEGRATIONS.map(
    (i) =>
      `- ${i.name} (${i.kind}): ${i.status === "live" ? "live" : "coming soon"}`,
  ).join("\n");

  const principles = PRINCIPLES.map(
    (p) => `- **${p.name}**: ${p.body} (${p.proof})`,
  ).join("\n");

  const faq = FAQ.map((f) => `**Q: ${f.q}**\n\n${f.a}`).join("\n\n");

  return `# ${SITE.company}: ${SITE.tagline}

${SITE.description}

Website: ${SITE.domain}
Contact: ${SITE.email}

## ${HERO.head}

${HERO.body}

Example incident (${LINEAGE.run}): ${LINEAGE.nodes.map((n) => n.name).join(", ")}. ${byIdName(LINEAGE.origin)} fails when ${LINEAGE.change}; the blast radius reaches ${LINEAGE.blast.length} downstream tables; the fix is ${LINEAGE.fix}.

## How it works

${steps}

## What the agent can see

A generic copilot sees an error message. ${SITE.company} sees the execution that produced it, the data it touched, and the systems around it.

${sources}

## Integrations

${integrations}

## Principles

${principles}

## Questions

${faq}

## Blog

${posts}

## Get started

${CLOSER.head} ${CLOSER.body}

Sign in: ${CTA.primary.href}
Docs: ${SITE.docs}

## Legal

${pages}

Privacy questions: ${SITE.privacyEmail}
`;
}

function byIdName(id: string) {
  return LINEAGE.nodes.find((n) => n.id === id)?.name ?? id;
}
