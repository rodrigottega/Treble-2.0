import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, Separator } from "@/components/ui/shared";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Conversation } from "@/types/inbox";
import { cn } from "@/lib/utils";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation | null;
  onTransfer: (targetType: 'agent' | 'team' | 'ai', targetId: string, targetName: string, reason: string, note: string) => void;
}

const DUMMY_AGENTS = [
  { id: 'a1', name: 'Lucía Herrera', status: 'online' },
  { id: 'a2', name: 'Carlos Méndez', status: 'busy' },
  { id: 'a3', name: 'Sofía Duarte', status: 'online' },
  { id: 'a4', name: 'Mateo Rivas', status: 'offline' },
];

const DUMMY_TEAMS = [
  { id: 't1', name: 'Admisiones' },
  { id: 't2', name: 'Soporte académico' },
  { id: 't3', name: 'Finanzas / pagos' },
  { id: 't4', name: 'Coordinación de programas' },
];

const REASONS = [
  'Requiere seguimiento comercial',
  'Duda académica',
  'Pago o financiamiento',
  'Documentos pendientes',
  'Solicitud compleja',
  'Otro'
];

export function TransferDialog({ open, onOpenChange, conversation, onTransfer }: TransferDialogProps) {
  const [tab, setTab] = React.useState<'agent'|'team'|'ai'>('agent');
  const [selectedTarget, setSelectedTarget] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setTab('agent');
      setSelectedTarget(null);
      setReason('');
      setNote('');
      setError('');
    }
  }, [open]);

  const handleTransfer = () => {
    if (tab !== 'ai' && !selectedTarget) {
      setError('Debes seleccionar un destino.');
      return;
    }
    
    let targetName = 'IA';
    let targetId = 'ai';
    
    if (tab === 'agent') {
      targetId = selectedTarget!;
      targetName = DUMMY_AGENTS.find(a => a.id === targetId)?.name || '';
    } else if (tab === 'team') {
      targetId = selectedTarget!;
      targetName = DUMMY_TEAMS.find(t => t.id === targetId)?.name || '';
    }

    onTransfer(tab, targetId, targetName, reason, note);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Transferir conversación</DialogTitle>
          <DialogDescription>
            Elige quién debe continuar esta conversación. Se registrará un evento en el historial del contacto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          <div className="flex-1 flex flex-col">
            <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setSelectedTarget(null); setError(''); }} className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="agent">A un agente</TabsTrigger>
                <TabsTrigger value="team">A un equipo</TabsTrigger>
                <TabsTrigger value="ai">A la IA</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <TabsContent value="agent" className="m-0 space-y-2">
                  {DUMMY_AGENTS.map(agent => (
                    <div 
                      key={agent.id} 
                      className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", selectedTarget === agent.id ? "border-primary bg-primary/5" : "hover:bg-muted")}
                      onClick={() => setSelectedTarget(agent.id)}
                    >
                      <Avatar fallback={agent.name.substring(0,2)} className="h-8 w-8" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className={cn("text-xs flex items-center gap-1", agent.status === 'online' ? "text-green-600" : agent.status === 'busy' ? "text-amber-600" : "text-muted-foreground")}>
                          <span className={cn("w-1.5 h-1.5 rounded-full inline-block", agent.status === 'online' ? "bg-green-500" : agent.status === 'busy' ? "bg-amber-500" : "bg-slate-400")}></span>
                          {agent.status === 'online' ? 'Disponible' : agent.status === 'busy' ? 'Ocupado' : 'Desconectado'}
                        </p>
                      </div>
                      {selectedTarget === agent.id && <i className="ri-checkbox-circle-fill text-primary text-xl"></i>}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="team" className="m-0 space-y-2">
                  {DUMMY_TEAMS.map(team => (
                    <div 
                      key={team.id} 
                      className={cn("flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors", selectedTarget === team.id ? "border-primary bg-primary/5" : "hover:bg-muted")}
                      onClick={() => setSelectedTarget(team.id)}
                    >
                      <span className="text-sm font-medium">{team.name}</span>
                      {selectedTarget === team.id && <i className="ri-checkbox-circle-fill text-primary text-xl"></i>}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="ai" className="m-0">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-5 text-center flex flex-col items-center">
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-3 text-2xl">
                      <i className="ri-robot-2-line"></i>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Agente IA especializado</h4>
                    <p className="text-sm text-purple-800/80 mb-4">
                      La IA tomará el control de esta conversación inmediatamente y continuará la asistencia.
                    </p>
                    <p className="text-xs text-purple-700/60 bg-white/50 px-3 py-1.5 rounded-md">
                      Puedes recuperar la conversación en cualquier momento.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="w-[280px] flex flex-col border-l pl-6 pt-1">
            <h4 className="text-sm font-medium mb-3">Contexto (opcional)</h4>
            
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Motivo</label>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {REASONS.map(r => (
                <span 
                  key={r}
                  className={cn("text-[10px] px-2 py-1 rounded-md border cursor-pointer transition-colors", reason === r ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted")}
                  onClick={() => setReason(reason === r ? '' : r)}
                >
                  {r}
                </span>
              ))}
            </div>

            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nota interna</label>
            <Textarea 
              className="resize-none h-24 text-sm" 
              placeholder="Agrega contexto para quien reciba la conversación..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            
            {error && <p className="text-xs text-red-500 font-medium mt-4 bg-red-50 p-2 rounded-md"><i className="ri-error-warning-line mr-1"></i> {error}</p>}
          </div>
        </div>

        <Separator className="my-4" />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleTransfer}>Transferir conversación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
