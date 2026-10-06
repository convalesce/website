#!/usr/bin/env python3
"""
Turn a legal document's PDF into the data its page is drawn from.

The wording of the terms, the privacy policy and the DPA is settled in the
PDFs, so a page is never retyped: this reads the PDF's own text, with its
fonts and positions, and writes headings, paragraphs and lists exactly as they
stand. Bold and links are kept; page numbers are dropped.

  pdftohtml -xml -i -q "Terms of Use.pdf" /tmp/terms
  python3 scripts/legal-from-pdf.py /tmp/terms.xml lib/legal/terms.json

Needs poppler (`pdftohtml`). Run it again whenever a PDF changes.
"""
import html
import json
import re
import sys
import xml.etree.ElementTree as ET

# The title and the numbered sections share the largest size; the title is
# whatever of that size comes before anything else.
SECTION, PART, CLAUSE = 34, 25, 20
BULLET = "●"
PITCH = 27  # a gap between lines larger than this starts a new block
CELL_GAP = 25  # a gap inside a line wider than this separates two cells of a table
MARGIN = 108  # where a paragraph starts
ROW_GAP = 40  # a gap between a table's lines larger than this starts a new row
FULL = 690  # a line reaching this far right was wrapped, not ended


def runs_of(node):
    """A text node's runs: its words with whether each is bold and where it links."""
    out = []

    def walk(el, bold, href):
        bold = bold or el.tag == "b"
        href = el.get("href") or href
        if el.text:
            out.append({"text": el.text, "bold": bold, "href": href})
        for child in el:
            walk(child, bold, href)
            if child.tail:
                out.append({"text": child.tail, "bold": bold, "href": href})

    walk(node, False, None)
    return out


def lines_of(path):
    tree = ET.parse(path)
    lines = []
    for page in tree.getroot().iter("page"):
        sizes = {f.get("id"): int(f.get("size")) for f in page.iter("fontspec")}
        lines_of.sizes.update(sizes)
        row = {}
        for node in page.findall("text"):
            top, left = int(node.get("top")), int(node.get("left"))
            width = int(node.get("width"))
            runs = runs_of(node)
            text = "".join(r["text"] for r in runs).strip()
            # The page number, alone at the right edge of the foot.
            if left >= 800 and re.fullmatch(r"\d+", text):
                continue
            key = next((k for k in row if abs(k - top) <= 3), top)
            for run in runs:
                run["left"] = left
            row.setdefault(key, []).append((left, width, lines_of.sizes[node.get("font")], runs))
        for top in sorted(row):
            parts = sorted(row[top], key=lambda p: p[0])
            runs = [r for part in parts for r in part[3]]
            if not "".join(r["text"] for r in runs).strip():
                continue
            # Text that runs on is one segment; a gap is the space between two cells.
            segments, edge = 0, None
            for part in parts:
                if "".join(r["text"] for r in part[3]).strip() == "":
                    continue
                if edge is None or part[0] - edge > CELL_GAP:
                    segments += 1
                edge = part[0] + part[1]
            lines.append(
                {
                    "segments": segments,
                    "page": int(page.get("number")),
                    "top": top,
                    "left": parts[0][0],
                    "right": max(p[0] + p[1] for p in parts),
                    "size": max(p[2] for p in parts),
                    "runs": runs,
                }
            )
    return lines


lines_of.sizes = {}


def merged(runs):
    """Runs with their spacing settled and neighbours of one style joined."""
    out = []
    for run in runs:
        text = run["text"].replace(" ", " ")
        if out and out[-1]["bold"] == run["bold"] and out[-1]["href"] == run["href"]:
            out[-1]["text"] += text
        else:
            out.append({"text": text, "bold": run["bold"], "href": run["href"]})
    for run in out:
        run["text"] = re.sub(r"\s+", " ", run["text"])
    out = [r for r in out if r["text"]]
    # One space between two runs, whichever of them carried it.
    for before, after in zip(out, out[1:]):
        if before["text"].endswith(" ") and after["text"].startswith(" "):
            after["text"] = after["text"].lstrip()
    out = [r for r in out if r["text"]]
    if out:
        out[0]["text"] = out[0]["text"].lstrip()
        out[-1]["text"] = out[-1]["text"].rstrip()
    return [
        {k: v for k, v in (("text", r["text"]), ("bold", r["bold"] or None), ("href", r.get("href"))) if v}
        for r in out
        if r["text"]
    ]


def joined(lines):
    """Several lines of one block as one run of text: a space where a line wrapped."""
    runs = []
    for i, line in enumerate(lines):
        for run in line["runs"]:
            runs.append(dict(run))
        if i < len(lines) - 1:
            # A line broken at a hyphen ("PII-" / "redaction") is one word.
            broken = "".join(r["text"] for r in line["runs"]).rstrip().endswith("-")
            if broken:
                runs[-1]["text"] = runs[-1]["text"].rstrip()
            else:
                runs.append({"text": " ", "bold": False, "href": None})
    return merged(runs)


