import { Fragment } from "react";

type InlineTokenType = "text" | "code" | "bold" | "underline" | "italic";

interface InlineToken {
  type: InlineTokenType;
  value: string;
}

const CODE_PATTERN = /`([^`\n]+)`/g;
const BOLD_PATTERN = /\*\*([^\n]+?)\*\*/g;
const UNDERLINE_PATTERN = /\+\+([^\n]+?)\+\+/g;
const ITALIC_PATTERN = /(?<!\w)_([^_\n]+?)_(?!\w)/g;

const PASSES: Array<{ pattern: RegExp; type: Exclude<InlineTokenType, "text"> }> = [
  { pattern: CODE_PATTERN, type: "code" },
  { pattern: BOLD_PATTERN, type: "bold" },
  { pattern: UNDERLINE_PATTERN, type: "underline" },
  { pattern: ITALIC_PATTERN, type: "italic" },
];

function expandPass(
  tokens: InlineToken[],
  pattern: RegExp,
  type: Exclude<InlineTokenType, "text">,
): InlineToken[] {
  const output: InlineToken[] = [];

  for (const token of tokens) {
    if (token.type !== "text") {
      output.push(token);
      continue;
    }

    let lastIndex = 0;
    for (const match of token.value.matchAll(pattern)) {
      const start = match.index ?? 0;
      const full = match[0];
      const inner = match[1];

      if (start > lastIndex) {
        output.push({ type: "text", value: token.value.slice(lastIndex, start) });
      }
      output.push({ type, value: inner });
      lastIndex = start + full.length;
    }
    if (lastIndex < token.value.length) {
      output.push({ type: "text", value: token.value.slice(lastIndex) });
    }
  }

  return output;
}

function tokenize(text: string): InlineToken[] {
  let tokens: InlineToken[] = [{ type: "text", value: text }];
  for (const { pattern, type } of PASSES) {
    tokens = expandPass(tokens, pattern, type);
  }
  return tokens;
}

export function InlineText({ text }: { text: string }) {
  const tokens = tokenize(text);

  return (
    <>
      {tokens.map((token, index) => {
        switch (token.type) {
          case "code":
            return (
              <code
                key={index}
                style={{ color: "#ff0000", backgroundColor: "#eeeeee" }}
              >
                {token.value}
              </code>
            );
          case "bold":
            return <strong key={index}>{token.value}</strong>;
          case "underline":
            return <u key={index}>{token.value}</u>;
          case "italic":
            return <em key={index}>{token.value}</em>;
          default:
            return <Fragment key={index}>{token.value}</Fragment>;
        }
      })}
    </>
  );
}
