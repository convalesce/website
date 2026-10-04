import type { Metadata } from "next";

import { Legal } from "@/components/legal";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Convalesce collects, what it does with it, and what it never does.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <Legal page={PRIVACY} index="P" />;
}
