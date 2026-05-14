import { 
  OrchestratorConfig, 
  AiAsset, 
  SubAgent, 
  RoutingRule, 
  HumanHandoffRule, 
  KnowledgeBase, 
  KnowledgeSource 
} from "../types/aiCenter";

export const initialOrchestratorConfig: OrchestratorConfig = {
  active: true,
  responseLength: "Normal",
  tone: "Cercano",
  language: "Español",
  initiativeLevel: "Balanceado",
  confirmBeforeSendingAssets: true,
  respondOutsideBusinessHours: true,
};

export const initialAiAssets: AiAsset[] = [
  {
    id: "a1",
    name: "Programa_Diplomado_UXUI.pdf",
    type: "pdf",
    description: "Plan de estudios completo del diplomado UX/UI.",
    useWhen: "Cuando el contacto pregunte por el plan de estudios, temario o módulos de UX/UI.",
    tags: ["UX/UI", "Programa", "PDF"],
    status: "available",
    size: "2.4 MB",
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "a2",
    name: "Brochure_Becas_2026.pdf",
    type: "pdf",
    description: "Información sobre becas, descuentos y financiamiento.",
    useWhen: "Cuando pregunten por becas, descuentos, pagos a plazos o ayuda financiera.",
    tags: ["Becas", "Financiamiento", "PDF"],
    status: "available",
    size: "1.1 MB",
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "a3",
    name: "Calendario_Academico.pdf",
    type: "pdf",
    description: "Fechas de inicio, asuetos y exámenes.",
    useWhen: "Si preguntan por fechas de inicio o calendario de clases.",
    tags: ["Calendario", "PDF"],
    status: "available",
    size: "500 KB",
    uploadedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "a4",
    name: "Presentacion_Data_Analytics.pptx",
    type: "presentation",
    description: "Slides introductorios de Data Analytics.",
    useWhen: "Para enviar a leads muy interesados en Data Analytics que duden de los temas.",
    tags: ["Data Analytics", "Slides"],
    status: "available",
    size: "4.5 MB",
    uploadedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "a5",
    name: "Video_Bienvenida.mp4",
    type: "video",
    description: "Video del rector dando la bienvenida.",
    useWhen: "Al enviar el primer mensaje a un lead, o después de que completen su inscripción.",
    tags: ["Video", "Bienvenida"],
    status: "available",
    size: "15 MB",
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "a6",
    name: "Campus_CDMX.jpg",
    type: "image",
    description: "Foto de baja resolución de la fachada del campus.",
    useWhen: "Si el contacto quiere ver cómo son las instalaciones físicas.",
    tags: ["Campus", "Imagen"],
    status: "available",
    size: "800 KB",
    uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  }
];

