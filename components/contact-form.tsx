"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (key: string, opts: { action: string }) => Promise<string>;
      };
    };
  }
}

const TOPICS = [
  { value: "product", label: "Product and getting started" },
  { value: "integration", label: "Request an integration" },
  { value: "account", label: "Account help" },
  { value: "privacy", label: "Privacy and personal data" },
] as const;

const field =
  "border-line bg-surface text-ink hover:border-ink/25 w-full rounded-md border px-3.5 py-3 text-base transition-colors";
const label = "text-ink text-small mb-1.5 block font-medium";

function getToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const g = window.grecaptcha?.enterprise;
    if (!g || !SITE_KEY) return reject(new Error("verification unavailable"));
    g.ready(() => g.execute(SITE_KEY, { action: "contact" }).then(resolve, reject));
  });
}

export function ContactForm() {
  const topicRef = useRef<HTMLSelectElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("topic");
    if (topicRef.current && TOPICS.some((t) => t.value === wanted)) topicRef.current.value = wanted!;
    if (!SITE_KEY) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    if (state === "sent") thanksRef.current?.focus();
  }, [state]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!body.ok) throw new Error(body.error ?? "Something went wrong.");
      setState("sent");
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "verification unavailable"
          ? err.message
          : "Something went wrong. Email us directly instead.",
      );
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="border-line rounded-lg border p-6">
        <h2 ref={thanksRef} tabIndex={-1} className="font-display text-h3 outline-none">
          Thanks, we have it.
        </h2>
        <p className="text-muted mt-2">A person will reply to the email you gave. In the meantime, the <Link href="/integrations" className="text-ink underline underline-offset-4">integrations</Link> page shows what Convalesce connects to.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" aria-describedby={error ? "form-error" : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Work email</label>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={label}>Company (optional)</label>
          <input id="company" name="company" maxLength={120} autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="topic" className={label}>Topic</label>
          <select id="topic" name="topic" ref={topicRef} defaultValue="product" className={field}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>Message</label>
        <textarea id="message" name="message" required rows={6} maxLength={4000} className={field} />
      </div>

      {/* a field only a bot fills */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p id="form-error" role="alert" className="text-small text-fail">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary inline-flex min-h-11 items-center rounded-md px-5 py-2.5 text-small font-medium transition-colors disabled:cursor-progress disabled:opacity-60"
      >
        {state === "sending" ? "Sending" : "Send message"}
      </button>
      <p className="text-faint text-small max-w-[60ch]">
        Protected by reCAPTCHA; Google&apos;s{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">privacy policy</a> and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">terms</a> apply. We keep your message to answer it; see our{" "}
        <a href="/privacy" className="underline underline-offset-4">privacy policy</a>.
      </p>
    </form>
  );
}
