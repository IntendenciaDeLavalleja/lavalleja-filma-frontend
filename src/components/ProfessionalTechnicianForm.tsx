import { useEffect, useState } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import FormSuccessMessage from "./FormSuccessMessage";
import CaptchaSum from "./CaptchaSum";
import { TAX_REGIMES } from "../data/providerCategories";
import { PROFESSIONAL_AREAS } from "../data/professionalAreas";
import {
  PHONE_PATTERN,
  mapServerFormErrors,
  sanitizePhone,
  validateOptionalHttpUrl,
  validatePhone,
  type FormErrors,
} from "../lib/formValidation";
import {
  submitProfessionalRegistration,
  getCaptchaChallenge,
  type CaptchaChallenge,
  type ProfessionalRegistrationData,
} from "../services/surveyFormsService";

type FormStatus = "idle" | "submitting" | "success" | "error";

const SUCCESS_MESSAGE =
  "Gracias por registrarte. La información fue recibida correctamente y será considerada para integrar el futuro directorio de profesionales, técnicos y colaboradores audiovisuales de Lavalleja Filma.";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ProfessionalTechnicianForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  // Sección 1
  const [fullName, setFullName] = useState("");
  const [locality, setLocality] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socialMedia, setSocialMedia] = useState("");

  // Sección 2
  const [areas, setAreas] = useState<string[]>([]);
  const [otherAreaDescription, setOtherAreaDescription] = useState("");

  // Sección 3
  const [hasExperience, setHasExperience] = useState<"si" | "no" | "">("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [hasTraining, setHasTraining] = useState<"si" | "no" | "">("");
  const [trainingDescription, setTrainingDescription] = useState("");

  // Sección 4
  const [hasOwnEquipment, setHasOwnEquipment] = useState<"si" | "no" | "">("");
  const [equipmentDetails, setEquipmentDetails] = useState("");
  const [droneCertification, setDroneCertification] = useState<
    "si" | "no" | "no-corresponde" | ""
  >("");

  // Sección 5
  const [availableAnywhere, setAvailableAnywhere] = useState<"si" | "no" | "">("");
  const [specificLocalities, setSpecificLocalities] = useState("");
  const [hasDriverLicense, setHasDriverLicense] = useState<"si" | "no" | "">("");
  const [hasOwnVehicle, setHasOwnVehicle] = useState<"si" | "no" | "">("");

  // Sección 6
  const [canIssueInvoice, setCanIssueInvoice] = useState<"si" | "no" | "">("");
  const [taxRegime, setTaxRegime] = useState("");
  const [otherTaxRegime, setOtherTaxRegime] = useState("");

  // Sección 7
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Sección 8
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

  const showOtherArea = areas.includes("otro");
  const showExperienceDescription = hasExperience === "si";
  const showTrainingDescription = hasTraining === "si";
  const showEquipmentDetails = hasOwnEquipment === "si";
  const showSpecificLocalities = availableAnywhere === "no";
  const showTaxRegime = canIssueInvoice === "si";
  const showOtherTaxRegime = showTaxRegime && taxRegime === "otro";

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Requerido";
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
    if (!validateOptionalHttpUrl(socialMedia)) {
      newErrors.socialMedia =
        "Ingresá una URL válida que comience con http:// o https://";
    }

    if (areas.length === 0) {
      newErrors.areas = "Seleccioná al menos un área";
    }
    if (showOtherArea && !otherAreaDescription.trim()) {
      newErrors.otherAreaDescription = "Especificá el área";
    }

    if (!hasExperience) newErrors.hasExperience = "Seleccioná una opción";
    if (showExperienceDescription && !experienceDescription.trim()) {
      newErrors.experienceDescription = "Requerido";
    }
    if (!hasTraining) newErrors.hasTraining = "Seleccioná una opción";

    if (!hasOwnEquipment) newErrors.hasOwnEquipment = "Seleccioná una opción";
    if (showEquipmentDetails && !equipmentDetails.trim()) {
      newErrors.equipmentDetails = "Requerido";
    }
    if (!droneCertification) newErrors.droneCertification = "Seleccioná una opción";

    if (!availableAnywhere) newErrors.availableAnywhere = "Seleccioná una opción";
    if (showSpecificLocalities && !specificLocalities.trim()) {
      newErrors.specificLocalities = "Requerido";
    }
    if (!hasDriverLicense) newErrors.hasDriverLicense = "Seleccioná una opción";
    if (!hasOwnVehicle) newErrors.hasOwnVehicle = "Seleccioná una opción";

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
      const firstError = document.querySelector(".lf-input.error, .lf-error-text");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setStatus("submitting");
    const data: ProfessionalRegistrationData = {
      fullName: fullName.trim(),
      locality: locality.trim(),
      phone: phone.trim(),
      email: email.trim(),
      socialMedia: socialMedia.trim() || undefined,
      areas,
      otherAreaDescription: showOtherArea ? otherAreaDescription.trim() : undefined,
      hasExperience: hasExperience as "si" | "no",
      experienceDescription: showExperienceDescription ? experienceDescription.trim() : undefined,
      hasTraining: hasTraining as "si" | "no",
      trainingDescription: showTrainingDescription ? trainingDescription.trim() : undefined,
      hasOwnEquipment: hasOwnEquipment as "si" | "no",
      equipmentDetails: showEquipmentDetails ? equipmentDetails.trim() : undefined,
      droneCertification: droneCertification as "si" | "no" | "no-corresponde",
      availableAnywhere: availableAnywhere as "si" | "no",
      specificLocalities: showSpecificLocalities ? specificLocalities.trim() : undefined,
      hasDriverLicense: hasDriverLicense as "si" | "no",
      hasOwnVehicle: hasOwnVehicle as "si" | "no",
      canIssueInvoice: canIssueInvoice as "si" | "no",
      taxRegime: showTaxRegime ? taxRegime : undefined,
      otherTaxRegime: showOtherTaxRegime ? otherTaxRegime.trim() : undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      authorizationConsent,
      dataAccuracyConsent,
      captchaToken: captchaChallenge!.token,
      captchaAnswer,
    };

    const response = await submitProfessionalRegistration(data);
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
    setFullName("");
    setLocality("");
    setPhone("");
    setEmail("");
    setSocialMedia("");
    setAreas([]);
    setOtherAreaDescription("");
    setHasExperience("");
    setExperienceDescription("");
    setHasTraining("");
    setTrainingDescription("");
    setHasOwnEquipment("");
    setEquipmentDetails("");
    setDroneCertification("");
    setAvailableAnywhere("");
    setSpecificLocalities("");
    setHasDriverLicense("");
    setHasOwnVehicle("");
    setCanIssueInvoice("");
    setTaxRegime("");
    setOtherTaxRegime("");
    setPortfolioUrl("");
    setAuthorizationConsent(false);
    setDataAccuracyConsent(false);
    setCaptchaAnswer("");
    void loadCaptcha();
  };

  const toggleArea = (id: string) => {
    setAreas((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  if (status === "success") {
    return <FormSuccessMessage message={SUCCESS_MESSAGE} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errors.submit && <div className="lf-form-error-banner">{errors.submit}</div>}

      {/* Sección 1: Datos generales */}
      <FormSection title="1. Datos generales">
        <FormField label="Nombre y apellido" required error={errors.fullName}>
          <input
            type="text"
            className={`lf-input ${errors.fullName ? "error" : ""}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={status === "submitting"}
          />
        </FormField>

        <div className="lf-form-grid lf-form-grid-2">
          <FormField label="Localidad de residencia" required error={errors.locality}>
            <input
              type="text"
              className={`lf-input ${errors.locality ? "error" : ""}`}
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Ej: Minas"
              disabled={status === "submitting"}
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
          />
        </FormField>

        <FormField
          label="Redes sociales, portfolio o sitio web"
          error={errors.socialMedia}
          helpText="Opcional. Instagram, Vimeo, Behance, LinkedIn, sitio web, etc."
        >
          <input
            type="url"
            className={`lf-input ${errors.socialMedia ? "error" : ""}`}
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
            placeholder="https://..."
            disabled={status === "submitting"}
            aria-invalid={!!errors.socialMedia}
          />
        </FormField>
      </FormSection>

      {/* Sección 2: Área */}
      <FormSection title="2. Área de experiencia">
        <FormField
          label="¿En qué áreas tenés experiencia, formación o conocimientos para colaborar en una producción audiovisual?"
          required
          error={errors.areas}
          helpText="Seleccioná todas las que apliquen."
        >
          <div className="lf-categories-grid">
            {PROFESSIONAL_AREAS.map((area) => (
              <label
                key={area.id}
                className={`lf-category-card ${areas.includes(area.id) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={areas.includes(area.id)}
                  onChange={() => toggleArea(area.id)}
                  disabled={status === "submitting"}
                />
                <div className="lf-category-content">
                  <div className="lf-category-name">{area.name}</div>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        {showOtherArea && (
          <FormField label="Especificá otra área" required error={errors.otherAreaDescription}>
            <input
              type="text"
              className={`lf-input ${errors.otherAreaDescription ? "error" : ""}`}
              value={otherAreaDescription}
              onChange={(e) => setOtherAreaDescription(e.target.value)}
              disabled={status === "submitting"}
            />
          </FormField>
        )}
      </FormSection>

      {/* Sección 3: Experiencia */}
      <FormSection title="3. Experiencia">
        <FormField label="¿Tenés experiencia en proyectos audiovisuales?" required error={errors.hasExperience}>
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasExperience"
                value="si"
                checked={hasExperience === "si"}
                onChange={(e) => setHasExperience(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasExperience"
                value="no"
                checked={hasExperience === "no"}
                onChange={(e) => setHasExperience(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showExperienceDescription && (
          <FormField label="Describí brevemente tu experiencia" required error={errors.experienceDescription}>
            <textarea
              className={`lf-input lf-textarea ${errors.experienceDescription ? "error" : ""}`}
              value={experienceDescription}
              onChange={(e) => setExperienceDescription(e.target.value)}
              disabled={status === "submitting"}
              rows={4}
            />
          </FormField>
        )}

        <FormField
          label="¿Participaste en producciones, cursos, talleres o formaciones relacionadas con el audiovisual?"
          required
          error={errors.hasTraining}
        >
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasTraining"
                value="si"
                checked={hasTraining === "si"}
                onChange={(e) => setHasTraining(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasTraining"
                value="no"
                checked={hasTraining === "no"}
                onChange={(e) => setHasTraining(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showTrainingDescription && (
          <FormField label="Especificá cuáles" helpText="Opcional.">
            <textarea
              className="lf-input lf-textarea"
              value={trainingDescription}
              onChange={(e) => setTrainingDescription(e.target.value)}
              disabled={status === "submitting"}
              rows={3}
            />
          </FormField>
        )}
      </FormSection>

      {/* Sección 4: Equipamiento */}
      <FormSection title="4. Equipamiento">
        <FormField label="¿Contás con equipamiento propio relacionado con tu actividad?" required error={errors.hasOwnEquipment}>
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasOwnEquipment"
                value="si"
                checked={hasOwnEquipment === "si"}
                onChange={(e) => setHasOwnEquipment(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="hasOwnEquipment"
                value="no"
                checked={hasOwnEquipment === "no"}
                onChange={(e) => setHasOwnEquipment(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showEquipmentDetails && (
          <FormField label="Detallá cuál" required error={errors.equipmentDetails}>
            <textarea
              className={`lf-input lf-textarea ${errors.equipmentDetails ? "error" : ""}`}
              value={equipmentDetails}
              onChange={(e) => setEquipmentDetails(e.target.value)}
              disabled={status === "submitting"}
              rows={3}
            />
          </FormField>
        )}

        <FormField
          label="Si realizás operación de drone, ¿contás con habilitación o certificación para operarlo?"
          required
          error={errors.droneCertification}
        >
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="droneCertification"
                value="si"
                checked={droneCertification === "si"}
                onChange={(e) => setDroneCertification(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="droneCertification"
                value="no"
                checked={droneCertification === "no"}
                onChange={(e) => setDroneCertification(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="droneCertification"
                value="no-corresponde"
                checked={droneCertification === "no-corresponde"}
                onChange={(e) => setDroneCertification(e.target.value as "no-corresponde")}
                disabled={status === "submitting"}
              />
              <span>No corresponde</span>
            </label>
          </div>
        </FormField>
      </FormSection>

      {/* Sección 5: Disponibilidad */}
      <FormSection title="5. Disponibilidad">
        <FormField label="¿Estás disponible para trabajar en cualquier localidad de Lavalleja?" required error={errors.availableAnywhere}>
          <div className="lf-radio-group">
            <label className="lf-radio-label">
              <input
                type="radio"
                name="availableAnywhere"
                value="si"
                checked={availableAnywhere === "si"}
                onChange={(e) => setAvailableAnywhere(e.target.value as "si")}
                disabled={status === "submitting"}
              />
              <span>Sí</span>
            </label>
            <label className="lf-radio-label">
              <input
                type="radio"
                name="availableAnywhere"
                value="no"
                checked={availableAnywhere === "no"}
                onChange={(e) => setAvailableAnywhere(e.target.value as "no")}
                disabled={status === "submitting"}
              />
              <span>No</span>
            </label>
          </div>
        </FormField>

        {showSpecificLocalities && (
          <FormField label="¿En qué localidades trabajás habitualmente?" required error={errors.specificLocalities}>
            <textarea
              className={`lf-input lf-textarea ${errors.specificLocalities ? "error" : ""}`}
              value={specificLocalities}
              onChange={(e) => setSpecificLocalities(e.target.value)}
              disabled={status === "submitting"}
              rows={2}
            />
          </FormField>
        )}

        <div className="lf-form-grid lf-form-grid-2">
          <FormField label="¿Contás con libreta de conducir vigente?" required error={errors.hasDriverLicense}>
            <div className="lf-radio-group">
              <label className="lf-radio-label">
                <input
                  type="radio"
                  name="hasDriverLicense"
                  value="si"
                  checked={hasDriverLicense === "si"}
                  onChange={(e) => setHasDriverLicense(e.target.value as "si")}
                  disabled={status === "submitting"}
                />
                <span>Sí</span>
              </label>
              <label className="lf-radio-label">
                <input
                  type="radio"
                  name="hasDriverLicense"
                  value="no"
                  checked={hasDriverLicense === "no"}
                  onChange={(e) => setHasDriverLicense(e.target.value as "no")}
                  disabled={status === "submitting"}
                />
                <span>No</span>
              </label>
            </div>
          </FormField>

          <FormField label="¿Contás con vehículo propio?" required error={errors.hasOwnVehicle}>
            <div className="lf-radio-group">
              <label className="lf-radio-label">
                <input
                  type="radio"
                  name="hasOwnVehicle"
                  value="si"
                  checked={hasOwnVehicle === "si"}
                  onChange={(e) => setHasOwnVehicle(e.target.value as "si")}
                  disabled={status === "submitting"}
                />
                <span>Sí</span>
              </label>
              <label className="lf-radio-label">
                <input
                  type="radio"
                  name="hasOwnVehicle"
                  value="no"
                  checked={hasOwnVehicle === "no"}
                  onChange={(e) => setHasOwnVehicle(e.target.value as "no")}
                  disabled={status === "submitting"}
                />
                <span>No</span>
              </label>
            </div>
          </FormField>
        </div>
      </FormSection>

      {/* Sección 6: Facturación */}
      <FormSection title="6. Facturación">
        <FormField label="¿Podés emitir factura?" required error={errors.canIssueInvoice}>
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

      {/* Sección 7: Material complementario */}
      <FormSection title="7. Material complementario (opcional)">
        <FormField
          label="Enlace a portfolio, reel, perfil profesional o trabajos realizados"
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

        <FormField label="Adjuntar CV, reel, fotografías o material de referencia">
          {/* TODO: Conectar carga real al backend cuando esté disponible */}
          <div className="lf-file-placeholder">
            <p className="lf-file-note">
              La carga de archivos quedará disponible al conectar el sistema definitivo.
            </p>
            <p className="lf-file-subnote">
              Por ahora podés compartir enlaces en el campo superior.
            </p>
          </div>
        </FormField>
      </FormSection>

      {/* Sección 8: Autorización */}
      <FormSection title="8. Autorización">
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
              fin de promover la contratación de profesionales, técnicos y
              colaboradores audiovisuales del departamento.
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
          {status === "submitting" ? "Enviando…" : "Enviar registro profesional"}
        </button>
      </div>
    </form>
  );
}
