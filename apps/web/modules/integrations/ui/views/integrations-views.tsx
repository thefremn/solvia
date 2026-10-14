"use client";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Separator } from "@workspace/ui/components/separator";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { INTEGRATIONS, type IntegrationId } from "../../constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { getIntegrationDetails } from "../../utils";

export const IntegrationsViews = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] =
    useState<IntegrationId | null>(null);
  const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Organization not found");
      return;
    }
    setSelectedIntegrationId(integrationId);
    setDialogOpen(true);
  };

  const handleCopyOrgId = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "");
      toast.success("Organization ID copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <>
      <IntegrationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        integrationId={selectedIntegrationId}
        organizationId={organization?.id ?? ""}
      />
      <div className="flex min-h-screen flex-col bg-[#F8FAFC] p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-screen-md flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl leading-tight font-bold text-[#0F172A]">
              Setup & Integrations
            </h1>
            <p className="text-sm text-[#475569]">
              Choose the integration that&apos;s right for you
            </p>
          </div>
          <Card className="border-[#E2E8F0] bg-white shadow-xs">
            <CardContent className="p-4">
              <Field>
                <FieldLabel
                  htmlFor="organization-id"
                  className="text-sm font-semibold text-[#0F172A]"
                >
                  Organization ID
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    id="organization-id"
                    readOnly
                    value={organization?.id ?? ""}
                    className="h-10 flex-1 border-[#E2E8F0] bg-[#F1F5F9] font-mono text-sm text-[#0F172A]"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyOrgId}
                    className="h-10 shrink-0 bg-[#0F2D52] px-3 text-sm font-semibold text-white hover:bg-[#0A2240]"
                  >
                    <CopyIcon data-icon="inline-start" />
                    Copy
                  </Button>
                </div>
              </Field>
            </CardContent>
          </Card>
          <Separator className="bg-[#E2E8F0]" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Integrations
              </h2>
              <p className="text-sm text-[#475569]">
                Add the following code to your website to enable the chatbox.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-xs transition-colors duration-150 ease-out outline-none hover:border-[#0F2D52] focus-visible:border-[#0F2D52]"
                >
                  <Image
                    src={integration.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="shrink-0"
                  />
                  <p className="truncate text-sm font-semibold text-[#0F172A]">
                    {integration.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const IntegrationsDialog = ({
  open,
  onOpenChange,
  integrationId,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  integrationId: IntegrationId | null;
  organizationId: string;
}) => {
  const details = integrationId
    ? getIntegrationDetails(integrationId, organizationId)
    : null;

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-[#E2E8F0] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#0F172A]">
            {details
              ? `Integrate with ${details.title}`
              : "Integrate with your website"}
          </DialogTitle>
          <DialogDescription className="text-[#475569]">
            {details?.description ??
              "Follow these steps to add the chatbox to your website"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {details?.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="rounded-md bg-[#F1F5F9] px-3 py-2 text-sm font-semibold text-[#0F172A]">
                {step.title}
              </div>
              {step.description && (
                <p className="text-sm text-[#475569]">{step.description}</p>
              )}
              {step.code && (
                <div className="group relative mt-2">
                  <pre className="max-h-[300px] overflow-x-auto overflow-y-auto rounded-md border border-[#E2E8F0] bg-[#F1F5F9] p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-[#0F172A] md:text-sm">
                    {step.code}
                  </pre>
                  <Button
                    className="absolute top-2 right-2 border-[#E2E8F0] bg-white text-[#475569] opacity-100 hover:bg-[#EBF5FF] hover:text-[#0F2D52] focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                    onClick={() => handleCopyCode(step.code!)}
                    size="icon-sm"
                    variant="outline"
                    aria-label="Copy code to clipboard"
                    title="Copy code to clipboard"
                  >
                    <CopyIcon />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
