import { Conversation, Message, Channel, HandlerType, ConversationStatus, LeadIntent, SlaStatus } from "@/types/inbox";
import { dummyTags } from "./tags";
import { subDays, subHours, subMinutes, formatISO } from "date-fns";

const now = new Date();

const generateMessages = (count: number, channel: Channel): Message[] => {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    const isUser = i % 2 === 0;
    messages.push({
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: "", // will be set later
      direction: isUser ? "inbound" : "outbound",
      type: "text",
      text: isUser ? "Hola, me interesa saber más sobre los programas." : "¡Hola! Claro, ¿qué programa te interesa?",
      status: isUser ? undefined : "read",
      createdAt: formatISO(subMinutes(now, count * 10 - i * 10)),
    });
  }
  return messages;
};

const createConversation = (
  id: string, contactName: string, channel: Channel, status: ConversationStatus,
  handledBy: HandlerType, leadIntent: LeadIntent, isUnread: boolean,
  whatsappExpired: boolean = false, msgCount = 4
): Conversation => {
  const initials = contactName.split(" ").map(n => n[0]).join("").toUpperCase();
  const lastMsgTime = subMinutes(now, Math.floor(Math.random() * 60));
  
  const messages = generateMessages(msgCount, channel);
  messages.forEach(m => m.conversationId = id);

  if (messages.length > 0) {
    if (isUnread) {
      messages[messages.length - 1].direction = "inbound";
      messages[messages.length - 1].text = "Por favor ayúdame con eso.";
    }
  }

  const tagSelection = [];
  if (leadIntent === "high") tagSelection.push(dummyTags[2]);
  if (isUnread) tagSelection.push(dummyTags[0]);

  let whatsappWindow;
  if (channel === "whatsapp") {
    whatsappWindow = {
      isActive: !whatsappExpired,
      expiresAt: whatsappExpired ? formatISO(subHours(now, 2)) : formatISO(subHours(now, -10)),
      remainingHours: whatsappExpired ? 0 : 10,
      lastCustomerMessageAt: whatsappExpired ? formatISO(subHours(now, 26)) : formatISO(lastMsgTime),
    };
  }

  const activeChannel = channel;
  const channelStatus = { [activeChannel]: whatsappExpired ? "expired" : status } as Record<Channel, ConversationStatus>;

  return {
    id,
    contactName,
    avatarInitials: initials,
    phone: `+52 55 ${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `${contactName.split(" ")[0].toLowerCase()}@example.com`,
    city: ["CDMX", "Bogotá", "Lima", "Buenos Aires"][Math.floor(Math.random() * 4)],
    
    channels: [activeChannel],
    activeChannel,
    channelStatus,
    threadsByChannel: { [activeChannel]: messages } as any,

    channel, // legacy
    status: whatsappExpired ? "expired" : status, // legacy
    isUnread,
    handledBy,
    ownerName: handledBy === "human" ? "Lucía Herrera" : (handledBy === "ai" ? "Agente IA" : null),
    assigneeId: handledBy === "human" ? "usr_1" : null,
    tags: tagSelection,
    lastMessage: messages[messages.length - 1]?.text || "",
    lastMessageAt: messages[messages.length - 1]?.createdAt || formatISO(lastMsgTime),
    leadStage: "Prospecto",
    leadIntent,
    source: channel === "instagram" ? "Story" : "Website",
    properties: {
      programOfInterest: "Diplomado UX/UI",
      modality: "Online",
      leadStage: "Prospecto",
    },
    followUpAt: Math.random() > 0.7 ? formatISO(subHours(now, -4)) : null,
    hasPendingFollowUp: Math.random() > 0.7,
    slaStatus: isUnread ? "needs_response" : "ok",
    whatsappWindow,
    messages, // legacy
    notes: [],
    events: [],
    createdAt: formatISO(subDays(now, 2)),
  };
};

export const dummyConversations: Conversation[] = [
  ...[
    createConversation("conv_1", "Mariana López", "whatsapp", "open", "human", "high", false),
    createConversation("conv_2", "Andrés Castillo", "instagram", "open", "human", "medium", false),
    createConversation("conv_3", "Nicolás Herrera", "whatsapp", "open", "human", "high", false),
    createConversation("conv_4", "Camila Torres", "instagram", "open", "human", "high", false),
    createConversation("conv_5", "Valeria Gómez", "whatsapp", "expired", "unassigned", "low", false, true),
  ].map((c, i) => {
    // Custom modifications based on requirements
    if (i === 0) {
      c.channels = ["whatsapp", "instagram"];
      c.channelStatus = { whatsapp: "open", instagram: "resolved" };
      c.tags = [{ id: "tag_beca", name: "Beca", color: "bg-purple-100 text-purple-800 border-purple-200" }];
      c.properties.programOfInterest = "Diplomado UX/UI";
      c.events = [
        { id: "e1", type: "conversation_ended", description: "Respondió a una story preguntando por modalidad online.", channel: "instagram", status: "resolved", createdAt: formatISO(subDays(now, 1)) },
        { id: "e2", type: "tag_added", description: "Etiqueta 'Beca' agregada.", createdAt: formatISO(subHours(now, 2)) }
      ];
      const igMessages = generateMessages(2, "instagram");
      igMessages[0].text = "Hola, vi sus stories, ¿tienen becas?";
      igMessages[1].text = "Sí, manejamos becas. Escríbenos por WhatsApp.";
      c.threadsByChannel.instagram = igMessages;
      c.lastMessage = "Me gustaría aplicar para la beca.";
      c.threadsByChannel.whatsapp[c.threadsByChannel.whatsapp.length - 1].text = c.lastMessage;
      
      c.historicalConversations = [
        {
          id: "hist_1_1",
          channel: "instagram",
          status: "closed",
          summary: "Respondió a una story preguntando por modalidad online.",
          startedAt: formatISO(subDays(now, 6)),
          endedAt: formatISO(subDays(now, 5)),
          messages: [
            { id: "m1", conversationId: "hist_1_1", direction: "inbound", type: "text", text: "Hola, ¿hay opciones online?", createdAt: formatISO(subDays(now, 6)) },
            { id: "m2", conversationId: "hist_1_1", direction: "outbound", type: "text", text: "¡Hola! Sí, casi todos nuestros programas tienen modalidad online. ¿Te interesa alguno en particular?", status: "read", createdAt: formatISO(subDays(now, 5)) }
          ]
        },
        {
          id: "hist_1_2",
          channel: "whatsapp",
          status: "resolved",
          summary: "Consultó sobre inicio de clases.",
          startedAt: formatISO(subDays(now, 12)),
          endedAt: formatISO(subDays(now, 10)),
          messages: [
            { id: "m3", conversationId: "hist_1_2", direction: "inbound", type: "text", text: "¿Cuándo empiezan las clases del diplomado?", createdAt: formatISO(subDays(now, 12)) },
            { id: "m4", conversationId: "hist_1_2", direction: "outbound", type: "text", text: "Inician el 15 del próximo mes. ¿Te mandamos la info de inscripción?", status: "read", createdAt: formatISO(subDays(now, 11)) },
            { id: "m5", conversationId: "hist_1_2", direction: "inbound", type: "text", text: "Sí por favor.", createdAt: formatISO(subDays(now, 10)) },
            { id: "m6", conversationId: "hist_1_2", direction: "outbound", type: "text", text: "Claro, aquí tienes el PDF.", status: "read", createdAt: formatISO(subDays(now, 10)) }
          ]
        }
      ];
    } else if (i === 1) {
      c.tags = [];
      c.events = [
        { id: "e1", type: "conversation_ended", description: "Consulta previa sobre diplomados", channel: "whatsapp", status: "closed", createdAt: formatISO(subDays(now, 5)) }
      ];
      c.historicalConversations = [
        {
          id: "hist_2_1",
          channel: "whatsapp",
          status: "closed",
          summary: "Consulta previa sobre diplomados",
          startedAt: formatISO(subDays(now, 6)),
          endedAt: formatISO(subDays(now, 5)),
          messages: [
            { id: "m1", conversationId: "hist_2_1", direction: "inbound", type: "text", text: "Buenas tardes, quisiera información de diplomados en marketing", createdAt: formatISO(subDays(now, 6)) },
            { id: "m2", conversationId: "hist_2_1", direction: "outbound", type: "text", text: "Buenas tardes Andrés, te compartimos el catálogo. Cualquier duda avísanos.", status: "read", createdAt: formatISO(subDays(now, 5)) }
          ]
        }
      ];
    } else if (i === 2) {
      c.tags = [{ id: "tag_ux", name: "Diplomado UX/UI", color: "bg-blue-100 text-blue-800 border-blue-200" }];
      c.events = [
        { id: "e1", type: "template_sent", description: "Se envió plantilla 'Seguimiento UX/UI'.", channel: "whatsapp", createdAt: formatISO(subHours(now, 10)) }
      ];
      c.historicalConversations = [
        {
          id: "hist_3_1",
          channel: "whatsapp",
          status: "resolved",
          summary: "Resolución de dudas sobre el temario.",
          startedAt: formatISO(subDays(now, 2)),
          endedAt: formatISO(subDays(now, 1)),
          messages: [
            { id: "m1", conversationId: "hist_3_1", direction: "inbound", type: "text", text: "Tengo un par de dudas sobre el módulo 3...", createdAt: formatISO(subDays(now, 2)) },
            { id: "m2", conversationId: "hist_3_1", direction: "outbound", type: "text", text: "En ese módulo vemos Figma a profundidad.", status: "read", createdAt: formatISO(subDays(now, 1)) },
            { id: "m3", conversationId: "hist_3_1", direction: "inbound", type: "text", text: "Perfecto", createdAt: formatISO(subDays(now, 1)) }
          ]
        },
        {
          id: "hist_3_2",
          channel: "whatsapp",
          status: "expired",
          summary: "Se envió plantilla de contacto inicial.",
          startedAt: formatISO(subDays(now, 5)),
          endedAt: formatISO(subDays(now, 4)),
          messages: [
            { id: "m1", conversationId: "hist_3_2", direction: "outbound", type: "template", text: "Hola Nicolás, vimos tu interés en UX/UI. ¿Podemos ayudarte?", status: "read", createdAt: formatISO(subDays(now, 5)) }
          ]
        }
      ];
    } else if (i === 3) {
      c.channels = ["instagram", "whatsapp"];
      c.channelStatus = { instagram: "open", whatsapp: "open" };
      c.tags = [{ id: "tag_intent", name: "Alta intención", color: "bg-green-100 text-green-800 border-green-200" }];
      c.threadsByChannel.whatsapp = generateMessages(3, "whatsapp");
      c.events = [
        { id: "e1", type: "conversation_started", description: "Inició conversación preguntando por costos", channel: "instagram", status: "open", createdAt: formatISO(subMinutes(now, 30)) }
      ];
      c.historicalConversations = [
        {
          id: "hist_4_1",
          channel: "instagram",
          status: "closed",
          summary: "Interacción por contenido de Instagram.",
          startedAt: formatISO(subDays(now, 8)),
          endedAt: formatISO(subDays(now, 7)),
          messages: [
            { id: "m1", conversationId: "hist_4_1", direction: "inbound", type: "text", text: "Me encantó el último post.", createdAt: formatISO(subDays(now, 8)) },
            { id: "m2", conversationId: "hist_4_1", direction: "outbound", type: "text", text: "¡Qué bueno Camila! Atenta a más novedades.", status: "read", createdAt: formatISO(subDays(now, 7)) }
          ]
        },
        {
          id: "hist_4_2",
          channel: "whatsapp",
          status: "resolved",
          summary: "Dudas sobre proceso de admisión.",
          startedAt: formatISO(subDays(now, 14)),
          endedAt: formatISO(subDays(now, 13)),
          messages: [
            { id: "m1", conversationId: "hist_4_2", direction: "inbound", type: "text", text: "¿Qué documentos necesito para inscribirme?", createdAt: formatISO(subDays(now, 14)) },
            { id: "m2", conversationId: "hist_4_2", direction: "outbound", type: "text", text: "Solo necesitas tu identificación y comprobante de domicilio.", status: "read", createdAt: formatISO(subDays(now, 13)) },
            { id: "m3", conversationId: "hist_4_2", direction: "inbound", type: "text", text: "Gracias, los enviaré pronto.", createdAt: formatISO(subDays(now, 13)) }
          ]
        }
      ];
    } else if (i === 4) {
      c.historicalConversations = [
        {
          id: "hist_5_1",
          channel: "whatsapp",
          status: "resolved",
          summary: "Solicitó información de precios mensuales.",
          startedAt: formatISO(subDays(now, 20)),
          endedAt: formatISO(subDays(now, 19)),
          messages: [
            { id: "m1", conversationId: "hist_5_1", direction: "inbound", type: "text", text: "¿Cuáles son las opciones de pago a meses?", createdAt: formatISO(subDays(now, 20)) },
            { id: "m2", conversationId: "hist_5_1", direction: "outbound", type: "text", text: "Tenemos 3, 6 y 12 meses sin intereses con tarjetas participantes.", status: "read", createdAt: formatISO(subDays(now, 19)) },
            { id: "m3", conversationId: "hist_5_1", direction: "inbound", type: "text", text: "Súper, lo voy a revisar con mi tarjeta.", createdAt: formatISO(subDays(now, 19)) }
          ]
        }
      ];
    }
    return c;
  }),
  createConversation("conv_6", "Diego Ramírez", "whatsapp", "resolved", "human", "low", false),
  createConversation("conv_7", "Sofía Martínez", "instagram", "closed", "human", "low", false),
  createConversation("conv_8", "Laura Méndez", "whatsapp", "open", "ai", "medium", false),
  createConversation("conv_9", "Mateo Rojas", "whatsapp", "open", "unassigned", "high", true),
  createConversation("conv_10", "Daniela Fuentes", "whatsapp", "open", "ai", "medium", false, true), // expired
  createConversation("conv_11", "Fernanda Pardo", "instagram", "open", "human", "high", true),
  createConversation("conv_12", "Juan Pablo Ruiz", "whatsapp", "open", "human", "medium", false),
  createConversation("conv_13", "Gabriela Silva", "instagram", "resolved", "ai", "low", false),
  createConversation("conv_14", "Tomás Vargas", "whatsapp", "open", "human", "high", false),
  createConversation("conv_15", "Andrea Molina", "whatsapp", "open", "unassigned", "medium", true),
  createConversation("conv_16", "Santiago Ríos", "instagram", "open", "human", "low", false),
  createConversation("conv_17", "Paulina Vera", "whatsapp", "open", "ai", "medium", false),
  createConversation("conv_18", "Isabel Cárdenas", "whatsapp", "open", "human", "high", false, true), // expired
  createConversation("conv_19", "Martín Salazar", "instagram", "open", "ai", "high", true),
  createConversation("conv_20", "Renata Aguilar", "whatsapp", "open", "human", "low", false),
  createConversation("conv_21", "Esteban Ortiz", "instagram", "closed", "unassigned", "low", false),
  createConversation("conv_22", "Luciana Castro", "whatsapp", "open", "ai", "medium", false),
  createConversation("conv_23", "Joaquín Navarro", "whatsapp", "open", "human", "high", true),
  createConversation("conv_24", "Emilia Cordero", "instagram", "open", "human", "medium", false),
  createConversation("conv_25", "Rafael Mora", "whatsapp", "open", "ai", "low", false, true), // expired
  createConversation("conv_26", "Victoria Sanz", "whatsapp", "resolved", "human", "high", false),
  createConversation("conv_27", "Alonso Reyes", "instagram", "open", "unassigned", "medium", true),
  createConversation("conv_28", "Julieta Rivas", "whatsapp", "open", "human", "high", false),
  createConversation("conv_29", "Ignacio Luna", "whatsapp", "open", "ai", "medium", false, true), // expired
  createConversation("conv_30", "Carmen Solís", "instagram", "open", "human", "low", false)
];
