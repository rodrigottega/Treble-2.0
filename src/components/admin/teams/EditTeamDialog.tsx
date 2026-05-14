import * as React from "react";
import { AdminTeam, AdminAgent } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditTeamDialogProps {
  team: AdminTeam;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (team: AdminTeam) => void;
  agents: AdminAgent[];
}

export function EditTeamDialog({ team, open, onOpenChange, onSave, agents }: EditTeamDialogProps) {
  const [name, setName] = React.useState(team.name);
  const [description, setDescription] = React.useState(team.description);
  const [autoAssign, setAutoAssign] = React.useState(team.availableForAutoAssignment);

  React.useEffect(() => {
    if (open) {
      setName(team.name);
      setDescription(team.description);
      setAutoAssign(team.availableForAutoAssignment);
    }
  }, [open, team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("El nombre es requerido");
      return;
    }

    const updatedTeam: AdminTeam = {
      ...team,
      name,
      description,
      availableForAutoAssignment: autoAssign,
    };

    onSave(updatedTeam);
    toast.success("Equipo actualizado exitosamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar equipo</DialogTitle>
            <DialogDescription>
              Modifica la información de este equipo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-team-name">Nombre del equipo *</Label>
              <Input 
                id="edit-team-name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-team-desc">Descripción (opcional)</Label>
              <Textarea 
                id="edit-team-desc" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Disponible para asignación automática</Label>
                <p className="text-xs text-muted-foreground">Podrá ser seleccionado en las reglas de enrutamiento.</p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
