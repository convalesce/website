import dpa from "@/lib/legal/dpa.json";
import privacy from "@/lib/legal/privacy.json";
import terms from "@/lib/legal/terms.json";

/* The wording of each legal document is settled in its PDF and is never
   retyped here. `scripts/legal-from-pdf.py` reads a PDF into the JSON beside
   this file: its headings, paragraphs, lists and tables exactly as they
   stand, with bold and links kept. To change a word, change the PDF and run
   the script again. */

/** A stretch of words that share a style; `href` makes it a link. */
export type Run = { text: string; bold?: boolean; href?: string };

export type Block =
  /** A numbered section: "1. Definitions". */
  | { type: "h2"; text: string }
  /** A part of a section: "2.1 Customer as Controller". */
  | { type: "h3"; text: string }
  /** A defined term or a clause under a part. */
  | { type: "h4"; text: string }
  | { type: "p"; runs: Run[] }
  | { type: "ul"; items: Run[][] }
  | { type: "table"; head: Run[][]; rows: Run[][][] };

export type LegalPage = { title: string; blocks: Block[] };

export const PRIVACY = privacy as LegalPage;
export const TERMS = terms as LegalPage;
export const DPA = dpa as LegalPage;
