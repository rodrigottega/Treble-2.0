import * as React from "react";
import { KnowledgeBase, KnowledgeSource, SubAgent } from "@/types/aiCenter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface KnowledgeBaseDetailProps {
  kb: KnowledgeBase;
  sources: KnowledgeSource[];
  setSources: React.Dispatch<React.SetStateAction<KnowledgeSource[]>>;
  onClose: () => void;
  subAgents: SubAgent[];
}

export function KnowledgeBaseDetail({ kb, sources, setSources, onClose, subAgents }: KnowledgeBaseDetailProps) {
  const [activeTab, setActiveTab] = React.useState("fuentes");
  const [isAddSourceOpen, setIsAddSourceOpen] = React.useState(false);

  const kbSources = sources.filter(s => s.knowledgeBaseId === kb.id);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'ri-file-pdf-2-line text-red-500';
      case 'plain_text': return 'ri-text text-gray-500';
      case 'txt': return 'ri-file-text-line text-blue-500';
      case 'website': return 'ri-global-line text-indigo-500';
      default: return 'ri-file-line';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'Documento PDF';
      case 'plain_text': return 'Texto libre';
      case 'txt': return 'Archivo TXT';
      case 'website': return 'Sitio Web';
      default: return type;
    }
  };

  const handleAddSource = (type: "file" | "text" | "website", data: any) => {
    toast.success("Fuente en procesamiento", { description: "Tomará unos segundos extraer la información." });
    setTimeout(() => {
      const newSource: KnowledgeSource = {
        id: `ks_${Date.now()}`,
        knowledgeBaseId: kb.id,
        name: data.name || "Nueva fuente",
        type: type === "file" ? (data.name.endsWith('.pdf') ? 'pdf' : 'txt') : type === "text" ? 'plain_text' : 'website',
        status: "ready",
        uploadedAt: new Date().toISOString(),
        size: data.size || "120 KB",
        indexedChunks: Math.floor(Math.random() * 50) + 5,
        url: type === "website" ? data.url : undefined
      };
      setSources(prev => [newSource, ...prev]);
      setIsAddSourceOpen(false);
      toast.success("Fuente indexada correctamente");
    }, 2000);
  };

  const deleteSource = (id: string) => {
    if (confirm("¿Eliminar esta fuente? Los agentes dejarán de utilizar esta información.")) {
       setSources(prev => prev.filter(s => s.id !== id));
       toast.success("Fuente eliminada");
    }
  };

  return (
    <div className="h-full flex flex-col w-full relative bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden w-full">
        <div className="flex flex-col py-6 px-8 border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm shrink-0">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
             <button onClick={onClose} className="hover:text-foreground hover:underline flex items-center gap-1">
               <i className="ri-arrow-left-s-line"></i> Bases de conocimiento
             </button>
             <span>/</span>
             <span className="truncate max-w-[200px]">{kb.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{kb.name}</h1>
              <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
                {kb.description || "Sin descripción."}
              </p>
            </div>
            {activeTab === 'fuentes' && (
              <Button onClick={() => setIsAddSourceOpen(true)}>
                 <i className="ri-add-line mr-2"></i> Agregar fuente
              </Button>
            )}
          </div>

          <TabsList className="mt-8 mb-[-25px] bg-transparent h-auto p-0 border-b w-full justify-start rounded-none">
            <TabsTrigger value="fuentes" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent px-4 pb-3 pt-2 rounded-none">
              Fuentes ({kbSources.length})
            </TabsTrigger>
            <TabsTrigger value="playground" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent px-4 pb-3 pt-2 rounded-none">
              Playground
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent px-4 pb-3 pt-2 rounded-none">
              Configuración
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto bg-muted/10">
          <TabsContent value="fuentes" className="h-full m-0 p-8 focus-visible:outline-none">
             {kbSources.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-16 text-center border overflow-hidden rounded-xl bg-background border-dashed shadow-sm">
                  <i className="ri-upload-cloud-2-line text-5xl text-muted-foreground mb-4"></i>
                  <h3 className="text-lg font-medium">No has agregado ninguna fuente</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">Para que la base de conocimiento sea útil, debes agregar archivos, texto o páginas web.</p>
                  <Button onClick={() => setIsAddSourceOpen(true)}>Agregar primera fuente</Button>
               </div>
             ) : (
               <div className="bg-background border rounded-xl overflow-hidden shadow-sm divide-y">
                 <div className="bg-muted/30 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground tracking-wider uppercase">
                   <div className="col-span-5">Fuente</div>
                   <div className="col-span-2">Estado</div>
                   <div className="col-span-3">Metadatos</div>
                   <div className="col-span-2 text-right">Acciones</div>
                 </div>
                 {kbSources.map(source => (
                   <div key={source.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/10 transition-colors">
                     <div className="col-span-5 flex items-center gap-4">
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                          <i className={`${getTypeIcon(source.type)} text-xl`}></i>
                        </div>
                        <div className="min-w-0">
                           <div className="font-medium text-sm truncate">{source.name}</div>
                           <div className="text-[11px] text-muted-foreground">{getTypeLabel(source.type)} {source.url ? `• ${source.url}` : ''}</div>
                        </div>
                     </div>
                     <div className="col-span-2">
                        <Badge variant="outline" className={
                          source.status === 'ready' ? 'text-green-600 border-green-200 bg-green-50' :
                          source.status === 'processing' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-amber-600 border-amber-200 bg-amber-50'
                        }>
                          {source.status === 'ready' ? 'Lista' : source.status === 'processing' ? 'Procesando' : 'Error'}
                        </Badge>
                     </div>
                     <div className="col-span-3 flex flex-col gap-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5"><i className="ri-database-2-line w-3 flex justify-center"></i> {source.indexedChunks ? `${source.indexedChunks} fragmentos` : '0 fragmentos'}</div>
                        <div className="flex items-center gap-1.5"><i className="ri-hard-drive-2-line w-3 flex justify-center"></i> {source.size || 'N/A'}</div>
                     </div>
                     <div className="col-span-2 flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toast("Preview mockeado")}>
                          <i className="ri-eye-line"></i>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => {toast.success("Reprocesando fuente");}}>
                          <i className="ri-refresh-line"></i>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteSource(source.id)}>
                          <i className="ri-delete-bin-line"></i>
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </TabsContent>

          <TabsContent value="playground" className="h-full m-0 p-8 focus-visible:outline-none">
             <KBPlayground kb={kb} kbSources={kbSources} />
          </TabsContent>

          <TabsContent value="config" className="h-full m-0 p-8 focus-visible:outline-none">
             <div className="bg-background border rounded-xl shadow-sm p-6 max-w-2xl">
               <h3 className="text-lg font-semibold mb-6">Configuración general</h3>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label>Nombre de la base</Label>
                   <Input defaultValue={kb.name} />
                 </div>
                 <div className="space-y-2">
                   <Label>Descripción</Label>
                   <Input defaultValue={kb.description} />
                 </div>
                 <div className="space-y-2 mt-6">
                   <Label>Prioridad de búsqueda</Label>
                   <p className="text-xs text-muted-foreground mb-2">Las bases con mayor prioridad se consultan primero cuando varias podrían responder la misma pregunta.</p>
                   <Select defaultValue={kb.priority}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Alta">Alta</SelectItem>
                       <SelectItem value="Normal">Normal</SelectItem>
                       <SelectItem value="Baja">Baja</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="pt-6 mt-6 border-t flex justify-end gap-3">
                   <Button variant="outline" className="text-destructive border-dashed" onClick={() => {
                     if (confirm("¿Estás seguro de eliminar esta KB?")) {
                        toast.success("Eliminado (simulado)");
                        onClose();
                     }
                   }}>Eliminar base de datos</Button>
                   <Button onClick={() => toast.success("Configuración guardada")}>Guardar cambios</Button>
                 </div>
               </div>
             </div>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar fuente</DialogTitle>
            <DialogDescription>Sube un archivo, pega texto o enlaza un sitio web para sumar a esta base de conocimiento.</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="file" className="mt-4">
             <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">Archivo</TabsTrigger>
                <TabsTrigger value="text">Texto libre</TabsTrigger>
                <TabsTrigger value="website">Website</TabsTrigger>
             </TabsList>
             
             <TabsContent value="file" className="pt-4 space-y-4">
               <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/10 text-center hover:bg-muted/20 transition-colors cursor-pointer"
                 onClick={() => handleAddSource("file", { name: "Manual_Adicional.pdf", size: "3.2 MB" })}>
                 <i className="ri-file-upload-line text-3xl text-muted-foreground mb-2"></i>
                 <div className="font-medium text-sm">Haz clic para simular subida</div>
                 <div className="text-xs text-muted-foreground mt-1">Soporta PDF o TXT</div>
               </div>
             </TabsContent>
             
             <TabsContent value="text" className="pt-4 space-y-4">
               <div className="space-y-2">
                 <Label>Contenido</Label>
                 <textarea 
                   className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                   placeholder="Pega el texto aquí..."
                 />
               </div>
               <div className="space-y-2">
                 <Label>Identificador (opcional)</Label>
                 <Input placeholder="Ej. Reglas de uso interno" />
               </div>
               <Button className="w-full" onClick={() => handleAddSource("text", { name: "Texto pegado" })}>Procesar texto</Button>
             </TabsContent>
             
             <TabsContent value="website" className="pt-4 space-y-4">
               <div className="space-y-2">
                 <Label>URL del website</Label>
                 <Input placeholder="https://..." />
               </div>
               <p className="text-xs text-muted-foreground">La IA intentará extraer el texto principal de la página. El scrapeo es de una sola página, no recursivo.</p>
               <Button className="w-full" onClick={() => handleAddSource("website", { name: "Pagina Scrapeada", url: "https://ejemplo.com" })}>Extraer página</Button>
             </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KBPlayground({ kb, kbSources }: { kb: KnowledgeBase, kbSources: KnowledgeSource[] }) {
  const [messages, setMessages] = React.useState<{role: "user"|"ai", text: string, sources?: KnowledgeSource[]}[]>([]);
  const [input, setInput] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsGenerating(true);

    setTimeout(() => {
      let sourcesToUse = kbSources.slice(0, 1 + Math.floor(Math.random() * 2));
      if (kbSources.length === 0) sourcesToUse = [];

      let responseText = "Mock de respuesta generada utilizando los fragmentos encontrados en las fuentes.";
      if (sourcesToUse.length === 0) {
        responseText = "No tengo suficiente información en esta base de conocimiento para responder a tu pregunta. Asegúrate de agregar fuentes.";
      }

      setMessages(prev => [...prev, { role: "ai", text: responseText, sources: sourcesToUse }]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-background border rounded-xl shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b flex justify-between items-center bg-muted/20">
         <div>
           <h3 className="font-semibold flex items-center gap-2">Playground <Badge className="font-normal" variant="outline">Notebook mode</Badge></h3>
           <p className="text-xs text-muted-foreground mt-0.5">Prueba cómo respondería la IA considerando <strong>únicamente</strong> las fuentes de esta base de conocimiento.</p>
         </div>
         <Button variant="ghost" size="sm" onClick={() => setMessages([])} disabled={messages.length === 0}>Limpiar</Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
         {messages.length === 0 ? (
           <div className="h-full flex items-center justify-center text-center text-muted-foreground">
             <div>
               <i className="ri-chat-3-line text-3xl mb-2"></i>
               <div className="text-sm">Escribe una pregunta para probar el contexto extraído.</div>
             </div>
           </div>
         ) : (
           messages.map((msg, i) => (
             <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border rounded-tl-sm'}`}>
                  {msg.text}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 text-xs">
                      <div className="font-medium text-muted-foreground mb-2">Fuentes citadas ({msg.sources.length}):</div>
                      <div className="flex flex-col gap-2">
                        {msg.sources.map((s, idx) => (
                          <div key={idx} className="bg-background border p-2 rounded flex items-center gap-2">
                             <i className="ri-file-text-line text-primary"></i> <span className="font-medium truncate">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>
           ))
         )}
         {isGenerating && (
            <div className="p-4 bg-muted/50 border rounded-xl rounded-tl-sm w-max flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
         )}
      </div>

      <div className="p-4 border-t">
        <div className="relative">
          <Input 
            placeholder="Pregunta algo sobre esta base de conocimiento..." 
            className="pr-12"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            variant="ghost"
            className="absolute right-1 top-1 h-8 w-8 text-primary" 
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
          >
            <i className="ri-send-plane-2-fill"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
