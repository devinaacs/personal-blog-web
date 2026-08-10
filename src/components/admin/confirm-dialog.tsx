"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialogPrimitive.Root
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
      open={open}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <AlertDialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border-2 border-zinc-900 bg-white p-6 shadow-lg outline-none">
          <AlertDialogPrimitive.Title className="text-lg font-bold text-zinc-900">
            {title}
          </AlertDialogPrimitive.Title>
          {description && (
            <AlertDialogPrimitive.Description className="mt-2 font-mono text-sm text-zinc-600">
              {description}
            </AlertDialogPrimitive.Description>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogPrimitive.Cancel asChild>
              <button
                className="border border-zinc-300 px-4 py-2 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                type="button"
              >
                {cancelLabel}
              </button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <button
                className={`px-4 py-2 font-mono text-sm font-bold text-white transition-colors ${
                  destructive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }`}
                onClick={onConfirm}
                type="button"
              >
                {confirmLabel}
              </button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
