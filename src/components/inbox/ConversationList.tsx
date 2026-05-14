import * as React from "react";
import { Conversation, Tag as TagType } from "@/types/inbox";
import { formatRelativeTime } from "@/lib/date";
import { ScrollArea, ScrollBar as ScrollAreaBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AgentStatusSelector } from "./AgentStatusSelector";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterChannel: 'all' | 'whatsapp' | 'instagram';
  setFilterChannel: (c: 'all' | 'whatsapp' | 'instagram') => void;
  filterStatus: 'all' | 'open' | 'resolved' | 'closed' | 'expired';
  setFilterStatus: (s: 'all' | 'open' | 'resolved' | 'closed' | 'expired') => void;
  filterView: string;
  setFilterView: (v: string) => void;
  onOpenAdvancedFilters: () => void;
  activeFilterCount: number;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  setSearchQuery,
  filterChannel,
  setFilterChannel,
  filterStatus,
  setFilterStatus,
  filterView,
  setFilterView,
  onOpenAdvancedFilters,
  activeFilterCount
}: ConversationListProps) {

  const views = [
    { id: "all", label: "Todas" },
    { id: "my_inbox", label: "Mi bandeja" },
    { id: "unassigned", label: "Sin asignar" },
    { id: "expired", label: "Expiradas" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header & Views */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Inbox</h2>
          <AgentStatusSelector />
        </div>

        <div className="flex items-center gap-[2px] mb-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
            <Input 
              placeholder="Buscar conversaciones..." 
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeFilterCount > 0 ? "secondary" : "ghost"} 
                  size="icon" 
                  className={cn("h-9 w-9 shrink-0 relative", activeFilterCount === 0 && "text-muted-foreground")}
                  onClick={onOpenAdvancedFilters}
                >
                  <i className="ri-sound-module-line text-lg"></i>
                  {activeFilterCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filtros avanzados</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-2">
            {views.map(v => (
              <Badge 
                key={v.id} 
                variant={filterView === v.id ? "default" : "secondary"}
                className={cn("cursor-pointer", filterView !== v.id && "bg-muted text-muted-foreground hover:bg-muted/80")}
                onClick={() => setFilterView(v.id)}
              >
                {v.label}
              </Badge>
            ))}
          </div>
          <ScrollAreaBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      <Separator />

      {/* List */}
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <i className="ri-inbox-archive-line text-4xl text-muted-foreground mb-2 opacity-50"></i>
            <p className="text-sm text-muted-foreground font-medium">No encontramos conversaciones</p>
            <p className="text-xs text-muted-foreground mt-1">Prueba cambiando los filtros de búsqueda.</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setFilterView('all'); setFilterChannel('all'); setFilterStatus('all'); }} className="mt-2 text-xs">
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map(conv => {
              const displayChannel = conv.activeChannel || conv.channel;
              const hasBoth = conv.channels?.includes('whatsapp') && conv.channels?.includes('instagram');
              const displayStatus = conv.channelStatus?.[displayChannel] || conv.status;
              
              return (
                <div 
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0",
                    selectedId === conv.id ? "bg-muted/80" : "bg-transparent",
                    conv.isUnread && "bg-blue-50/40 dark:bg-blue-950/20"
                  )}
                >
                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <span className={cn("text-sm font-semibold truncate", conv.isUnread ? "text-foreground" : "text-foreground/90")}>
                          {conv.contactName}
                        </span>
                        <div className="flex items-center gap-1">
                          {displayChannel === 'whatsapp' ? (
                            <i className="ri-whatsapp-line text-green-600"></i>
                          ) : (
                            <i className="ri-instagram-line text-pink-600"></i>
                          )}
                          {hasBoth && <span className="text-[9px] text-muted-foreground bg-muted px-1 rounded font-medium ml-0.5 whitespace-nowrap">WA+IG</span>}
                        </div>
                      </div>
                      <span className={cn("text-xs shrink-0 whitespace-nowrap", conv.isUnread ? "text-blue-600 font-medium" : "text-muted-foreground")}>
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    
                    <p className={cn("text-sm truncate pr-4", conv.isUnread ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {conv.lastMessage || "Adjunto"}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {displayStatus === 'expired' && displayChannel === 'whatsapp' && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-800 border border-orange-200">
                          WA Expirado
                        </span>
                      )}
                      
                      {/* Note: Handled by 'unassigned' is kept visible if helpful, or we can just rely on 'Sin asignar' view. Let's keep it if we want. It's not 'IA' */}
                      
                      {conv.tags.slice(0, 1).map(tag => (
                        <span key={tag.id} className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-sm border", tag.color)}>
                          {tag.name}
                        </span>
                      ))}
                      {conv.tags.length > 1 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
                          +{conv.tags.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                  {conv.isUnread && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
