import * as React from "react";
import { AssignmentRule } from "../../../types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AssignmentSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules: AssignmentRule[];
}

export function AssignmentSimulator({ open, onOpenChange, rules }: AssignmentSimulatorProps) {
  const [channel, setChannel] = React.useState("whatsapp");
  const [funnelStage, setFunnelStage] = React.useState("Nuevo lead");
  const [topic, setTopic] = React.useState("none");
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [result, setResult] = React.useState<{ruleName: string, destination: string, explanation: string} | null>(null);

  React.useEffect(() => {
    if (open) {
      setChannel("whatsapp");
      setFunnelStage("Nuevo lead");
      setTopic("none");
      setResult(null);
    }
  }, [open]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setResult(null);

    setTimeout(() => {
      // Very basic local evaluation match mock
      let matchedRule = rules.find(r => r.active && r.type === 'round_robin');
      if (topic.toLowerCase().includes('pago')) matchedRule = rules.find(r => r.name.includes('Pagos'));
      if (channel === 'instagram') matchedRule = rules.find(r => r.name.includes('Instagram'));
      
      if (!matchedRule) {
        matchedRule = rules.find(r => r.active);
      }

      if (matchedRule) {
        setResult({
          ruleName: matchedRule.name,
          destination: matchedRule.destinationLabel || matchedRule.destination.name,
          explanation: `Se aplicó '${matchedRule.name}' porque el canal es ${channel} y la etapa es ${funnelStage}. La conversación se asignaría al destino ${matchedRule.destinationLabel || matchedRule.destination.name}.`
        });
      } else {
         setResult({
          ruleName: "Ninguna",
          destination: "Cola general",
          explanation: `Ninguna regla coincidió. Será dejada en la bandeja 'Sin asignar'.`
        });
      }

      setIsSimulating(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Probar asignación</DialogTitle>
          <DialogDescription>
            Simula una conversación entrante para comprobar qué regla se aplicaría.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Canal</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Etapa del funnel</Label>
            <Select value={funnelStage} onValueChange={setFunnelStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nuevo lead">Nuevo lead</SelectItem>
                <SelectItem value="Contactado">Contactado</SelectItem>
                <SelectItem value="Calificado">Calificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tema detectado o último mensaje</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Ej: pagos, soporte..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin tema específico</SelectItem>
                <SelectItem value="pagos">Info sobre pagos o facturas</SelectItem>
                <SelectItem value="soporte">Problemas técnicos o acceso</SelectItem>
                <SelectItem value="becas">Aplicar a becas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result && !isSimulating && (
            <div className="mt-4 bg-neutral-50/60 border rounded-xl p-4">
              <div className="flex gap-2">
                 <i className="ri-check-line text-green-600 mt-0.5"></i>
                 <div>
                   <div className="font-medium text-sm">Destino simulado: <span className="font-semibold text-primary">{result.destination}</span></div>
                   <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                     {result.explanation}
                   </p>
                 </div>
              </div>
            </div>
          )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={handleSimulate} disabled={isSimulating}>
            {isSimulating ? "Simulando..." : "Simular"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
