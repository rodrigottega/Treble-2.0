import * as React from "react";
import { AiAsset } from "@/types/aiCenter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AssetsManagerProps {
  assets: AiAsset[];
  setAssets: React.Dispatch<React.SetStateAction<AiAsset[]>>;
}

export function AssetsManager({ assets, setAssets }: AssetsManagerProps) {
  const [filterType, setFilterType] = React.useState<string>("all");
  
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<AiAsset | null>(null);

  // Upload/Edit State
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<any>("pdf");
  const [description, setDescription] = React.useState("");
  const [useWhen, setUseWhen] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const filteredAssets = assets.filter(a => filterType === "all" || a.type === filterType);

  const getTypeIcon = (t: string) => {
    switch(t) {
      case 'pdf': return 'ri-file-pdf-2-line text-red-500';
      case 'image': return 'ri-image-2-line text-blue-500';
      case 'video': return 'ri-video-line text-purple-500';
      case 'presentation': return 'ri-file-ppt-2-line text-orange-500';
      case 'link': return 'ri-link text-indigo-500';
      default: return 'ri-file-text-line text-gray-500';
    }
  };

  const handleOpenUpload = () => {
    setName("");
    setType("pdf");
    setDescription("");
    setUseWhen("");
    setIsUploading(false);
    setIsUploadOpen(true);
  };

  const handleOpenEdit = (asset: AiAsset) => {
    setSelectedAsset(asset);
    setName(asset.name);
    setType(asset.type);
    setDescription(asset.description);
    setUseWhen(asset.useWhen);
    setIsEditOpen(true);
  };

  const handleOpenPreview = (asset: AiAsset) => {
    setSelectedAsset(asset);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el recurso "${name}"?`)) {
      setAssets(prev => prev.filter(a => a.id !== id));
      toast.success("Recurso eliminado");
    }
  };

  const handleUpload = () => {
    if (!name || !useWhen) {
      toast.error("El nombre y la regla de uso son obligatorios");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newAsset: AiAsset = {
        id: `ast_${Date.now()}`,
        name,
        type,
        description,
        useWhen,
        tags: [],
        status: "available",
        size: "1.5 MB",
        uploadedAt: new Date().toISOString()
      };
      
      setAssets(prev => [newAsset, ...prev]);
      setIsUploading(false);
      setIsUploadOpen(false);
      toast.success("Recurso subido correctamente");
    }, 1500);
  };

  const handleSaveEdit = () => {
    if (!selectedAsset || !name || !useWhen) return;
    
    setAssets(prev => prev.map(a => a.id === selectedAsset.id ? {
      ...a, name, description, useWhen
    } : a));
    
    setIsEditOpen(false);
    toast.success("Recurso actualizado");
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Recursos que la IA puede enviar
            <TooltipWrapper content="Estos son los archivos y enlaces que el agente puede compartir con los contactos en el chat. No se usan para darle conocimiento a la IA.">
              <i className="ri-information-line text-muted-foreground cursor-help"></i>
            </TooltipWrapper>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Sube materiales (PDF, imágenes, links) que el agente puede compartir con contactos cuando sean útiles. 
            <strong className="font-medium text-foreground ml-1">Estos recursos no se usan como conocimiento para responder preguntas.</strong>
          </p>
        </div>
        <Button onClick={handleOpenUpload}>
          <i className="ri-upload-cloud-2-line mr-2"></i>
          Subir recurso
        </Button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Badge 
            variant={filterType === "all" ? "default" : "outline"} 
            className="cursor-pointer" 
            onClick={() => setFilterType("all")}
          >
            Todos
          </Badge>
          <Badge 
            variant={filterType === "pdf" ? "default" : "outline"} 
            className="cursor-pointer" 
            onClick={() => setFilterType("pdf")}
          >
            PDF
          </Badge>
          <Badge 
            variant={filterType === "image" ? "default" : "outline"} 
            className="cursor-pointer" 
            onClick={() => setFilterType("image")}
          >
            Imagen
          </Badge>
          <Badge 
            variant={filterType === "video" ? "default" : "outline"} 
            className="cursor-pointer" 
            onClick={() => setFilterType("video")}
          >
            Video
          </Badge>
          <Badge 
            variant={filterType === "presentation" ? "default" : "outline"} 
            className="cursor-pointer" 
            onClick={() => setFilterType("presentation")}
          >
            Presentación
          </Badge>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center p-12 bg-muted/20 border border-dashed rounded-lg">
            <i className="ri-folder-open-line text-4xl text-muted-foreground mb-3"></i>
            <h3 className="text-lg font-medium">No hay recursos</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Sube folletos, PDFs o imágenes para que tu agente pueda enviarlos por WhatsApp o Instagram.</p>
            <Button variant="outline" onClick={handleOpenUpload}>Subir mi primer recurso</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="border rounded-lg p-4 bg-background hover:border-primary/50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="mt-1 h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <i className={`${getTypeIcon(asset.type)} text-lg`}></i>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate" title={asset.name}>{asset.name}</h4>
                      <p className="text-[11px] text-muted-foreground flex gap-2 mt-0.5">
                         <span className="uppercase">{asset.type}</span>
                         {asset.size && <span>• {asset.size}</span>}
                         <span>• {format(new Date(asset.uploadedAt), "d MMM", { locale: es })}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs">
                  <div className="font-medium mb-1 line-clamp-1">{asset.description}</div>
                  <div className="text-muted-foreground line-clamp-2 italic bg-muted/40 p-2 rounded">
                    <span className="font-medium not-italic text-foreground">Cuándo usar: </span> 
                    {asset.useWhen}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => handleOpenPreview(asset)}>
                    <i className="ri-eye-line mr-1.5"></i> Preview
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => handleOpenEdit(asset)}>
                    <i className="ri-pencil-line mr-1.5"></i> Editar
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(asset.id, asset.name)}>
                    <i className="ri-delete-bin-line"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload/Edit Dialog */}
      <Dialog open={isUploadOpen || isEditOpen} onOpenChange={(v) => { if (!v) { setIsUploadOpen(false); setIsEditOpen(false); } }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isUploadOpen ? "Subir nuevo recurso" : "Editar recurso"}</DialogTitle>
            <DialogDescription>
              {isUploadOpen ? "Sube un archivo para que la IA lo envíe a los contactos cuando sea relevante." : "Modifica los detalles y la regla de uso del recurso."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isUploadOpen && (
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/10 text-center hover:bg-muted/20 transition-colors cursor-pointer">
                <i className="ri-upload-cloud-2-line text-3xl text-muted-foreground mb-2"></i>
                <div className="font-medium text-sm">Haz clic o arrastra un archivo aquí</div>
                <div className="text-xs text-muted-foreground mt-1">Soporta PDF, imágenes, videos y documentos (Max 20MB)</div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Nombre del recurso <span className="text-destructive">*</span></Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Brochure Diplomado 2026.pdf" />
            </div>

            {isUploadOpen && (
              <div className="space-y-2">
                <Label>Tipo de recurso</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="presentation">Presentación</SelectItem>
                    <SelectItem value="image">Imagen</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="link">Enlace / URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Descripción corta</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. El plan de estudios oficial para enviar a interesados." />
            </div>

            <div className="space-y-2">
              <Label>Cuándo debería enviarse este recurso <span className="text-destructive">*</span></Label>
              <p className="text-[10px] text-muted-foreground mb-1 leading-tight">
                Instrucción para la IA. Se directo y claro sobre en qué escenario de la conversación la IA debe compartir este archivo.
              </p>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={useWhen}
                onChange={e => setUseWhen(e.target.value)}
                placeholder="Ej. Cuando el contacto pregunte por becas o descuentos disponibles."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsUploadOpen(false); setIsEditOpen(false); }} disabled={isUploading}>
              Cancelar
            </Button>
            <Button onClick={isUploadOpen ? handleUpload : handleSaveEdit} disabled={isUploading || !name || !useWhen}>
              {isUploading ? (
                <><i className="ri-loader-4-line animate-spin mr-2"></i> Guardando...</>
              ) : isUploadOpen ? "Subir recurso" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background">
          {selectedAsset && (
            <div className="h-[500px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <i className={`${getTypeIcon(selectedAsset.type)} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{selectedAsset.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase">{selectedAsset.type} {selectedAsset.size ? `• ${selectedAsset.size}` : ''}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
                  <i className="ri-close-line"></i>
                </Button>
              </div>
              
              <div className="flex-1 bg-muted/30 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]"></div>
                <div className="relative bg-background p-8 rounded-xl border shadow-sm max-w-sm w-full mx-auto z-10 flex flex-col items-center">
                  <i className={`${getTypeIcon(selectedAsset.type)} text-6xl opacity-20 mb-4`}></i>
                  <h4 className="font-medium text-lg mb-2">Vista previa no disponible</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Módulo de demostración. En producción, aquí se renderizaría el {selectedAsset.type.toUpperCase()} para lectura online.
                  </p>
                  <Button variant="outline">
                    <i className="ri-download-2-line mr-2"></i> Descargar archivo simulado
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Minimal tooltip wrapper for local use
function TooltipWrapper({ children, content }: { children: React.ReactNode, content: string }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md border z-50 whitespace-normal">
        {content}
      </div>
    </div>
  );
}
