import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";

interface AdminLayoutProps {
  activeMainSection: any;
  onMainSectionChange: (section: any) => void;
  sidebarSlot: React.ReactNode;
  contentSlot: React.ReactNode;
}

export function AdminLayout({
  activeMainSection,
  onMainSectionChange,
  sidebarSlot,
  contentSlot
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeMainSection={activeMainSection} onMainSectionChange={onMainSectionChange} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarSlot}
        <main className="flex-1 overflow-hidden flex flex-col bg-background h-full">
           <div className="w-full h-full bg-background flex flex-col">
             {contentSlot}
           </div>
        </main>
      </div>
    </div>
  );
}
