import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";

interface SettingsLayoutProps {
  activeMainSection: "inbox" | "channels" | "metrics" | "contacts" | "ai_center" | "admin" | "settings";
  onMainSectionChange: (section: "inbox" | "channels" | "metrics" | "contacts" | "ai_center" | "admin" | "settings") => void;
  sidebarSlot: React.ReactNode;
  contentSlot: React.ReactNode;
}

export function SettingsLayout({ activeMainSection, onMainSectionChange, sidebarSlot, contentSlot }: SettingsLayoutProps) {
  return (
    <div className="flex bg-background h-screen w-full overflow-hidden">
      <AppSidebar 
        activeMainSection={activeMainSection}
        onMainSectionChange={onMainSectionChange}
      />
      <div className="flex flex-1 overflow-hidden">
        {sidebarSlot}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/50">
          {contentSlot}
        </div>
      </div>
    </div>
  );
}
