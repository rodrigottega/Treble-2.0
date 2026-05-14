export type AdminSection = "agents" | "teams" | "assignment_rules";

export type AgentStatus = "active" | "inactive" | "break";

export type AssignmentRuleType =
  | "round_robin"
  | "least_load"
  | "team_based"
  | "skills_based"
  | "priority_based"
  | "sla_based"
  | "channel_based"
  | "language_location"
  | "business_hours"
  | "sticky_owner"
  | "overflow_fallback"
  | "manual_review";

export type RulePriority = "high" | "medium" | "low";

export interface AdminAgent {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  status: AgentStatus;
  teamId?: string;
  teamName?: string;
  currentConversation?: {
    id: string;
    contactName: string;
    channel: "whatsapp" | "instagram";
  };
  assignedOpenConversations: number;
  pendingConversations: number;
  lastActivityAt: string;
  availableForAutoAssignment: boolean;
  createdAt: string;
}

export interface AdminTeam {
  id: string;
  name: string;
  description: string;
  color?: string;
  memberIds: string[];
  activeAgents: number;
  openConversations: number;
  associatedRules: number;
  availableForAutoAssignment: boolean;
  createdAt: string;
  lastActivityAt: string;
}

export interface AssignmentCondition {
  field:
    | "channel"
    | "topic"
    | "keywords"
    | "funnel_stage"
    | "intent"
    | "tag"
    | "country"
    | "city"
    | "language"
    | "business_hours"
    | "waiting_time";
  operator: "is" | "contains" | "is_any_of" | "greater_than";
  value: string | string[] | number;
}

export interface AssignmentDestination {
  type: "agent" | "team" | "queue" | "ai_agent" | "sticky_owner";
  id?: string;
  name: string;
  teamMethod?: "round_robin" | "least_load" | "longest_available" | "manual_review";
}

export interface AssignmentRule {
  id: string;
  name: string;
  description?: string;
  type: AssignmentRuleType | string;
  appliesWhenLabel?: string;
  assignmentMethodLabel?: string;
  destinationLabel?: string;
  conditions: AssignmentCondition[] | any[];
  destination: AssignmentDestination | any;
  priority: RulePriority | string;
  active: boolean;
  order: number;
  capacityLimit?: number;
  excludeInactiveAgents?: boolean;
  excludeBreakAgents?: boolean;
  reassignIfNoResponse?: boolean;
  reassignAfterMinutes?: number;
  lastRunAt?: string;
  createdAt?: string;
}
