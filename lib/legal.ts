import { SITE } from "@/lib/content";

/* Legal copy lives here as data, the same way the page copy lives in
   content.ts: one place to review a change of wording. */

export type Clause = {
  heading: string;
  /** paragraphs, in order */
  body?: readonly string[];
  /** a list under the paragraphs */
  points?: readonly string[];
};

export type LegalPage = {
  title: string;
  /** shown under the title; bump it when the wording changes */
  updated: string;
  intro: string;
  clauses: readonly Clause[];
};

const CONTACT = `Write to ${SITE.email}.`;

export const PRIVACY: LegalPage = {
  title: "Privacy policy",
  updated: "4 October 2026",
  intro:
    "Convalesce finds what broke in your data pipelines, why, and what to do about it. To do that it needs to know who you are and to read parts of the systems you connect. This page says what it collects, what it does with it, and what it never does.",
  clauses: [
    {
      heading: "What is collected about you",
      points: [
        "When you sign in with GitHub: your GitHub login, account id and public name.",
        "When you sign in with Google: your name, email address and Google account id. The email must be one Google has verified.",
        "What you tell us after signing in: your name, what best describes your role, your job title, and whether you use Convalesce for a company (with its name and the size of its data team) or for yourself.",
        "What you do in the console: questions you ask about an incident, decisions you record on a proposed fix, and settings you change.",
      ],
    },
    {
      heading: "What is collected from the systems you connect",
      body: [
        "Convalesce reads the shape of your data, not the rows. From the tools you connect it receives metadata: the names of pipelines, tasks, tables and columns; run states, timings and error messages; schema changes; lineage between jobs and tables; and the results of data checks.",
        "Data access is off unless you turn it on. If you do, Convalesce can run read-only queries against the sources you allow, and uses what comes back only to investigate the incident in front of it.",
        "Code access is a separate step. If you connect repositories through the Convalesce GitHub App, it reads the files and history of the repositories you choose, and can open issues and draft pull requests there. It never merges a pull request.",
      ],
    },
    {
      heading: "What it is used for",
      points: [
        "To open and keep your workspace, and to show who decided what.",
        "To detect failures, investigate their cause, and propose fixes.",
        "To keep the service working: logs, error reports and usage counts.",
        "To understand how the product is used. Usage analytics in the console run only with your consent.",
      ],
      body: [
        "Your data is not sold, and it is not used to train models, ours or anyone else's.",
      ],
    },
    {
      heading: "Who else handles it",
      body: [
        "Convalesce runs on Google Cloud, which hosts the service and its databases. To investigate an incident, the relevant metadata, error text and code excerpts are sent to a model provider under terms that bar training on them.",
        "GitHub receives what you would expect when you connect it: the issues and pull requests Convalesce writes in your repositories. This website uses Vercel for hosting and analytics, and Google Analytics.",
        "Nobody else receives your data, unless the law requires it.",
      ],
    },
    {
      heading: "How long it is kept",
      body: [
        "Your account and workspace are kept for as long as you use Convalesce. Ask for your workspace to be deleted and it is deleted, with everything in it. Backups age out after that on their own schedule.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "The console sets one cookie to keep you signed in. It lasts twelve hours. A short-lived cookie guards the sign-in itself. There are no advertising cookies.",
      ],
    },
    {
      heading: "Your choices",
      points: [
        "See, correct or delete what Convalesce holds about you.",
        "Disconnect a tool or a repository at any time; Convalesce stops reading it at once.",
        "Withdraw consent for analytics in the console.",
      ],
      body: [CONTACT],
    },
    {
      heading: "Changes",
      body: [
        "When this policy changes, the date at the top changes with it. A change that matters is announced in the console before it takes effect.",
      ],
    },
  ],
};

export const TERMS: LegalPage = {
  title: "Terms of service",
  updated: "4 October 2026",
  intro:
    "These terms cover your use of Convalesce: the console, the integrations that send it data, and the GitHub App. By signing in you agree to them. If you use Convalesce for a company, you agree on its behalf and confirm you are allowed to.",
  clauses: [
    {
      heading: "What Convalesce does",
      body: [
        "Convalesce watches the data systems you connect, opens an incident when something fails, investigates the cause, and proposes a fix. Where you allow it, it opens issues and draft pull requests in your repositories.",
        "It is in early access. Features change, and some will be wrong before they are right.",
      ],
    },
    {
      heading: "Your account and workspace",
      points: [
        "Signing in creates a workspace that is yours. Keep your sign-in secure; what is done from your account is your responsibility.",
        "Connect only systems and repositories you have the right to connect.",
        "Keys and credentials you give Convalesce are used only to do what you connected them for.",
      ],
    },
    {
      heading: "Fixes are proposals",
      body: [
        "A diagnosis can be wrong, and a right diagnosis can still produce a wrong fix. Every code change Convalesce writes is opened as a draft pull request. It never merges one. Reviewing, approving and merging a change, and what happens when it runs, are yours to decide and yours to answer for.",
      ],
    },
    {
      heading: "What you may not do",
      points: [
        "Use Convalesce to break the law or someone else's rights.",
        "Try to reach another workspace's data, or probe, overload or disrupt the service.",
        "Resell it, or build a competing product from it.",
      ],
    },
    {
      heading: "Your data and ours",
      body: [
        "What you connect stays yours. You give Convalesce permission to process it only to provide the service, as the privacy policy describes. The product itself, its software and its name are ours.",
        "If you send feedback, we may use it to improve the product without owing you anything for it.",
      ],
    },
    {
      heading: "Availability and warranty",
      body: [
        "Convalesce is provided as it is. We work to keep it available and correct, and we do not promise that it will always be either. It is an aid to the people who run your data systems, not a replacement for their judgement or for your own monitoring.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "To the extent the law allows, Convalesce is not liable for indirect or consequential loss, lost profits or lost data arising from your use of the service, and its total liability is limited to what you paid for the service in the twelve months before the claim.",
      ],
    },
    {
      heading: "Ending it",
      body: [
        "Stop using Convalesce whenever you like, and ask for your workspace to be deleted. We may suspend or close a workspace that breaks these terms or puts the service or other customers at risk, and will say why.",
      ],
    },
    {
      heading: "Changes and contact",
      body: [
        "When these terms change, the date at the top changes with them. A change that matters is announced in the console before it takes effect; using Convalesce after that means you accept it.",
        CONTACT,
      ],
    },
  ],
};
