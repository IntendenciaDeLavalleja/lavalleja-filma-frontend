export interface ProfessionalArea {
  id: string;
  name: string;
}

export const PROFESSIONAL_AREAS: ProfessionalArea[] = [
  { id: "produccion", name: "Producción" },
  { id: "asistencia-produccion", name: "Asistencia de producción" },
  { id: "direccion", name: "Dirección" },
  { id: "camara", name: "Cámara" },
  { id: "fotografia-bts", name: "Fotografía fija, making of, prensa o backstage" },
  { id: "drone", name: "Operación de drone" },
  { id: "dp", name: "Dirección de fotografía" },
  { id: "iluminacion", name: "Iluminación" },
  { id: "sonido-directo", name: "Sonido directo" },
  { id: "asistencia-sonido", name: "Asistencia de sonido" },
  { id: "edicion", name: "Edición y montaje" },
  { id: "color", name: "Corrección de color" },
  { id: "diseno-sonoro", name: "Diseño sonoro y postproducción de audio" },
  { id: "direccion-arte", name: "Dirección de arte" },
  { id: "asistencia-arte", name: "Asistencia de arte" },
  { id: "vestuario", name: "Vestuario" },
  { id: "maquillaje", name: "Maquillaje y peinado" },
  { id: "animacion", name: "Animación y motion graphics" },
  { id: "efectos-visuales-fx", name: "Efectos Visuales FX" },
  { id: "actuacion", name: "Actuación" },
  { id: "locucion", name: "Locución" },
  { id: "extra-figuracion", name: "Participación como extra y figuración" },
  { id: "otro", name: "Otro" },
];
