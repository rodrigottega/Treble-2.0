import * as React from "react";
import { AdminTeam, AdminAgent } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (team: AdminTeam) => void;
  agents: AdminAgent[];
}

export function CreateTeamDialog({ open, onOpenChange, onCreate, agents }: CreateTeamDialogProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [autoAssign, setAutoAssign] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setAutoAssign(true);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("El nombre es requerido");
      return;
    }

    const newTeam: AdminTeam = {
      id: `team_${Date.now()}`,
      name,
      description,
      color: "bg-slate-100 text-slate-700",
      memberIds: [],
      activeAgents: 0,
      openConversations: 0,
      associatedRules: 0,
      availableForAutoAssignment: autoAssign,
      createdAt: new Date().toISOString(),
      lastActivityAt: "Recién creado"
    };

    onCreate(newTeam);
    toast.success("Equipo creado exitosamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear equipo</DialogTitle>
            <DialogDescription>
              Crea un nuevo equipo para organizar a tus agentes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nombre del equipo *</Label>
              <Input 
                id="team-name" 
                placeholder="Ej: Ventas Empresas" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-desc">Descripción (opcional)</Label>
              <Textarea 
                id="team-desc" 
                placeholder="Propósito del equipo..." 
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
            <Button type="submit">Crear equipo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
