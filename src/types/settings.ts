export type SettingsSection = "pricing_plans";

export type BillingCycle = "monthly" | "annual";

export type LimitBehaviorMode =
  | "continue_with_overage"
  | "stop_sending"
  | "require_admin_approval";

export interface Plan {
  id: string;
  name: string;
  price: string;
  outboundLimit: number;
  includedAgents: number | "unlimited";
  features: string[];
  current?: boolean;
}

export interface CurrentPlan {
  id: string;
  name: string;
  status: "active" | "past_due" | "cancelled";
  billingCycle: BillingCycle;
  renewsAt: string;
  outboundLimit: number;
  outboundUsed: number;
  includedAgents: number;
  channels: string[];
}

export interface OutboundUsageBreakdown {
  whatsapp: number;
  instagram: number;
  manualMessages: number;
  hsmTemplates: number;
  aiAutomated: number;
}

export interface LimitBehavior {
  mode: LimitBehaviorMode;
  overageCostPerMessage?: number;
  overageMaxMessages?: number;
  notifyBeforeOverage: boolean;
  approvalAdminId?: string;
}

export interface AlertSettings {
  enabled: boolean;
  primaryNumber: string;
  recipientName?: string;
  verified: boolean;
  percentageThresholds: number[];
  remainingMessagesThreshold?: number;
  notifyAtLimit: boolean;
  notifyWhenOverageStarts: boolean;
  dailySummary: boolean;
  dailySummaryTime?: string;
  additionalRecipients: AlertRecipient[];
}

export interface AlertRecipient {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
}

export interface UsageHistoryItem {
  id: string;
  period: string;
  planName: string;
  limit: number;
  used: number;
  overage: number;
  status: "En curso" | "Cerrado" | "Consumo adicional";
}
