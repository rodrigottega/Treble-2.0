import * as React from "react";
import { AiCenterSection } from "@/types/aiCenter";

interface AiCenterSidebarProps {
  activeSection: AiCenterSection;
  onSectionChange: (section: AiCenterSection) => void;
}

export function AiCenterSidebar({ activeSection, onSectionChange }: AiCenterSidebarProps) {
  return (
    <div className="flex w-[260px] flex-col border-r bg-card shrink-0 z-10">
      <div className="flex flex-col p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">AI Center</h2>
        <p className="text-xs text-muted-foreground mt-1">Configura agentes, recursos y conocimiento.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <button
          onClick={() => onSectionChange("orchestrator")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "orchestrator" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <i className="ri-share-network-line text-lg"></i>
          Agente orquestador
        </button>

        <button
          onClick={() => onSectionChange("sub_agents")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "sub_agents" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <i className="ri-robot-2-line text-lg"></i>
          Sub-agentes
        </button>

        <button
          onClick={() => onSectionChange("knowledge_base")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "knowledge_base" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <i className="ri-book-3-line text-lg"></i>
          Base de conocimiento
        </button>
      </div>
    </div>
  );
}
