export type Channel = "whatsapp" | "instagram";
export type ConversationStatus = "open" | "resolved" | "closed" | "expired";
export type HandlerType = "ai" | "human" | "unassigned";
export type MessageDirection = "inbound" | "outbound" | "internal" | "system";
export type MessageType = "text" | "image" | "document" | "audio" | "template" | "interactive";
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type LeadIntent = "low" | "medium" | "high";
export type SlaStatus = "ok" | "needs_response" | "overdue";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CRMProperty {
  programOfInterest?: string;
  modality?: string;
  campus?: string;
  leadStage?: string;
  budget?: string;
  nextAction?: string;
  acquisitionChannel?: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  channel?: Channel;
  status?: ConversationStatus;
  createdAt: string;
}

export interface MessageAttachment {
  type: "image" | "document" | "audio" | "interactive";
  url?: string;
  name?: string;
  duration?: number;
  options?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  text: string;
  status?: MessageStatus;
  createdAt: string;
  attachment?: MessageAttachment;
  replyToId?: string;
  replyToMessage?: Message; // For rendering context
  reaction?: string;
}

export interface WhatsAppWindow {
  isActive: boolean;
  expiresAt: string | null;
  remainingHours: number | null;
  lastCustomerMessageAt: string | null;
}

export interface HistoricalConversation {
  id: string;
  channel: Channel;
  status: ConversationStatus;
  summary: string;
  startedAt: string;
  endedAt: string;
  messages: Message[];
  tags?: Tag[];
}

export type FunnelStage = 
  | "Nuevo lead"
  | "Contactado"
  | "Calificado"
  | "No calificado"
  | "Aplicación iniciada"
  | "Documentos pendientes"
  | "Inscripción en proceso"
  | "Inscrito"
  | "Perdido";

export interface Conversation {
  id: string;
  contactName: string;
  avatarInitials: string;
  phone: string;
  email: string;
  city: string;
  funnelStage?: FunnelStage;
  
  channels: Channel[]; // Support for multiple channels
  activeChannel: Channel; // The channel currently visible/active in chat
  channelStatus: Record<Channel, ConversationStatus>; // e.g., { whatsapp: "open", instagram: "resolved" }
  whatsappWindow?: WhatsAppWindow;

  threadsByChannel: Record<Channel, Message[]>; // Messages separated by channel
  historicalConversations?: HistoricalConversation[];
  
  // Legacy or global fields
  channel: Channel; // Keeping for backward compatibility temporarily, or just use activeChannel
  status: ConversationStatus; // Overall status or status of active channel
  messages: Message[]; // Legacy or merged messages. Let's rely on threadsByChannel.
  
  isUnread: boolean;
  handledBy: HandlerType;
  ownerName: string | null;
  assigneeId: string | null;
  team?: string;
  tags: Tag[];
  
  lastMessage: string;
  lastMessageAt: string;
  
  leadStage: string;
  leadIntent: LeadIntent;
  source: string;
  properties: CRMProperty;
  followUpAt: string | null;
  hasPendingFollowUp: boolean;
  slaStatus: SlaStatus;
  
  notes: Note[];
  events: ActivityEvent[];
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: "Utility" | "Marketing" | "Authentication";
  language: string;
  status: "Approved";
  description: string;
  lastUsed: string;
  text: string;
  variables: string[];
}
