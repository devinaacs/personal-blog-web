import { Fragment, ReactNode } from "react";

type Mark = "bold" | "underline" | "italic";

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

const MARK_PATTERNS: Array<{ mark: Mark; pattern: RegExp }> = [
  { mark: "bold", pattern: /\*\*([^\n]+?)\*\*/ },
  { mark: "underline", pattern: /\+\+([^\n]+?)\+\+/ },
  { mark: "italic", pattern: /(?<!\w)_([^_\n]+?)_(?!\w)/ },
];

function parseMarks(text: string, marks: Mark[]): StyledRun[] {
  if (!text) return [];

  let earliest: { index: number; length: number; inner: string; mark: Mark } | null = null;

  for (const { mark, pattern } of MARK_PATTERNS) {
    if (marks.includes(mark)) continue;
    const match = pattern.exec(text);
    if (match && match.index !== undefined && (!earliest || match.index < earliest.index)) {
      earliest = { index: match.index, length: match[0].length, inner: match[1], mark };
    }
  }

  if (!earliest) {
    return [{ type: "text", text, marks }];
  }

  const before = text.slice(0, earliest.index);
  const after = text.slice(earliest.index + earliest.length);

  return [
    ...parseMarks(before, marks),
    ...parseMarks(earliest.inner, [...marks, earliest.mark]),
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
    switch (mark) {
      case "bold":
        return <strong>{node}</strong>;
      case "underline":
        return <u>{node}</u>;
      case "italic":
        return <em>{node}</em>;
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
              key={index}
              style={{ color: "#ff0000", backgroundColor: "#eeeeee" }}
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
