import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { templatesData } from "@/data/metrics";

export function ChannelMetricsPage() {
  const handleExport = () => {
    toast.success("Exportación generada.");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Por canal</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Compara rendimiento, volumen y conversión entre WhatsApp e Instagram.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Comparación principal</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Métrica</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Instagram</th>
                  <th className="px-4 py-3 font-medium text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">Conversaciones nuevas</td>
                  <td className="px-4 py-3">812</td>
                  <td className="px-4 py-3">472</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">+72% WA</td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">Conversión a inscrito</td>
                  <td className="px-4 py-3">16.4%</td>
                  <td className="px-4 py-3">11.2%</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">+5.2 pp WA</td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">Tasa de respuesta</td>
                  <td className="px-4 py-3">94.2%</td>
                  <td className="px-4 py-3">88.5%</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">+5.7 pp WA</td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">Primera respuesta promedio</td>
                  <td className="px-4 py-3">5m 12s</td>
                  <td className="px-4 py-3">3m 45s</td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">-1m 27s IG</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-card border rounded-xl p-4 flex flex-col justify-between">
            <h4 className="font-medium text-sm mb-4">Volumen de conversaciones</h4>
            <div className="flex-1 min-h-[160px] flex items-end gap-6 pr-4 pt-4 pb-2 border-b">
              <div className="flex-1 flex flex-col gap-2 items-center h-full justify-end">
                <div className="w-[80%] max-w-[80px] bg-green-500 rounded-t-lg relative group transition-all" style={{ height: '100%' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm opacity-100">812</div>
                </div>
                <div className="text-xs font-medium text-foreground">WhatsApp</div>
              </div>
              <div className="flex-1 flex flex-col gap-2 items-center h-full justify-end">
                <div className="w-[80%] max-w-[80px] bg-pink-500 rounded-t-lg relative group transition-all" style={{ height: '58%' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm opacity-100">472</div>
                </div>
                <div className="text-xs font-medium text-foreground">Instagram</div>
              </div>
            </div>
            
            <div className="mt-4 pt-2 flex gap-2">
              <i className="ri-lightbulb-flash-line text-blue-500 mt-0.5"></i>
              <p className="text-xs text-muted-foreground leading-tight">
                <span className="font-medium text-foreground">WhatsApp concentra el 63% de las conversaciones</span> y tiene mejor conversión a inscrito. Instagram genera más leads iniciales de baja intención.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-whatsapp-line text-green-600 text-xl"></i>
            <h3 className="font-semibold text-lg">WhatsApp</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Las métricas de WhatsApp ayudan a monitorear entregabilidad y uso de templates.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-muted/50">
               <div className="text-sm font-medium mb-2">Entregabilidad</div>
               <div className="space-y-2">
                 <div>
                   <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Entregados</span><span>98%</span></div>
                   <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[98%]"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Leídos</span><span>84%</span></div>
                   <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[84%]"></div></div>
                 </div>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="flex-1 p-3 bg-muted/30 rounded-xl border border-muted/50 text-center">
                 <div className="text-xl font-bold">142</div>
                 <div className="text-xs text-muted-foreground">Ventanas activas</div>
               </div>
               <div className="flex-1 p-3 bg-red-50 rounded-xl border border-red-100 text-center cursor-pointer hover:bg-red-100 transition-colors" onClick={() => toast("Filtro disponible próximamente.")}>
                 <div className="text-xl font-bold text-red-700">38</div>
                 <div className="text-xs text-red-600">Ventanas expiradas</div>
               </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Rendimiento de templates</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="font-medium pb-2 pr-4">Template</th>
                      <th className="font-medium pb-2 pr-4">Entregados</th>
                      <th className="font-medium pb-2 pr-4">Tasa resp.</th>
                      <th className="font-medium pb-2">Calidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {templatesData.map((t, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{t.name}</div>
                          <div className="text-[10px] text-muted-foreground">{t.category}</div>
                        </td>
                        <td className="py-2 pr-4">{t.delivered}</td>
                        <td className="py-2 pr-4">{t.responseRate}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.quality === 'Alta' ? 'bg-green-100 text-green-700' : t.quality === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {t.quality}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-instagram-line text-pink-600 text-xl"></i>
            <h3 className="font-semibold text-lg">Instagram</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Usa estas métricas para entender qué origen trae mejores leads.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-muted/50">
              <div className="text-sm font-medium mb-3">Origen de conversaciones</div>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div><span className="text-muted-foreground">DM orgánico</span></div>
                   <span className="font-medium">45%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-muted-foreground">Story reply</span></div>
                   <span className="font-medium">32%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-muted-foreground">Comentario</span></div>
                   <span className="font-medium">18%</span>
                 </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Rendimiento por origen</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="font-medium pb-2 pr-4">Origen</th>
                      <th className="font-medium pb-2 pr-4">Conversaciones</th>
                      <th className="font-medium pb-2 pr-4">Conversión</th>
                      <th className="font-medium pb-2">T. Resp.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-medium">DM orgánico</td>
                      <td className="py-2 pr-4">212</td>
                      <td className="py-2 pr-4">12.4%</td>
                      <td className="py-2">5m</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Story reply</td>
                      <td className="py-2 pr-4">151</td>
                      <td className="py-2 pr-4">9.8%</td>
                      <td className="py-2">3m</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Comentario</td>
                      <td className="py-2 pr-4">84</td>
                      <td className="py-2 pr-4">8.2%</td>
                      <td className="py-2">12m</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Anuncio</td>
                      <td className="py-2 pr-4">25</td>
                      <td className="py-2 pr-4">18.5%</td>
                      <td className="py-2">2m</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