export const initialSubAgents: SubAgent[] = [
  {
    id: "sa1",
    name: "SDR / Ventas",
    category: "Comercial",
    description: "Califica leads, responde preguntas comerciales y empuja al siguiente paso.",
    skills: ["Calificar leads", "Resolver dudas de precio", "Promover siguiente paso", "Detectar intención alta", "Recomendar contacto humano ante negociación."],
    status: "active",
    knowledgeBaseIds: ["kb1", "kb3"],
    assetIds: ["a1", "a2", "a4"],
    routingDescription: "Entrar cuando el contacto pregunte por precios, inscripción, becas o disponibilidad."
  },
  {
    id: "sa2",
    name: "Soporte",
    category: "Atención",
    description: "Ayuda con problemas, dudas operativas y solicitudes posteriores a la inscripción.",
    skills: ["Resolver dudas frecuentes", "Detectar problemas", "Pedir contexto adicional", "Derivar a humano si hay frustración", "Guiar al usuario paso a paso."],
    status: "active",
    knowledgeBaseIds: ["kb4"],
    assetIds: [],
    routingDescription: "Entrar cuando el contacto reporte un problema o pida ayuda con una cuenta, pago o acceso."
  },
  {
    id: "sa3",
    name: "Onboarding",
    category: "Activación",
    description: "Guía a nuevos usuarios o estudiantes en sus primeros pasos.",
    skills: ["Guiar primeros pasos", "Explicar configuración inicial", "Enviar recursos de bienvenida", "Recordar tareas pendientes."],
    status: "active",
    knowledgeBaseIds: ["kb1", "kb2"],
    assetIds: ["a3", "a5"],
    routingDescription: "Entrar después de que el contacto se inscriba o confirme interés avanzado."
  },
  {
    id: "sa4",
    name: "Document Collector",
    category: "Operaciones",
    description: "Solicita documentos faltantes, valida checklists y explica requisitos.",
    skills: ["Solicitar documentos faltantes", "Validar checklist", "Explicar requisitos", "Recordar pendientes."],
    status: "paused",
    knowledgeBaseIds: ["kb2"],
    assetIds: []
  },
  {
    id: "sa5",
    name: "Billing Assistant",
    category: "Pagos",
    description: "Ayuda con facturación, comprobantes y dudas transaccionales básicas.",
    skills: ["Explicar conceptos de facturación", "Pedir comprobantes", "Resolver dudas básicas", "Transferir a humano en casos sensibles."],
    status: "available",
    knowledgeBaseIds: [],
    assetIds: []
  },
  {
    id: "sa6",
    name: "Retention Agent",
    category: "Retención",
    description: "Detecta riesgo de abandono y propone alternativas antes de cancelar.",
    skills: ["Detectar riesgo de abandono", "Entender motivos de desinterés", "Proponer alternativas", "Escalar a humano en oportunidad crítica."],
    status: "available",
    knowledgeBaseIds: [],
    assetIds: []
  },
  {
    id: "sa7",
    name: "FAQ Agent",
    category: "Conocimiento",
    description: "Responde estrictamente preguntas frecuentes usando solo fuentes.",
    skills: ["Responder preguntas frecuentes", "Usar bases de conocimiento", "Citar fuentes", "Evitar responder sin evidencia."],
    status: "available",
    knowledgeBaseIds: ["kb4"],
    assetIds: []
  },
  {
    id: "sa8",
    name: "Scheduling Agent",
    category: "Agenda",
    description: "Coordina llamadas, propone horarios y confirma asistencia.",
    skills: ["Proponer horarios", "Coordinar llamadas", "Confirmar asistencia", "Enviar recordatorios."],
    status: "paused",
    knowledgeBaseIds: [],
    assetIds: []
  },
  {
    id: "sa9",
    name: "Product Specialist",
    category: "Producto",
    description: "Explica programas en detalle y compara opciones complejas.",
    skills: ["Explicar productos", "Comparar opciones", "Recomendar según necesidad", "Enviar brochures."],
    status: "available",
    knowledgeBaseIds: ["kb1"],
    assetIds: ["a1", "a4"]
  },
  {
    id: "sa10",
    name: "Compliance Guard",
    category: "Control",
    description: "Detecta temas sensibles y bloquea respuestas riesgosas.",
    skills: ["Detectar temas sensibles", "Bloquear respuestas riesgosas", "Recomendar transferencia humana", "Aplicar reglas de seguridad."],
    status: "available",
    knowledgeBaseIds: [],
    assetIds: []
  }
];

export const initialRoutingRules: RoutingRule[] = [
  {
    id: "rr1",
    name: "Preguntas comerciales",
    conditionType: "topic",
    conditionValue: "precios, becas, inscripción, disponibilidad",
    subAgentId: "sa1",
    active: true
  },
  {
    id: "rr2",
    name: "Problemas técnicos",
    conditionType: "keywords",
    conditionValue: "error, acceso, contraseña, plataforma, falla",
    subAgentId: "sa2",
    active: true
  },
  {
    id: "rr3",
    name: "Nuevos inscritos",
    conditionType: "funnel_stage",
    conditionValue: "Inscrito",
    subAgentId: "sa3",
    active: true
  },
  {
    id: "rr4",
    name: "Documentos pendientes",
    conditionType: "funnel_stage",
    conditionValue: "Documentos pendientes",
    subAgentId: "sa4",
    active: false
  }
];

