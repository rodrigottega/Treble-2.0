import * as React from "react";
import { SettingsSection } from "../../types/settings";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-64 border-r bg-card h-full flex flex-col z-10">
      <div className="p-4 border-b h-14 flex items-center">
        <h2 className="font-semibold">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <MenuButton 
            active={activeSection === "pricing_plans"}
            onClick={() => onSectionChange("pricing_plans")}
            icon="ri-bank-card-line"
            label="Pricing / Planes"
          />
        </div>
      </div>
    </div>
  );
}

function MenuButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <i className={`${icon} ${active ? "text-primary" : "text-muted-foreground"} text-lg`}></i>
      {label}
    </button>
  );
}
