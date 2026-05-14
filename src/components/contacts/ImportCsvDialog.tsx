import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
}

export function ImportCsvDialog({ open, onOpenChange, onImport }: ImportCsvDialogProps) {
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  const handleSimulateUpload = () => {
    toast.info("Analizando archivo CSV...");
    setTimeout(() => setStep(2), 1000);
  };

  const handleFinish = () => {
    toast.success("Importación completada con éxito.");
    onImport([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar contactos desde CSV</DialogTitle>
          <DialogDescription>
            Sube un archivo delimitado por comas para agregar contactos masivamente.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="py-8">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <i className="ri-file-excel-2-line text-2xl"></i>
              </div>
              <p className="text-sm font-medium mb-1">Arrastra tu archivo CSV aquí</p>
              <p className="text-xs text-muted-foreground mb-4">o haz clic para explorar en tu dispositivo</p>
              <Input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={handleSimulateUpload} />
              <Button asChild size="sm" variant="secondary">
                 <label htmlFor="csv-upload" className="cursor-pointer">Seleccionar archivo</label>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4 space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md flex gap-3">
              <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
              <div>
                <h4 className="font-medium text-green-900 text-sm">Archivo analizado correctamente</h4>
                <p className="text-xs text-green-700 mt-1">Encontramos 124 filas válidas listas para importar. El mapeo de columnas base se realizó automáticamente.</p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
               <table className="w-full text-xs text-left">
                 <thead className="bg-muted text-muted-foreground">
                   <tr>
                     <th className="px-3 py-2 font-medium">Columna CSV</th>
                     <th className="px-3 py-2 font-medium">Mapeo a CRM</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   <tr>
                     <td className="px-3 py-2 font-mono">Nombre Completo</td>
                     <td className="px-3 py-2"><span className="text-primary font-medium">Nombre</span></td>
                   </tr>
                   <tr>
                     <td className="px-3 py-2 font-mono">Correo</td>
                     <td className="px-3 py-2"><span className="text-primary font-medium">Email</span></td>
                   </tr>
                   <tr>
                     <td className="px-3 py-2 font-mono">Telefono</td>
                     <td className="px-3 py-2"><span className="text-primary font-medium">Teléfono</span></td>
                   </tr>
                   <tr>
                     <td className="px-3 py-2 font-mono">Interes</td>
                     <td className="px-3 py-2"><span className="text-primary font-medium">Programa de interés</span></td>
                   </tr>
                 </tbody>
               </table>
            </div>
            <p className="text-xs text-muted-foreground italic">Vista previa simulada para el prototipo.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          {step === 1 ? (
             <Button disabled>Continuar</Button>
          ) : (
             <Button onClick={handleFinish}>Importar 124 contactos</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
