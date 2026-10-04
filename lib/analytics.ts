export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export type AnalyticsEvent = "open_app" | "see_how_it_works";

declare global {
  interface Window {
    /** defined by the inline init in components/analytics.tsx */
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(
  event: AnalyticsEvent,
  params: Record<string, string> = {},
) {
  if (!GA_ID) return;
  window.gtag?.("event", event, params);
}
