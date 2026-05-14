import * as React from "react";
import { AssignmentRule } from "../../../types/admin";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AssignmentRulesTableProps {
  rules: AssignmentRule[];
  setRules: React.Dispatch<React.SetStateAction<AssignmentRule[]>>;
}

export function AssignmentRulesTable({ rules, setRules }: AssignmentRulesTableProps) {
  
  const handleToggle = (id: string, active: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active } : r));
    toast.success(`Regla ${active ? 'activada' : 'desactivada'}`);
  };

  const handleDuplicate = (rule: AssignmentRule) => {
    const duplicate: AssignmentRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      name: `${rule.name} copia`,
      active: false,
      lastRunAt: "Nunca"
    };
    setRules(prev => [...prev, duplicate]);
    toast.success("Regla duplicada");
  };

  const handleDelete = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success("Regla eliminada");
  };

  const getPriorityBadge = (p: string) => {
    if (p === 'high') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-medium">Alta</Badge>;
    if (p === 'medium') return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-medium">Media</Badge>;
    return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-medium">Baja</Badge>;
  };

  const getTypeIcon = (t: string) => {
    switch(t) {
      case 'round_robin': return 'ri-loop-right-line';
      case 'least_load': return 'ri-scales-3-line';
      case 'team_based': return 'ri-team-line';
      case 'skills_based': return 'ri-star-smile-line';
      case 'priority_based': return 'ri-vip-diamond-line';
      case 'sla_based': return 'ri-timer-flash-line';
      case 'channel_based': return 'ri-share-line';
      case 'business_hours': return 'ri-time-line';
      case 'sticky_owner': return 'ri-user-follow-line';
      case 'overflow_fallback': return 'ri-error-warning-line';
      default: return 'ri-flow-chart';
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden w-full shadow-sm">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-neutral-200 text-[11px] font-semibold text-muted-foreground bg-white uppercase tracking-wider">
        <div className="col-span-1 text-center">Prioridad</div>
        <div className="col-span-3">Regla</div>
        <div className="col-span-3">Cuándo se aplica</div>
        <div className="col-span-2">Destino</div>
        <div className="col-span-1 text-center">Estado</div>
        <div className="col-span-1 text-center">Última ejecución</div>
        <div className="col-span-1 text-right">Acciones</div>
      </div>
      <div className="divide-y relative">
        <div className="absolute left-[8.333%] top-0 bottom-0 w-px bg-neutral-100 -z-10"></div>
        {rules.sort((a,b) => a.order - b.order).map((rule, idx) => (
          <div key={rule.id} className={`grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-100 items-center transition-colors text-sm bg-white ${!rule.active ? 'opacity-60' : 'hover:bg-neutral-50/70'}`}>
            <div className="col-span-1 flex justify-center">
              {getPriorityBadge(rule.priority)}
            </div>
            
            <div className="col-span-3 pr-2">
               <div className="flex items-center gap-2 mb-1">
                 <i className={`${getTypeIcon(rule.type)} text-muted-foreground`}></i>
                 <div className="font-medium text-foreground truncate" title={rule.name}>{rule.name}</div>
               </div>
               {rule.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1">{rule.description}</div>
               )}
            </div>
            
            <div className="col-span-3 text-xs pr-2">
               {rule.appliesWhenLabel ? (
                 <span className="text-muted-foreground">{rule.appliesWhenLabel}</span>
               ) : (
                 <span className="text-muted-foreground italic">Todas (Fallback / Global)</span>
               )}
            </div>

            <div className="col-span-2">
               <div className="text-sm font-medium max-w-full text-foreground truncate mb-1">
                  {rule.assignmentMethodLabel || 'Personalizado'}
               </div>
               <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-medium max-w-full">
                  <span className="truncate">{rule.destinationLabel || rule.destination.name}</span>
               </div>
            </div>

            <div className="col-span-1 flex justify-center">
               <Switch checked={rule.active} onCheckedChange={(v) => handleToggle(rule.id, v)} />
            </div>

            <div className="col-span-1 text-xs text-muted-foreground text-center truncate">
               {rule.lastRunAt}
            </div>

            <div className="col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <i className="ri-more-2-fill"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => toast("Editar", { description: "Pronto disponible"})}>
                     <i className="ri-pencil-line mr-2"></i> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(rule)}>
                     <i className="ri-file-copy-line mr-2"></i> Duplicar
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1"></div>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                     if(window.confirm("¿Seguro que deseas eliminar esta regla?")) handleDelete(rule.id);
                  }}>
                     <i className="ri-delete-bin-line mr-2"></i> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
