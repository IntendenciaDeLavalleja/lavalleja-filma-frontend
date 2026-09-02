import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCaptchaChallenge,
  submitProfessionalRegistration,
  submitProviderRegistration,
  type ProfessionalRegistrationData,
  type ProviderRegistrationData,
} from "./surveyFormsService";

const provider: ProviderRegistrationData = {
  businessName: "Transporte Sierra",
  contactName: "Ana Perez",
  locality: "Minas",
  phone: "099123456",
  email: "ana@example.com",
  categories: ["transporte-logistica"],
  serviceDescription: "Transporte para rodajes.",
  geographicAvailability: "todo-departamento",
  hasRelevantExperience: "no",
  leadTime: "24-48h",
  canIssueInvoice: "no",
  authorizationConsent: true,
  dataAccuracyConsent: true,
  captchaToken: "signed-provider-captcha",
  captchaAnswer: "5",
};

const professional: ProfessionalRegistrationData = {
  fullName: "Juan Rodriguez",
  locality: "Minas",
  phone: "098123456",
  email: "juan@example.com",
  areas: ["camara"],
  hasExperience: "no",
  hasTraining: "no",
  hasOwnEquipment: "no",
  droneCertification: "no-corresponde",
  availableAnywhere: "si",
  hasDriverLicense: "si",
  hasOwnVehicle: "no",
  canIssueInvoice: "no",
  authorizationConsent: true,
  dataAccuracyConsent: true,
  captchaToken: "signed-professional-captcha",
  captchaAnswer: "9",
};

describe("survey forms API integration contract", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the server-signed captcha challenge", async () => {
    const challenge = {
      firstNumber: 3,
      secondNumber: 7,
      token: "signed-token",
      expiresIn: 600,
    };
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(challenge)));

    await expect(getCaptchaChallenge()).resolves.toEqual(challenge);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/forms\/captcha$/),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("posts the provider payload and returns its persisted identity", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "ok",
      id: 12,
      code: "LF-PRV-ABC12345",
    }), { status: 201 }));

    await expect(submitProviderRegistration(provider)).resolves.toEqual({
      ok: true,
      data: { id: 12, code: "LF-PRV-ABC12345" },
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/forms\/providers$/),
      expect.objectContaining({ method: "POST", body: JSON.stringify(provider) }),
    );
  });

  it("posts the professional payload to the matching endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "ok",
      id: 15,
      code: "LF-PRO-ABC12345",
    }), { status: 201 }));

    await expect(submitProfessionalRegistration(professional)).resolves.toEqual({
      ok: true,
      data: { id: 15, code: "LF-PRO-ABC12345" },
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/forms\/professionals$/),
      expect.objectContaining({ method: "POST", body: JSON.stringify(professional) }),
    );
  });

  it("surfaces backend field errors", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Hay campos que requieren revision.",
      errors: { leadTime: "Tiempo de respuesta invalido." },
    }), { status: 400 }));

    await expect(submitProviderRegistration(provider)).resolves.toEqual({
      ok: false,
      errorMessage: "Hay campos que requieren revision.",
      fieldErrors: { leadTime: "Tiempo de respuesta invalido." },
    });
  });
});
