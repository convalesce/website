import { NextResponse } from "next/server";

import { humanEnough, notify, parseMessage, store } from "@/lib/contact";

export const runtime = "nodejs";

/* Best effort on a serverless host: a warm instance remembers, a cold one
   does not. reCAPTCHA is the real gate; this only blunts a burst. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const fail = (error: string, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return fail("Too many messages. Try again later.", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const fields = body as { website?: unknown; token?: unknown };
  /* a field no person sees: anything in it is a bot, which is told it worked */
  if (typeof fields.website === "string" && fields.website) {
    return NextResponse.json({ ok: true });
  }

  const message = parseMessage(body);
  if (!message) return fail("Please fill in every required field.", 400);
  if (typeof fields.token !== "string" || !fields.token) {
    return fail("Verification failed. Reload and try again.", 400);
  }

  try {
    if (!(await humanEnough(fields.token))) {
      return fail("Verification failed. Email us directly instead.", 400);
    }
    await store(message, { ip, userAgent: request.headers.get("user-agent") ?? "" });
  } catch (error) {
    console.error("contact: could not process", error);
    return fail("Something went wrong. Email us directly instead.", 500);
  }

  /* the message is already saved, so a mail failure is ours to chase and the
     visitor still gets their confirmation */
  try {
    await notify(message);
  } catch (error) {
    console.error("contact: saved but not mailed", error);
  }
  return NextResponse.json({ ok: true });
}
