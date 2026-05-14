import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generalKpis, funnelData, lateralFunnelData } from "@/data/metrics";

export function GeneralMetricsPage() {
  const handleExport = () => {
    toast.success("Exportación generada con los filtros actuales.");
  };

  const handleInboxFilter = () => {
    toast("Filtro aplicado al Inbox próximamente.");
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Generales</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Monitorea el rendimiento de tus conversaciones, contactos y funnel de admisiones.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="shrink-0">
          <i className="ri-download-line mr-2"></i> Exportar vista
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {generalKpis.map((kpi, idx) => (
          <div key={idx} className="bg-card border rounded-xl p-4 shadow-sm flex flex-col">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center justify-between">
              {kpi.title}
            </div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div className={`text-xs font-medium mt-auto ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <i className={kpi.isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line"}></i> {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Funnel de contactos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Visualiza en qué etapa se encuentran los contactos y dónde se pierden oportunidades.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Funnel Bars */}
          <div className="flex-1 space-y-4">
            {funnelData.map((stage, i) => (
              <div key={i} className="flex flex-col cursor-pointer group">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium group-hover:text-primary transition-colors">{stage.stage}</span>
                  <span className="text-muted-foreground">
                    {stage.count} <span className="text-xs">({stage.percent}%)</span>
                  </span>
                </div>
                <div className="h-4 bg-muted overflow-hidden rounded-full relative">
                  <div 
                    className="h-full bg-primary/80 group-hover:bg-primary transition-colors duration-300" 
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
                {i < funnelData.length - 1 && (
                  <div className="h-6 flex items-center justify-end pr-2 gap-4 text-[10px] text-muted-foreground">
                    {funnelData[i+1].conversionFromPrevious !== undefined && (
                        <span>Conversión: {funnelData[i+1].conversionFromPrevious}%</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-muted/30 border rounded-xl p-4">
               <h4 className="font-medium text-sm mb-3">Estados laterales</h4>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                     <span className="text-muted-foreground">No calificado</span>
                   </div>
                   <span className="font-medium">{lateralFunnelData["No calificado"]}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-300"></span>
                     <span className="text-muted-foreground">Perdido</span>
                   </div>
                   <span className="font-medium">{lateralFunnelData["Perdido"]}</span>
                 </div>
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex gap-2">
                <i className="ri-lightbulb-flash-line text-blue-600 mt-0.5"></i>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Insights</p>
                  <ul className="space-y-1 text-xs">
                    <li>• La mayor caída ocurre entre Contactado y Calificado.</li>
                    <li>• 156 contactos detenidos por documentos pendientes.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-auto" onClick={handleInboxFilter}>
              Ver contactos en Inbox
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operación del equipo */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-1">Operación del equipo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Estos datos ayudan a entender si el equipo está respondiendo a tiempo y cerrando conversaciones sin acumulación.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
               <div className="text-xl font-bold mb-0.5">126</div>
               <div className="text-xs text-muted-foreground">Abiertas ahora</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
               <div className="text-xl font-bold mb-0.5">34</div>
               <div className="text-xs text-muted-foreground">Sin respuesta</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
               <div className="text-xl font-bold text-red-700 mb-0.5">12</div>
               <div className="text-xs text-red-600">Vencidas</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
               <div className="text-xl font-bold mb-0.5">18</div>
               <div className="text-xs text-muted-foreground">Reabiertas</div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
             <div className="text-sm font-medium">Tendencia de conversaciones</div>
             <div className="flex items-end gap-2 h-24 pt-4 border-b pb-2">
                <div className="w-1/6 bg-blue-100 rounded-t-sm h-full relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">120</div></div>
                <div className="w-1/6 bg-blue-200 rounded-t-sm h-[80%] relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">105</div></div>
                <div className="w-1/6 bg-blue-300 rounded-t-sm h-[90%] relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">115</div></div>
                <div className="w-1/6 bg-blue-400 rounded-t-sm h-[60%] relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">80</div></div>
                <div className="w-1/6 bg-blue-500 rounded-t-sm h-[110%] relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">135</div></div>
                <div className="w-1/6 bg-blue-600 rounded-t-sm h-[75%] relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">95</div></div>
             </div>
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Calidad de leads */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex-1">
            <h3 className="font-semibold text-lg mb-4">Calidad de leads</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0 rounded-full border-8 border-slate-100 overflow-hidden">
                   <div className="absolute inset-0 border-8 border-green-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 70%)' }}></div>
                   <div className="absolute inset-0 border-8 border-amber-400 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 70%, 0 30%)' }}></div>
                   <div className="absolute inset-0 border-8 border-red-400 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 30%, 50% 0, 100% 0)' }}></div>
                </div>
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>Alta</span><span className="font-medium">65%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div>Media</span><span className="font-medium">20%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div>Baja</span><span className="font-medium">15%</span></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                 <div className="text-sm font-medium mb-3">Principales motivos de pérdida</div>
                 <div className="space-y-2 text-sm text-muted-foreground">
                   <div className="flex justify-between"><span>No respondió</span><span>42%</span></div>
                   <div className="flex justify-between"><span>Precio</span><span>28%</span></div>
                   <div className="flex justify-between"><span>No cumple requisitos</span><span>15%</span></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
