import { CurrentPlan, OutboundUsageBreakdown, LimitBehavior, AlertSettings, UsageHistoryItem, Plan } from "../types/settings";

export const dummyCurrentPlan: CurrentPlan = {
  id: "growth",
  name: "Growth",
  status: "active",
  billingCycle: "monthly",
  renewsAt: "2026-06-01",
  outboundLimit: 10000,
  outboundUsed: 7420,
  includedAgents: 12,
  channels: ["WhatsApp", "Instagram"]
};

export const dummyUsageBreakdown: OutboundUsageBreakdown = {
  whatsapp: 5980,
  instagram: 1440,
  manualMessages: 2860,
  hsmTemplates: 3720,
  aiAutomated: 840
};

export const initialLimitBehavior: LimitBehavior = {
  mode: "continue_with_overage",
  overageCostPerMessage: 0.012,
  overageMaxMessages: 2000,
  notifyBeforeOverage: true
};

export const initialAlertSettings: AlertSettings = {
  enabled: true,
  primaryNumber: "+52 55 1907 6049",
  recipientName: "Admin principal",
  verified: true,
  percentageThresholds: [75, 90, 100],
  remainingMessagesThreshold: 1000,
  notifyAtLimit: true,
  notifyWhenOverageStarts: true,
  dailySummary: false,
  dailySummaryTime: "09:00",
  additionalRecipients: []
};

export const dummyUsageHistory: UsageHistoryItem[] = [
  { id: "h1", period: "Mayo 2026", planName: "Growth", limit: 10000, used: 7420, overage: 0, status: "En curso" },
  { id: "h2", period: "Abril 2026", planName: "Growth", limit: 10000, used: 9840, overage: 0, status: "Cerrado" },
  { id: "h3", period: "Marzo 2026", planName: "Growth", limit: 10000, used: 11320, overage: 1320, status: "Consumo adicional" },
  { id: "h4", period: "Febrero 2026", planName: "Starter", limit: 5000, used: 4780, overage: 0, status: "Cerrado" }
];

export const mockPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$99/mes",
    outboundLimit: 5000,
    includedAgents: 3,
    features: ["Canales básicos", "Reportes estándar"],
    current: false
  },
  {
    id: "growth",
    name: "Growth",
    price: "$249/mes",
    outboundLimit: 10000,
    includedAgents: 12,
    features: ["WhatsApp + Instagram", "AI Center básico", "Integraciones"],
    current: true
  },
  {
    id: "scale",
    name: "Scale",
    price: "$699/mes",
    outboundLimit: 50000,
    includedAgents: "unlimited",
    features: ["Reglas avanzadas", "AI Center completo", "API de alto volumen"],
    current: false
  }
];
