import * as React from "react";
import { Conversation, Message, Template } from "@/types/inbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, Separator, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Popover, PopoverTrigger, PopoverContent } from "@/components/ui/shared";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/date";

import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ChatPanelProps {
  conversation: Conversation | null;
  onSendMessage: (text: string, isInternal: boolean, replyToMsg?: Message) => void;
  onChangeStatus: (status: "open" | "resolved" | "closed" | "expired") => void;
  onOpenTemplates: () => void;
  onSuggestAi: () => void;
  onSwitchChannel: (channel: 'whatsapp' | 'instagram') => void;
  onOpenTransfer: () => void;
  activeChatTab: string;
  setActiveChatTab: (tabId: string) => void;
  openHistoryTabs: string[];
  setOpenHistoryTabs: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ChatPanel({ 
  conversation, onSendMessage, onChangeStatus, onOpenTemplates, 
  onSuggestAi, onSwitchChannel, onOpenTransfer, 
  activeChatTab, setActiveChatTab, openHistoryTabs, setOpenHistoryTabs 
}: ChatPanelProps) {
  const [inputText, setInputText] = React.useState("");
  const [isInternal, setIsInternal] = React.useState(false);
  const [isFormattingOpen, setIsFormattingOpen] = React.useState(false);
  const [replyToMessage, setReplyToMessage] = React.useState<Message | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const isHistoryActive = activeChatTab !== "current";
  const activeHistory = isHistoryActive ? conversation?.historicalConversations?.find(h => h.id === activeChatTab) : null;

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, activeChatTab]);

  const handleSend = () => {
    if (!inputText.trim() || isHistoryActive) return;
    onSendMessage(inputText, isInternal, replyToMessage || undefined);
    setInputText("");
    setReplyToMessage(null);
  };

  const applyFormat = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    const before = inputText.substring(0, start);
    const after = inputText.substring(end);

    const newText = before + prefix + selectedText + suffix + after;
    setInputText(newText);

    // Set cursor position after React update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'b') {
        e.preventDefault();
        applyFormat('*');
      } else if (e.key === 'i') {
        e.preventDefault();
        applyFormat('_');
      }
    }
  };

  const closeHistoryTab = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenHistoryTabs(prev => prev.filter(id => id !== historyId));
    if (activeChatTab === historyId) {
      setActiveChatTab("current");
    }
  };

  if (!conversation) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <i className="ri-chat-3-line text-2xl text-muted-foreground"></i>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Selecciona una conversación</h3>
          <p className="text-sm text-muted-foreground">Elige una conversación de la lista para leer y enviar mensajes.</p>
        </div>
      </div>
    );
  }

  const activeChannel = conversation.activeChannel || conversation.channel;
  const isWaExpired = activeChannel === 'whatsapp' && (conversation.channelStatus?.['whatsapp'] === 'expired' || conversation.status === 'expired');
  const hasBoth = conversation.channels?.includes('whatsapp') && conversation.channels?.includes('instagram');
  const messages = isHistoryActive && activeHistory ? activeHistory.messages : (conversation.threadsByChannel?.[activeChannel] || conversation.messages || []);
  const displayStatus = conversation.channelStatus?.[activeChannel] || conversation.status;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-[72px] px-6 border-b shrink-0 bg-card">
        <div className="flex items-center gap-3">
          <Avatar fallback={conversation.avatarInitials} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight">{conversation.contactName}</h3>
              {isHistoryActive && activeHistory ? (
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border font-medium",
                  activeHistory.channel === 'whatsapp' ? "bg-green-50 text-green-700 border-green-200" : "bg-pink-50 text-pink-700 border-pink-200"
                )}>
                  <i className={activeHistory.channel === 'whatsapp' ? "ri-whatsapp-line" : "ri-instagram-line"}></i>
                  {activeHistory.channel === 'whatsapp' ? "WhatsApp Histórico" : "Instagram Histórico"}
                </div>
              ) : hasBoth ? (
                <div className="flex items-center bg-muted rounded-full p-0.5 border">
                  <button 
                    onClick={() => onSwitchChannel('whatsapp')}
                    className={cn("px-2 py-0.5 rounded-full text-xs transition-colors flex items-center gap-1", activeChannel === 'whatsapp' ? "bg-background shadow-sm text-green-700" : "text-muted-foreground hover:text-foreground")}
                  >
                    <i className="ri-whatsapp-line"></i> WA
                  </button>
                  <button 
                    onClick={() => onSwitchChannel('instagram')}
                    className={cn("px-2 py-0.5 rounded-full text-xs transition-colors flex items-center gap-1", activeChannel === 'instagram' ? "bg-background shadow-sm text-pink-700" : "text-muted-foreground hover:text-foreground")}
                  >
                    <i className="ri-instagram-line"></i> IG
                  </button>
                </div>
              ) : (
                activeChannel === 'whatsapp' ? (
                  <i className="ri-whatsapp-line text-green-600"></i>
                ) : (
                  <i className="ri-instagram-line text-pink-600"></i>
                )
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {conversation.handledBy === 'ai' ? (
                <span className="flex items-center gap-1 text-purple-600 font-medium"><i className="ri-robot-2-line"></i> Agente IA</span>
              ) : conversation.handledBy === 'human' ? (
                <span className="flex items-center gap-1"><i className="ri-user-line"></i> {conversation.ownerName}</span>
              ) : (
                <span className="text-amber-600">Sin asignar</span>
              )}
              <span>•</span>
              <span className={cn(
                "capitalize", 
                (!isHistoryActive && displayStatus === 'open') && "text-green-600 font-medium",
                (!isHistoryActive && displayStatus === 'resolved') && "text-blue-600",
                (!isHistoryActive && displayStatus === 'expired') && "text-orange-600 font-medium",
                isHistoryActive && "text-muted-foreground font-medium"
              )}>
                {isHistoryActive && activeHistory 
                  ? (activeHistory.status === 'open' ? 'Histórico · Abierta' : activeHistory.status === 'resolved' ? 'Histórico · Resuelta' : activeHistory.status === 'closed' ? 'Histórico · Cerrada' : 'Histórico · Expirada') 
                  : (displayStatus === 'open' ? 'Abierta' : displayStatus === 'resolved' ? 'Resuelta' : displayStatus === 'closed' ? 'Cerrada' : 'WA Expirado')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(!isHistoryActive && activeChannel === 'whatsapp') && (
            <div className={cn(
              "text-xs px-2 py-1 rounded-md flex items-center gap-1.5 mr-2 border",
              isWaExpired ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-green-50 border-green-200 text-green-800"
            )}>
              <i className="ri-time-line"></i>
              {isWaExpired ? "Ventana expirada" : `Activa · ${conversation.whatsappWindow?.remainingHours || 0}h`}
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={() => onChangeStatus(displayStatus === 'resolved' ? 'open' : 'resolved')} disabled={isHistoryActive}>
            <i className={cn("mr-1.5", displayStatus === 'resolved' ? "ri-arrow-go-back-line" : "ri-check-line")}></i>
            {displayStatus === 'resolved' ? 'Reabrir' : 'Resolver'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isHistoryActive}>
                <i className="ri-more-2-fill"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {activeChannel === 'whatsapp' && (
                <DropdownMenuItem onClick={onOpenTemplates}>
                  <i className="ri-message-3-line mr-2"></i> Enviar plantilla
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onOpenTransfer}>
                <i className="ri-user-shared-2-line mr-2"></i> Transferir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      {openHistoryTabs.length > 0 && (
        <div className="flex bg-muted/10 border-b overflow-x-auto hide-scrollbar px-4 pt-2 shrink-0">
          <button
            className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors rounded-t-lg -mb-[1px]", !isHistoryActive ? "border-primary bg-background text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
            onClick={() => setActiveChatTab("current")}
          >
            Actual
          </button>
          {openHistoryTabs.map(tabId => {
            const tabHistory = conversation.historicalConversations?.find(h => h.id === tabId);
            if (!tabHistory) return null;
            const label = `${tabHistory.channel === 'whatsapp' ? 'WA' : 'IG'} · ${format(new Date(tabHistory.endedAt), "d MMM", { locale: es })}`;
            return (
              <div
                key={tabId}
                className={cn("group flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors rounded-t-lg ml-1 cursor-pointer -mb-[1px]", activeChatTab === tabId ? "border-primary bg-background text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
                onClick={() => setActiveChatTab(tabId)}
                title="Conversación histórica · Solo lectura"
              >
                <i className={cn(tabHistory.channel === 'whatsapp' ? "ri-whatsapp-line text-green-600" : "ri-instagram-line text-pink-600")}></i>
                <span className="whitespace-nowrap">{label}</span>
                <button
                  className="opacity-50 hover:opacity-100 hover:text-destructive flex items-center justify-center p-0.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={(e) => closeHistoryTab(tabId, e)}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/10" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center mb-4">
            <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
              {isHistoryActive && activeHistory ? `Conversación histórica · ${activeHistory.channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'} · ${format(new Date(activeHistory.endedAt), "d MMM yyyy", { locale: es })}` : 'Inicio de la conversación'}
            </span>
          </div>
          
          {messages.map((msg, i) => {
            const isOutbound = msg.direction === 'outbound';
            const isInternal = msg.direction === 'internal';
            
            return (
              <div key={msg.id} className={cn("flex flex-col group/message", (isOutbound || isInternal) ? "items-end" : "items-start")}>
                <div className={cn("flex items-center relative gap-1", isOutbound ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group",
                    isInternal ? "bg-amber-100 text-amber-900 border border-amber-200 rounded-br-sm" :
                    isOutbound ? "bg-slate-900 text-white rounded-br-sm" : "bg-card border rounded-bl-sm"
                  )}>
                    {isInternal && (
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 opacity-60">
                        <i className="ri-lock-line"></i> Nota interna
                      </div>
                    )}

                    {msg.replyToMessage && (
                      <div className={cn(
                        "text-xs p-2 mb-2 rounded-lg border-l-2 opacity-80 cursor-pointer overflow-hidden",
                        isOutbound ? "bg-white/10 border-white/40" : "bg-muted border-primary/40"
                      )}>
                        <p className="font-semibold truncate text-[11px] mb-0.5">
                          {msg.replyToMessage.direction === 'outbound' ? 'Tú' : conversation.contactName}
                        </p>
                        <p className="truncate opacity-80">{msg.replyToMessage.text}</p>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                    
                    {/* Reaction simulated */}
                    {msg.reaction && !isHistoryActive && (
                      <div className="absolute -bottom-2 -right-2 bg-background border px-1.5 py-0.5 rounded-full text-xs shadow-sm">
                        {msg.reaction}
                      </div>
                    )}
                  </div>

                  {/* Actions hover */}
                  {!isInternal && !isHistoryActive && (
                    <div className="opacity-0 group-hover/message:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                        onClick={() => setReplyToMessage(msg)}
                        title="Responder"
                      >
                        <i className="ri-reply-line"></i>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">{formatRelativeTime(msg.createdAt)}</span>
                  {isOutbound && msg.status && (
                    <span className="text-[10px] text-muted-foreground">
                      {msg.status === 'read' ? <i className="ri-check-double-line text-blue-500"></i> :
                       msg.status === 'delivered' ? <i className="ri-check-double-line"></i> :
                       msg.status === 'sent' ? <i className="ri-check-line"></i> :
                       <i className="ri-time-line"></i>}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      <div className="p-4 bg-card border-t shrink-0">
        {isHistoryActive ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 border rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <i className="ri-history-line text-xl"></i>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">Esta es una conversación histórica</p>
                <p className="text-xs text-muted-foreground">No puedes responder desde este hilo. Es de solo lectura.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setActiveChatTab('current')}>
              Volver a actual
            </Button>
          </div>
        ) : isWaExpired ? (
          <div className="flex flex-col items-center justify-center py-6 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
              <i className="ri-error-warning-line text-xl"></i>
            </div>
            <p className="text-sm font-medium text-orange-900 mb-1">La ventana de WhatsApp expiró</p>
            <p className="text-xs text-orange-700 mb-4 max-w-sm text-center">Para contactar a este usuario debes enviar una plantilla aprobada. Podrás escribir mensajes libres cuando el contacto responda.</p>
            <Button onClick={onOpenTemplates}>
              <i className="ri-message-3-line mr-2"></i> Enviar plantilla HSM
            </Button>
          </div>
        ) : (
          <div className={cn("rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all bg-background focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/40", isInternal ? "bg-amber-50/50 border-amber-200 focus-within:ring-amber-200 focus-within:border-amber-300" : "")}>
            {replyToMessage && (
              <div className="bg-muted/50 border-b p-2 px-3 flex items-center justify-between">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-primary/80">
                    Respondiendo a {replyToMessage.direction === 'outbound' ? 'Tú' : conversation.contactName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{replyToMessage.text}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full shrink-0" onClick={() => setReplyToMessage(null)}>
                  <i className="ri-close-line"></i>
                </Button>
              </div>
            )}
            
            {isInternal && (
              <div className="bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider py-1 px-3 flex items-center gap-1.5">
                <i className="ri-lock-line"></i> Solo visible para el equipo
              </div>
            )}

            {isFormattingOpen && (
              <div className="flex items-center gap-1 bg-muted/20 border-b px-2 py-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md" onClick={() => applyFormat('*')}>
                        <span className="font-bold font-serif text-[15px]">B</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Negritas</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md" onClick={() => applyFormat('_')}>
                        <span className="italic font-serif text-[15px]">I</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cursiva</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground line-through rounded-md" onClick={() => applyFormat('~')}>
                        <span className="font-serif text-[15px]">S</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Tachado</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <Textarea 
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isInternal ? "Escribe una nota interna..." : `Escribe un mensaje por ${activeChannel === 'whatsapp' ? 'WhatsApp' : 'Instagram'}...`}
              className="border-0 focus-visible:ring-0 shadow-none resize-none min-h-[52px] max-h-[300px] bg-transparent p-3 text-sm pb-1"
            />
            
            <div className="flex items-center justify-between p-2 pt-1 gap-2 bg-transparent">
              {/* Left Action Groups */}
              <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TooltipProvider>
                  
                  {/* Group 1: General insertion */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                        <i className="ri-add-line text-lg"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Adjuntar archivo</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8 rounded-full transition-colors font-serif font-medium", isFormattingOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")} 
                        onClick={() => setIsFormattingOpen(!isFormattingOpen)}>
                        Aa
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isFormattingOpen ? "Ocultar formato" : "Mostrar formato"}</TooltipContent>
                  </Tooltip>

                  <Popover>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-block">
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                              <i className="ri-emoji-sticker-line text-lg"></i>
                            </Button>
                          </PopoverTrigger>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Agregar emoji</TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-fit p-2 border-border shadow-md rounded-xl" align="start">
                      <div className="grid grid-cols-5 gap-2 text-xl">
                        {['😀', '😂', '😍', '🙏', '👍', '🔥', '🎉', '✅', '👋', '💡'].map(emoji => (
                          <button key={emoji} className="hover:bg-muted p-2 rounded-lg transition-colors" onClick={() => applyFormat(emoji, '')}>{emoji}</button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="w-px h-4 bg-border mx-1"></div>

                  {/* Group 2: Media */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                        <i className="ri-image-add-line text-lg"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Adjuntar imagen</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                        <i className="ri-attachment-2 text-lg"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Adjuntar documento</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                        <i className="ri-mic-line text-lg"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Nota de voz</TooltipContent>
                  </Tooltip>

                  <div className="w-px h-4 bg-border mx-1"></div>

                  {/* Group 3: Intelligence / Special */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-100"
                        onClick={onSuggestAi}
                      >
                        <i className="ri-magic-line text-lg"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sugerir respuesta con IA</TooltipContent>
                  </Tooltip>
                  {activeChannel === 'whatsapp' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                          onClick={onOpenTemplates}
                        >
                          <i className="ri-file-list-line text-lg"></i>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Enviar plantilla HSM</TooltipContent>
                    </Tooltip>
                  )}

                  <div className="w-px h-4 bg-border mx-1 hidden sm:block"></div>

                  {/* Group 4: Internal Note */}
                  <Button 
                    variant={isInternal ? "secondary" : "ghost"} 
                    size="sm" 
                    className={cn("h-8 text-[11px] px-2.5 gap-1.5 rounded-lg transition-all hidden sm:flex font-medium", isInternal ? "bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200" : "text-muted-foreground hover:text-foreground")}
                    onClick={() => setIsInternal(!isInternal)}
                  >
                    <i className={isInternal ? "ri-lock-fill" : "ri-lock-line"}></i>
                    Nota interna
                  </Button>

                  {/* Internal note icon for very small screens */}
                  <Button
                    variant={isInternal ? "secondary" : "ghost"}
                    size="icon"
                    className={cn("h-8 w-8 rounded-full sm:hidden transition-all", isInternal ? "bg-amber-100 text-amber-900 border border-amber-200" : "text-muted-foreground")}
                    onClick={() => setIsInternal(!isInternal)}
                  >
                     <i className={isInternal ? "ri-lock-fill text-lg" : "ri-lock-line text-lg"}></i>
                  </Button>

                </TooltipProvider>
              </div>

              {/* Right Action: Send */}
              <div className="flex items-center shrink-0">
                <Button 
                  size="sm" 
                  className={cn("h-8 rounded-lg shadow-sm transition-all px-3.5", isInternal ? "bg-amber-600 hover:bg-amber-700 text-white" : "", !inputText.trim() && "opacity-50")} 
                  onClick={handleSend} 
                  disabled={!inputText.trim()}
                >
                  <span className="font-medium">{isInternal ? 'Guardar nota' : 'Enviar'}</span> <i className="ri-send-plane-fill ml-1.5"></i>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

