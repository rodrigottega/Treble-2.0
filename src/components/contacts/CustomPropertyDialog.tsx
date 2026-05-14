import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CustomPropertyDefinition, CustomPropertyType, CustomPropertyOption } from "@/types/contacts";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CustomPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (prop: CustomPropertyDefinition) => void;
}

export function CustomPropertyDialog({ open, onOpenChange, onAdd }: CustomPropertyDialogProps) {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [type, setType] = React.useState<CustomPropertyType>("text");
  const [showInTable, setShowInTable] = React.useState(true);
  const [options, setOptions] = React.useState<string[]>([""]);

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setName("");
      setDesc("");
      setType("text");
      setShowInTable(true);
      setOptions([""]);
    }
  }, [open]);

  const handleCreate = () => {
    if (!name.trim()) return;
    
    let parsedOptions: CustomPropertyOption[] | undefined = undefined;
    
    if (type === "single_select" || type === "multi_select") {
      const validOpts = options.filter(o => o.trim());
      if (validOpts.length < 2) {
        toast.error("Debes agregar al menos 2 opciones.");
        return;
      }
      parsedOptions = validOpts.map((o, index) => ({
        id: `opt_${Date.now()}_${index}`,
        label: o.trim()
      }));
    }

    const newProp: CustomPropertyDefinition = {
      id: `prop_${Date.now()}`,
      name: name.trim(),
      key: name.trim().toLowerCase().replace(/\s+/g, '_'),
      type,
      description: desc.trim(),
      showInTable,
      options: parsedOptions,
      createdAt: new Date().toISOString()
    };

    onAdd(newProp);
    toast.success("Propiedad creada");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva propiedad</DialogTitle>
          <DialogDescription>
            Crea una propiedad personalizada para organizar y segmentar tus contactos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prop_name">Nombre de la propiedad</Label>
            <Input 
              id="prop_name" 
              placeholder="Ej. Edad, Grupo de edad, Presupuesto..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prop_type">Tipo de propiedad</Label>
            <Select value={type} onValueChange={(v) => setType(v as CustomPropertyType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto corto</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="single_select">Selección única (Dropdown)</SelectItem>
                <SelectItem value="multi_select">Selección múltiple</SelectItem>
                <SelectItem value="boolean">Verdadero / Falso</SelectItem>
                <SelectItem value="date">Fecha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(type === "single_select" || type === "multi_select") && (
            <div className="space-y-2 border p-3 rounded-md bg-muted/20">
              <Label>Opciones</Label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input 
                    value={opt} 
                    onChange={e => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Opción ${idx + 1}`}
                    className="h-8 text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (options.length > 1) {
                         setOptions(options.filter((_, i) => i !== idx));
                      }
                    }}
                  >
                     <i className="ri-delete-bin-line"></i>
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 border-dashed h-8 text-xs"
                onClick={() => setOptions([...options, ""])}
              >
                <i className="ri-add-line mr-1"></i> Agregar opción
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="prop_desc">Descripción (Opcional)</Label>
            <Input 
              id="prop_desc" 
              placeholder="Describe cuándo debe usarse esta propiedad..." 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="space-y-0.5">
              <Label htmlFor="prop_show">Mostrar en tabla</Label>
              <p className="text-xs text-muted-foreground">Esta propiedad será visible como columna.</p>
            </div>
            <Switch 
              id="prop_show" 
              checked={showInTable} 
              onCheckedChange={setShowInTable}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Crear propiedad</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
