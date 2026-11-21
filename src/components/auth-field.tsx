"use client";

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: string[];
  minLength?: number;
};

export function TextField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required,
  error,
  minLength,
}: TextFieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="label-sh">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="input-sh"
      />
      {error?.length ? (
        <p id={describedBy} role="alert" className="mt-1 text-xs text-accent">
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}