export const initialHumanHandoffRules: HumanHandoffRule[] = [
  {
    id: "hhr1",
    name: "Solicitud explícita de humano",
    description: "Si el contacto pide hablar con una persona de manera directa.",
    priority: "Alta",
    active: true,
    baseRule: true,
    messageBeforeTransfer: "Voy a transferirte con una persona de nuestro equipo para que te ayude."
  },
  {
    id: "hhr2",
    name: "Baja confianza",
    description: "Si la IA no tiene suficiente certeza ni fuentes para responder correctamente.",
    priority: "Media",
    active: true,
    baseRule: true,
    messageBeforeTransfer: "Déjame conectar con alguien del equipo que conoce más detalles al respecto."
  },
  {
    id: "hhr3",
    name: "Tema sensible o crítico",
    description: "Si la conversación incluye quejas graves, temas legales, pagos complejos o datos sensibles.",
    priority: "Alta",
    active: true,
    baseRule: true,
    messageBeforeTransfer: "Este tema requiere la revisión de un especialista, te transferiré con uno."
  },
  {
    id: "hhr4",
    name: "Repetición de error",
    description: "Si el contacto repite la misma pregunta y la IA no logra resolverla tras varios intentos.",
    priority: "Media",
    active: true,
    baseRule: true,
    messageBeforeTransfer: "Parece que no estoy logrando ayudarte. Te paso con un humano enseguida."
  },
  {
    id: "hhr5",
    name: "Cliente molesto",
    description: "Si se detecta frustración, enojo o lenguaje negativo.",
    priority: "Alta",
    active: true,
    baseRule: true,
    messageBeforeTransfer: "Siento los inconvenientes, dejame pasarte con una persona que podrá solucionar esto."
  },
  {
    id: "hhr6",
    name: "Negociación compleja",
    description: "Si el contacto pide excepciones de pago, descuentos no estándar o acuerdos diferentes.",
    priority: "Alta",
    active: true,
    baseRule: false,
    messageBeforeTransfer: "Para revisar temas de negociaciones especiales, te transferiré con un ejecutivo."
  },
  {
    id: "hhr7",
    name: "Fuera del alcance",
    description: "Si el tema no pertenece a las capacidades de los agentes activos.",
    priority: "Baja",
    active: true,
    baseRule: true,
  }
];

export const initialKnowledgeBases: KnowledgeBase[] = [
  {
    id: "kb1",
    name: "Programas académicos",
    description: "Información sobre programas, duración, modalidades, costos y requisitos.",
    status: "ready",
    sourceIds: ["ks1", "ks2"],
    associatedAgentIds: ["sa1", "sa3", "sa9"],
    priority: "Alta",
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "kb2",
    name: "Admisiones y documentos",
    description: "Requisitos de inscripción, documentos, fechas y proceso de admisión.",
    status: "ready",
    sourceIds: ["ks3"],
    associatedAgentIds: ["sa3", "sa4"],
    priority: "Normal",
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "kb3",
    name: "Becas y financiamiento",
    description: "Reglas, porcentajes, condiciones y fechas de becas.",
    status: "needs_review",
    sourceIds: ["ks4", "ks5"],
    associatedAgentIds: ["sa1"],
    priority: "Alta",
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: "kb4",
    name: "Soporte general",
    description: "Preguntas frecuentes sobre acceso, pagos, plataforma y soporte académico.",
    status: "processing",
    sourceIds: ["ks6"],
    associatedAgentIds: ["sa2", "sa7"],
    priority: "Normal",
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const initialKnowledgeSources: KnowledgeSource[] = [
  {
    id: "ks1",
    knowledgeBaseId: "kb1",
    name: "Detalles Diplomado UX/UI.pdf",
    type: "pdf",
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    size: "1.2 MB",
    indexedChunks: 45
  },
  {
    id: "ks2",
    knowledgeBaseId: "kb1",
    name: "Catálogo de programas",
    type: "website",
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    url: "https://ejemplo.com/programas",
    indexedChunks: 120
  },
  {
    id: "ks3",
    knowledgeBaseId: "kb2",
    name: "Proceso de admisión.txt",
    type: "txt",
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    size: "20 KB",
    indexedChunks: 5
  },
  {
    id: "ks4",
    knowledgeBaseId: "kb3",
    name: "Reglas_Becas.pdf",
    type: "pdf",
    status: "needs_review",
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    size: "800 KB",
    indexedChunks: 22
  },
  {
    id: "ks5",
    knowledgeBaseId: "kb3",
    name: "Condiciones de pagos fraccionados",
    type: "plain_text",
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    indexedChunks: 2,
    contentPreview: "Para los pagos fraccionados, el estudiante debe..."
  },
  {
    id: "ks6",
    knowledgeBaseId: "kb4",
    name: "FAQ Soporte",
    type: "website",
    status: "processing",
    uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    url: "https://ejemplo.com/ayuda",
    indexedChunks: 0
  }
];
