import * as React from "react";
import { SubAgent } from "@/types/aiCenter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveSubAgentsCardProps {
  subAgents: SubAgent[];
  onConfigureClick: (agent: SubAgent) => void;
}

export function ActiveSubAgentsCard({ subAgents, onConfigureClick }: ActiveSubAgentsCardProps) {
  const activeAgents = subAgents.filter(a => a.status === "active");

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b bg-muted/20">
        <h2 className="text-lg font-semibold">Sub-agentes activos</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Estos sub-agentes forman parte del equipo del orquestador y están listos para intervenir.</p>
      </div>

      <div className="p-6">
        {activeAgents.length === 0 ? (
          <div className="text-center p-8 border rounded-lg border-dashed">
            <h4 className="font-medium text-sm">No hay sub-agentes activos</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-4">El orquestador responderá todo por sí mismo.</p>
            <Button variant="outline" size="sm">Explorar sub-agentes</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeAgents.map(ag => (
              <div key={ag.id} className="border rounded-lg p-4 flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 text-primary h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <i className="ri-robot-2-line"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm leading-tight">{ag.name}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{ag.category}</span>
                      </div>
                    </div>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Activo</Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ag.description}</p>
                  
                  <div className="bg-muted/40 p-2 rounded text-xs">
                    <span className="font-medium">Regla de entrada: </span>
                    <span className="text-muted-foreground">{ag.routingDescription || "Configuración pendiente"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-end">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onConfigureClick(ag)}>
                    Configurar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
