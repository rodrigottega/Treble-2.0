import { FunnelMetric, TemplateMetric, ExportHistoryItem, MetricKpi } from "../types/metrics";

export const generalKpis: MetricKpi[] = [
  {
    title: "Conversaciones nuevas",
    value: "1,284",
    delta: "+12.4%",
    isPositive: true,
    helpText: "Total de conversaciones iniciadas en el periodo."
  },
  {
    title: "Contactos nuevos",
    value: "842",
    delta: "+8.1%",
    isPositive: true,
    helpText: "Contactos únicos que interactuaron por primera vez."
  },
  {
    title: "Tasa de respuesta",
    value: "92.6%",
    delta: "+3.2%",
    isPositive: true,
    helpText: "Porcentaje de conversaciones con al menos una respuesta."
  },
  {
    title: "Tiempo medio primera respuesta",
    value: "4m 28s",
    delta: "-18%",
    isPositive: true,
    helpText: "Tiempo promedio para responder el primer mensaje."
  },
  {
    title: "Conversaciones resueltas",
    value: "738",
    delta: "+9.7%",
    isPositive: true,
    helpText: "Conversaciones marcadas como resueltas en el periodo."
  },
  {
    title: "Conversión a inscrito",
    value: "14.8%",
    delta: "+2.1%",
    isPositive: true,
    helpText: "Porcentaje de nuevos leads que llegaron a Inscrito."
  }
];

export const funnelData: FunnelMetric[] = [
  { stage: "Nuevo lead", count: 842, percent: 100, avgTimeInStage: "12m" },
  { stage: "Contactado", count: 690, percent: 81.9, conversionFromPrevious: 81.9, dropOff: 18.1, avgTimeInStage: "4h" },
  { stage: "Calificado", count: 426, percent: 50.6, conversionFromPrevious: 61.7, dropOff: 38.3, avgTimeInStage: "1d 2h" },
  { stage: "Aplicación iniciada", count: 238, percent: 28.3, conversionFromPrevious: 55.8, dropOff: 44.2, avgTimeInStage: "2d" },
  { stage: "Documentos pendientes", count: 156, percent: 18.5, conversionFromPrevious: 65.5, dropOff: 34.5, avgTimeInStage: "3d 4h" },
  { stage: "Inscripción en proceso", count: 118, percent: 14.0, conversionFromPrevious: 75.6, dropOff: 24.4, avgTimeInStage: "1d" },
  { stage: "Inscrito", count: 92, percent: 10.9, conversionFromPrevious: 77.9, dropOff: 22.1, avgTimeInStage: "-" }
];

export const lateralFunnelData = {
  "No calificado": 184,
  "Perdido": 97
};

export const templatesData: TemplateMetric[] = [
  { name: "seguimiento_admisiones", category: "Marketing", sent: 1240, delivered: 1215, read: 980, replies: 310, responseRate: "25%", quality: "Alta" },
  { name: "beca_disponible", category: "Marketing", sent: 850, delivered: 830, read: 650, replies: 280, responseRate: "32.9%", quality: "Alta" },
  { name: "documentos_pendientes", category: "Utility", sent: 320, delivered: 318, read: 290, replies: 145, responseRate: "45.3%", quality: "Media" },
  { name: "recordatorio_clase_muestra", category: "Utility", sent: 450, delivered: 440, read: 380, replies: 85, responseRate: "18.8%", quality: "Alta" },
  { name: "codigo_verificacion", category: "Authentication", sent: 120, delivered: 118, read: 110, replies: 0, responseRate: "0%", quality: "Alta" },
];

export const exportHistory: ExportHistoryItem[] = [
  { id: "1", reportType: "Funnel de contactos", format: "CSV", createdAt: "Hoy 10:42", status: "Completado" },
  { id: "2", reportType: "Rendimiento por canal", format: "XLSX", createdAt: "Ayer", status: "Completado" },
  { id: "3", reportType: "Templates WhatsApp", format: "CSV", createdAt: "8 mayo", status: "Completado" },
];
