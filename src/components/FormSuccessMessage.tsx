interface FormSuccessMessageProps {
  message: string;
  onReset: () => void;
}

export default function FormSuccessMessage({
  message,
  onReset,
}: FormSuccessMessageProps) {
  return (
    <div className="lf-card rounded-2xl">
      <div className="lf-success">
        <div className="lf-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="lf-success-title">Registro recibido</h3>
        <p className="lf-success-text">{message}</p>
        <button type="button" onClick={onReset} className="lf-btn lf-btn-ghost">
          Registrar otro
        </button>
      </div>
    </div>
  );
}
