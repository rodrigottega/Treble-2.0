import * as React from "react";
import { AdminTeam } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DeleteTeamDialogProps {
  team: AdminTeam;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: AdminTeam[];
  onConfirm: (reassignAgentsToTeamId: string) => void;
}

export function DeleteTeamDialog({ team, open, onOpenChange, teams, onConfirm }: DeleteTeamDialogProps) {
  const [reassignTo, setReassignTo] = React.useState<string>("none");

  const hasAgents = team.memberIds.length > 0;
  const hasRules = team.associatedRules > 0;
  
  const handleConfirm = () => {
    toast.success("Equipo eliminado exitosamente");
    onConfirm(reassignTo);
  };

  const otherTeams = teams.filter(t => t.id !== team.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Eliminar equipo</DialogTitle>
          <DialogDescription>
             Estás a punto de eliminar el equipo <strong>{team.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {hasAgents && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 my-2">
            <div className="flex gap-2 text-amber-800 mb-2">
              <i className="ri-error-warning-line text-lg shrink-0"></i>
              <div className="text-sm font-medium">
                Este equipo tiene <strong>{team.memberIds.length}</strong> agentes. Antes de eliminarlo, selecciona a qué equipo moverlos.
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label className="text-amber-900">Mover agentes a:</Label>
              <Select value={reassignTo} onValueChange={setReassignTo}>
                <SelectTrigger className="bg-white border-amber-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Dejar sin equipo</SelectItem>
                  {otherTeams.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {hasRules && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 my-2 mt-4">
            <div className="flex gap-2 text-destructive mb-1">
              <i className="ri-alert-line text-lg shrink-0"></i>
              <div className="text-sm font-medium">
                Este equipo se usa en <strong>{team.associatedRules}</strong> reglas de asignación. Esas reglas podrían fallar si no las actualizas.
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar equipo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
