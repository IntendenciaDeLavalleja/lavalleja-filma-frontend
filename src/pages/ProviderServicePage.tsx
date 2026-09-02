import ProviderServiceForm from "../components/ProviderServiceForm";
import SurveyPageShell from "../components/SurveyPageShell";

export default function ProviderServicePage() {
  return (
    <SurveyPageShell
      title="Registro de proveedores y servicios"
      description="Completá este formulario si ofrecés servicios, productos, infraestructura o apoyo logístico que pueda ser útil para una producción audiovisual en Lavalleja."
      backHref="/"
      backLabel="Volver al inicio"
    >
      <ProviderServiceForm />
    </SurveyPageShell>
  );
}
