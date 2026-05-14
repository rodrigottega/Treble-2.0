import * as React from "react";
import { AgentStatus } from "../../../types/admin";

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  if (status === 'active') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></span>
        Activo
      </div>
    );
  }
  if (status === 'break') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
        Break
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 shrink-0"></span>
      Inactivo
    </div>
  );
}
