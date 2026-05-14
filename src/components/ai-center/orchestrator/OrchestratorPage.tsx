import * as React from "react";
import { OrchestratorConfig, AiAsset, SubAgent, RoutingRule, HumanHandoffRule } from "@/types/aiCenter";
import { OrchestratorHeader } from "./OrchestratorHeader";
import { OrchestratorBasicConfig } from "./OrchestratorBasicConfig";
import { AssetsManager } from "./AssetsManager";
import { ActiveSubAgentsCard } from "./ActiveSubAgentsCard";
import { HumanHandoffRulesCard } from "./HumanHandoffRulesCard";
import { OrchestratorPlayground } from "./OrchestratorPlayground";

interface OrchestratorPageProps {
  config: OrchestratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<OrchestratorConfig>>;
  assets: AiAsset[];
  setAssets: React.Dispatch<React.SetStateAction<AiAsset[]>>;
  subAgents: SubAgent[];
  routingRules: RoutingRule[];
  setRoutingRules: React.Dispatch<React.SetStateAction<RoutingRule[]>>;
  handoffRules: HumanHandoffRule[];
  setHandoffRules: React.Dispatch<React.SetStateAction<HumanHandoffRule[]>>;
  onConfigureAgent: (agent: SubAgent) => void;
}

export function OrchestratorPage({
  config,
  setConfig,
  assets,
  setAssets,
  subAgents,
  routingRules,
  setRoutingRules,
  handoffRules,
  setHandoffRules,
  onConfigureAgent
}: OrchestratorPageProps) {
  return (
    <div className="h-full flex flex-col w-full relative">
      <OrchestratorHeader config={config} setConfig={setConfig} />
      
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <OrchestratorBasicConfig config={config} setConfig={setConfig} />
        <AssetsManager assets={assets} setAssets={setAssets} />
        <ActiveSubAgentsCard subAgents={subAgents} onConfigureClick={onConfigureAgent} />
        <HumanHandoffRulesCard rules={handoffRules} setRules={setHandoffRules} />
        <div className="pt-4 border-t mt-8">
           <OrchestratorPlayground />
        </div>
        <div className="h-12 w-full"></div> {/* Spacer */}
      </div>
    </div>
  );
}
