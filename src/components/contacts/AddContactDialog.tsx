import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Contact, CustomPropertyDefinition, FunnelStageDef, ContactIntent } from "@/types/contacts";
import { toast } from "sonner";
import { initialFunnelStages, initialCustomProperties } from "@/data/contacts";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (contact: Contact) => void;
}

export function AddContactDialog({ open, onOpenChange, onAdd }: AddContactDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  
  const [waChecked, setWaChecked] = React.useState(false);
  const [igChecked, setIgChecked] = React.useState(false);
  const [instagramUsername, setInstagramUsername] = React.useState("");

  const [funnelStage, setFunnelStage] = React.useState<string>("Nuevo lead");
  const [intent, setIntent] = React.useState<ContactIntent>("Media");
  const [program, setProgram] = React.useState("");

  // Minimal implementation, no custom props dynamic generation yet for simplicity.
  
  // Clean up on close
  React.useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setCity("");
      setWaChecked(false);
      setIgChecked(false);
      setInstagramUsername("");
      setFunnelStage("Nuevo lead");
      setIntent("Media");
      setProgram("");
    }
  }, [open]);

  const isValid = name.trim() !== "" && (email.trim() !== "" || phone.trim() !== "" || instagramUsername.trim() !== "") && (!waChecked || phone.trim() !== "");

  const handleSave = () => {
    if (!isValid) return;

    const channels: ("whatsapp" | "instagram")[] = [];
    if (waChecked) channels.push("whatsapp");
    if (igChecked) channels.push("instagram");

    if (channels.length === 0) {
      // Auto-detect channels based on presence
      if (phone) channels.push("whatsapp");
      if (instagramUsername) channels.push("instagram");
      if (!phone && !instagramUsername) channels.push("whatsapp"); // fallback
    }

    const newContact: Contact = {
      id: `c_${Date.now()}`,
      name,
      initials: name.substring(0, 2).toUpperCase(),
      email: email || undefined,
      phone: phone || undefined,
      country: country || undefined,
      city: city || undefined,
      channels,
      primaryChannel: channels[0] || "whatsapp",
      instagramUsername: instagramUsername || undefined,
      funnelStage: funnelStage as any,
      intent,
      programOfInterest: program || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      conversations: [],
      timelineEvents: [
        {
          id: `ev_${Date.now()}`,
          type: "contact_created",
          title: "Contacto creado manualmente",
          description: "Añadido a través del formulario.",
          createdAt: new Date().toISOString()
        }
      ],
      customProperties: {}
    };

    onAdd(newContact);
    toast.success("Contacto agregado");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar contacto</DialogTitle>
          <DialogDescription>
            Crea un contacto nuevo y completa la información necesaria para gestionarlo desde el CRM.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">Información básica</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Nombre completo <span className="text-destructive">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Ana Pérez" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono {waChecked && <span className="text-destructive">*</span>}</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+52 ..." />
              </div>
              <div className="space-y-2">
                <Label>País</Label>
                <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">Canales</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded border">
                <Switch id="wa-checked" checked={waChecked} onCheckedChange={setWaChecked} />
                <Label htmlFor="wa-checked" className="flex items-center gap-2 cursor-pointer">
                  <i className="ri-whatsapp-line text-green-600 text-lg"></i>
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded border">
                <Switch id="ig-checked" checked={igChecked} onCheckedChange={setIgChecked} />
                <Label htmlFor="ig-checked" className="flex items-center gap-2 cursor-pointer">
                  <i className="ri-instagram-line text-pink-600 text-lg"></i>
                  Instagram
                </Label>
              </div>
            </div>
            {igChecked && (
              <div className="space-y-2">
                <Label>Usuario de Instagram</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                  <Input className="pl-8" value={instagramUsername} onChange={e => setInstagramUsername(e.target.value)} placeholder="usuario" />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">CRM / Funnel</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Etapa del funnel</Label>
                <Select value={funnelStage} onValueChange={setFunnelStage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {initialFunnelStages.map(s => (
                       <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Intención</Label>
                <Select value={intent} onValueChange={(v: any) => setIntent(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Programa de interés</Label>
                <Input value={program} onChange={e => setProgram(e.target.value)} placeholder="Ej. Maestría en IA" />
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!isValid}>Agregar contacto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
