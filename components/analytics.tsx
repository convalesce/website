import Script from "next/script";

import { GA_ID } from "@/lib/analytics";

/**
 * Google Analytics, hand-rolled rather than via @next/third-parties, for one
 * reason: that component hardcodes the gtag script with no strategy, so Next
 * treats it as afterInteractive and emits a `rel="preload"` for it. That pulls
 * a third-party download into first paint to compete with the fonts, for a
 * script that renders nothing.
 *
 * Split instead: the tiny inline init runs early so `dataLayer` exists and
 * events queue from the first interaction, while the network request waits for
 * idle. gtag.js drains the queue when it arrives, so nothing is lost.
 */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script
        id="ga-src"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
    </>
  );
}
