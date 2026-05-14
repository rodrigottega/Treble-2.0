import * as React from "react";
import { Contact, CustomPropertyDefinition, FunnelStage, FunnelStageDef } from "@/types/contacts";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FunnelStageSelect } from "./FunnelStageSelect";

function SimpleTooltip({ children, content }: { children: React.ReactNode, content: string }) {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md border z-50 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
}

interface ContactsTableProps {
  contacts: Contact[];
  customProperties: CustomPropertyDefinition[];
  funnelStages: FunnelStageDef[];
  selectedIds: string[];
  onSelectIds: React.Dispatch<React.SetStateAction<string[]>>;
  onRowClick: (id: string) => void;
  onChangeStage: (id: string, stage: FunnelStage) => void;
}

export function ContactsTable({
  contacts,
  customProperties,
  funnelStages,
  selectedIds,
  onSelectIds,
  onRowClick,
  onChangeStage
}: ContactsTableProps) {
  
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < contacts.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectIds([]);
    } else {
      onSelectIds(contacts.map(c => c.id));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectIds(prev => [...prev, id]);
    } else {
      onSelectIds(prev => prev.filter(v => v !== id));
    }
  };

  const visibleCustomProps = customProperties.filter(p => p.showInTable);

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <i className="ri-contacts-book-2-line text-3xl text-muted-foreground"></i>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No encontramos contactos</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">Prueba ajustando los filtros de búsqueda o importa un archivo CSV nuevo.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left whitespace-nowrap">
      <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 border-b">
        <tr>
          <th className="px-4 py-3 w-10 font-medium">
            <Checkbox 
              checked={allSelected ? true : someSelected ? "indeterminate" : false} 
              onCheckedChange={handleSelectAll} 
            />
          </th>
          <th className="px-4 py-3 font-medium min-w-[200px]">Nombre</th>
          <th className="px-4 py-3 font-medium min-w-[140px]">Teléfono</th>
          <th className="px-4 py-3 font-medium min-w-[180px]">Email</th>
          <th className="px-4 py-3 font-medium min-w-[120px]">País</th>
          <th className="px-4 py-3 font-medium min-w-[120px]">Ciudad</th>
          <th className="px-4 py-3 font-medium">Canal</th>
          <th className="px-4 py-3 font-medium min-w-[180px]">Etapa del funnel</th>
          <th className="px-4 py-3 font-medium">Intención</th>
          <th className="px-4 py-3 font-medium">Programa</th>
          <th className="px-4 py-3 font-medium">Tags</th>
          <th className="px-4 py-3 font-medium min-w-[160px]">Última actividad</th>
          {visibleCustomProps.map(cp => (
            <th key={cp.id} className="px-4 py-3 font-medium">{cp.name}</th>
          ))}
          <th className="px-4 py-3 font-medium">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y relative">
        {contacts.map(contact => (
          <tr 
            key={contact.id} 
            className="hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => onRowClick(contact.id)}
          >
            <td className="px-4 py-3 w-10" onClick={e => e.stopPropagation()}>
              <Checkbox 
                checked={selectedIds.includes(contact.id)} 
                onCheckedChange={(c) => handleSelectOne(contact.id, c as boolean)} 
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                  {contact.initials}
                </div>
                <div className="font-medium text-foreground">{contact.name}</div>
              </div>
            </td>
            <td className="px-4 py-3 text-muted-foreground">{contact.phone || "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{contact.email || "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{contact.country || "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{contact.city || "—"}</td>
            <td className="px-4 py-3">
              <div className="flex gap-1.5">
                {contact.channels.includes("whatsapp") && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-6 h-6 p-0 flex items-center justify-center rounded-full">
                    <i className="ri-whatsapp-line"></i>
                  </Badge>
                )}
                {contact.channels.includes("instagram") && (
                  <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 w-6 h-6 p-0 flex items-center justify-center rounded-full">
                    <i className="ri-instagram-line"></i>
                  </Badge>
                )}
              </div>
            </td>
            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
              <FunnelStageSelect 
                value={contact.funnelStage} 
                onChange={(v) => onChangeStage(contact.id, v as FunnelStage)}
                funnelStages={funnelStages}
              />
            </td>
            <td className="px-4 py-3">
               <Badge variant={contact.intent === "Alta" ? "default" : contact.intent === "Media" ? "secondary" : "outline"} className="text-[10px]">
                 {contact.intent}
               </Badge>
            </td>
            <td className="px-4 py-3 max-w-[150px] truncate text-muted-foreground">
               {contact.programOfInterest || "—"}
            </td>
            <td className="px-4 py-3">
               <div className="flex gap-1">
                 {contact.tags.slice(0, 2).map((t, i) => (
                   <span key={i} className="text-[10px] px-1.5 py-0.5 rounded border bg-muted/50 text-muted-foreground truncate max-w-[80px]">{t}</span>
                 ))}
                 {contact.tags.length > 2 && (
                   <span className="text-[10px] px-1.5 py-0.5 rounded border bg-muted/50 text-muted-foreground">+{contact.tags.length - 2}</span>
                 )}
               </div>
            </td>
            <td className="px-4 py-3 text-muted-foreground">
               {format(new Date(contact.lastActivityAt), "d MMM, HH:mm", { locale: es })}
            </td>
            
            {visibleCustomProps.map(cp => (
              <td key={cp.id} className="px-4 py-3 text-muted-foreground max-w-[120px] truncate">
                 {renderCustomPropertyValue(cp, contact.customProperties[cp.key])}
              </td>
            ))}

            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <i className="ri-more-2-line"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-semibold">Acciones</div>
                  <DropdownMenuItem onClick={() => onRowClick(contact.id)}>Ver detalles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                     toast("Funcionalidad simulada: Enviar template de WhatsApp");
                  }}>Enviar template WA</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => {
                     toast("Funcionalidad simulada: Eliminar contacto");
                  }}>Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderCustomPropertyValue(prop: CustomPropertyDefinition, value: any) {
  if (value === undefined || value === null || value === "") return "—";
  
  if (prop.type === "boolean") {
    return value ? <Badge variant="outline" className="text-[10px]">Sí</Badge> : <Badge variant="outline" className="text-[10px]">No</Badge>;
  }
  
  if (prop.type === "single_select") {
     const opt = prop.options?.find(o => o.id === value);
     return opt ? <Badge variant="secondary" className="text-[10px] font-normal">{opt.label}</Badge> : "—";
  }

  if (prop.type === "multi_select" && Array.isArray(value)) {
    if(value.length === 0) return "—";
    return <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{value.length} seleccionados</span>;
  }
  
  return String(value);
}
