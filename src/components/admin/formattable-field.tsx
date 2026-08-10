"use client";

import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Bold, Highlighter, Italic, Underline } from "lucide-react";

import { HIGHLIGHT_COLORS, HighlightColor } from "@/components/blog/inline-text";

type MarkerKind = "bold" | "italic" | "underline";

interface MarkerSpec {
  open: string;
  close: string;
}

const MARKERS: Record<MarkerKind, MarkerSpec> = {
  bold: { open: "**", close: "**" },
  underline: { open: "++", close: "++" },
  italic: { open: "_", close: "_" },
};

const TOOLBAR_ITEMS: Array<{ kind: MarkerKind; icon: typeof Bold; label: string }> = [
  { kind: "bold", icon: Bold, label: "Bold" },
  { kind: "italic", icon: Italic, label: "Italic" },
  { kind: "underline", icon: Underline, label: "Underline" },
];

const HIGHLIGHT_COLOR_KEYS = Object.keys(HIGHLIGHT_COLORS) as HighlightColor[];

const HIGHLIGHT_COLOR_LABELS: Record<HighlightColor, string> = {
  grey: "Light grey",
  latte: "Latte",
  cream: "Cream",
  lemonade: "Pink lemonade",
  flamingo: "Flamingo",
};

const HIGHLIGHT_WRAP_PATTERN = new RegExp(
  `^\\{hl:(${HIGHLIGHT_COLOR_KEYS.join("|")})\\}([\\s\\S]*)\\{/hl\\}$`,
);

// Matches an open tag ending exactly at the selection start, so we can
// detect "selection is the inner text of an existing highlight" even
// when the markers themselves aren't part of the selection.
const HIGHLIGHT_OPEN_BEFORE_PATTERN = new RegExp(
  `\\{hl:(${HIGHLIGHT_COLOR_KEYS.join("|")})\\}$`,
);
const HIGHLIGHT_CLOSE = "{/hl}";

interface SelectionRange {
  start: number;
  end: number;
}

interface MarkerEditResult extends SelectionRange {
  value: string;
}

function computeMarkerEdit(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  marker: MarkerSpec,
): MarkerEditResult {
  const { open, close } = marker;
  const selected = value.slice(selectionStart, selectionEnd);

  if (
    selected.length >= open.length + close.length &&
    selected.startsWith(open) &&
    selected.endsWith(close)
  ) {
    const inner = selected.slice(open.length, selected.length - close.length);
    return {
      value: value.slice(0, selectionStart) + inner + value.slice(selectionEnd),
      start: selectionStart,
      end: selectionStart + inner.length,
    };
  }

  const before = value.slice(Math.max(0, selectionStart - open.length), selectionStart);
  const after = value.slice(selectionEnd, selectionEnd + close.length);
  if (selectionStart !== selectionEnd && before === open && after === close) {
    const outerStart = selectionStart - open.length;
    const outerEnd = selectionEnd + close.length;
    return {
      value: value.slice(0, outerStart) + selected + value.slice(outerEnd),
      start: outerStart,
      end: outerStart + selected.length,
    };
  }

  if (selectionStart === selectionEnd) {
    const nextValue = value.slice(0, selectionStart) + open + close + value.slice(selectionStart);
    const cursor = selectionStart + open.length;
    return { value: nextValue, start: cursor, end: cursor };
  }

  const nextValue =
    value.slice(0, selectionStart) + open + selected + close + value.slice(selectionEnd);
  return {
    value: nextValue,
    start: selectionStart + open.length,
    end: selectionStart + open.length + selected.length,
  };
}

