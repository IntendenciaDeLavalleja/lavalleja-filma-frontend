import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="lf-form-section">
      <h4 className="lf-form-section-title">{title}</h4>
      <div className="lf-form-section-body">{children}</div>
    </div>
  );
}
