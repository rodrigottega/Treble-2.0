import * as React from "react";
import { AdminSection } from "../../types/admin";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-[280px] border-r bg-background flex flex-col h-full shrink-0">
      <div className="p-4 py-6 border-b">
         <h2 className="text-lg font-semibold tracking-tight mb-1">Admin</h2>
         <p className="text-sm text-muted-foreground leading-relaxed">Gestiona agentes, equipos y asignaciones.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-6">
          
          <div className="space-y-1">
            <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
               Gestión de personal
            </h3>
            <button 
              onClick={() => onSectionChange("agents")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'agents' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <i className="ri-user-settings-line text-lg w-5 text-center"></i>
              Agentes
            </button>
            <button 
              onClick={() => onSectionChange("teams")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'teams' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <i className="ri-team-line text-lg w-5 text-center"></i>
              Equipos
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
               Routing operacional
            </h3>
            <button 
              onClick={() => onSectionChange("assignment_rules")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'assignment_rules' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <i className="ri-flow-chart text-lg w-5 text-center"></i>
              Reglas de asignación
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
