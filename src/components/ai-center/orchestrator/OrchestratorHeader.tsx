import * as React from "react";
import { OrchestratorConfig, AiAsset, SubAgent, RoutingRule, HumanHandoffRule } from "@/types/aiCenter";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface OrchestratorHeaderProps {
  config: OrchestratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<OrchestratorConfig>>;
}

export function OrchestratorHeader({ config, setConfig }: OrchestratorHeaderProps) {
  const [showConfirmDisable, setShowConfirmDisable] = React.useState(false);

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      setShowConfirmDisable(true);
    } else {
      setConfig(prev => ({ ...prev, active: true }));
      toast.success("Agente orquestador activado");
    }
  };

  const confirmDisable = () => {
    setConfig(prev => ({ ...prev, active: false }));
    setShowConfirmDisable(false);
    toast("Agente orquestador desactivado", { description: "La IA dejará de responder automáticamente." });
  };

  const handleSave = () => {
    toast.success("Configuración guardada", { description: "Los cambios han sido aplicados al agente." });
  };

  const scrollToPlayground = () => {
    document.getElementById("orchestrator-playground")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 px-8 border-b bg-background sticky top-0 z-10 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Agente orquestador</h1>
            <Badge variant={config.active ? "default" : "secondary"}>
              {config.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Configura cómo la IA coordina conversaciones, decide cuándo usar sub-agentes y cuándo transferir a un humano.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 mr-4 bg-muted/50 p-2 rounded-lg border">
            <Switch checked={config.active} onCheckedChange={handleToggle} id="toggle-orch"/>
            <label htmlFor="toggle-orch" className="text-sm font-medium cursor-pointer">
              {config.active ? "Desactivar" : "Activar"}
            </label>
          </div>

          <Button variant="outline" onClick={scrollToPlayground}>
            Probar agente
          </Button>
          <Button onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </div>

      <Dialog open={showConfirmDisable} onOpenChange={setShowConfirmDisable}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desactivar agente orquestador</DialogTitle>
            <DialogDescription>
              La IA dejará de tomar conversaciones automáticamente. Los agentes humanos podrán seguir respondiendo desde Inbox. ¿Estás seguro?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDisable(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDisable}>Desactivar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
