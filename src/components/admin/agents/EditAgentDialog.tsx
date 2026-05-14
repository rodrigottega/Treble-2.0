import * as React from "react";
import { AdminTeam, AdminAgent, AgentStatus } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface EditAgentDialogProps {
  agent: AdminAgent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: AdminTeam[];
  onSave: (agent: AdminAgent) => void;
}

export function EditAgentDialog({ agent, open, onOpenChange, teams, onSave }: EditAgentDialogProps) {
  const [name, setName] = React.useState(agent.name);
  const [email, setEmail] = React.useState(agent.email);
  const [role, setRole] = React.useState(agent.role);
  const [teamId, setTeamId] = React.useState(agent.teamId || "");
  const [status, setStatus] = React.useState<AgentStatus>(agent.status);
  const [autoAssign, setAutoAssign] = React.useState(agent.availableForAutoAssignment);

  React.useEffect(() => {
    if (open) {
      setName(agent.name);
      setEmail(agent.email);
      setRole(agent.role);
      setTeamId(agent.teamId || "");
      setStatus(agent.status);
      setAutoAssign(agent.availableForAutoAssignment);
    }
  }, [open, agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !teamId) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const updatedAgent: AdminAgent = {
      ...agent,
      name,
      initials,
      email,
      role,
      status,
      teamId,
      teamName: team.name,
      availableForAutoAssignment: autoAssign,
    };

    onSave(updatedAgent);
    toast.success("Agente actualizado exitosamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar agente</DialogTitle>
            <DialogDescription>
              Modifica la información y estado operativo de este agente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-agent-name">Nombre completo *</Label>
              <Input 
                id="edit-agent-name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-agent-email">Correo electrónico *</Label>
              <Input 
                id="edit-agent-email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rol *</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agente de soporte">Agente de soporte</SelectItem>
                    <SelectItem value="Ejecutiva comercial">Ejecutiva comercial</SelectItem>
                    <SelectItem value="Especialista de onboarding">Especialista de onboarding</SelectItem>
                    <SelectItem value="Finanzas / pagos">Finanzas / pagos</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipo *</Label>
                <Select value={teamId} onValueChange={setTeamId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado operativo</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AgentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Asignación automática</Label>
                <p className="text-xs text-muted-foreground">Permitir recibir nuevas asignaciones automáticas.</p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} disabled={status === 'inactive'} />
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
