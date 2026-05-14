import * as React from "react";
import { KnowledgeBase, SubAgent } from "@/types/aiCenter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface KnowledgeBaseGridProps {
  knowledgeBases: KnowledgeBase[];
  subAgents: SubAgent[];
  onOpen: (kb: KnowledgeBase) => void;
  onCreate: () => void;
}

export function KnowledgeBaseGrid({ knowledgeBases, subAgents, onOpen, onCreate }: KnowledgeBaseGridProps) {
  
  const getAgentName = (id: string) => {
    return subAgents.find(a => a.id === id)?.name || "Desconocido";
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ready': return <span className="text-[10px] bg-green-500/10 text-green-700 px-2 py-0.5 rounded border border-green-500/20 uppercase font-medium">Lista</span>;
      case 'processing': return <span className="text-[10px] bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded border border-blue-500/20 uppercase font-medium">Procesando</span>;
      case 'needs_review': return <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-medium">Revisión req.</span>;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col w-full relative bg-background">
      <div className="flex flex-col py-8 px-8 border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Base de conocimiento</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              Crea fuentes de conocimiento que los agentes pueden consultar para responder con información confiable. 
              Estas fuentes no se envían como archivos al contacto.
            </p>
          </div>
          <Button onClick={onCreate}>
             <i className="ri-add-line mr-2"></i> Crear base de conocimiento
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
         {knowledgeBases.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-16 text-center border overflow-hidden rounded-xl bg-muted/10 border-dashed">
             <i className="ri-book-3-line text-5xl text-muted-foreground mb-4"></i>
             <h3 className="text-xl font-medium">No hay bases de conocimiento todavía</h3>
             <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">Agrupa documentos, textos o páginas web en bases de conocimiento para darle contexto a tus agentes IA.</p>
             <Button onClick={onCreate}>Crear mi primera base</Button>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {knowledgeBases.map(kb => (
               <div key={kb.id} className="border rounded-xl bg-card hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer overflow-hidden group" onClick={() => onOpen(kb)}>
                 <div className="p-5 flex-1">
                   <div className="flex items-start justify-between mb-3">
                     <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                       <i className="ri-book-3-line text-xl"></i>
                     </div>
                     {getStatusBadge(kb.status)}
                   </div>
                   
                   <h3 className="font-semibold text-lg line-clamp-1 mb-1">{kb.name}</h3>
                   <p className="text-xs text-muted-foreground line-clamp-3 mb-4 h-12 leading-relaxed">
                     {kb.description || "Sin descripción."}
                   </p>

                   <div className="space-y-3">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-3 border-dashed">
                        <i className="ri-file-copy-2-line"></i> {kb.sourceIds.length} fuentes indexadas
                     </div>
                     <div className="flex items-start gap-2 text-[11px] text-muted-foreground min-h-[32px]">
                        <i className="ri-robot-line text-primary mt-0.5"></i> 
                        <div className="leading-tight">
                          {kb.associatedAgentIds.length === 0 ? "No asociado a ningún agente" : 
                           kb.associatedAgentIds.map(id => getAgentName(id)).join(", ")}
                        </div>
                     </div>
                   </div>
                 </div>

                 <div className="p-3 bg-muted/30 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                   <span className="flex items-center gap-1.5"><i className="ri-time-line"></i> Actualizado {format(new Date(kb.updatedAt), "d MMM", { locale: es })}</span>
                   <span className="font-medium text-foreground hover:underline flex items-center gap-1">Abrir <i className="ri-arrow-right-line"></i></span>
                 </div>
               </div>
             ))}
           </div>
         )}
         <div className="h-12 w-full"></div> {/* Spacer */}
      </div>
    </div>
  );
}
