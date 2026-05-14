import * as React from "react";
import { Contact, CustomPropertyDefinition } from "@/types/contacts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ContactPropertiesTabProps {
  contact: Contact;
  customProperties: CustomPropertyDefinition[];
  onUpdateContact: (updated: Contact) => void;
}

export function ContactPropertiesTab({ contact, customProperties, onUpdateContact }: ContactPropertiesTabProps) {

  const handleUpdate = (key: string, value: any, propName: string) => {
    onUpdateContact({
      ...contact,
      customProperties: {
         ...contact.customProperties,
         [key]: value
      },
      timelineEvents: [
        {
          id: `ev_${Date.now()}`,
          type: "property_updated",
          title: "Propiedad actualizada",
          description: `Se actualizó la propiedad "${propName}".`,
          createdAt: new Date().toISOString()
        },
        ...contact.timelineEvents
      ]
    });
    toast.success(`Propiedad "${propName}" actualizada`);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
           <h4 className="font-semibold text-sm">Propiedades personalizadas</h4>
           <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" onClick={() => toast("Crea nuevas propiedades desde la tabla principal.")}>
              Administrar
           </Button>
        </div>
        
        {customProperties.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded text-center">
            Aún no hay propiedades personalizadas.
          </div>
        ) : (
          <div className="space-y-5">
            {customProperties.map(prop => {
              const val = contact.customProperties[prop.key];
              
              return (
                <div key={prop.id} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{prop.name}</Label>
                  
                  {prop.type === "text" && (
                    <Input 
                      className="h-8 text-sm" 
                      value={val || ""} 
                      onChange={e => handleUpdate(prop.key, e.target.value, prop.name)} 
                      placeholder="Sin valor"
                    />
                  )}

                  {prop.type === "number" && (
                    <Input 
                      type="number"
                      className="h-8 text-sm" 
                      value={val || ""} 
                      onChange={e => handleUpdate(prop.key, e.target.value ? Number(e.target.value) : "", prop.name)}
                      placeholder="Sin valor"
                    />
                  )}

                  {prop.type === "boolean" && (
                    <div className="flex items-center h-8">
                      <Switch 
                        checked={!!val} 
                        onCheckedChange={c => handleUpdate(prop.key, c, prop.name)}
                      />
                      <span className="ml-2 text-sm">{val ? "Sí" : "No"}</span>
                    </div>
                  )}

                  {prop.type === "single_select" && (
                    <Select value={val || ""} onValueChange={v => handleUpdate(prop.key, v, prop.name)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Seleccionar opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {prop.options?.map(o => (
                          <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {prop.type === "multi_select" && (
                    <div className="text-xs text-muted-foreground py-1">
                       <Badge variant="outline" className="mr-2">Edición de multiselect simulada</Badge>
                       {Array.isArray(val) && val.length > 0 ? val.join(", ") : "Sin seleccionar"}
                    </div>
                  )}

                  {prop.type === "date" && (
                    <Input 
                      type="date"
                      className="h-8 text-sm" 
                      value={val || ""} 
                      onChange={e => handleUpdate(prop.key, e.target.value, prop.name)}
                    />
                  )}
                  
                  {prop.description && (
                     <p className="text-[10px] text-muted-foreground/70">{prop.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
