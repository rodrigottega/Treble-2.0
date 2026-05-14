import * as React from "react";
import { SubAgent, KnowledgeBase, AiAsset } from "@/types/aiCenter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SubAgentConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: SubAgent | null;
  knowledgeBases: KnowledgeBase[];
  assets: AiAsset[];
  onSave: (updatedAgent: SubAgent) => void;
  onActivate: (id: string) => void;
  onPause: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SubAgentConfigSheet({
  open,
  onOpenChange,
  agent,
  knowledgeBases,
  assets,
  onSave,
  onActivate,
  onPause,
  onRemove
}: SubAgentConfigSheetProps) {
  
  const [localAgent, setLocalAgent] = React.useState<SubAgent | null>(null);

  React.useEffect(() => {
    if (agent && open) {
      setLocalAgent(JSON.parse(JSON.stringify(agent)));
    }
  }, [agent, open]);

  if (!localAgent) return null;

  const handleSave = () => {
    onSave(localAgent);
    onOpenChange(false);
  };

  const toggleKB = (id: string) => {
    setLocalAgent(prev => {
      if (!prev) return prev;
      const kbs = prev.knowledgeBaseIds.includes(id) 
        ? prev.knowledgeBaseIds.filter(k => k !== id)
        : [...prev.knowledgeBaseIds, id];
      return { ...prev, knowledgeBaseIds: kbs };
    });
  };

  const toggleAsset = (id: string) => {
    setLocalAgent(prev => {
      if (!prev) return prev;
      const ast = prev.assetIds.includes(id) 
        ? prev.assetIds.filter(k => k !== id)
        : [...prev.assetIds, id];
      return { ...prev, assetIds: ast };
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto w-full p-0 flex flex-col">
        <div className="p-6 border-b shrink-0 bg-background sticky top-0 z-10 shadow-sm">
          <SheetHeader className="text-left flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <SheetTitle className="text-2xl">{localAgent.name}</SheetTitle>
                <Badge variant={localAgent.status === 'active' ? 'default' : localAgent.status === 'paused' ? 'secondary' : 'outline'}>
                  {localAgent.status === 'active' ? 'Activo' : localAgent.status === 'paused' ? 'Pausado' : 'Disponible'}
                </Badge>
              </div>
              <SheetDescription className="text-sm mt-1">{localAgent.description}</SheetDescription>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-3xl shrink-0">
               <i className="ri-robot-2-line"></i>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 p-6 space-y-8 bg-muted/10">

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Habilidades</h3>
            <div className="flex flex-col gap-2">
              {localAgent.skills.map((skill, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-background p-2 px-3 border rounded-md shadow-sm">
                   <i className="ri-check-line text-primary mt-0.5"></i>
                   <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Regla de asignación</h3>
             <div className="bg-background p-5 border rounded-xl shadow-sm space-y-4">
                <p className="text-xs text-muted-foreground">Instrucción para el orquestador: ¿En qué momento específico debe intervenir este sub-agente?</p>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={localAgent.routingDescription || ""}
                  onChange={e => setLocalAgent({ ...localAgent, routingDescription: e.target.value })}
                  placeholder="Ej. Entrar cuando el contacto pregunte por precios o suscripciones."
                />
             </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bases de conocimiento asociadas</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Fuentes de las que el agente puede sacar información.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast("Crear KB mockeado")}>Crear KB</Button>
            </div>
            
            <div className="bg-background border rounded-xl overflow-hidden shadow-sm divide-y">
              {knowledgeBases.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No hay bases de conocimiento disponibles.</div>
              ) : (
                knowledgeBases.map(kb => {
                  const isLinked = localAgent.knowledgeBaseIds.includes(kb.id);
                  return (
                    <div key={kb.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${isLinked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                           <i className="ri-book-3-line"></i>
                         </div>
                         <div>
                           <div className="font-medium text-sm">{kb.name}</div>
                           <div className="text-[10px] text-muted-foreground">{kb.sourceIds.length} fuentes indexadas</div>
                         </div>
                      </div>
                      <Switch checked={isLinked} onCheckedChange={() => toggleKB(kb.id)} />
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recursos permitidos</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Archivos que este sub-agente tiene permitido enviar al contacto.</p>
              </div>
            </div>
            
            <div className="bg-background border rounded-xl overflow-hidden shadow-sm divide-y">
              {assets.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No hay recursos disponibles.</div>
              ) : (
                assets.map(asset => {
                  const isLinked = localAgent.assetIds.includes(asset.id);
                  return (
                    <div key={asset.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                         <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${isLinked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                           <i className="ri-file-3-line"></i>
                         </div>
                         <div className="min-w-0">
                           <div className="font-medium text-sm truncate">{asset.name}</div>
                           <div className="text-[10px] text-muted-foreground uppercase">{asset.type}</div>
                         </div>
                      </div>
                      <Switch checked={isLinked} onCheckedChange={() => toggleAsset(asset.id)} />
                    </div>
                  );
                })
              )}
              <div className="p-3 bg-muted/10 text-xs text-muted-foreground text-center">
                 Si no seleccionas recursos, el agente solo podrá sugerir respuestas en texto.
              </div>
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Límites</h3>
             <div className="bg-background border rounded-xl shadow-sm p-2">
               <div className="flex justify-between items-center p-3 border-b border-dashed">
                 <Label className="font-medium text-sm">No responder fuera de su especialidad</Label>
                 <Switch defaultChecked />
               </div>
               <div className="flex justify-between items-center p-3">
                 <Label className="font-medium text-sm">Transferir a humano si no está seguro</Label>
                 <Switch defaultChecked />
               </div>
             </div>
          </section>

        </div>

        <div className="p-6 border-t bg-background shrink-0 sticky bottom-0 z-10 flex flex-col gap-3">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>Guardar configuración</Button>
          </div>
          
          <div className="flex items-center justify-center border-t border-dashed pt-3 mt-1 w-full gap-2 text-sm">
             {localAgent.status === "available" ? (
               <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 w-full" onClick={() => { onActivate(localAgent.id); onOpenChange(false); }}>
                 <i className="ri-play-circle-line mr-2"></i> Activar agente en orquestador
               </Button>
             ) : localAgent.status === "active" ? (
               <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 w-full" onClick={() => { onPause(localAgent.id); onOpenChange(false); }}>
                 <i className="ri-pause-circle-line mr-2"></i> Pausar agente
               </Button>
             ) : (
               <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 w-full" onClick={() => { onActivate(localAgent.id); onOpenChange(false); }}>
                 <i className="ri-play-circle-line mr-2"></i> Reanudar agente
               </Button>
             )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
