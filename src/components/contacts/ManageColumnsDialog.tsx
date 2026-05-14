import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomPropertyDefinition } from "@/types/contacts";
import { toast } from "sonner";

interface ManageColumnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customProperties: CustomPropertyDefinition[];
  setCustomProperties: React.Dispatch<React.SetStateAction<CustomPropertyDefinition[]>>;
}

export function ManageColumnsDialog({ open, onOpenChange, customProperties, setCustomProperties }: ManageColumnsDialogProps) {
  const [localProps, setLocalProps] = React.useState(customProperties);

  React.useEffect(() => {
    setLocalProps(customProperties);
  }, [customProperties, open]);

  const handleToggle = (id: string, checked: boolean) => {
    setLocalProps(prev => prev.map(p => p.id === id ? { ...p, showInTable: checked } : p));
  };

  const handleSave = () => {
    setCustomProperties(localProps);
    onOpenChange(false);
    toast.success("Columnas actualizadas");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Administrar columnas</DialogTitle>
          <DialogDescription>
            Selecciona qué propiedades personalizadas quieres ver en la tabla de contactos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto">
           {/* Base Columns that are static */}
           <div className="space-y-3">
             <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Columnas fijas</h4>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_name" checked disabled />
               <label htmlFor="c_name" className="text-sm font-medium leading-none cursor-not-allowed">Nombre</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_phone" checked disabled />
               <label htmlFor="c_phone" className="text-sm font-medium leading-none cursor-not-allowed">Teléfono</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_email" checked disabled />
               <label htmlFor="c_email" className="text-sm font-medium leading-none cursor-not-allowed">Email</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_country" checked disabled />
               <label htmlFor="c_country" className="text-sm font-medium leading-none cursor-not-allowed">País</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_city" checked disabled />
               <label htmlFor="c_city" className="text-sm font-medium leading-none cursor-not-allowed">Ciudad</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_channel" checked disabled />
               <label htmlFor="c_channel" className="text-sm font-medium leading-none cursor-not-allowed">Canal</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_funnel" checked disabled />
               <label htmlFor="c_funnel" className="text-sm font-medium leading-none cursor-not-allowed">Etapa del funnel</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_intent" checked disabled />
               <label htmlFor="c_intent" className="text-sm font-medium leading-none cursor-not-allowed">Intención</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_program" checked disabled />
               <label htmlFor="c_program" className="text-sm font-medium leading-none cursor-not-allowed">Programa</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_tags" checked disabled />
               <label htmlFor="c_tags" className="text-sm font-medium leading-none cursor-not-allowed">Tags</label>
             </div>
             <div className="flex items-center space-x-2 opacity-50">
               <Checkbox id="c_activity" checked disabled />
               <label htmlFor="c_activity" className="text-sm font-medium leading-none cursor-not-allowed">Última actividad</label>
             </div>
           </div>

           <div className="space-y-3 pt-2">
             <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Propiedades personalizadas</h4>
             {localProps.length === 0 ? (
               <p className="text-sm text-muted-foreground">No tienes propiedades personalizadas creadas.</p>
             ) : (
               localProps.map(p => (
                 <div key={p.id} className="flex items-center space-x-2">
                   <Checkbox 
                     id={`prop_${p.id}`} 
                     checked={p.showInTable} 
                     onCheckedChange={(c) => handleToggle(p.id, c as boolean)}
                   />
                   <label htmlFor={`prop_${p.id}`} className="text-sm leading-none cursor-pointer">
                     {p.name}
                     <span className="text-xs text-muted-foreground ml-2">({p.type.replace('_', ' ')})</span>
                   </label>
                 </div>
               ))
             )}
           </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
