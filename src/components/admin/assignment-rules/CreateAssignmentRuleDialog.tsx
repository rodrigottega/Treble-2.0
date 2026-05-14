import * as React from "react";
import { AssignmentRule, AdminTeam, AdminAgent } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CreateAssignmentRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (rule: AssignmentRule) => void;
  teams: AdminTeam[];
  agents: AdminAgent[];
}

export function CreateAssignmentRuleDialog({ open, onOpenChange, onCreate, teams, agents }: CreateAssignmentRuleDialogProps) {
  const [tab, setTab] = React.useState("basic");

  // Basic Info
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<"high"|"medium"|"low">("medium");
  const [isActive, setIsActive] = React.useState(true);

  // Conditions
  const [conditionField, setConditionField] = React.useState("");
  const [conditionOperator, setConditionOperator] = React.useState("equals");
  const [conditionValue, setConditionValue] = React.useState("");
  const [conditions, setConditions] = React.useState<{field:string, operator:string, value:string}[]>([]);

  // Assignment
  const [assignType, setAssignType] = React.useState("");
  const [destType, setDestType] = React.useState<"team"|"agent"|"queue">("team");
  const [destId, setDestId] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTab("basic");
      setName("");
      setDescription("");
      setPriority("medium");
      setIsActive(true);
      setConditionField("");
      setConditionOperator("equals");
      setConditionValue("");
      setConditions([]);
      setAssignType("");
      setDestType("team");
      setDestId("");
    }
  }, [open]);

  const handleAddCondition = () => {
    if (!conditionField || !conditionValue) return;
    setConditions(prev => [...prev, { field: conditionField, operator: conditionOperator, value: conditionValue }]);
    setConditionField("");
    setConditionValue("");
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !assignType || !destId) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    let destName = destId;
    if (destType === 'team') {
      destName = teams.find(t => t.id === destId)?.name || destId;
    } else if (destType === 'agent') {
      destName = agents.find(a => a.id === destId)?.name || destId;
    } else {
      destName = "Cola general";
    }

    const methodLabel = assignType === 'round_robin' ? 'Round robin' : assignType === 'least_load' ? 'Menor carga disponible' : 'Por equipo';
    
    let appliesLabel = "Cuando ";
    if (conditions.length === 0) appliesLabel += "alguna nueva conversación llegue.";
    else {
       appliesLabel += conditions.map(c => `el campo ${c.field} sea ${c.value}`).join(' y ');
    }

    const newRule: AssignmentRule = {
      id: `rule_${Date.now()}`,
      name,
      description,
      priority,
      order: 10,
      active: isActive,
      type: assignType,
      appliesWhenLabel: appliesLabel,
      assignmentMethodLabel: methodLabel,
      destinationLabel: destName,
      conditions: conditions.map(c => ({
        field: c.field,
        operator: c.operator as any,
        value: c.value
      })),
      destination: {
        type: destType,
        id: destId,
        name: destName
      },
      lastRunAt: "Nunca"
    };

    onCreate(newRule);
    toast.success("Regla creada exitosamente");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle>Crear regla de asignación</DialogTitle>
          <DialogDescription>
            Define cómo se evalúan y asignan las nuevas conversaciones.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col mt-2">
          <TabsList className="grid w-full grid-cols-4 flex-none">
            <TabsTrigger value="basic">1. Básica</TabsTrigger>
            <TabsTrigger value="conditions">2. Condiciones</TabsTrigger>
            <TabsTrigger value="assignment">3. Asignación</TabsTrigger>
            <TabsTrigger value="preview">4. Resumen</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-1 py-4">
            <TabsContent value="basic" className="m-0 space-y-5">
              <div className="space-y-2">
                <Label>Nombre de la regla *</Label>
                <Input placeholder="Ej: Soporte VIP, Ventas B2B..." value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea placeholder="Explica el propósito de esta regla..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={priority} onValueChange={(v:any) => setPriority(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta (Se evalúa primero)</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja (Fallback)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="space-y-0.5">
                    <Label>Activa</Label>
                    <p className="text-xs text-muted-foreground">La regla funcionará de inmediato</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => setTab("conditions")}>Siguiente: Condiciones</Button>
            </TabsContent>

            <TabsContent value="conditions" className="m-0 space-y-5">
              <div className="bg-neutral-50/50 border rounded-xl p-4 space-y-4">
                <h3 className="font-medium text-sm">Agregar condición</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Campo evaluado</Label>
                    <Select value={conditionField} onValueChange={setConditionField}>
                      <SelectTrigger><SelectValue placeholder="Selecciona..."/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="channel">Canal de origen</SelectItem>
                        <SelectItem value="funnelStage">Etapa del funnel</SelectItem>
                        <SelectItem value="topic">Tema detectado (IA)</SelectItem>
                        <SelectItem value="tag">Etiqueta del contacto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Operador</Label>
                    <Select value={conditionOperator} onValueChange={setConditionOperator}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Es igual a</SelectItem>
                        <SelectItem value="not_equals">No es igual a</SelectItem>
                        <SelectItem value="contains">Contiene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Valor</Label>
                    <Input placeholder="Ej: whatsapp, reclamos..." value={conditionValue} onChange={e => setConditionValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCondition()} />
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleAddCondition} disabled={!conditionField || !conditionValue}>
                  <i className="ri-add-line mr-1"></i> Agregar condición
                </Button>
              </div>

              {conditions.length > 0 ? (
                <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-neutral-50 px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase border-b border-neutral-200">Condiciones activas (Y)</div>
                  <div className="divide-y divide-neutral-100">
                    {conditions.map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2.5 text-sm bg-white">
                        <div className="flex items-center gap-2">
                          <span className="font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs">{c.field}</span>
                          <span className="text-muted-foreground italic text-xs">{c.operator === 'equals' ? 'es igual a' : c.operator === 'contains' ? 'contiene' : 'no es igual a'}</span>
                          <span className="font-medium bg-primary/10 text-primary-foreground text-primary border border-primary/20 px-1.5 py-0.5 rounded text-xs">{c.value}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveCondition(i)}>
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
                  No hay condiciones. La regla aplicará a TODAS las conversaciones (Fallback).
                </div>
              )}
              <Button className="w-full mt-4" onClick={() => setTab("assignment")}>Siguiente: Asignación</Button>
            </TabsContent>

            <TabsContent value="assignment" className="m-0 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Método de asignación *</Label>
                  <Select value={assignType} onValueChange={setAssignType}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un método" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin (Turnos equitativos)</SelectItem>
                      <SelectItem value="least_load">Menor carga de trabajo</SelectItem>
                      <SelectItem value="team_based">Enviar directo al equipo (Sin asignar)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">El método define qué agente recibirá la conversación dentro del destino elegido.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Destino: ¿Equipo o Agente?</Label>
                    <Select value={destType} onValueChange={(v:any) => { setDestType(v); setDestId(""); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team">Un equipo específico</SelectItem>
                        <SelectItem value="agent">Un agente específico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Selecciona el destino *</Label>
                    <Select value={destId} onValueChange={setDestId}>
                      <SelectTrigger><SelectValue placeholder="Elige..." /></SelectTrigger>
                      <SelectContent>
                        {destType === 'team' && teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        {destType === 'agent' && agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => setTab("preview")}>Siguiente: Resumen</Button>
            </TabsContent>

            <TabsContent value="preview" className="m-0 space-y-5">
              <div className="bg-slate-50 border rounded-lg p-5 space-y-4">
                <h3 className="font-semibold text-base text-foreground mb-4">Resumen en lenguaje natural</h3>
                
                <div className="space-y-2 text-sm leading-relaxed">
                  <p>
                    <strong className="text-primary mr-1">Cuándo:</strong> 
                    {conditions.length === 0 ? "Entre CUALQUIER conversación nueva," : "Entre una conversación nueva que cumpla las siguientes condiciones:"}
                  </p>
                  
                  {conditions.length > 0 && (
                     <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                       {conditions.map((c, i) => (
                         <li key={i}>
                           El campo <span className="font-medium text-foreground">{c.field}</span> {c.operator === 'equals' ? 'es igual a' : c.operator === 'contains' ? 'contiene' : 'no es igual a'} <span className="font-medium text-foreground">"{c.value}"</span>
                         </li>
                       ))}
                     </ul>
                  )}

                  <p className="mt-4 pt-2 border-t">
                    <strong className="text-primary mr-1">Entonces:</strong> 
                    Asignar usando <span className="font-medium text-foreground underline decoration-primary/30 decoration-2 underline-offset-2">{assignType === 'round_robin' ? 'Round Robin' : assignType === 'least_load' ? 'Mínima Carga' : assignType === 'team_based' ? 'Disponibilidad de Equipo' : '...'}</span> al destino: 
                    <span className="font-medium text-foreground ml-1">
                      {destType === 'team' ? teams.find(t=>t.id===destId)?.name || 'Selecciona un equipo' : agents.find(a=>a.id===destId)?.name || 'Selecciona un agente'}
                    </span>
                  </p>
                </div>
              </div>

            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-none pt-4 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!name || !assignType || !destId || tab !== 'preview'}>Crear regla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
