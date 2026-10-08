import { HERO, SITE } from "@/lib/content";
import { shareCard } from "@/lib/share-card";

export const alt = `${SITE.company}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return shareCard({ head: HERO.head, sub: HERO.sub, headSize: 82 });
}
