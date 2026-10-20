"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { CustomizationForm } from "../components/customization-form";

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  const isLoading = widgetSettings === undefined || vapiPlugin === undefined;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background p-8">
        <Loader2Icon className="animate-spin text-foreground" />
        <p className="text-sm text-muted-foreground">Loading Settings...</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-background p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl leading-tight font-bold text-foreground">
            Widget Customization
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>
        <div>
          <CustomizationForm
            initialData={widgetSettings}
            hasVapiPlugin={!!vapiPlugin}
          />
        </div>
      </div>
    </div>
  );
};
