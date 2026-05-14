import * as React from "react";
import { cn } from "@/lib/utils";
import { MetricsSection } from "@/types/metrics";

interface MetricsSidebarProps {
  activeSection: MetricsSection;
  onSectionChange: (section: MetricsSection) => void;
}

export function MetricsSidebar({ activeSection, onSectionChange }: MetricsSidebarProps) {
  return (
    <div className="flex flex-col h-full w-full bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Metrics</h2>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        <button
          onClick={() => onSectionChange('general')}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeSection === 'general' ? "bg-accent/50 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:font-medium"
          )}
        >
          <div className="flex items-center gap-2.5">
            <i className="ri-layout-grid-line text-lg"></i>
            Generales
          </div>
        </button>

        <button
          onClick={() => onSectionChange('channels')}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeSection === 'channels' ? "bg-accent/50 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:font-medium"
          )}
        >
          <div className="flex items-center gap-2.5">
            <i className="ri-chat-1-line text-lg"></i>
            Por canal
          </div>
        </button>

        <button
          onClick={() => onSectionChange('export')}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeSection === 'export' ? "bg-accent/50 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:font-medium"
          )}
        >
          <div className="flex items-center gap-2.5">
            <i className="ri-download-line text-lg"></i>
            Exportar
          </div>
        </button>
      </div>
    </div>
  );
}
