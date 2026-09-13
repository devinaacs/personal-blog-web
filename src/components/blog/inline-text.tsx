import { Fragment, ReactNode } from "react";

export const HIGHLIGHT_COLORS = {
  grey: "#F0F2F2",
  latte: "#D9C4B8",
  cream: "#F2DDD0",
  lemonade: "#F2B2AC",
  flamingo: "#F2A0A0",
} as const;

export type HighlightColor = keyof typeof HIGHLIGHT_COLORS;

type SimpleMarkKind = "bold" | "underline" | "italic";

type Mark =
  | { kind: SimpleMarkKind }
  | { kind: "highlight"; color: HighlightColor };

interface StyledRun {
  type: "text";
  text: string;
  marks: Mark[];
}

interface CodeRun {
  type: "code";
  text: string;
}

type InlineRun = StyledRun | CodeRun;

const CODE_PATTERN = /`([^`\n]+)`/g;

const SIMPLE_MARK_PATTERNS: Record<SimpleMarkKind, RegExp> = {
  bold: /\*\*([^\n]+?)\*\*/,
  underline: /\+\+([^\n]+?)\+\+/,
  italic: /(?<!\w)_([^_\n]+?)_(?!\w)/,
};

const HIGHLIGHT_PATTERN = new RegExp(
  `\\{hl:(${Object.keys(HIGHLIGHT_COLORS).join("|")})\\}([^\\n]+?)\\{/hl\\}`,
);

interface MarkMatch {
  index: number;
  length: number;
  inner: string;
  mark: Mark;
}

function findEarliestMark(text: string, marks: Mark[]): MarkMatch | null {
  let earliest: MarkMatch | null = null;

  for (const kind of Object.keys(SIMPLE_MARK_PATTERNS) as SimpleMarkKind[]) {
    if (marks.some((mark) => mark.kind === kind)) continue;
    const match = SIMPLE_MARK_PATTERNS[kind].exec(text);
    if (match && match.index !== undefined && (!earliest || match.index < earliest.index)) {
      earliest = { index: match.index, length: match[0].length, inner: match[1], mark: { kind } };
    }
  }

  if (!marks.some((mark) => mark.kind === "highlight")) {
    const match = HIGHLIGHT_PATTERN.exec(text);
    if (match && match.index !== undefined && (!earliest || match.index < earliest.index)) {
      earliest = {
        index: match.index,
        length: match[0].length,
        inner: match[2],
        mark: { kind: "highlight", color: match[1] as HighlightColor },
      };
    }
  }

  return earliest;
}

function parseMarks(text: string, marks: Mark[]): StyledRun[] {
  if (!text) return [];

  const found = findEarliestMark(text, marks);
  if (!found) {
    return [{ type: "text", text, marks }];
  }

  const before = text.slice(0, found.index);
  const after = text.slice(found.index + found.length);

  return [
    ...parseMarks(before, marks),
    ...parseMarks(found.inner, [...marks, found.mark]),
    ...parseMarks(after, marks),
  ];
}

function tokenize(text: string): InlineRun[] {
  const runs: InlineRun[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CODE_PATTERN)) {
    const start = match.index ?? 0;

    if (start > lastIndex) {
      runs.push(...parseMarks(text.slice(lastIndex, start), []));
    }
    runs.push({ type: "code", text: match[1] });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(...parseMarks(text.slice(lastIndex), []));
  }

  return runs;
}

function applyMarks(text: string, marks: Mark[]): ReactNode {
  return marks.reduce<ReactNode>((node, mark) => {
    switch (mark.kind) {
      case "bold":
        return <strong>{node}</strong>;
      case "underline":
        return <u>{node}</u>;
      case "italic":
        return <em>{node}</em>;
      case "highlight":
        return (
          <mark style={{ backgroundColor: HIGHLIGHT_COLORS[mark.color], color: "inherit" }}>
            {node}
          </mark>
        );
    }
  }, text);
}

export function InlineText({ text }: { text: string }) {
  const runs = tokenize(text);

  return (
    <>
      {runs.map((run, index) => {
        if (run.type === "code") {
          return (
            <code
              className="rounded-sm px-1.5 py-0.5 font-mono text-[0.9em]"
              key={index}
              style={{
                color: "var(--color-accent-deep)",
                backgroundColor: "var(--color-paper-dim)",
              }}
            >
              {run.text}
            </code>
          );
        }
        return <Fragment key={index}>{applyMarks(run.text, run.marks)}</Fragment>;
      })}
    </>
  );
}
