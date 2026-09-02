/**
 * Servicio de envío de formularios de Lavalleja Filma.
 *
 * Reemplaza el mock anterior: ahora hace llamadas HTTP reales al backend
 * Flask mediante el cliente API centralizado (apiClient.ts).
 */

import { apiRequest, ApiClientError } from "./apiClient";

export interface ProviderRegistrationData {
  // Sección 1
  businessName: string;
  contactName: string;
  locality: string;
  phone: string;
  email: string;
  website?: string;
  // Sección 2
  categories: string[];
  otherCategoryDescription?: string;
  gastronomyOptions?: string[];
  // Sección 3
  serviceDescription: string;
  geographicAvailability: "todo-departamento" | "localidades-especificas";
  specificLocalities?: string;
  hasRelevantExperience: "si" | "no";
  experienceDetails?: string;
  leadTime: string;
  // Sección 4
  canIssueInvoice: "si" | "no";
  taxRegime?: string;
  otherTaxRegime?: string;
  // Sección 5
  portfolioUrl?: string;
  // Sección 6
  authorizationConsent: boolean;
  dataAccuracyConsent: boolean;
  captchaToken: string;
  captchaAnswer: string;
}

export interface ProfessionalRegistrationData {
  // Sección 1
  fullName: string;
  locality: string;
  phone: string;
  email: string;
  socialMedia?: string;
  // Sección 2
  areas: string[];
  otherAreaDescription?: string;
  // Sección 3
  hasExperience: "si" | "no";
  experienceDescription?: string;
  hasTraining: "si" | "no";
  trainingDescription?: string;
  // Sección 4
  hasOwnEquipment: "si" | "no";
  equipmentDetails?: string;
  droneCertification: "si" | "no" | "no-corresponde";
  // Sección 5
  availableAnywhere: "si" | "no";
  specificLocalities?: string;
  hasDriverLicense: "si" | "no";
  hasOwnVehicle: "si" | "no";
  // Sección 6
  canIssueInvoice: "si" | "no";
  taxRegime?: string;
  otherTaxRegime?: string;
  // Sección 7
  portfolioUrl?: string;
  // Sección 8
  authorizationConsent: boolean;
  dataAccuracyConsent: boolean;
  captchaToken: string;
  captchaAnswer: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  id?: number;
  code?: string;
  errors?: Record<string, string>;
}

export interface FormSubmitResult {
  ok: boolean;
  data?: { id: number; code: string };
  fieldErrors?: Record<string, string>;
  errorMessage?: string;
}

export interface CaptchaChallenge {
  firstNumber: number;
  secondNumber: number;
  token: string;
  expiresIn: number;
}

export function getCaptchaChallenge(): Promise<CaptchaChallenge> {
  return apiRequest<CaptchaChallenge>("/api/forms/captcha");
}

function mapApiError(err: unknown): FormSubmitResult {
  if (err instanceof ApiClientError) {
    return {
      ok: false,
      fieldErrors: err.fieldErrors,
      errorMessage: err.message,
    };
  }
  return {
    ok: false,
    errorMessage:
      err instanceof Error
        ? err.message
        : "Error desconocido al enviar el formulario.",
  };
}

export async function submitProviderRegistration(
  data: ProviderRegistrationData,
): Promise<FormSubmitResult> {
  try {
    const response = await apiRequest<RegistrationResponse>("/api/forms/providers", {
      method: "POST",
      body: data,
    });
    if (response.success) {
      return { ok: true, data: { id: response.id ?? 0, code: response.code ?? "" } };
    }
    return {
      ok: false,
      fieldErrors: response.errors,
      errorMessage: response.message,
    };
  } catch (err) {
    return mapApiError(err);
  }
}

export async function submitProfessionalRegistration(
  data: ProfessionalRegistrationData,
): Promise<FormSubmitResult> {
  try {
    const response = await apiRequest<RegistrationResponse>(
      "/api/forms/professionals",
      { method: "POST", body: data },
    );
    if (response.success) {
      return { ok: true, data: { id: response.id ?? 0, code: response.code ?? "" } };
    }
    return {
      ok: false,
      fieldErrors: response.errors,
      errorMessage: response.message,
    };
  } catch (err) {
    return mapApiError(err);
  }
}
