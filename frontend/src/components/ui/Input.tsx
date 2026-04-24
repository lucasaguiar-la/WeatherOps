import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hint?: string;
  label: string;
};

export function Input({ hint, id, label, ...props }: InputProps) {
  return (
    <label className="input-group" htmlFor={id}>
      <span className="input-group__label">{label}</span>
      <input className="input" id={id} {...props} />
      {hint ? <span className="input-group__hint">{hint}</span> : null}
    </label>
  );
}
