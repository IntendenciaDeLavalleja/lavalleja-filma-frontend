import ProfessionalTechnicianForm from "../components/ProfessionalTechnicianForm";
import SurveyPageShell from "../components/SurveyPageShell";

export default function ProfessionalTechnicianPage() {
  return (
    <SurveyPageShell
      title="Registro de profesionales, técnicos y colaboradores"
      description="Completá este formulario si tenés experiencia, formación o interés en colaborar con producciones audiovisuales desde cualquier área técnica, artística o de apoyo."
      backHref="/"
      backLabel="Volver al inicio"
    >
      <ProfessionalTechnicianForm />
    </SurveyPageShell>
  );
}