function computeHighlightEdit(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  color: HighlightColor,
): MarkerEditResult {
  const selected = value.slice(selectionStart, selectionEnd);
  const wrapped = selected.match(HIGHLIGHT_WRAP_PATTERN);

  // Selection is already an entire highlight span (markers included): same
  // color toggles it off, a different color swaps it instead of nesting.
  if (wrapped) {
    const [, existingColor, inner] = wrapped;
    const next = existingColor === color ? inner : `{hl:${color}}${inner}{/hl}`;
    return {
      value: value.slice(0, selectionStart) + next + value.slice(selectionEnd),
      start: selectionStart,
      end: selectionStart + next.length,
    };
  }

  // Selection is just the inner text, with the highlight's markers sitting
  // immediately outside it (the common case — that's what looks selected
  // when you drag over already-highlighted text). Same treatment: same
  // color unwraps, different color replaces rather than nesting.
  if (selectionStart !== selectionEnd) {
    const openMatch = value.slice(0, selectionStart).match(HIGHLIGHT_OPEN_BEFORE_PATTERN);
    const hasCloseAfter = value.startsWith(HIGHLIGHT_CLOSE, selectionEnd);

    if (openMatch && hasCloseAfter) {
      const existingColor = openMatch[1] as HighlightColor;
      const outerStart = selectionStart - openMatch[0].length;
      const outerEnd = selectionEnd + HIGHLIGHT_CLOSE.length;

      if (existingColor === color) {
        return {
          value: value.slice(0, outerStart) + selected + value.slice(outerEnd),
          start: outerStart,
          end: outerStart + selected.length,
        };
      }

      const next = `{hl:${color}}${selected}{/hl}`;
      return {
        value: value.slice(0, outerStart) + next + value.slice(outerEnd),
        start: outerStart + `{hl:${color}}`.length,
        end: outerStart + `{hl:${color}}`.length + selected.length,
      };
    }
  }

  const open = `{hl:${color}}`;
  const close = "{/hl}";

  if (selectionStart === selectionEnd) {
    const nextValue = value.slice(0, selectionStart) + open + close + value.slice(selectionStart);
    const cursor = selectionStart + open.length;
    return { value: nextValue, start: cursor, end: cursor };
  }

  const nextValue =
    value.slice(0, selectionStart) + open + selected + close + value.slice(selectionEnd);
  return {
    value: nextValue,
    start: selectionStart + open.length,
    end: selectionStart + open.length + selected.length,
  };
}

function applyInlineMarker(
  element: HTMLTextAreaElement | HTMLInputElement,
  markerKind: MarkerKind,
  onChange: (newValue: string) => void,
): SelectionRange {
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;

  const result = computeMarkerEdit(element.value, start, end, MARKERS[markerKind]);
  onChange(result.value);

  return { start: result.start, end: result.end };
}

function applyHighlight(
  element: HTMLTextAreaElement | HTMLInputElement,
  color: HighlightColor,
  onChange: (newValue: string) => void,
): SelectionRange {
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;

  const result = computeHighlightEdit(element.value, start, end, color);
  onChange(result.value);

  return { start: result.start, end: result.end };
}

function useMarkerToolbar<T extends HTMLTextAreaElement | HTMLInputElement>(
  onChange: (value: string) => void,
) {
  const ref = useRef<T>(null);
  const pendingSelection = useRef<SelectionRange | null>(null);

  useLayoutEffect(() => {
    if (pendingSelection.current && ref.current) {
      const { start, end } = pendingSelection.current;
      ref.current.focus();
      ref.current.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  });

  function handleMarker(kind: MarkerKind) {
    if (!ref.current) return;
    pendingSelection.current = applyInlineMarker(ref.current, kind, onChange);
  }

  function handleHighlight(color: HighlightColor) {
    if (!ref.current) return;
    pendingSelection.current = applyHighlight(ref.current, color, onChange);
  }

  return { ref, handleMarker, handleHighlight };
}

function HighlightPicker({ onSelect }: { onSelect: (color: HighlightColor) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="p-1 text-zinc-500 transition-colors hover:text-zinc-900"
        onClick={() => setOpen((value) => !value)}
        onMouseDown={(event) => event.preventDefault()}
        title="Highlight"
        type="button"
      >
        <Highlighter size={14} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 flex items-center gap-1.5 border border-zinc-300 bg-white p-1.5 shadow-sm">
          {HIGHLIGHT_COLOR_KEYS.map((color) => (
            <button
              className="h-5 w-5 shrink-0 rounded-full border border-zinc-300 transition-transform hover:scale-110"
              key={color}
              onClick={() => {
                onSelect(color);
                setOpen(false);
              }}
              onMouseDown={(event) => event.preventDefault()}
              style={{ backgroundColor: HIGHLIGHT_COLORS[color] }}
              title={HIGHLIGHT_COLOR_LABELS[color]}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FormattableField({
  value,
  onChange,
  multiline,
  rows,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const { ref, handleMarker, handleHighlight } = useMarkerToolbar<
    HTMLTextAreaElement | HTMLInputElement
  >(onChange);

  return (
    <div>
      <div className="mb-1 flex items-center gap-1">
        {TOOLBAR_ITEMS.map(({ kind, icon: Icon, label }) => (
          <button
            className="p-1 text-zinc-500 transition-colors hover:text-zinc-900"
            key={kind}
            onClick={() => handleMarker(kind)}
            onMouseDown={(event) => event.preventDefault()}
            title={label}
            type="button"
          >
            <Icon size={14} />
          </button>
        ))}
        <HighlightPicker onSelect={handleHighlight} />
      </div>

      {multiline ? (
        <textarea
          className={className}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          ref={ref as RefObject<HTMLTextAreaElement>}
          rows={rows}
          value={value}
        />
      ) : (
        <input
          className={className}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          ref={ref as RefObject<HTMLInputElement>}
          type="text"
          value={value}
        />
      )}
    </div>
  );
}
