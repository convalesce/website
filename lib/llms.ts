import {
  CLOSER,
  CONTEXT_SOURCES,
  CTA,
  FAQ,
  HERO,
  INTEGRATIONS,
  LINEAGE,
  PRINCIPLES,
  SITE,
  STEPS,
} from "@/lib/content";

/* Both LLM index files are derived from the same copy the page renders. The
   full text adds one thing the page does not spell out: the example incident
   walked end to end, assembled from the same LINEAGE data the artifacts cite. */

const live = INTEGRATIONS.filter((i) => i.status === "live").map((i) => i.name);
const soon = INTEGRATIONS.filter((i) => i.status === "soon").map((i) => i.name);

export function llmsIndex() {
  return `# ${SITE.company}

> ${SITE.description}

${SITE.company} is a developer tool for data teams. Its agents pick up a failed run, assemble the context around it (lineage, metadata, telemetry, run state), and return a proposed or applied fix with the evidence attached. It reads the shape of data (schemas, types, row counts, lineage), not the rows.

## Site

- [Home](${SITE.domain}): ${HERO.head}
- [How it works](${SITE.domain}/#how-it-works): ${STEPS.map((s) => s.title).join(" → ")}
- [Context](${SITE.domain}/#context): what the agent can see
- [Integrations](${SITE.domain}/#integrations): live: ${live.join(", ")}; coming: ${soon.join(", ")}
- [Full text](${SITE.domain}/llms-full.txt): every section of the site as plain text

## Contact

- Early access: ${CTA.primary.href}
- Email: ${SITE.email}
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
    (i) => `- ${i.name} (${i.kind}): ${i.status === "live" ? "live" : "coming soon"}`,
  ).join("\n");

  const principles = PRINCIPLES.map((p) => `- **${p.name}**: ${p.body} (${p.proof})`).join(
    "\n",
  );

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

## Early access

${CLOSER.head} ${CLOSER.body}

Request early access: ${CTA.primary.href}
`;
}

function byIdName(id: string) {
  return LINEAGE.nodes.find((n) => n.id === id)?.name ?? id;
}
