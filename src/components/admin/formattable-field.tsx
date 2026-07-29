"use client";

import {
  RefObject,
  useLayoutEffect,
  useRef,
} from "react";
import { Bold, Italic, Underline } from "lucide-react";

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

  return { ref, handleMarker };
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
  const { ref, handleMarker } = useMarkerToolbar<HTMLTextAreaElement | HTMLInputElement>(
    onChange,
  );

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
