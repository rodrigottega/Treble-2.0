import * as React from "react";
import { HumanHandoffRule } from "@/types/aiCenter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HumanHandoffRulesCardProps {
  rules: HumanHandoffRule[];
  setRules: React.Dispatch<React.SetStateAction<HumanHandoffRule[]>>;
}

export function HumanHandoffRulesCard({ rules, setRules }: HumanHandoffRulesCardProps) {

  const toggleRule = (id: string, current: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !current } : r));
    toast(current ? "Regla de transferencia desactivada" : "Regla de transferencia activada");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Media': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Baja': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b bg-muted/20 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Reglas de transferencia humana
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Define cuándo el agente IA debe detenerse y transferir la conversación a un humano.</p>
        </div>
        <Button size="sm" onClick={() => toast("Funcionalidad de crear regla mockeada")}>
          <i className="ri-add-line mr-2"></i> Agregar regla
        </Button>
      </div>

      <div className="p-0">
        <div className="divide-y">
          {rules.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No hay reglas de transferencia.</div>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className={`p-4 flex items-start justify-between hover:bg-muted/30 transition-colors ${!rule.active ? 'opacity-60 saturate-50 gap-4' : 'gap-4'}`}>
                
                <div className="mt-1 w-8 flex justify-center shrink-0">
                   <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <i className="ri-user-shared-line text-xs text-muted-foreground"></i>
                   </div>
                </div>

                <div className="flex-1 pr-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{rule.name}</h4>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getPriorityColor(rule.priority)}`}>
                      Prioridad {rule.priority}
                    </Badge>
                    {rule.baseRule && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Base</Badge>}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{rule.description}</p>
                  
                  {rule.messageBeforeTransfer && rule.active && (
                    <div className="bg-muted p-2 rounded text-xs border relative group">
                       <span className="absolute -top-2 left-2 bg-muted px-1 text-[9px] text-muted-foreground tracking-wider uppercase">Mensaje previo</span>
                       <span className="italic text-muted-foreground select-none">"{rule.messageBeforeTransfer}"</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 mt-1">
                  <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id, rule.active)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Editar mockeado")}>
                    <i className="ri-pencil-line"></i>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
