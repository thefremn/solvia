"use client";

import { GlobeIcon ,PhoneIcon,PhoneCallIcon,WorkflowIcon } from "lucide-react";
import { PluginCard } from "../components/plugin-card";

const vapiFeatures = [
  {
    label: "Web Voice Calls",
    description: "Voice chat directly in your app",
    icon: GlobeIcon,
  },
  {
    label: "Phone numbers",
    description: "Get dedicated business lines",
    icon: PhoneIcon,
  },
  {
    label: "Outbound calls",
    description: "Automated customer outreach",
    icon: PhoneCallIcon,
  },
  {
    label: "Workflows",
    description: "Customer conversation flows",
    icon: WorkflowIcon,
  },
];


export const VapiView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md: text-4x1">Vapi Plugin</h1>
          <p className="text-muted-foreground">
            Connect Vapi to enable AI voice calls and phone support
          </p>
        </div>

        <div className="mt-8">
          <PluginCard 
            serviceImage="/vapi.png"
            serviceName="Vapi"
            features={vapiFeatures}
          />
        </div>
      </div>
    </div>
  );
};
