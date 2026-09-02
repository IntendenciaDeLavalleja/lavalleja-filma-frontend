import { describe, expect, it } from "vitest";
import {
  mapServerFormErrors,
  sanitizePhone,
  validateOptionalHttpUrl,
  validatePhone,
} from "./formValidation";

describe("form validation", () => {
  it("keeps only digits in phone input", () => {
    expect(sanitizePhone("+598 (99) 123-456 ext. 7")).toBe("598991234567");
  });

  it("accepts phones with at least five digits", () => {
    expect(validatePhone("099123456")).toBe(true);
    expect(validatePhone("1234")).toBe(false);
    expect(validatePhone("099 123 456")).toBe(false);
    expect(validatePhone("1".repeat(21))).toBe(false);
  });

  it("accepts empty or HTTP(S) URLs only", () => {
    expect(validateOptionalHttpUrl(" ")).toBe(true);
    expect(validateOptionalHttpUrl("http://example.com")).toBe(true);
    expect(validateOptionalHttpUrl("https://instagram.com/lavalleja")).toBe(true);
    expect(validateOptionalHttpUrl("instagram.com/lavalleja")).toBe(false);
    expect(validateOptionalHttpUrl("ftp://example.com/file")).toBe(false);
  });

  it("maps URL field errors and always includes a general message", () => {
    expect(
      mapServerFormErrors(
        {
          website: "Sitio inválido",
          social_media: "Red social inválida",
          portfolio_url: "Portfolio inválido",
        },
        "Revisá los datos enviados.",
      ),
    ).toMatchObject({
      website: "Sitio inválido",
      socialMedia: "Red social inválida",
      portfolioUrl: "Portfolio inválido",
      submit: "Revisá los datos enviados.",
    });

    expect(mapServerFormErrors().submit).toContain("No se pudo enviar");
  });
});
