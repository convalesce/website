import Image from "next/image";
import type { IconType } from "react-icons";
import { SiApachekafka, SiGithub } from "react-icons/si";

import { TOOL_LOGOS } from "@/lib/content";

/* Marks that are one flat black: a picture of one cannot turn with the theme,
   so these are drawn in the text colour. */
const FLAT: Record<string, IconType> = { GitHub: SiGithub, Kafka: SiApachekafka };

/** A tool's own mark, or nothing where it has none: the name beside it carries the row. */
export function ToolLogo({ name, className = "" }: { name: string; className?: string }) {
  const Mark = FLAT[name];
  if (Mark) return <Mark aria-hidden="true" className={`text-ink size-5 shrink-0 ${className}`} />;
  const file = TOOL_LOGOS[name];
  if (!file) return null;
  return (
    <Image
      src={`/logos/${file}`}
      alt=""
      width={20}
      height={20}
      unoptimized
      className={`size-5 shrink-0 object-contain ${className}`}
    />
  );
}
