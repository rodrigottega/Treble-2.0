import { Template } from "@/types/inbox";

export const dummyTemplates: Template[] = [
  {
    id: "tpl_001",
    name: "recordatorio_clase_muestra",
    category: "Utility",
    language: "es_MX",
    status: "Approved",
    description: "Recuerda al lead su clase muestra agendada.",
    lastUsed: "2023-11-20T10:00:00Z",
    text: "Hola {{nombre}}, te recordamos que tu clase muestra de {{programa}} está programada para {{fecha}}. ¿Confirmas tu asistencia?",
    variables: ["nombre", "programa", "fecha"]
  },
  {
    id: "tpl_002",
    name: "seguimiento_admisiones",
    category: "Utility",
    language: "es_MX",
    status: "Approved",
    description: "Seguimiento general de admisiones.",
    lastUsed: "2023-11-21T14:30:00Z",
    text: "Hola {{nombre}}, seguimos disponibles para ayudarte con tu proceso de inscripción a {{programa}}. ¿Quieres que un asesor te contacte?",
    variables: ["nombre", "programa"]
  },
  {
    id: "tpl_003",
    name: "beca_disponible",
    category: "Marketing",
    language: "es_MX",
    status: "Approved",
    description: "Oferta de beca parcial limitada.",
    lastUsed: "2023-11-22T09:15:00Z",
    text: "Hola {{nombre}}, tenemos una beca parcial disponible para el programa {{programa}} por tiempo limitado. ¿Te gustaría recibir más información?",
    variables: ["nombre", "programa"]
  },
  {
    id: "tpl_004",
    name: "codigo_verificacion",
    category: "Authentication",
    language: "es_MX",
    status: "Approved",
    description: "Envía un código de 6 dígitos.",
    lastUsed: "2023-11-23T11:00:00Z",
    text: "Tu código de verificación para continuar tu proceso de admisión es {{codigo}}.",
    variables: ["codigo"]
  },
  {
    id: "tpl_005",
    name: "documentos_pendientes",
    category: "Utility",
    language: "es_MX",
    status: "Approved",
    description: "Aviso de documentos faltantes.",
    lastUsed: "2023-11-23T16:45:00Z",
    text: "Hola {{nombre}}, aún tienes documentos pendientes para completar tu inscripción a {{programa}}. Puedes responder este mensaje si necesitas ayuda.",
    variables: ["nombre", "programa"]
  }
];
