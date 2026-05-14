import * as React from "react";
import { AdminTeam, AdminAgent, AgentStatus } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: AdminTeam[];
  onCreate: (agent: AdminAgent) => void;
}

export function CreateAgentDialog({ open, onOpenChange, teams, onCreate }: CreateAgentDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [teamId, setTeamId] = React.useState("");
  const [status, setStatus] = React.useState<AgentStatus>("inactive");
  const [autoAssign, setAutoAssign] = React.useState(true);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setRole("");
      setTeamId("");
      setStatus("inactive");
      setAutoAssign(true);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !teamId) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newAgent: AdminAgent = {
      id: `ag_new_${Date.now()}`,
      name,
      initials,
      email,
      role,
      status,
      teamId,
      teamName: team.name,
      assignedOpenConversations: 0,
      pendingConversations: 0,
      lastActivityAt: "Nunca",
      availableForAutoAssignment: autoAssign,
      createdAt: new Date().toISOString()
    };

    onCreate(newAgent);
    toast.success("Agente creado exitosamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear agente</DialogTitle>
            <DialogDescription>
              Agrega un nuevo agente humano para atender conversaciones y recibir asignaciones.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Nombre completo *</Label>
              <Input 
                id="agent-name" 
                placeholder="Ej: Mariana López" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-email">Correo electrónico *</Label>
              <Input 
                id="agent-email" 
                type="email" 
                placeholder="mariana@empresa.com" 
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
              <Label>Estado inicial</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AgentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">Recomendamos crearlo como inactivo hasta que su cuenta esté configurada.</p>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Zonificación automática</Label>
                <p className="text-xs text-muted-foreground">Disponible para recibir chats automáticamente si su estado es Activo.</p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Crear agente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
