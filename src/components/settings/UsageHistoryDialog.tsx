import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { dummyUsageHistory } from "../../data/settings";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface UsageHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageHistoryDialog({ open, onOpenChange }: UsageHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Historial de uso</DialogTitle>
          <DialogDescription>
            Resumen del consumo de mensajes outbound de los últimos meses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Periodo</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium text-right">Límite</th>
                <th className="px-4 py-3 font-medium text-right">Usados</th>
                <th className="px-4 py-3 font-medium text-right">Consumo Adicional</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dummyUsageHistory.map(item => (
                <tr key={item.id} className="bg-white">
                  <td className="px-4 py-3 font-medium">{item.period}</td>
                  <td className="px-4 py-3">{item.planName}</td>
                  <td className="px-4 py-3 text-right">{item.limit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{item.used.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{item.overage.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'En curso' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Consumo adicional' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => {
            toast.success("Historial exportado");
            onOpenChange(false);
          }}>
            <i className="ri-download-line mr-2"></i>
            Exportar CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
