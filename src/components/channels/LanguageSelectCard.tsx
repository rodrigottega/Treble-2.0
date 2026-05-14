import * as React from "react";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { toast } from "sonner";

interface LanguageSelectCardProps {
  initialLanguage?: string;
}

export function LanguageSelectCard({ initialLanguage = "spanish" }: LanguageSelectCardProps) {
  const [lang, setLang] = React.useState(initialLanguage);

  const handleLangChange = (val: string) => {
    setLang(val);
    toast.success("Idioma de respuesta actualizado.");
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-1">Idioma de respuesta</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Define el idioma predeterminado para responder mensajes.
      </p>
      
      <div className="max-w-xs mb-2">
        <Select value={lang} onValueChange={handleLangChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="english">Inglés</SelectItem>
            <SelectItem value="portuguese">Portugués</SelectItem>
            <SelectItem value="french">Francés</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Este idioma se usará como preferencia inicial para respuestas manuales, sugerencias de IA y templates compatibles.
      </p>
    </div>
  );
}
