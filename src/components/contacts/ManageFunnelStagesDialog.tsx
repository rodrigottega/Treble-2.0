import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FunnelStageDef } from "@/types/contacts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ManageFunnelStagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funnelStages: FunnelStageDef[];
  setFunnelStages: React.Dispatch<React.SetStateAction<FunnelStageDef[]>>;
}

const COLOR_OPTIONS = [
  { label: "Gris", value: "bg-gray-100 text-gray-700 border-gray-200" },
  { label: "Azul", value: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Verde oscuro", value: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { label: "Verde claro", value: "bg-green-100 text-green-700 border-green-200" },
  { label: "Rojo", value: "bg-red-100 text-red-700 border-red-200" },
  { label: "Amarillo", value: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { label: "Naranja", value: "bg-orange-100 text-orange-700 border-orange-200" },
  { label: "Morado", value: "bg-purple-100 text-purple-700 border-purple-200" },
  { label: "Índigo", value: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { label: "Violeta", value: "bg-violet-100 text-violet-700 border-violet-200" },
];

export function ManageFunnelStagesDialog({ open, onOpenChange, funnelStages, setFunnelStages }: ManageFunnelStagesDialogProps) {
  const [view, setView] = React.useState<"list" | "create" | "edit">("list");
  const [editingStage, setEditingStage] = React.useState<FunnelStageDef | null>(null);

  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("bg-gray-100 text-gray-700 border-gray-200");

  const resetForm = () => {
    setName("");
    setColor("bg-gray-100 text-gray-700 border-gray-200");
  };

  const handleCreateNew = () => {
    resetForm();
    setView("create");
  };

  const handleEdit = (stage: FunnelStageDef) => {
    setEditingStage(stage);
    setName(stage.name);
    setColor(stage.color);
    setView("edit");
  };

  const handleDelete = (stage: FunnelStageDef) => {
    if (stage.isSystem) {
      toast.error("No se pueden eliminar las etapas base del sistema.");
      return;
    }
    if (confirm(`¿Estás seguro de eliminar la etapa "${stage.name}"? Los contactos deberás reasignarlos (simulado).`)) {
      setFunnelStages(prev => prev.filter(s => s.id !== stage.id));
      toast.success("Etapa eliminada");
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (view === "create") {
      const newStage: FunnelStageDef = {
        id: `fs_${Date.now()}`,
        name,
        color,
        isSystem: false
      };
      setFunnelStages(prev => [...prev, newStage]);
      toast.success("Etapa creada");
    } else if (view === "edit" && editingStage) {
      setFunnelStages(prev => prev.map(s => s.id === editingStage.id ? { ...s, name, color } : s));
      toast.success("Etapa actualizada");
    }
    
    setView("list");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v) {
        setTimeout(() => setView("list"), 200);
      }
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-4 shrink-0">
          <DialogHeader>
             <DialogTitle>Etapas del funnel</DialogTitle>
             <DialogDescription>
               {view === "list" ? "Personaliza las etapas que usas para clasificar y dar seguimiento a tus contactos." : 
                view === "create" ? "Agrega una nueva etapa a tu proceso de ventas o seguimiento." : "Modifica el nombre y color de esta etapa."}
             </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {view === "list" && (
            <div className="space-y-4">
              <div className="border rounded-md divide-y">
                {funnelStages.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-row items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-row items-center gap-3 w-1/2">
                      <div className="text-muted-foreground text-xs w-4">{idx + 1}</div>
                      <Badge variant="outline" className={`font-normal px-2 ${stage.color} flex-shrink-0 w-max truncate`}>
                        {stage.name}
                      </Badge>
                      {stage.isSystem && <span className="text-[10px] text-muted-foreground">(Base)</span>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleEdit(stage)}>
                         <i className="ri-pencil-line"></i>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${stage.isSystem ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-destructive hover:bg-destructive/10'}`} 
                        disabled={stage.isSystem}
                        onClick={() => handleDelete(stage)}
                      >
                         <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-muted/10">
                   <Button variant="outline" className="w-full h-8 border-dashed" onClick={handleCreateNew}>
                     <i className="ri-add-line mr-2"></i> Agregar etapa
                   </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                 Nota: Las etapas "Base" son requeridas por el sistema y no se pueden eliminar, pero sí se pueden editar visualmente. El reordenamiento está simulado.
              </p>
            </div>
          )}

          {(view === "create" || view === "edit") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre de la etapa <span className="text-destructive">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Esperando respuesta..." />
              </div>
              
              <div className="space-y-2">
                <Label>Color visual</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border ${opt.value.split(" ")[0]} ${opt.value.split(" ")[2]}`}></div>
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg flex items-center justify-center mt-4">
                <div className="text-xs text-muted-foreground mr-4">Vista previa:</div>
                <Badge variant="outline" className={`font-normal px-2 py-0.5 ${color}`}>
                  {name || "Nombre de etapa"}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 shrink-0 border-t bg-muted/10">
           {view === "list" ? (
             <div className="flex justify-end">
               <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
             </div>
           ) : (
             <div className="flex justify-between">
               <Button variant="ghost" onClick={() => setView("list")}>Atrás</Button>
               <Button onClick={handleSave} disabled={!name.trim()}>Guardar etapa</Button>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
