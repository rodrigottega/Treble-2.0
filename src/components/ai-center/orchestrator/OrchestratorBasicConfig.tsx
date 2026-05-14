import * as React from "react";
import { OrchestratorConfig, ResponseLength, AgentTone, InitiativeLevel } from "@/types/aiCenter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OrchestratorBasicConfigProps {
  config: OrchestratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<OrchestratorConfig>>;
}

export function OrchestratorBasicConfig({ config, setConfig }: OrchestratorBasicConfigProps) {
  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b bg-muted/20">
        <h2 className="text-lg font-semibold">Configuración básica</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Define cómo debe comunicarse el agente en las conversaciones.</p>
      </div>
      
      <div className="p-6 grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-3">
            <Label className="text-base">Longitud de respuesta</Label>
            <p className="text-xs text-muted-foreground mb-2">Controla qué tan extensas deben ser las respuestas del agente.</p>
            <div className="flex bg-muted/50 p-1 rounded-lg border">
              {(["Breve", "Normal", "Detallada"] as ResponseLength[]).map(r => (
                <button
                  key={r}
                  onClick={() => setConfig(prev => ({ ...prev, responseLength: r }))}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${config.responseLength === r ? 'bg-background shadow-sm border border-border/50 text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Nivel de iniciativa</Label>
            <p className="text-xs text-muted-foreground mb-2">
              {config.initiativeLevel === "Conservador" ? "Responde solo lo necesario." :
               config.initiativeLevel === "Balanceado" ? "Responde y sugiere próximos pasos cuando sea útil." :
               "Propone acciones y avanza la conversación cuando detecta intención."}
            </p>
            <div className="flex bg-muted/50 p-1 rounded-lg border">
              {(["Conservador", "Balanceado", "Proactivo"] as InitiativeLevel[]).map(r => (
                <button
                  key={r}
                  onClick={() => setConfig(prev => ({ ...prev, initiativeLevel: r }))}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${config.initiativeLevel === r ? 'bg-background shadow-sm border border-border/50 text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Tono</Label>
            <p className="text-xs text-muted-foreground mb-2">Define el estilo de comunicación que usará el agente al responder.</p>
            <Select value={config.tone} onValueChange={(v: AgentTone) => setConfig(prev => ({ ...prev, tone: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cercano">Cercano</SelectItem>
                <SelectItem value="Profesional">Profesional</SelectItem>
                <SelectItem value="Directo">Directo</SelectItem>
                <SelectItem value="Empático">Empático</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Idioma principal</Label>
            <p className="text-xs text-muted-foreground mb-2">El agente priorizará este idioma, salvo que detecte otro idioma en la conversación.</p>
            <Select value={config.language} onValueChange={(v) => setConfig(prev => ({ ...prev, language: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Español">Español</SelectItem>
                <SelectItem value="Inglés">Inglés</SelectItem>
                <SelectItem value="Portugués">Portugués</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Pedir confirmación antes de enviar recursos</Label>
              <p className="text-xs text-muted-foreground mt-1">Si está activo, el agente sugerirá el recurso (ej. un PDF) y esperará que el usuario lo pida antes de enviarlo, en lugar de enviarlo automáticamente.</p>
            </div>
            <Switch 
              checked={config.confirmBeforeSendingAssets} 
              onCheckedChange={v => setConfig(prev => ({ ...prev, confirmBeforeSendingAssets: v }))} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Permitir respuestas fuera de horario</Label>
              <p className="text-xs text-muted-foreground mt-1">Si está activo, la IA puede responder cuando el equipo humano esté fuera de horario comercial.</p>
            </div>
            <Switch 
              checked={config.respondOutsideBusinessHours} 
              onCheckedChange={v => setConfig(prev => ({ ...prev, respondOutsideBusinessHours: v }))} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
