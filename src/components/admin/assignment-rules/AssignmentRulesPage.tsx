import * as React from "react";
import { AssignmentRule, AdminAgent, AdminTeam } from "../../../types/admin";
import { AssignmentRulesTable } from "./AssignmentRulesTable";
import { CreateAssignmentRuleDialog } from "./CreateAssignmentRuleDialog";
import { AssignmentSimulator } from "./AssignmentSimulator";

interface AssignmentRulesPageProps {
  rules: AssignmentRule[];
  setRules: React.Dispatch<React.SetStateAction<AssignmentRule[]>>;
  agents: AdminAgent[];
  teams: AdminTeam[];
}

export function AssignmentRulesPage({ rules, setRules, agents, teams }: AssignmentRulesPageProps) {
  const [isSimulatorOpen, setIsSimulatorOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const activeRulesCount = rules.filter(r => r.active).length;

  return (
    <div className="flex flex-col h-full bg-neutral-50 relative overflow-y-auto">
      <div className="flex-none p-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reglas de asignación</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              Define cómo se distribuyen las conversaciones nuevas entre agentes y equipos.
            </p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-neutral-200 bg-white hover:bg-neutral-50 h-10 px-4 py-2 shadow-sm"
              >
                <i className="ri-flask-line mr-2"></i>
                Probar asignación
             </button>
             <button 
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
              >
                <i className="ri-add-line mr-2"></i>
                Crear regla
             </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Reglas activas</div>
            <div className="text-3xl font-semibold">{activeRulesCount}</div>
          </div>
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Asignadas hoy</div>
            <div className="text-3xl font-semibold">142</div>
          </div>
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Sin asignar</div>
            <div className="text-3xl font-semibold text-amber-600">3</div>
          </div>
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Tiempo promedio asignación</div>
            <div className="text-3xl font-semibold">12s</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <AssignmentRulesTable 
           rules={rules} 
           setRules={setRules}
        />
      </div>

      {isSimulatorOpen && (
        <AssignmentSimulator 
          open={isSimulatorOpen} 
          onOpenChange={setIsSimulatorOpen} 
          rules={rules} 
        />
      )}

      {isCreateOpen && (
        <CreateAssignmentRuleDialog 
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onCreate={(r) => { setRules(prev => [...prev, r]); setIsCreateOpen(false); }}
          agents={agents}
          teams={teams}
        />
      )}

    </div>
  );
}
