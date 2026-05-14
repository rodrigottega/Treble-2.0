export type AiCenterSection = "orchestrator" | "sub_agents" | "knowledge_base";

export type ResponseLength = "Breve" | "Normal" | "Detallada";

export type AgentTone =
  | "Cercano"
  | "Profesional"
  | "Directo"
  | "Empático"
  | "Comercial"
  | "Formal";

export type InitiativeLevel = "Conservador" | "Balanceado" | "Proactivo";

export type AssetType =
  | "pdf"
  | "presentation"
  | "image"
  | "video"
  | "document"
  | "link";

export type AssetStatus = "uploading" | "processing" | "available" | "error";

export type SubAgentStatus = "available" | "active" | "paused";

export type KnowledgeSourceType = "pdf" | "plain_text" | "txt" | "website";

export type KnowledgeSourceStatus =
  | "processing"
  | "ready"
  | "error"
  | "needs_review";

export interface OrchestratorConfig {
  active: boolean;
  responseLength: ResponseLength;
  tone: AgentTone;
  language: string;
  initiativeLevel: InitiativeLevel;
  confirmBeforeSendingAssets: boolean;
  respondOutsideBusinessHours: boolean;
}

export interface AiAsset {
  id: string;
  name: string;
  type: AssetType;
  description: string;
  useWhen: string;
  tags: string[];
  status: AssetStatus;
  size?: string;
  uploadedAt: string;
}

export interface SubAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  skills: string[];
  status: SubAgentStatus;
  knowledgeBaseIds: string[];
  assetIds: string[];
  routingDescription?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  conditionType: "topic" | "keywords" | "funnel_stage" | "channel" | "tag";
  conditionValue: string;
  subAgentId: string;
  active: boolean;
}

export interface HumanHandoffRule {
  id: string;
  name: string;
  description: string;
  priority: "Alta" | "Media" | "Baja";
  active: boolean;
  baseRule: boolean;
  messageBeforeTransfer?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  status: "ready" | "processing" | "needs_review";
  sourceIds: string[];
  associatedAgentIds: string[];
  priority: "Baja" | "Normal" | "Alta";
  updatedAt: string;
}

export interface KnowledgeSource {
  id: string;
  knowledgeBaseId: string;
  name: string;
  type: KnowledgeSourceType;
  status: KnowledgeSourceStatus;
  uploadedAt: string;
  size?: string;
  indexedChunks?: number;
  url?: string;
  contentPreview?: string;
}
