import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { FormattableField } from "@/components/admin/formattable-field";

function Wrapper({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  return <FormattableField multiline onChange={setValue} value={value} />;
}

function selectText(textarea: HTMLTextAreaElement, text: string) {
  const start = textarea.value.indexOf(text);
  textarea.focus();
  textarea.setSelectionRange(start, start + text.length);
}

function renderField(initialValue: string) {
  const { container } = render(<Wrapper initialValue={initialValue} />);
  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

  function pickHighlightColor(label: string) {
    fireEvent.click(container.querySelector('button[title="Highlight"]')!);
    fireEvent.click(container.querySelector(`button[title="${label}"]`)!);
  }

  return { textarea, pickHighlightColor };
}

describe("FormattableField highlight picker", () => {
  it("wraps selected text in the chosen highlight color", () => {
    const { textarea, pickHighlightColor } = renderField("people around me.");

    selectText(textarea, "people around me.");
    pickHighlightColor("Cream");

    expect(textarea.value).toBe("{hl:cream}people around me.{/hl}");
  });

  it("swaps the color instead of nesting when re-highlighting already-highlighted text", () => {
    const { textarea, pickHighlightColor } = renderField("people around me.");

    selectText(textarea, "people around me.");
    pickHighlightColor("Cream");

    // Re-select just the visible inner text (not the {hl:...} markers
    // themselves) — this is what a real selection looks like when you
    // drag over already-highlighted text — and pick a different color.
    selectText(textarea, "people around me.");
    pickHighlightColor("Flamingo");

    expect(textarea.value).toBe("{hl:flamingo}people around me.{/hl}");
    expect(textarea.value).not.toContain("{hl:cream}{hl:flamingo}");
  });

  it("unwraps the highlight when the same color is picked again", () => {
    const { textarea, pickHighlightColor } = renderField("people around me.");

    selectText(textarea, "people around me.");
    pickHighlightColor("Cream");

    selectText(textarea, "people around me.");
    pickHighlightColor("Cream");

    expect(textarea.value).toBe("people around me.");
  });
});
