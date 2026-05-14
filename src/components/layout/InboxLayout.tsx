import * as React from "react";
import { AppSidebar } from "./AppSidebar";

export function InboxLayout({
  listSlot,
  chatSlot,
  detailsSlot,
  activeMainSection = "inbox",
  onMainSectionChange
}: {
  listSlot: React.ReactNode;
  chatSlot: React.ReactNode;
  detailsSlot: React.ReactNode;
  activeMainSection?: "inbox" | "channels";
  onMainSectionChange?: (section: "inbox" | "channels") => void;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar activeMainSection={activeMainSection} onMainSectionChange={onMainSectionChange} />
      
      {/* List Column */}
      <div className="flex w-[350px] flex-col border-r bg-card shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {listSlot}
      </div>
      
      {/* Chat Column */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background relative">
        {chatSlot}
      </div>

      {/* Details Column */}
      <div className="hidden w-[320px] flex-col border-l bg-card shrink-0 lg:flex shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
        {detailsSlot}
      </div>
    </div>
  );
}
