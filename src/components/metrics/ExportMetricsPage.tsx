import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportHistory } from "@/data/metrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ExportMetricsPage() {
  const [reportType, setReportType] = React.useState("funnel");
  const [format, setFormat] = React.useState("csv");

  const handleExport = () => {
    if (format === "pdf") {
      toast("La exportación PDF estará disponible próximamente.");
      return;
    }
    toast.success("Reporte exportado correctamente.", {
      description: "La descarga ha comenzado."
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Exportar</h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Descarga reportes con los datos filtrados de conversaciones, canales y funnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Configurar reporte</h3>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Tipo de reporte</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resume">Resumen general</SelectItem>
                  <SelectItem value="funnel">Funnel de contactos</SelectItem>
                  <SelectItem value="channels">Rendimiento por canal</SelectItem>
                  <SelectItem value="templates">Templates WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Formato</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Recomendado)</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t">
            <Button onClick={handleExport} className="w-full">
              <i className="ri-download-line mr-2"></i> Exportar reporte
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Historial de exportaciones</h3>
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <i className={item.format === 'CSV' ? "ri-file-text-line" : "ri-file-excel-2-line"}></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.reportType}</div>
                    <div className="text-xs text-muted-foreground">{item.format} · {item.createdAt}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Descargando archivo nuevamente...")}>
                  <i className="ri-download-line text-muted-foreground"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
