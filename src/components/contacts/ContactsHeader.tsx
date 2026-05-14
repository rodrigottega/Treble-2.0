import * as React from "react";
import { Button } from "@/components/ui/button";
import { ImportCsvDialog } from "./ImportCsvDialog";
import { AddContactDialog } from "./AddContactDialog";
import { ExportContactsDialog } from "./ExportContactsDialog";
import { Contact } from "@/types/contacts";

interface ContactsHeaderProps {
  onAddContact: (contact: Contact) => void;
  onImport: (contacts: any[]) => void;
}

export function ContactsHeader({ onAddContact, onImport }: ContactsHeaderProps) {
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  return (
    <>
      <div className="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Gestiona contactos, propiedades, conversaciones y etapas del funnel en un solo lugar.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
            <i className="ri-upload-2-line mr-2"></i>
            Importar CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
             <i className="ri-download-2-line mr-2"></i>
             Exportar
          </Button>
          <Button size="sm" onClick={() => setIsAddContactOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Agregar contacto
          </Button>
        </div>
      </div>

      <ImportCsvDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={onImport} />
      <AddContactDialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen} onAdd={onAddContact} />
      <ExportContactsDialog open={isExportOpen} onOpenChange={setIsExportOpen} mode="all" />
    </>
  );
}
