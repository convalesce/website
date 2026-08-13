import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export type AnalyticsEvent = "request_early_access" | "see_how_it_works";

export function track(
  event: AnalyticsEvent,
  params: Record<string, string> = {},
) {
  if (!GA_ID) return;
  sendGAEvent("event", event, params);
}
