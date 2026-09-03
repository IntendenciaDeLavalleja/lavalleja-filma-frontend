import { useEffect, useState } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import FormSuccessMessage from "./FormSuccessMessage";
import CaptchaSum from "./CaptchaSum";
import {
  PROVIDER_CATEGORIES,
  GASTRONOMY_OPTIONS,
  LEAD_TIMES,
  TAX_REGIMES,
} from "../data/providerCategories";
import {
  submitProviderRegistration,
  getCaptchaChallenge,
  type CaptchaChallenge,
  type ProviderRegistrationData,
} from "../services/surveyFormsService";
import {
  PHONE_PATTERN,
  mapServerFormErrors,
  sanitizePhone,
  validateOptionalHttpUrl,
  validatePhone,
  type FormErrors,
} from "../lib/formValidation";

type FormStatus = "idle" | "submitting" | "success" | "error";

const SUCCESS_MESSAGE =
  "Gracias por registrar tu servicio. La información fue recibida correctamente y será considerada para integrar la futura base de datos de proveedores y servicios de Lavalleja Filma.";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ProviderServiceForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  // Sección 1
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [locality, setLocality] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Sección 2
  const [categories, setCategories] = useState<string[]>([]);
  const [otherCategoryDescription, setOtherCategoryDescription] = useState("");
  const [gastronomyOptions, setGastronomyOptions] = useState<string[]>([]);

  // Sección 3
  const [serviceDescription, setServiceDescription] = useState("");
  const [geographicAvailability, setGeographicAvailability] = useState<
    "todo-departamento" | "localidades-especificas" | ""
  >("");
  const [specificLocalities, setSpecificLocalities] = useState("");
  const [hasRelevantExperience, setHasRelevantExperience] = useState<
    "si" | "no" | ""
  >("");
  const [experienceDetails, setExperienceDetails] = useState("");
  const [leadTime, setLeadTime] = useState("");

  // Sección 4
  const [canIssueInvoice, setCanIssueInvoice] = useState<"si" | "no" | "">("");
  const [taxRegime, setTaxRegime] = useState("");
  const [otherTaxRegime, setOtherTaxRegime] = useState("");

  // Sección 5
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Sección 6
  const [authorizationConsent, setAuthorizationConsent] = useState(false);
  const [dataAccuracyConsent, setDataAccuracyConsent] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const loadCaptcha = async () => {
    try {
      setCaptchaChallenge(await getCaptchaChallenge());
      setCaptchaAnswer("");
      setErrors((current) => ({ ...current, captchaAnswer: undefined }));
    } catch {
      setCaptchaChallenge(null);
      setErrors((current) => ({
        ...current,
        captchaAnswer: "No se pudo cargar la verificación. Intentá nuevamente.",
      }));
    }
  };

  useEffect(() => {
    void loadCaptcha();
  }, []);

  const showOtherCategory = categories.includes("otros");
  const showGastronomyOptions = categories.includes("gastronomia");
  const showSpecificLocalities =
    geographicAvailability === "localidades-especificas";
  const showExperienceDetails = hasRelevantExperience === "si";
  const showTaxRegime = canIssueInvoice === "si";
  const showOtherTaxRegime = showTaxRegime && taxRegime === "otro";

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!businessName.trim()) newErrors.businessName = "Requerido";
    if (!contactName.trim()) newErrors.contactName = "Requerido";
    if (!locality.trim()) newErrors.locality = "Requerido";
    if (!phone.trim()) {
      newErrors.phone = "Requerido";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Ingresá un teléfono válido";
    }
    if (!email.trim()) {
      newErrors.email = "Requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }
    if (!validateOptionalHttpUrl(website)) {
      newErrors.website =
        "Ingresá una URL válida que comience con http:// o https://";
    }

    if (categories.length === 0) {
      newErrors.categories = "Seleccioná al menos una categoría";
    }
    if (showOtherCategory && !otherCategoryDescription.trim()) {
      newErrors.otherCategoryDescription = "Especificá el servicio";
    }

    if (!serviceDescription.trim()) newErrors.serviceDescription = "Requerido";
    if (!geographicAvailability) newErrors.geographicAvailability = "Seleccioná una opción";
    if (showSpecificLocalities && !specificLocalities.trim()) {
      newErrors.specificLocalities = "Indicá las localidades";
    }
    if (!hasRelevantExperience) newErrors.hasRelevantExperience = "Seleccioná una opción";
    if (!leadTime) newErrors.leadTime = "Seleccioná una opción";

    if (!canIssueInvoice) newErrors.canIssueInvoice = "Seleccioná una opción";
    if (showTaxRegime && !taxRegime) newErrors.taxRegime = "Seleccioná un régimen";
    if (showOtherTaxRegime && !otherTaxRegime.trim()) {
      newErrors.otherTaxRegime = "Especificá el régimen";
    }
    if (!validateOptionalHttpUrl(portfolioUrl)) {
      newErrors.portfolioUrl =
        "Ingresá una URL válida que comience con http:// o https://";
    }

    if (!authorizationConsent) {
      newErrors.authorizationConsent = "Debés aceptar la autorización";
    }
    if (!dataAccuracyConsent) {
      newErrors.dataAccuracyConsent = "Debés declarar que la información es correcta";
    }
    if (!captchaChallenge) {
      newErrors.captchaAnswer = "Esperá a que cargue la verificación";
    } else if (!captchaAnswer.trim()) {
      newErrors.captchaAnswer = "Resolvé la suma para continuar";
    } else if (
      Number(captchaAnswer) !==
      captchaChallenge.firstNumber + captchaChallenge.secondNumber
    ) {
      newErrors.captchaAnswer = "La suma no es correcta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus("error");
      // Scroll al primer error
      const firstError = document.querySelector(".lf-input.error, .lf-error-text");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setStatus("submitting");
    const data: ProviderRegistrationData = {
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      locality: locality.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
      categories,
      otherCategoryDescription: showOtherCategory ? otherCategoryDescription.trim() : undefined,
      gastronomyOptions: showGastronomyOptions && gastronomyOptions.length > 0 ? gastronomyOptions : undefined,
      serviceDescription: serviceDescription.trim(),
      geographicAvailability: geographicAvailability as "todo-departamento" | "localidades-especificas",
      specificLocalities: showSpecificLocalities ? specificLocalities.trim() : undefined,
      hasRelevantExperience: hasRelevantExperience as "si" | "no",
      experienceDetails: showExperienceDetails ? experienceDetails.trim() : undefined,
      leadTime,
      canIssueInvoice: canIssueInvoice as "si" | "no",
      taxRegime: showTaxRegime ? taxRegime : undefined,
      otherTaxRegime: showOtherTaxRegime ? otherTaxRegime.trim() : undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      authorizationConsent,
      dataAccuracyConsent,
      captchaToken: captchaChallenge!.token,
      captchaAnswer,
    };

    const response = await submitProviderRegistration(data);
    if (response.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      const merged = mapServerFormErrors(
        response.fieldErrors,
        response.errorMessage,
      );
      if (merged.captchaAnswer) void loadCaptcha();
      setErrors(merged);
      // Scroll al primer error
      setTimeout(() => {
        const firstError = document.querySelector(
          ".lf-input.error, .lf-error-text",
        );
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrors({});
    setBusinessName("");
    setContactName("");
    setLocality("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setCategories([]);
    setOtherCategoryDescription("");
    setGastronomyOptions([]);
    setServiceDescription("");
    setGeographicAvailability("");
    setSpecificLocalities("");
    setHasRelevantExperience("");
    setExperienceDetails("");
    setLeadTime("");
    setCanIssueInvoice("");
    setTaxRegime("");
    setOtherTaxRegime("");
    setPortfolioUrl("");
    setAuthorizationConsent(false);
    setDataAccuracyConsent(false);
    setCaptchaAnswer("");
    void loadCaptcha();
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      if (!next.includes("gastronomia")) {
        setGastronomyOptions([]);
      }
      return next;
    });
  };

  const toggleGastronomyOption = (id: string) => {
    setGastronomyOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  if (status === "success") {
    return <FormSuccessMessage message={SUCCESS_MESSAGE} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errors.submit && <div className="lf-form-error-banner">{errors.submit}</div>}

      {/* Sección 1: Datos generales */}
      <FormSection title="1. Datos generales">
        <FormField label="Nombre del emprendimiento o razón social" required error={errors.businessName}>
          <input
            type="text"
            className={`lf-input ${errors.businessName ? "error" : ""}`}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={status === "submitting"}
            aria-invalid={!!errors.businessName}
          />
        </FormField>

        <FormField label="Nombre del contacto principal" required error={errors.contactName}>
          <input
            type="text"
            className={`lf-input ${errors.contactName ? "error" : ""}`}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            disabled={status === "submitting"}
            aria-invalid={!!errors.contactName}
          />
        </FormField>

        <div className="lf-form-grid lf-form-grid-2">
          <FormField label="Localidad dentro de Lavalleja" required error={errors.locality}>
            <input
              type="text"
              className={`lf-input ${errors.locality ? "error" : ""}`}
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Ej: Minas, Villa Serrana"
              disabled={status === "submitting"}
              aria-invalid={!!errors.locality}
            />
          </FormField>

          <FormField label="Teléfono de contacto" required error={errors.phone}>
            <input
              type="tel"
              className={`lf-input ${errors.phone ? "error" : ""}`}
              value={phone}
              onChange={(e) => setPhone(sanitizePhone(e.target.value))}
              inputMode="numeric"
              pattern={PHONE_PATTERN}
              maxLength={20}
              placeholder="099123456"
              disabled={status === "submitting"}
              aria-invalid={!!errors.phone}
            />
          </FormField>
        </div>

        <FormField label="Correo electrónico" required error={errors.email}>
          <input
            type="email"
            className={`lf-input ${errors.email ? "error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            disabled={status === "submitting"}
            aria-invalid={!!errors.email}
          />
        </FormField>

        <FormField
          label="Sitio web o redes sociales"
          error={errors.website}
          helpText="Instagram, Facebook, LinkedIn, sitio web, catálogo, etc."
        >
          <input
            type="url"
            className={`lf-input ${errors.website ? "error" : ""}`}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
            disabled={status === "submitting"}
            aria-invalid={!!errors.website}
          />
        </FormField>
      </FormSection>

      {/* Sección 2: Categoría */}
      <FormSection title="2. Categoría de servicio">
        <FormField label="Seleccioná una o más categorías" required error={errors.categories}>
          <div className="lf-categories-grid">
            {PROVIDER_CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className={`lf-category-card ${categories.includes(cat.id) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  disabled={status === "submitting"}
                />
                <div className="lf-category-content">
                  <div className="lf-category-name">{cat.name}</div>
                  <div className="lf-category-description">{cat.description}</div>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        {showGastronomyOptions && (
          <div className="lf-suboptions-box">
            <FormField
              label="Opciones y menús especiales de Gastronomía"
              helpText="Indicá si tu servicio ofrece opciones para requerimientos alimentarios o dietas específicas (opcional):"
            >
              <div className="lf-suboptions-grid">
                {GASTRONOMY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`lf-suboption-card ${gastronomyOptions.includes(opt.id) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={gastronomyOptions.includes(opt.id)}
                      onChange={() => toggleGastronomyOption(opt.id)}
                      disabled={status === "submitting"}
                    />
                    <div className="lf-suboption-content">
                      <span className="lf-suboption-name">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {showOtherCategory && (
          <FormField label="Especificá otro servicio" required error={errors.otherCategoryDescription}>
            <input
              type="text"
              className={`lf-input ${errors.otherCategoryDescription ? "error" : ""}`}
              value={otherCategoryDescription}
              onChange={(e) => setOtherCategoryDescription(e.target.value)}
              disabled={status === "submitting"}
            />
          </FormField>
        )}
      </FormSection>

      {/* Sección 3: Capacidad */}
      <FormSection title="3. Capacidad y características del servicio">
        <FormField
          label="Descripción del servicio"
          required
          error={errors.serviceDescription}
          helpText="Describí brevemente los servicios ofrecidos, equipamiento disponible o características destacadas."
        >
          <textarea
            className={`lf-input lf-textarea ${errors.serviceDescription ? "error" : ""}`}
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder="Ejemplo: Contamos con tres camionetas 4x4 con chofer. Servicio disponible en todo el departamento."
            disabled={status === "submitting"}
            rows={5}
            aria-invalid={!!errors.serviceDescription}
          />
        </FormField>

        <FormField label="Disponibilidad geográfica" required error={errors.geographicAvailability}>
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="geographicAvailability"
                value="todo-departamento"
                checked={geographicAvailability === "todo-departamento"}
                onChange={(e) => setGeographicAvailability(e.target.value as "todo-departamento")}
                disabled={status === "submitting"}
              />
              <span>Trabajo en todo el departamento</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="geographicAvailability"
                value="localidades-especificas"
                checked={geographicAvailability === "localidades-especificas"}
                onChange={(e) => setGeographicAvailability(e.target.value as "localidades-especificas")}
                disabled={status === "submitting"}
              />
              <span>Trabajo únicamente en determinadas localidades</span>
            </label>
          </div>
        </FormField>

        {showSpecificLocalities && (
          <FormField label="Indicá las localidades donde trabajás" required error={errors.specificLocalities}>
            <textarea
              className={`lf-input lf-textarea ${errors.specificLocalities ? "error" : ""}`}
              value={specificLocalities}
              onChange={(e) => setSpecificLocalities(e.target.value)}
              disabled={status === "submitting"}
              rows={2}
            />
          </FormField>
        )}

        <FormField
          label="¿Ha brindado servicios para eventos, turismo, producciones audiovisuales u otras actividades similares?"
          required
          error={errors.hasRelevantExperience}
        >
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasRelevantExperience"
                value="si"
                checked={hasRelevantExperience === "si"}
                onChange={(e) => setHasRelevantExperience(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasRelevantExperience"
                value="no"
                checked={hasRelevantExperience === "no"}
                onChange={(e) => setHasRelevantExperience(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showExperienceDetails && (
          <FormField label="Detalle de experiencia" helpText="Opcional. No excluyente.">
            <textarea
              className="lf-input lf-textarea"
              value={experienceDetails}
              onChange={(e) => setExperienceDetails(e.target.value)}
              disabled={status === "submitting"}
              rows={3}
            />
          </FormField>
        )}

        <FormField
          label="¿Con cuánta anticipación necesitás ser contactado para brindar el servicio?"
          required
          error={errors.leadTime}
        >
          <select
            className={`lf-input lf-select ${errors.leadTime ? "error" : ""}`}
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            disabled={status === "submitting"}
            aria-invalid={!!errors.leadTime}
          >
            <option value="">Seleccioná una opción</option>
            {LEAD_TIMES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>

      {/* Sección 4: Facturación */}
      <FormSection title="4. Facturación">
        <FormField label="¿Puede emitir factura?" required error={errors.canIssueInvoice}>
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="canIssueInvoice"
                value="si"
                checked={canIssueInvoice === "si"}
                onChange={(e) => setCanIssueInvoice(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="canIssueInvoice"
                value="no"
                checked={canIssueInvoice === "no"}
                onChange={(e) => setCanIssueInvoice(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showTaxRegime && (
          <FormField label="Régimen correspondiente" required error={errors.taxRegime}>
            <select
              className={`lf-input lf-select ${errors.taxRegime ? "error" : ""}`}
              value={taxRegime}
              onChange={(e) => setTaxRegime(e.target.value)}
              disabled={status === "submitting"}
              aria-invalid={!!errors.taxRegime}
            >
              <option value="">Seleccioná un régimen</option>
              {TAX_REGIMES.map((regime) => (
                <option key={regime.value} value={regime.value}>
                  {regime.label}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {showOtherTaxRegime && (
          <FormField label="Especificá el régimen" required error={errors.otherTaxRegime}>
            <input
              type="text"
              className={`lf-input ${errors.otherTaxRegime ? "error" : ""}`}
              value={otherTaxRegime}
              onChange={(e) => setOtherTaxRegime(e.target.value)}
              disabled={status === "submitting"}
            />
          </FormField>
        )}
      </FormSection>

      {/* Sección 5: Material visual */}
      <FormSection title="5. Material visual (opcional)">
        <FormField
          label="Enlace a sitio web, catálogo digital o portfolio"
          error={errors.portfolioUrl}
        >
          <input
            type="url"
            className={`lf-input ${errors.portfolioUrl ? "error" : ""}`}
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://..."
            disabled={status === "submitting"}
            aria-invalid={!!errors.portfolioUrl}
          />
        </FormField>

      </FormSection>

      {/* Sección 6: Autorización */}
      <FormSection title="6. Autorización">
        <FormField error={errors.authorizationConsent}>
          <label className="lf-checkbox-label">
            <input
              type="checkbox"
              checked={authorizationConsent}
              onChange={(e) => setAuthorizationConsent(e.target.checked)}
              disabled={status === "submitting"}
            />
            <span>
              Autorizo a la Intendencia Departamental de Lavalleja a incorporar
              y difundir la información proporcionada en directorios, materiales
              promocionales y plataformas vinculadas a Lavalleja Filma, con el
              fin de promover la contratación de servicios locales para
              producciones audiovisuales.
            </span>
          </label>
        </FormField>

        <FormField error={errors.dataAccuracyConsent}>
          <label className="lf-checkbox-label">
            <input
              type="checkbox"
              checked={dataAccuracyConsent}
              onChange={(e) => setDataAccuracyConsent(e.target.checked)}
              disabled={status === "submitting"}
            />
            <span>
              Declaro que la información proporcionada es correcta y se
              encuentra actualizada.
            </span>
          </label>
        </FormField>
      </FormSection>

      <CaptchaSum
        firstNumber={captchaChallenge?.firstNumber ?? null}
        secondNumber={captchaChallenge?.secondNumber ?? null}
        onReload={() => void loadCaptcha()}
        value={captchaAnswer}
        onChange={setCaptchaAnswer}
        error={errors.captchaAnswer}
        disabled={status === "submitting"}
      />

      <div className="lf-form-submit">
        <button
          type="submit"
          className="lf-btn lf-btn-primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Enviando…" : "Enviar registro de proveedor"}
        </button>
      </div>
    </form>
  );
}
