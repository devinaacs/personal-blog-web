import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InlineText } from "@/components/blog/inline-text";

describe("InlineText", () => {
  it("renders a single style", () => {
    const { container } = render(<InlineText text="**bold**" />);
    expect(container.querySelector("strong")).toHaveTextContent("bold");
  });

  it("combines bold and italic on the same word", () => {
    const { container } = render(<InlineText text="**_word_**" />);
    const strong = container.querySelector("strong");
    expect(strong).toHaveTextContent("word");
    expect(container.querySelector("em")?.contains(strong)).toBe(true);
  });

  it("combines all three marks", () => {
    const { container } = render(<InlineText text="**_++word++_**" />);
    expect(container.querySelector("u em strong")).toHaveTextContent("word");
  });

  it("does not italicize underscores inside a word", () => {
    const { container } = render(<InlineText text="snake_case_word" />);
    expect(container.querySelector("em")).toBeNull();
    expect(container).toHaveTextContent("snake_case_word");
  });

  it("does not apply marks inside inline code", () => {
    const { container } = render(<InlineText text="`**not bold**`" />);
    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("code")).toHaveTextContent("**not bold**");
  });

  it("renders independent, non-overlapping styled spans", () => {
    const { container } = render(<InlineText text="**bold** and _italic_" />);
    expect(container.querySelector("strong")).toHaveTextContent("bold");
    expect(container.querySelector("em")).toHaveTextContent("italic");
    expect(container.querySelector("strong em, em strong")).toBeNull();
  });

  it("renders a highlight with the given color", () => {
    const { container } = render(<InlineText text="{hl:flamingo}word{/hl}" />);
    const mark = container.querySelector("mark");
    expect(mark).toHaveTextContent("word");
    expect(mark).toHaveStyle({ backgroundColor: "#F2A0A0" });
  });

  it("combines highlight with bold", () => {
    const { container } = render(<InlineText text="**{hl:cream}word{/hl}**" />);
    const strong = container.querySelector("strong");
    const mark = container.querySelector("mark");
    expect(mark).toHaveTextContent("word");
    expect(mark?.contains(strong)).toBe(true);
  });
});
