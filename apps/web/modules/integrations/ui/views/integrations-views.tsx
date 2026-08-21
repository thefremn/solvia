"use client";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
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
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<IntegrationId | null>(null);
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
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold md:text-4xl">Setup & Integrations</h1>
            <p className="text-muted-foreground">
              Choose the integration that&apos;s right for you
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <Label className="w-34" htmlFor="organization-id">
                Organization ID
              </Label>
              <Input
                id="organization-id"
                readOnly
                value={organization?.id ?? ""}
                className="flex-1 bg-background font-mono text-sm"
              />
              <Button size="sm" className="gap-2" onClick={handleCopyOrgId}>
                <CopyIcon className="size-4" />
                Copy
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <div className="space-y-1">
              <Label className="text-lg">Integrations</Label>
              <p className="text-sm text-muted-foreground">
                Add the following code to your website to enable the chatbox.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {INTEGRATIONS.map((integration) => (
                  <button
                    key={integration.id}
                    onClick={() => handleIntegrationClick(integration.id)}
                    type="button"
                    className="flex items-center gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
                  >
                    <Image
                      src={integration.icon}
                      alt={integration.title}
                      width={32}
                      height={32}
                    />
                    <p className="font-medium">{integration.title}</p>
                  </button>
                ))}
              </div>
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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {details ? `Integrate with ${details.title}` : "Integrate with your website"}
          </DialogTitle>
          <DialogDescription>
            {details?.description ?? "Follow these steps to add the chatbox to your website"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {details?.steps.map((step, idx) => (
            <div key={idx} className="space-y-2">
              <div className="rounded-md bg-accent px-3 py-2 font-medium text-sm">
                {step.title}
              </div>
              {step.description && (
                <p className="text-muted-foreground text-sm">{step.description}</p>
              )}
              {step.code && (
                <div className="group relative mt-2">
                  <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-3 font-mono text-secondary text-xs leading-relaxed md:text-sm">
                    {step.code}
                  </pre>
                  <Button
                    className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleCopyCode(step.code!)}
                    size="icon"
                    variant="secondary"
                  >
                    <CopyIcon className="size-3.5" />
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

