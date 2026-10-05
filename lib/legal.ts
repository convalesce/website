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
    "This page says what Convalesce collects, why, and the choices you have.",
  clauses: [
    {
      heading: "What is collected",
      points: [
        "Account details from the provider you sign in with, such as your name and email address, and what you tell us about your role and organisation.",
        "Information from the systems you choose to connect, which Convalesce needs to detect and investigate failures. This is mostly descriptions of your data, not the data. While investigating a failure, Convalesce may also read a small, capped sample of rows from a connection, unless you switch that off for the connection.",
        "How the service is used, to keep it working and improve it.",
      ],
    },
    {
      heading: "How it is used",
      body: [
        "To provide and secure the service, and to improve it. Your data is not sold, and it is not used to train models.",
      ],
    },
    {
      heading: "Who it is shared with",
      body: [
        "Service providers that host and operate Convalesce on our behalf, under terms that protect your data, and the tools you connect, as far as needed to do what you asked. That includes the provider of the AI model an investigation runs on, which receives what the investigation reads, including any sampled rows. Otherwise only where the law requires it.",
      ],
    },
    {
      heading: "Keeping and deleting it",
      body: [
        "Your data is kept while you use Convalesce. You can ask for your workspace and account to be deleted.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can ask to see, correct or delete what Convalesce holds about you, and disconnect any system at any time.",
        CONTACT,
      ],
    },
    {
      heading: "Changes",
      body: ["When this policy changes, the date at the top changes with it."],
    },
  ],
};

export const TERMS: LegalPage = {
  title: "Terms of service",
  updated: "4 October 2026",
  intro:
    "These terms cover your use of Convalesce. By signing in you agree to them. If you use Convalesce for a company, you agree on its behalf. Convalesce is an early version: please read the next section before relying on it.",
  clauses: [
    {
      heading: "An early version",
      body: [
        "This is the first version of Convalesce, offered free of charge so that people can try it and tell us what is wrong with it. It is not finished.",
      ],
      points: [
        "It can be wrong. A diagnosis may miss the real cause, and a proposed fix may not work or may break something else.",
        "It can change or stop. Features may be altered or removed, and the service may be unavailable, without notice.",
        "It can lose things. Do not treat Convalesce as the only record of an incident, and keep your own monitoring and alerting in place.",
        "Check before you act. Read every proposed change as you would a stranger's, and test it before it reaches anything that matters.",
      ],
    },
    {
      heading: "Using Convalesce",
      points: [
        "Keep your sign-in secure; what is done from your account is your responsibility.",
        "Connect only systems and repositories you have the right to connect.",
        "Do not misuse the service, try to reach data that is not yours, or disrupt it.",
      ],
    },
    {
      heading: "Fixes are proposals",
      body: [
        "Convalesce proposes changes; it does not merge them. Reviewing, approving and applying a change is your decision and your responsibility.",
      ],
    },
    {
      heading: "Your data and ours",
      body: [
        "What you connect stays yours. Convalesce processes it only to provide the service, as the privacy policy describes. The product and its name are ours.",
      ],
    },
    {
      heading: "Warranty and liability",
      body: [
        "Convalesce is provided as it is, without warranty of any kind, and you use it at your own risk. To the extent the law allows, we are not liable for loss arising from your use of it, including loss caused by a wrong diagnosis or a proposed change you applied.",
      ],
    },
    {
      heading: "Ending and changes",
      body: [
        "You can stop using Convalesce at any time. We may suspend a workspace that breaks these terms. When these terms change, the date at the top changes with them.",
        CONTACT,
      ],
    },
  ],
};
