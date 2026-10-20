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
      <div className="flex min-h-screen flex-col bg-background p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-screen-md flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl leading-tight font-bold text-foreground">
              Setup & Integrations
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose the integration that&apos;s right for you
            </p>
          </div>
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="p-4">
              <Field>
                <FieldLabel
                  htmlFor="organization-id"
                  className="text-sm font-semibold text-foreground"
                >
                  Organization ID
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    id="organization-id"
                    readOnly
                    value={organization?.id ?? ""}
                    className="h-10 flex-1 border-border bg-muted font-mono text-sm text-foreground"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyOrgId}
                    className="h-10 shrink-0 bg-primary px-3 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    <CopyIcon data-icon="inline-start" />
                    Copy
                  </Button>
                </div>
              </Field>
            </CardContent>
          </Card>
          <Separator className="bg-muted" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-foreground">
                Integrations
              </h2>
              <p className="text-sm text-muted-foreground">
                Add the following code to your website to enable the chatbox.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-colors duration-150 ease-out outline-none hover:border-ring focus-visible:border-ring"
                >
                  <Image
                    src={integration.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="shrink-0"
                  />
                  <p className="truncate text-sm font-semibold text-foreground">
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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {details
              ? `Integrate with ${details.title}`
              : "Integrate with your website"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {details?.description ??
              "Follow these steps to add the chatbox to your website"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {details?.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="rounded-md bg-muted px-3 py-2 text-sm font-semibold text-foreground">
                {step.title}
              </div>
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}
              {step.code && (
                <div className="group relative mt-2">
                  <pre className="max-h-[300px] overflow-x-auto overflow-y-auto rounded-md border border-border bg-muted p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-foreground md:text-sm">
                    {step.code}
                  </pre>
                  <Button
                    className="absolute top-2 right-2 border-border bg-card text-muted-foreground opacity-100 hover:bg-accent hover:text-foreground focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
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
