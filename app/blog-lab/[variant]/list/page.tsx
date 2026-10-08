import { notFound } from "next/navigation";

import { ClockList } from "@/components/blog-lab/clock";
import { loadPost, type Loaded } from "@/components/blog-lab/content";
import { EditorialList } from "@/components/blog-lab/editorial";
import { LineageList } from "@/components/blog-lab/lineage";
import { ManualList } from "@/components/blog-lab/manual";
import { ReportList } from "@/components/blog-lab/report";
import { TrailList } from "@/components/blog-lab/trail";
import { VARIANTS, variantOf, type VariantSlug } from "@/components/blog-lab/variants";

type Params = { variant: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return VARIANTS.map((v) => ({ variant: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const variant = variantOf((await params).variant);
  return variant ? { title: `${variant.name}, list | Blog design lab` } : {};
}

const LISTS: Record<VariantSlug, (props: { data: Loaded }) => React.ReactNode> = {
  "incident-report": ReportList,
  "evidence-trail": TrailList,
  "running-clock": ClockList,
  lineage: LineageList,
  editorial: EditorialList,
  "field-manual": ManualList,
  "field-report": (props) => <ManualList {...props} slug="field-report" report />,
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const variant = variantOf((await params).variant);
  if (!variant) notFound();
  const View = LISTS[variant.slug];
  return <View data={await loadPost()} />;
}
