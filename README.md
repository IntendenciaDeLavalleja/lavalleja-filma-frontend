# Lavalleja Filma — Survey Forms Frontend

Vite + React + TypeScript landing con dos formularios públicos:

- **Proveedores y Servicios** para empresas, emprendimientos, comercios.
- **Profesionales, Técnicos y Colaboradores Audiovisuales** para personas.

Esta landing se comunica con el backend Flask (`../backend`) a través de
endpoints HTTP JSON.

---

## Setup

```bash
cd survey-forms/frontend
npm install
cp .env.example .env
# Editá .env si tu backend corre en otro host/puerto
```

## Variables de entorno

| Variable             | Default                     | Descripción                                  |
| -------------------- | --------------------------- | -------------------------------------------- |
| `VITE_API_BASE_URL`  | `http://localhost:5000`     | URL base del backend Flask                  |

## Desarrollo

```bash
npm run dev      # http://localhost:5173
```

## Build de producción

```bash
npm run build    # genera dist/
npm run preview
```

## Conectar con el backend

Asegurate de que el backend esté corriendo (`../backend`, ver su README) y
que `VITE_API_BASE_URL` apunte a esa URL. CORS ya está configurado en el
backend para `http://localhost:5173` por defecto.

## Estructura

```
src/
├── main.tsx                          # entrypoint
├── pages/
│   └── LavallejaFilmaSurveyLanding.tsx
├── components/
│   ├── HeroComingSoon.tsx            # hero "Próximamente"
│   ├── ProviderServiceForm.tsx       # formulario de proveedores
│   ├── ProfessionalTechnicianForm.tsx # formulario de profesionales
│   ├── FormField.tsx                 # campo reutilizable
│   ├── FormSection.tsx               # sección del formulario
│   ├── FormSuccessMessage.tsx        # mensaje de éxito
│   └── SurveyNavigationButtons.tsx   # botones del hero
├── data/
│   ├── providerCategories.ts         # categorías, lead times, tax regimes
│   └── professionalAreas.ts          # áreas profesionales
├── services/
│   ├── apiClient.ts                  # cliente HTTP centralizado
│   └── surveyFormsService.ts         # funciones de envío
└── styles/
    └── lavallejaFilmaSurvey.css      # tema oscuro lf-*
```

## Endpoints consumidos

| Método | Path                              | Función                                |
| ------ | --------------------------------- | -------------------------------------- |
| POST   | `/api/forms/providers`            | `submitProviderRegistration()`         |
| POST   | `/api/forms/professionals`        | `submitProfessionalRegistration()`     |

## Manejo de errores

El cliente `apiClient.ts` levanta `ApiClientError` con:

- `status`: código HTTP
- `fieldErrors`: mapa `{ campo: mensaje }` (errores por campo del backend)
- `message`: mensaje general

Los formularios mapean estos errores a cada campo correspondiente y los
muestran junto al label (patrón `lf-error-text`).
