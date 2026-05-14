import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";
import { MetricsFilters } from "./MetricsFilters";

export function MetricsLayout({
  sidebarSlot,
  contentSlot,
  activeMainSection = "metrics",
  onMainSectionChange
}: {
  sidebarSlot: React.ReactNode;
  contentSlot: React.ReactNode;
  activeMainSection?: "inbox" | "channels" | "metrics";
  onMainSectionChange?: (section: "inbox" | "channels" | "metrics") => void;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar activeMainSection={activeMainSection} onMainSectionChange={onMainSectionChange} />
      
      {/* Metrics Sidebar Column */}
      <div className="flex w-[260px] flex-col border-r bg-card shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {sidebarSlot}
      </div>
      
      {/* Metrics Content Column */}
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/20">
        <MetricsFilters />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {contentSlot}
          </div>
        </div>
      </div>
    </div>
  );
}
