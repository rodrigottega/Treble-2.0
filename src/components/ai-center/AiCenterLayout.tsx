import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";

interface AiCenterLayoutProps {
  activeMainSection: any;
  onMainSectionChange: (section: any) => void;
  sidebarSlot: React.ReactNode;
  contentSlot: React.ReactNode;
}

export function AiCenterLayout({
  activeMainSection,
  onMainSectionChange,
  sidebarSlot,
  contentSlot
}: AiCenterLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeMainSection={activeMainSection} onMainSectionChange={onMainSectionChange} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarSlot}
        <main className="flex-1 overflow-hidden flex flex-col bg-muted/10 h-full">
           <div className="w-full max-w-6xl h-full mx-auto md:border-l md:border-r border-border/50 bg-background flex flex-col shadow-sm">
             {contentSlot}
           </div>
        </main>
      </div>
    </div>
  );
}
