import * as React from "react";
import { cn } from "@/lib/utils";

interface ChannelsSidebarProps {
  activeChannel: "whatsapp" | "instagram";
  onChannelChange: (channel: "whatsapp" | "instagram") => void;
}

export function ChannelsSidebar({ activeChannel, onChannelChange }: ChannelsSidebarProps) {
  return (
    <div className="flex flex-col h-full w-full bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Channels</h2>
        <p className="text-sm text-muted-foreground mt-1">Configura tus canales conectados.</p>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        <button
          onClick={() => onChannelChange('whatsapp')}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeChannel === 'whatsapp' ? "bg-accent/50 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:font-medium"
          )}
        >
          <div className="flex items-center gap-2.5">
            <i className="ri-whatsapp-line text-green-600 text-lg"></i>
            WhatsApp
          </div>
          <span className="text-[10px] uppercase font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
            Conectado
          </span>
        </button>

        <button
          onClick={() => onChannelChange('instagram')}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeChannel === 'instagram' ? "bg-accent/50 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:font-medium"
          )}
        >
          <div className="flex items-center gap-2.5">
            <i className="ri-instagram-line text-pink-600 text-lg"></i>
            Instagram
          </div>
          <span className="text-[10px] uppercase font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
            Conectado
          </span>
        </button>
      </div>
    </div>
  );
}
