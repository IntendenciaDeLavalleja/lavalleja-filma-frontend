export type SurveyRoute = "home" | "provider" | "professional";

export function getSurveyRoute(pathname: string): SurveyRoute {
  if (pathname.includes("provider")) {
    return "provider";
  }

  if (pathname.includes("professional")) {
    return "professional";
  }

  return "home";
}
