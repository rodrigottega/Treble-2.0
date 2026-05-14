import * as React from "react";
import { KnowledgeBase, KnowledgeSource, SubAgent } from "@/types/aiCenter";
import { KnowledgeBaseGrid } from "./KnowledgeBaseGrid";
import { KnowledgeBaseDetail } from "./KnowledgeBaseDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface KnowledgeBasePageProps {
  knowledgeBases: KnowledgeBase[];
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>;
  sources: KnowledgeSource[];
  setSources: React.Dispatch<React.SetStateAction<KnowledgeSource[]>>;
  subAgents: SubAgent[];
}

export function KnowledgeBasePage({
  knowledgeBases,
  setKnowledgeBases,
  sources,
  setSources,
  subAgents
}: KnowledgeBasePageProps) {
  const [selectedKB, setSelectedKB] = React.useState<KnowledgeBase | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;

    const newKB: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newName,
      description: newDesc,
      status: "ready",
      sourceIds: [],
      associatedAgentIds: [],
      priority: "Normal",
      updatedAt: new Date().toISOString()
    };

    setKnowledgeBases(prev => [newKB, ...prev]);
    setIsCreateOpen(false);
    toast.success("Base de conocimiento creada");
    setSelectedKB(newKB);
    setNewName("");
    setNewDesc("");
  };

  return (
    <>
      {!selectedKB ? (
        <KnowledgeBaseGrid 
          knowledgeBases={knowledgeBases} 
          subAgents={subAgents} 
          onOpen={setSelectedKB} 
          onCreate={() => setIsCreateOpen(true)}
        />
      ) : (
        <KnowledgeBaseDetail 
           kb={selectedKB}
           sources={sources}
           setSources={setSources}
           onClose={() => setSelectedKB(null)}
           subAgents={subAgents}
        />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva base de conocimiento</DialogTitle>
            <DialogDescription>
              Crea un espacio para agrupar documentos, páginas o textos relacionados. Luego podrás conectar esta base a uno o varios agentes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre de la base <span className="text-destructive">*</span></Label>
              <Input placeholder="Ej. Admisiones y Becas" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input placeholder="Ayuda a identificar qué contiene esta base." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Crear base</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
