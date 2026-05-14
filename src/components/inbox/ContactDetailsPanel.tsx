import * as React from "react";
import { toast } from "sonner";
import { Conversation, Tag, FunnelStage } from "@/types/inbox";
import { Avatar, Separator, Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContactDetailsProps {
  conversation: Conversation | null;
  onUpdateProperty: (key: string, value: string) => void;
  onManageTags: () => void;
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  onChangeFunnelStage: (stage: FunnelStage) => void;
  onOpenHistory: (historyId: string) => void;
}

// Dummy tags for assignment
const AVAILABLE_TAGS: Tag[] = [
  { id: 't1', name: 'Alta intención', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 't2', name: 'Nuevo lead', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 't3', name: 'Beca', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 't4', name: 'Precio', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 't5', name: 'Documentos pendientes', color: 'bg-red-100 text-red-800 border-red-200' },
];

const FUNNEL_STAGES: FunnelStage[] = [
  "Nuevo lead",
  "Contactado",
  "Calificado",
  "No calificado",
  "Aplicación iniciada",
  "Documentos pendientes",
  "Inscripción en proceso",
  "Inscrito",
  "Perdido"
];

export function ContactDetailsPanel({ conversation, onUpdateProperty, onManageTags, onAddTag, onRemoveTag, onChangeFunnelStage, onOpenHistory }: ContactDetailsProps) {
  const [tagSearch, setTagSearch] = React.useState("");
  const [isTagPopoverOpen, setIsTagPopoverOpen] = React.useState(false);

  if (!conversation) return null;

  return (
    <div className="h-full w-full bg-card flex flex-col">
      <Tabs defaultValue="details" className="h-full flex flex-col pt-4">
        <div className="px-6 pb-2 shrink-0">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="details" className="rounded-lg py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">Detalles</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">Historial</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col p-6 pt-2">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
          <Avatar fallback={conversation.avatarInitials} className="h-20 w-20 mb-3 text-2xl" />
          <h2 className="text-xl font-semibold mb-1">{conversation.contactName}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {conversation.channels?.includes('whatsapp') && conversation.channels?.includes('instagram') ? (
              <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full border text-xs">
                WA + IG
              </span>
            ) : conversation.activeChannel === 'whatsapp' || conversation.channel === 'whatsapp' ? (
              <><i className="ri-whatsapp-line text-green-600"></i> WhatsApp</>
            ) : (
              <><i className="ri-instagram-line text-pink-600"></i> Instagram</>
            )}
            <span>•</span>
            <span>{conversation.city}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Basic Info */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Información de contacto</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <i className="ri-phone-line text-muted-foreground w-6"></i>
              <span className="text-foreground">{conversation.phone}</span>
            </div>
            <div className="flex items-center">
              <i className="ri-mail-line text-muted-foreground w-6"></i>
              <span className="text-foreground">{conversation.email}</span>
            </div>
            <div className="flex items-center">
              <i className="ri-global-line text-muted-foreground w-6"></i>
              <span className="text-foreground">Fuente: {conversation.source}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* CRM */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CRM</h4>
            <button 
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              onClick={() => toast("El perfil completo en CRM estará disponible próximamente.")}
            >
              Ver en CRM <i className="ri-arrow-right-up-line"></i>
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-muted-foreground">Programa</span>
              <div className="col-span-2 font-medium text-right truncate cursor-pointer hover:underline" onClick={() => onUpdateProperty('program', 'test')}>
                {conversation.properties.programOfInterest || "-"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-muted-foreground">Modalidad</span>
              <div className="col-span-2 font-medium text-right">{conversation.properties.modality || "-"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-muted-foreground">Intención</span>
              <div className="col-span-2 text-right">
                <Badge variant="outline" className={cn(
                  "font-medium",
                  conversation.leadIntent === 'high' && "bg-green-50 text-green-700 border-green-200",
                  conversation.leadIntent === 'medium' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                )}>
                  {conversation.leadIntent === 'high' ? 'Alta' : conversation.leadIntent === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Etiquetas</h4>
            <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <i className="ri-add-line"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <i className="ri-search-line absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"></i>
                    <Input 
                      placeholder="Buscar o crear etiqueta..." 
                      className="pl-7 h-8 text-xs" 
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                    {AVAILABLE_TAGS.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase())).map(t => {
                      const isAssigned = conversation.tags.some(ct => ct.id === t.id);
                      return (
                        <button
                          key={t.id}
                          className="flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-md text-sm text-left transition-colors"
                          onClick={() => {
                            if (!isAssigned) {
                              onAddTag(t);
                            }
                            setIsTagPopoverOpen(false);
                            setTagSearch("");
                          }}
                          disabled={isAssigned}
                        >
                          <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-sm border", t.color, isAssigned && "opacity-50")}>{t.name}</span>
                          {isAssigned && <i className="ri-check-line text-muted-foreground"></i>}
                        </button>
                      );
                    })}
                    {tagSearch.trim() && !AVAILABLE_TAGS.some(t => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                      <button 
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md text-sm text-left text-primary"
                        onClick={() => {
                          const newTag: Tag = {
                            id: `t_${Date.now()}`,
                            name: tagSearch.trim(),
                            color: 'bg-slate-100 text-slate-800 border-slate-200'
                          };
                          onAddTag(newTag);
                          setIsTagPopoverOpen(false);
                          setTagSearch("");
                        }}
                      >
                        <i className="ri-add-line"></i> Crear "{tagSearch}"
                      </button>
                    )}
                  </div>
                  <Separator />
                  <Button variant="ghost" className="w-full h-8 text-xs justify-start text-muted-foreground" onClick={() => { setIsTagPopoverOpen(false); onManageTags(); }}>
                    <i className="ri-settings-3-line mr-2"></i> Gestionar etiquetas globales
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-2">
            {conversation.tags.map(t => (
              <Badge key={t.id} variant="outline" className={cn("font-medium select-none group pr-1.5 cursor-pointer", t.color)}>
                {t.name}
                <i className="ri-close-line ml-1 opacity-50 group-hover:opacity-100 transition-opacity hover:text-red-700 hover:bg-red-100 rounded-full" onClick={(e) => { e.stopPropagation(); onRemoveTag(t.id); }}></i>
              </Badge>
            ))}
            {conversation.tags.length === 0 && (
              <span className="text-sm text-muted-foreground italic">Sin etiquetas</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Funnel Stage */}
        <div className="flex flex-col py-6">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Etapa del funnel</h4>
          <Select
            value={conversation.funnelStage || ""}
            onValueChange={(val) => {
              if (val) {
                onChangeFunnelStage(val as FunnelStage);
              }
            }}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Seleccionar etapa..." />
            </SelectTrigger>
            <SelectContent>
              {FUNNEL_STAGES.map(stage => (
                <SelectItem key={stage} value={stage}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      stage === "Nuevo lead" ? "bg-slate-400" :
                      stage === "Contactado" ? "bg-blue-400" :
                      stage === "Calificado" ? "bg-green-500" :
                      stage === "No calificado" ? "bg-red-300" :
                      stage === "Aplicación iniciada" ? "bg-blue-500" :
                      stage === "Documentos pendientes" ? "bg-amber-500" :
                      stage === "Inscripción en proceso" ? "bg-violet-500" :
                      stage === "Inscrito" ? "bg-green-600" :
                      "bg-slate-300"
                    )} />
                    {stage}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
          </ScrollArea>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col p-6 pt-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Interacciones pasadas</h4>
              
              {!conversation.historicalConversations || conversation.historicalConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg bg-muted/20">
                  <i className="ri-history-line text-2xl text-muted-foreground mb-2"></i>
                  <p className="text-sm font-medium text-foreground mb-1">No hay conversaciones anteriores para este contacto</p>
                  <p className="text-xs text-muted-foreground">Cuando existan interacciones pasadas por WhatsApp o Instagram, aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversation.historicalConversations.map((hist, i) => (
                    <div key={hist.id} className="bg-background border rounded-xl p-4 hover:border-muted-foreground/20 transition-colors flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <i className={cn(
                            "text-base", 
                            hist.channel === 'whatsapp' ? "ri-whatsapp-line text-green-600" : "ri-instagram-line text-pink-600"
                          )}></i>
                          <span className="text-sm font-medium text-foreground">
                            {format(new Date(hist.endedAt), "d MMM yyyy", { locale: es })}
                          </span>
                        </div>
                        <Badge variant="outline" className={cn(
                          "text-[10px] uppercase font-bold py-0 h-4 border",
                          hist.status === 'resolved' && "bg-blue-50 text-blue-700 border-blue-200",
                          hist.status === 'closed' && "bg-slate-50 text-slate-700 border-slate-200",
                          hist.status === 'open' && "bg-green-50 text-green-700 border-green-200",
                          hist.status === 'expired' && "bg-orange-50 text-orange-700 border-orange-200"
                        )}>
                          {hist.status === 'resolved' ? 'Resuelta' : 
                           hist.status === 'closed' ? 'Cerrada' : 
                           hist.status === 'expired' ? 'WA Expirado' : 'Abierta'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                        {hist.summary}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-fit h-8 text-xs font-medium self-start shadow-none bg-background text-foreground hover:bg-muted"
                        onClick={() => onOpenHistory(hist.id)}
                      >
                        Abrir conversación <i className="ri-arrow-right-line ml-1"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
