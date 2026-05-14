export type ContactChannel = "whatsapp" | "instagram";

export type FunnelStage = string;

export interface FunnelStageDef {
  id: string;
  name: string;
  color: string;
  isSystem: boolean;
}

export type ContactIntent = "Alta" | "Media" | "Baja";

export type CustomPropertyType =
  | "text"
  | "number"
  | "single_select"
  | "multi_select"
  | "boolean"
  | "date";

export interface CustomPropertyOption {
  id: string;
  label: string;
  color?: string;
}

export interface CustomPropertyDefinition {
  id: string;
  name: string;
  key: string;
  type: CustomPropertyType;
  description?: string;
  options?: CustomPropertyOption[];
  showInTable: boolean;
  createdAt: string;
}

export interface ContactConversationMessage {
  id: string;
  content: string;
  role: "user" | "agent";
  createdAt: string;
  status?: "sent" | "delivered" | "read" | "failed";
}

export interface ContactConversation {
  id: string;
  channel: ContactChannel;
  status: "open" | "resolved" | "closed" | "expired";
  summary: string;
  startedAt: string;
  endedAt?: string;
  owner?: string;
  messages: ContactConversationMessage[];
}

export interface ContactTimelineEvent {
  id: string;
  type:
    | "contact_created"
    | "message_received"
    | "message_sent"
    | "template_sent"
    | "funnel_stage_updated"
    | "property_updated"
    | "tag_added"
    | "tag_removed"
    | "conversation_resolved"
    | "contact_imported"
    | "bulk_template_sent";
  title: string;
  description: string;
  createdAt: string;
  channel?: ContactChannel;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  channels: ContactChannel[];
  primaryChannel: ContactChannel;
  instagramUsername?: string;
  funnelStage: FunnelStage;
  intent: ContactIntent;
  programOfInterest?: string;
  modality?: string;
  campus?: string;
  source?: string;
  owner?: string;
  tags: string[];
  createdAt: string;
  lastActivityAt: string;
  lastConversationAt?: string;
  conversations: ContactConversation[];
  timelineEvents: ContactTimelineEvent[];
  customProperties: Record<string, any>;
}
