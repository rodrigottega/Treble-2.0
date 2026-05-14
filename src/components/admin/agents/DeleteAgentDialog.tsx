import * as React from "react";
import { AdminAgent } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DeleteAgentDialogProps {
  agent: AdminAgent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: AdminAgent[];
  onConfirm: () => void;
}

export function DeleteAgentDialog({ agent, open, onOpenChange, agents, onConfirm }: DeleteAgentDialogProps) {
  const [reassignTo, setReassignTo] = React.useState<string>("unassigned");

  const hasOpenConversations = agent.assignedOpenConversations > 0;
  
  const handleConfirm = () => {
    // Si quisieramos manejar lógica interna, acá se haría el cambio en DB.
    toast.success("Agente eliminado exitosamente", {
      description: hasOpenConversations 
        ? `Conversaciones transferidas ${reassignTo === 'unassigned' ? 'a la cola Sin Asignar' : 'al agente seleccionado'}.`
        : undefined
    });
    onConfirm();
  };

  const otherAgents = agents.filter(a => a.id !== agent.id && a.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Eliminar agente</DialogTitle>
          <DialogDescription>
             Estás a punto de eliminar a <strong>{agent.name}</strong>. Este agente dejará de aparecer en Admin y no recibirá nuevas asignaciones. Las conversaciones históricas se conservarán.
          </DialogDescription>
        </DialogHeader>

        {hasOpenConversations && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 my-2">
            <div className="flex gap-2 text-amber-800 mb-2">
              <i className="ri-error-warning-line text-lg shrink-0"></i>
              <div className="text-sm font-medium">
                Este agente tiene <strong>{agent.assignedOpenConversations}</strong> conversaciones abiertas.
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label className="text-amber-900">Reasignar conversaciones a:</Label>
              <Select value={reassignTo} onValueChange={setReassignTo}>
                <SelectTrigger className="bg-white border-amber-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Dejar sin asignar (Cola general)</SelectItem>
                  {otherAgents.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.teamName})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar agente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
