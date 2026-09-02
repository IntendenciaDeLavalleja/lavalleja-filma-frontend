import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
  id?: string;
}

export default function FormField({
  label,
  required = false,
  error,
  helpText,
  children,
  id,
}: FormFieldProps) {
  return (
    <div className="lf-form-group">
      {label && (
        <label className="lf-label" htmlFor={id}>
          {label}
          {required && <span className="lf-label-required">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="lf-help-text">{helpText}</p>
      )}
      {error && (
        <p className="lf-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
