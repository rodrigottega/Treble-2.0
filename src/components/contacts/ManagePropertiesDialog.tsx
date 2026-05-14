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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPropertyDefinition } from "@/types/contacts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ManagePropertiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customProperties: CustomPropertyDefinition[];
  setCustomProperties: React.Dispatch<React.SetStateAction<CustomPropertyDefinition[]>>;
}

export function ManagePropertiesDialog({ open, onOpenChange, customProperties, setCustomProperties }: ManagePropertiesDialogProps) {
  const [view, setView] = React.useState<"list" | "create" | "edit">("list");
  const [editingProp, setEditingProp] = React.useState<CustomPropertyDefinition | null>(null);

  // Form state
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<string>("text");
  const [description, setDescription] = React.useState("");
  const [showInTable, setShowInTable] = React.useState(true);
  
  const resetForm = () => {
    setName("");
    setType("text");
    setDescription("");
    setShowInTable(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setView("create");
  };

  const handleEdit = (prop: CustomPropertyDefinition) => {
    setEditingProp(prop);
    setName(prop.name);
    setType(prop.type);
    setDescription(prop.description || "");
    setShowInTable(prop.showInTable);
    setView("edit");
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la propiedad "${name}"? Esta acción borrará el valor en todos los contactos.`)) {
      setCustomProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Propiedad eliminada");
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (view === "create") {
      const newProp: CustomPropertyDefinition = {
        id: `prop_${Date.now()}`,
        name,
        key: name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        type: type as any,
        description,
        showInTable,
        createdAt: new Date().toISOString()
      };
      setCustomProperties(prev => [...prev, newProp]);
      toast.success("Propiedad creada");
    } else if (view === "edit" && editingProp) {
      setCustomProperties(prev => prev.map(p => p.id === editingProp.id ? { ...p, name, description, showInTable } : p));
      toast.success("Propiedad actualizada");
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle>Propiedades de contacto</DialogTitle>
            <DialogDescription>
              {view === "list" ? "Administra las propiedades personalizadas para organizar tus contactos." : 
               view === "create" ? "Crea una nueva propiedad para almacenar información específica." : "Edita la configuración de la propiedad."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {view === "list" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-dashed">
                <span className="text-sm text-muted-foreground">Propiedades del sistema no editables</span>
                <Badge variant="outline" className="font-normal text-xs">Protegidas</Badge>
              </div>

              {customProperties.length === 0 ? (
                <div className="text-center p-8 bg-muted/20 border rounded-lg">
                  <i className="ri-database-2-line text-3xl text-muted-foreground mb-2"></i>
                  <h4 className="font-medium text-sm">No tienes propiedades personalizadas</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Crea propiedades adicionales como "Presupuesto", "Empresa", etc.</p>
                  <Button size="sm" onClick={handleCreateNew}>Crear primera propiedad</Button>
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {customProperties.map(prop => (
                    <div key={prop.id} className="flex flex-row items-start justify-between p-3 py-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {prop.name}
                          {prop.showInTable && <Badge variant="secondary" className="text-[9px] px-1 h-4">Tabla</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <span className="capitalize">{prop.type.replace('_', ' ')}</span>
                          {prop.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px] inline-block">{prop.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(prop)}>
                           <i className="ri-pencil-line"></i>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(prop.id, prop.name)}>
                           <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="p-3">
                     <Button variant="outline" className="w-full h-8 border-dashed" onClick={handleCreateNew}>
                       <i className="ri-add-line mr-2"></i> Crear propiedad
                     </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {(view === "create" || view === "edit") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre de la propiedad <span className="text-destructive">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Presupuesto, Empresa, Cargo..." />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de propiedad</Label>
                {view === "create" ? (
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto corto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="boolean">Verdadero / Falso</SelectItem>
                      <SelectItem value="date">Fecha</SelectItem>
                      <SelectItem value="single_select">Selección única (Select)</SelectItem>
                      <SelectItem value="multi_select">Selección múltiple</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm px-3 py-2 border rounded-md bg-muted text-muted-foreground capitalize">
                     {type.replace('_', ' ')}
                  </div>
                )}
                {view === "edit" && <p className="text-[10px] text-muted-foreground">El tipo de propiedad no se puede cambiar después de crearla.</p>}
              </div>

              <div className="space-y-2">
                <Label>Descripción (opcional)</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Agrega contexto sobre el uso de esta propiedad" />
              </div>

              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border mt-2">
                <div className="space-y-0.5">
                  <Label>Mostrar como columna visible</Label>
                  <p className="text-[10px] text-muted-foreground">La propiedad será una columna en la tabla principal por defecto.</p>
                </div>
                <Switch checked={showInTable} onCheckedChange={setShowInTable} />
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
               <Button onClick={handleSave} disabled={!name.trim()}>Guardar propiedad</Button>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
