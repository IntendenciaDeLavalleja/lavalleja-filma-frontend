export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface GastronomyOption {
  id: string;
  label: string;
  description?: string;
}

export const GASTRONOMY_OPTIONS: GastronomyOption[] = [
  {
    id: "vegetariana",
    label: "Comida vegetariana",
  },
  {
    id: "vegana",
    label: "Comida vegana",
  },
  {
    id: "sin-tacc",
    label: "Sin TACC / Celíacos (sin gluten)",
  },
  {
    id: "sin-azucar",
    label: "Sin azúcar / Apto para diabéticos",
  },
];

export const PROVIDER_CATEGORIES: Category[] = [
  {
    id: "transporte-logistica",
    name: "Transporte y Logística",
    description:
      "Combis, ómnibus, camionetas, fletes, vehículos 4x4, maquinaria, traslado de personas y equipos.",
  },
  {
    id: "gastronomia",
    name: "Gastronomía",
    description:
      "Catering, viandas, restaurantes, cafeterías y servicios de alimentación.",
  },
  {
    id: "alojamiento",
    name: "Alojamiento",
    description:
      "Hoteles, hostales, cabañas, estancias, casas y apartamentos de alquiler.",
  },
  {
    id: "oficios-mano-obra",
    name: "Oficios y Mano de Obra",
    description:
      "Electricidad, carpintería, herrería, pintura, mantenimiento, jardinería, limpieza y apoyo logístico.",
  },
  {
    id: "comercios-suministros",
    name: "Comercios y Suministros",
    description:
      "Ferreterías, barracas, viveros, imprentas, tiendas de telas, anticuarios, supermercados y otros comercios.",
  },
  {
    id: "salud-seguridad",
    name: "Salud y Seguridad",
    description:
      "Ambulancias, enfermería, emergencias médicas, seguridad privada y prevención.",
  },
  {
    id: "infraestructura-apoyo",
    name: "Infraestructura y Servicios de Apoyo",
    description:
      "Baños químicos, generadores, conectividad e internet, lavanderías, mensajería, alquiler de mobiliario, carpas, mesas, sillas y otros servicios complementarios.",
  },
  {
    id: "espacios-locaciones",
    name: "Espacios y Locaciones Complementarias",
    description:
      "Salones, galpones, predios privados, espacios para base de producción, estacionamiento o almacenamiento.",
  },
  {
    id: "otros",
    name: "Otros",
    description: "Otros servicios no contemplados en las categorías anteriores.",
  },
];

export const LEAD_TIMES = [
  { value: "menos-24h", label: "Menos de 24 horas" },
  { value: "24-48h", label: "Entre 24 y 48 horas" },
  { value: "3-7-dias", label: "Entre 3 y 7 días" },
  { value: "mas-1-semana", label: "Más de una semana" },
  { value: "depende", label: "Depende del servicio" },
];

export const TAX_REGIMES = [
  { value: "literal-e", label: "Literal E" },
  { value: "monotributo", label: "Monotributo" },
  { value: "monotributo-mides", label: "Monotributo Social MIDES" },
  { value: "unipersonal", label: "Unipersonal" },
  { value: "sas", label: "SAS" },
  { value: "srl", label: "SRL" },
  { value: "sa", label: "SA" },
  { value: "otro", label: "Otro" },
];
