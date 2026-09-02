export type FormErrors = Record<string, string | undefined>;

export const PHONE_PATTERN = "[0-9]{5,20}";

export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 20);
}

export function validatePhone(phone: string): boolean {
  return new RegExp(`^${PHONE_PATTERN}$`).test(phone);
}

export function validateOptionalHttpUrl(value: string): boolean {
  const trimmedValue = value.trim();
  if (!trimmedValue) return true;

  try {
    const url = new URL(trimmedValue);
    return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname;
  } catch {
    return false;
  }
}

export function mapServerFormErrors(
  fieldErrors?: Record<string, string>,
  errorMessage?: string,
): FormErrors {
  const errors: FormErrors = {};

  for (const [key, message] of Object.entries(fieldErrors ?? {})) {
    errors[key] = message;
    errors[key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())] =
      message;
  }

  errors.submit =
    errorMessage?.trim() ||
    "No se pudo enviar el formulario. Revisá los campos marcados e intentá nuevamente.";

  return errors;
}
