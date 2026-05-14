import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "all" | "selected" | "filtered";
}

export function ExportContactsDialog({ open, onOpenChange, mode }: ExportContactsDialogProps) {
  const [exportOption, setExportOption] = React.useState("all_columns");

  const handleExport = () => {
    toast.success("Exportación iniciada. Recibirás tu CSV en breve.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar contactos</DialogTitle>
          <DialogDescription>
            Descarga la información de tus contactos en un archivo CSV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            {mode === "selected" 
              ? "Se exportarán únicamente los contactos seleccionados." 
              : mode === "filtered"
              ? "Se exportarán los contactos que apliquen a los filtros actuales."
              : "Se exportarán todos los contactos guardados."}
          </div>

          <div className="space-y-3">
             <Label>¿Qué columnas de datos quieres incluir?</Label>
             <RadioGroup value={exportOption} onValueChange={setExportOption} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all_columns" id="all_columns" />
                  <Label htmlFor="all_columns" className="font-normal">Todas las propiedades (Base y Personalizadas)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visible" id="visible" />
                  <Label htmlFor="visible" className="font-normal">Solo las columnas visibles en la tabla actual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="base_only" id="base_only" />
                  <Label htmlFor="base_only" className="font-normal">Solo información base (Nombre, Email, Teléfono, Etapa)</Label>
                </div>
             </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleExport}>
            <i className="ri-download-2-line mr-2"></i> Exportar CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
