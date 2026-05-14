export type MetricsSection = "general" | "channels" | "export";
export type MetricChannel = "all" | "whatsapp" | "instagram";

export type FunnelStage =
  | "Nuevo lead"
  | "Contactado"
  | "Calificado"
  | "Aplicación iniciada"
  | "Documentos pendientes"
  | "Inscripción en proceso"
  | "Inscrito"
  | "No calificado"
  | "Perdido";

export type ExportFormat = "CSV" | "XLSX" | "PDF";

export type ReportType =
  | "Resumen general"
  | "Funnel de contactos"
  | "Rendimiento por canal"
  | "Templates WhatsApp"
  | "Conversaciones";

export interface MetricKpi {
  title: string;
  value: string;
  delta: string;
  isPositive: boolean;
  helpText?: string;
  icon?: string;
}

export interface FunnelMetric {
  stage: FunnelStage;
  count: number;
  percent: number;
  conversionFromPrevious?: number;
  dropOff?: number;
  avgTimeInStage?: string;
}

export interface ChannelMetric {
  channel: string;
  newConversations: number;
  newContacts: number;
  responseRate: string;
  avgFirstResponse: string;
  resolutionRate: string;
  qualifiedConversion: string;
  enrolledConversion: string;
}

export interface TemplateMetric {
  name: string;
  category: string;
  sent: number;
  delivered: number;
  read: number;
  replies: number;
  responseRate: string;
  quality: "Alta" | "Media" | "Baja";
}

export interface ExportHistoryItem {
  id: string;
  reportType: string;
  format: string;
  createdAt: string;
  status: "Completado" | "Fallido" | "En proceso";
}
