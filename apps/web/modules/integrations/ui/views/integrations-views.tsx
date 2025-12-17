"use client";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { INTEGRATIONS } from "../../constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { createScript } from "../../utils";

export const IntegrationsViews = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: string) => {
    if(!organization) {
        toast.error("Organization not found");
        return;
    }
    const snippet = createScript(integrationId, organization.id);
    setSelectedSnippet(snippet);
    setDialogOpen(true);
  };
  const handleCopy = async () => {
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
        snippet={selectedSnippet}       
        />
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md: text-4x1">Setup & Integrations</h1>
          <p className="text-muted-foreground">
            Choose the integrations tha&apos;s right for you
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
            <Button size="sm" className="gap-2" onClick={handleCopy}>
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                  className="flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
                >
                  <Image
                    src={integration.icon}
                    alt={integration.title}
                    width={32}
                    height={32}
                  />
                  <p>{integration.title}</p>
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
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
    const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Code copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
    };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add the chatbox to your website
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code
            </div>
            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleCopy}
                size="icon"
                variant="secondary"
              >
                <CopyIcon className="size-3"/>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              2.Add the code in your page
            </div>
            <p>
              Paste the chatbox code in your page. You can add it in the html
              head section.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