def table_of(lines):
    """
    A table from the lines it covers: its columns from where cells start, its
    rows from the gaps between them, each cell's wrapped lines joined.
    """
    starts = sorted({run["left"] for line in lines for run in line["runs"] if run["text"].strip()})
    columns = []
    for left in starts:
        # Cells of one column start near each other; the next column is far.
        if columns and left - columns[-1][-1] < 80:
            columns[-1].append(left)
        else:
            columns.append([left])
    edges = [group[0] - 5 for group in columns]

    def column(left):
        return max(i for i, edge in enumerate(edges) if left >= edge)

    rows, prev = [], None
    for line in lines:
        if prev is None or line["top"] - prev["top"] > ROW_GAP or line["page"] != prev["page"]:
            rows.append([[] for _ in columns])
        cells = {}
        at = None
        for run in line["runs"]:
            # A run carries on the cell of the run before it unless it starts a new one.
            if run["text"].strip() or at is None:
                at = column(run["left"])
            cells.setdefault(at, []).append(run)
        for index, runs in cells.items():
            rows[-1][index].append({"runs": runs})
        prev = line
    cooked = [[joined(cell) for cell in row] for row in rows]
    return {"type": "table", "head": cooked[0], "rows": cooked[1:]}


def kind_of(line):
    text = "".join(r["text"] for r in line["runs"]).strip()
    if line["size"] >= SECTION:
        return "h2"
    if line["size"] >= PART:
        return "h3"
    if line["size"] >= CLAUSE:
        return "h4"
    if text.startswith(BULLET):
        return "li"
    return "p"


def continues(prev, line):
    """Whether a line carries on the block before it rather than starting one."""
    if prev["page"] == line["page"]:
        return 0 < line["top"] - prev["top"] <= PITCH
    # Over a page break: only a line that was wrapped carries on.
    return prev["right"] >= FULL


def document(path):
    lines = lines_of(path)
    title, blocks, open_block = [], [], None
    prev = None
    table = None
    for line in lines:
        # A table runs from its first line of several cells to the next
        # line that starts at the margin as ordinary text does.
        if table is not None:
            if line["segments"] == 1 and abs(line["left"] - MARGIN) <= 3:
                blocks.append({"kind": "table", "lines": table})
                table = None
            else:
                table.append(line)
                prev = line
                continue
        elif line["segments"] >= 3:
            table, open_block = [line], None
            prev = line
            continue
        kind = kind_of(line)
        if kind == "h2" and not blocks:
            title.append(line)
            prev, open_block = line, None
            continue
        if kind == "li":
            # The bullet itself is drawn by the page.
            first = line["runs"][0]
            first["text"] = first["text"].replace(BULLET, "", 1)
            open_block = {"kind": "li", "lines": [line]}
            blocks.append(open_block)
        elif (
            open_block
            and prev
            and kind == "p"
            and open_block["kind"] in ("p", "li")
            and continues(prev, line)
            # A list item's wrapped lines sit under its words, not at the margin.
            and (open_block["kind"] == "p" or line["left"] > 120)
        ):
            open_block["lines"].append(line)
        elif open_block and prev and kind == open_block["kind"] and kind in ("h2", "h3", "h4") and continues(prev, line):
            open_block["lines"].append(line)
        else:
            open_block = {"kind": kind, "lines": [line]}
            blocks.append(open_block)
        prev = line

    if table:
        blocks.append({"kind": "table", "lines": table})
    out = []
    for block in blocks:
        if block["kind"] == "table":
            out.append(table_of(block["lines"]))
            continue
        runs = joined(block["lines"])
        if not runs:
            continue
        if block["kind"] == "li":
            if out and out[-1]["type"] == "ul":
                out[-1]["items"].append(runs)
            else:
                out.append({"type": "ul", "items": [runs]})
        elif block["kind"] in ("h2", "h3", "h4"):
            out.append({"type": block["kind"], "text": "".join(r["text"] for r in runs)})
        else:
            out.append({"type": "p", "runs": runs})
    return {"title": "".join(r["text"] for r in joined(title)), "blocks": out}


if __name__ == "__main__":
    source, target = sys.argv[1], sys.argv[2]
    doc = document(source)
    with open(target, "w") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
        f.write("\n")
    kinds = {}
    for block in doc["blocks"]:
        kinds[block["type"]] = kinds.get(block["type"], 0) + 1
    print(f"{target}: {doc['title']!r}, {kinds}")
