import * as React from "react";
import { Avatar } from "@/components/ui/shared";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/shared";

interface AppSidebarProps {
  activeMainSection?: "inbox" | "channels" | "metrics" | "contacts" | "ai_center" | "admin" | "settings";
  onMainSectionChange?: (section: "inbox" | "channels" | "metrics" | "contacts" | "ai_center" | "admin" | "settings") => void;
}

export function AppSidebar({ activeMainSection = "inbox", onMainSectionChange }: AppSidebarProps) {
  return (
    <div className="flex h-screen w-16 flex-col items-center justify-between border-r bg-card py-4 z-20">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 mb-4 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm overflow-hidden">
          <img src="https://raw.githubusercontent.com/rodrigottega/assets/main/300x300_Square_ciarem.png" alt="Logo" className="h-full w-full object-cover" />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("inbox")}
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'inbox' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-inbox-line text-lg"></i>
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive"></span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Inbox</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("channels")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'channels' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-share-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Channels</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("metrics")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'metrics' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-bar-chart-box-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Metrics</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("contacts")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'contacts' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-contacts-book-2-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Contacts</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("ai_center")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'ai_center' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-sparkling-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">AI Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("admin")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'admin' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <i className="ri-shield-user-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Admin</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onMainSectionChange?.("settings")}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeMainSection === 'settings' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              >
                <i className="ri-settings-4-line text-lg"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Ajustes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Avatar fallback="LH" className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-border transition-all" />
      </div>
    </div>
  );
}
