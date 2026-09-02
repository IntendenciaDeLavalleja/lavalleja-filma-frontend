import { useEffect, useState } from "react";
import { getSurveyRoute, type SurveyRoute } from "./lib/spaNavigation";
import LavallejaFilmaSurveyLanding from "./pages/LavallejaFilmaSurveyLanding";
import ProviderServicePage from "./pages/ProviderServicePage";
import ProfessionalTechnicianPage from "./pages/ProfessionalTechnicianPage";

function useSurveyRoute() {
  const [route, setRoute] = useState<SurveyRoute>(() => getSurveyRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setRoute(getSurveyRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return route;
}

export default function SurveyApp() {
  const route = useSurveyRoute();

  if (route === "provider") {
    return <ProviderServicePage />;
  }

  if (route === "professional") {
    return <ProfessionalTechnicianPage />;
  }

  return <LavallejaFilmaSurveyLanding />;
}
