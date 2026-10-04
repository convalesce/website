import type { Metadata } from "next";

import { Legal } from "@/components/legal";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that cover your use of Convalesce.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <Legal page={TERMS} index="T" />;
}
