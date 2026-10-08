import { notFound } from "next/navigation";

import { ClockPost } from "@/components/blog-lab/clock";
import { loadPost, type Loaded } from "@/components/blog-lab/content";
import { EditorialPost } from "@/components/blog-lab/editorial";
import { LineagePost } from "@/components/blog-lab/lineage";
import { ManualPost } from "@/components/blog-lab/manual";
import { ReportPost } from "@/components/blog-lab/report";
import { TrailPost } from "@/components/blog-lab/trail";
import { VARIANTS, variantOf, type VariantSlug } from "@/components/blog-lab/variants";

type Params = { variant: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return VARIANTS.map((v) => ({ variant: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const variant = variantOf((await params).variant);
  return variant ? { title: `${variant.name}, post | Blog design lab` } : {};
}

const POST: Record<VariantSlug, (props: { data: Loaded }) => React.ReactNode> = {
  "incident-report": ReportPost,
  "evidence-trail": TrailPost,
  "running-clock": ClockPost,
  lineage: LineagePost,
  editorial: EditorialPost,
  "field-manual": ManualPost,
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const variant = variantOf((await params).variant);
  if (!variant) notFound();
  const View = POST[variant.slug];
  return <View data={await loadPost()} />;
}
