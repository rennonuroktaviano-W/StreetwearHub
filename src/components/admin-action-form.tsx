"use client";

import { useActionState } from "react";
import type { AdminActionResult } from "@/app/actions/admin";

type Action = (formData: FormData) => Promise<AdminActionResult>;

export function AdminActionForm({
  action,
  fields,
  submitLabel,
  compact = false,
  onSuccess,
}: {
  action: Action;
  fields: { name: string; label: string; type?: string; value?: string; textarea?: boolean; required?: boolean }[];
  submitLabel: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [state, runAction, pending] = useActionState<AdminActionResult, FormData>(
    async (_prev, formData) => {
      const result = await action(formData);
      if (result.ok) onSuccess?.();
      return result;
    },
    { ok: true },
  );

  return (
    <form action={runAction} className={compact ? "flex flex-wrap items-end gap-3" : "space-y-4"}>
      {!state.ok && state.error ? (
        <p role="alert" className="w-full border border-accent bg-accent/10 p-3 text-sm text-accent">{state.error}</p>
      ) : null}
      {state.ok && !compact ? (
        <p role="status" className="text-xs text-muted">Tersimpan.</p>
      ) : null}
      {fields.map((field) =>
        field.type === "hidden" ? (
          <input key={field.name} type="hidden" name={field.name} value={field.value ?? ""} />
        ) : (
          <div key={field.name} className={compact ? "min-w-40 flex-1" : ""}>
            <label className="label-sh" htmlFor={field.name}>{field.label}</label>
            {field.textarea ? (
              <textarea
                id={field.name}
                name={field.name}
                className="input-sh min-h-20"
                defaultValue={field.value}
                required={field.required}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                className="input-sh"
                defaultValue={field.value}
                required={field.required}
              />
            )}
          </div>
        ),
      )}
      <button type="submit" className={compact ? "btn-outline" : "btn-accent"} disabled={pending}>
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
