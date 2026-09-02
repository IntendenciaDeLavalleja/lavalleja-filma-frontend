interface CaptchaSumProps {
  firstNumber: number | null;
  secondNumber: number | null;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onReload: () => void;
}

export default function CaptchaSum({
  firstNumber,
  secondNumber,
  value,
  onChange,
  error,
  disabled = false,
  onReload,
}: CaptchaSumProps) {
  return (
    <div className="lf-form-group lf-captcha-group">
      <label className="lf-label" htmlFor="captcha-answer">
        Verificación de seguridad<span className="lf-label-required">*</span>
      </label>
      <div className="lf-captcha-prompt">
        {firstNumber === null || secondNumber === null ? (
          <>
            <span>Cargando verificación...</span>
            <button type="button" onClick={onReload} disabled={disabled}>
              Reintentar
            </button>
          </>
        ) : (
          <>
            <span>¿Cuánto es</span>
            <strong>{firstNumber}</strong>
            <span>+</span>
            <strong>{secondNumber}</strong>
            <span>?</span>
          </>
        )}
      </div>
      <input
        id="captcha-answer"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        className={`lf-input lf-captcha-input ${error ? "error" : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || firstNumber === null || secondNumber === null}
        aria-invalid={!!error}
        aria-describedby={error ? "captcha-error" : undefined}
      />
      {error && (
        <p id="captcha-error" className="lf-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
