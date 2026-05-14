import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function MetricsFilters() {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-card w-full shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Select defaultValue="30d">
        <SelectTrigger className="w-[140px] shrink-0 h-8 text-xs">
          <SelectValue placeholder="Rango" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoy</SelectItem>
          <SelectItem value="7d">Últimos 7 días</SelectItem>
          <SelectItem value="30d">Últimos 30 días</SelectItem>
          <SelectItem value="month">Este mes</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] shrink-0 h-8 text-xs">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los canales</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] shrink-0 h-8 text-xs">
          <SelectValue placeholder="Equipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los equipos</SelectItem>
          <SelectItem value="admisiones">Admisiones</SelectItem>
          <SelectItem value="soporte">Soporte académico</SelectItem>
          <SelectItem value="finanzas">Finanzas / pagos</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] shrink-0 h-8 text-xs">
          <SelectValue placeholder="Programa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los programas</SelectItem>
          <SelectItem value="diplomado_ux">Diplomado UX/UI</SelectItem>
          <SelectItem value="marketing">Marketing Digital</SelectItem>
          <SelectItem value="data">Data Analytics</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground ml-auto shrink-0">
        Limpiar filtros
      </Button>
    </div>
  );
}
