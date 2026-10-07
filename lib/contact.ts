import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient, GoogleAuth, type AuthClient } from "google-auth-library";

/* The contact form's server side: bot check, store, notify. Google services
   all the way down, called as one service account (website-contact), reached
   keylessly (see client()). */

export const TOPICS = ["product", "integration", "account", "privacy"] as const;
export type Topic = (typeof TOPICS)[number];

export type Message = {
  name: string;
  email: string;
  company: string;
  topic: Topic;
  message: string;
};

const LIMITS = { name: 120, email: 200, company: 120, message: 4000 } as const;
const MIN_SCORE = 0.5;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export function parseMessage(body: unknown): Message | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const topic = TOPICS.find((t) => t === b.topic);
  const msg = {
    name: clean(b.name, LIMITS.name),
    email: clean(b.email, LIMITS.email),
    company: clean(b.company, LIMITS.company),
    topic,
    message: clean(b.message, LIMITS.message),
  };
  if (!msg.name || !msg.message || !topic) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email)) return null;
  return { ...msg, topic };
}

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
};

const project = () => env("GCP_PROJECT_ID");
const serviceAccount = () => env("GCP_SERVICE_ACCOUNT_EMAIL");

/* No key file: the org forbids them. On Vercel the platform's short-lived
   OIDC token is exchanged for the service account's access token through
   Workload Identity Federation; anywhere else (local dev) the developer's own
   gcloud login stands in. */
let cached: AuthClient | undefined;

async function client(): Promise<AuthClient> {
  if (cached) return cached;
  if (process.env.VERCEL) {
    const number = env("GCP_PROJECT_NUMBER");
    const external = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${number}/locations/global/workloadIdentityPools/vercel/providers/vercel-website`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount()}:generateAccessToken`,
      subject_token_supplier: { getSubjectToken: getVercelOidcToken },
    });
    if (!external) throw new Error("could not build the Vercel credential");
    cached = external;
  } else {
    cached = await new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    }).getClient();
  }
  return cached;
}

/** True when reCAPTCHA Enterprise judges the token a person on this action. */
export async function humanEnough(token: string): Promise<boolean> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set");
  const res = await (await client()).request<{
    tokenProperties?: { valid?: boolean; action?: string };
    riskAnalysis?: { score?: number };
  }>({
    url: `https://recaptchaenterprise.googleapis.com/v1/projects/${project()}/assessments`,
    method: "POST",
    data: { event: { token, siteKey, expectedAction: "contact" } },
  });
  const { tokenProperties, riskAnalysis } = res.data;
  return (
    tokenProperties?.valid === true &&
    tokenProperties.action === "contact" &&
    (riskAnalysis?.score ?? 0) >= MIN_SCORE
  );
}

export async function store(m: Message, meta: { ip: string; userAgent: string }) {
  const str = (stringValue: string) => ({ stringValue });
  await (await client()).request({
    url: `https://firestore.googleapis.com/v1/projects/${project()}/databases/(default)/documents/contact_messages`,
    method: "POST",
    data: {
      fields: {
        name: str(m.name),
        email: str(m.email),
        company: str(m.company),
        topic: str(m.topic),
        message: str(m.message),
        ip: str(meta.ip),
        userAgent: str(meta.userAgent.slice(0, 300)),
        createdAt: { timestampValue: new Date().toISOString() },
      },
    },
  });
}

/* A header value never carries a line break, whatever the visitor typed. */
const header = (v: string) => v.replace(/[\r\n]+/g, " ");

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");

/** Mail the team from the Workspace mailbox the service account is delegated to. */
export async function notify(m: Message) {
  const from = process.env.CONTACT_MAIL_FROM;
  if (!from) throw new Error("CONTACT_MAIL_FROM is not set");
  const to = process.env.CONTACT_MAIL_TO ?? from;
  const now = Math.floor(Date.now() / 1000);
  /* Gmail only sends as a user through domain-wide delegation: the service
     account signs a claim naming that user, and Google trades it for a token. */
  const signed = await (await client()).request<{ signedJwt: string }>({
    url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount()}:signJwt`,
    method: "POST",
    data: {
      payload: JSON.stringify({
        iss: serviceAccount(),
        sub: from,
        scope: "https://www.googleapis.com/auth/gmail.send",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 300,
      }),
    },
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signed.data.signedJwt,
    }),
  });
  if (!tokenRes.ok) throw new Error(`gmail token: ${tokenRes.status} ${await tokenRes.text()}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };
  const text = `${m.message}\n\n--\n${m.name}${m.company ? `, ${m.company}` : ""}\n${m.email}\nTopic: ${m.topic}`;
  const mime = [
    `From: Convalesce website <${from}>`,
    `To: ${to}`,
    `Reply-To: ${header(m.name)} <${header(m.email)}>`,
    `Subject: =?UTF-8?B?${Buffer.from(`[${m.topic}] ${header(m.name)}`).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
  ].join("\r\n");
  const sent = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: b64url(mime) }),
  });
  if (!sent.ok) throw new Error(`gmail send: ${sent.status} ${await sent.text()}`);
}
