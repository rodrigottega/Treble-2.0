import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";

export function ChannelsLayout({
  sidebarSlot,
  contentSlot,
  activeMainSection = "channels",
  onMainSectionChange
}: {
  sidebarSlot: React.ReactNode;
  contentSlot: React.ReactNode;
  activeMainSection?: "inbox" | "channels";
  onMainSectionChange?: (section: "inbox" | "channels") => void;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar activeMainSection={activeMainSection} onMainSectionChange={onMainSectionChange} />
      
      {/* Channels Sidebar Column */}
      <div className="flex w-[260px] flex-col border-r bg-card shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {sidebarSlot}
      </div>
      
      {/* Configuration Content Column */}
      <div className="flex flex-1 flex-col overflow-auto bg-muted/20">
        <div className="max-w-[1000px] w-full mx-auto p-8">
          {contentSlot}
        </div>
      </div>
    </div>
  );
}
