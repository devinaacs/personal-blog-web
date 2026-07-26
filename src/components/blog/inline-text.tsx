import { Fragment } from "react";

const INLINE_CODE_PATTERN = /(`[^`]+`)/g;

export function InlineText({ text }: { text: string }) {
  const segments = text.split(INLINE_CODE_PATTERN);

  return (
    <>
      {segments.map((segment, index) =>
        segment.startsWith("`") && segment.endsWith("`") ? (
          <code
            key={index}
            style={{ color: "#ff0000", backgroundColor: "#eeeeee" }}
          >
            {segment.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={index}>{segment}</Fragment>
        ),
      )}
    </>
  );
}
