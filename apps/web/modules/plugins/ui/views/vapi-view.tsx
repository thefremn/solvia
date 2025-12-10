"use client";

import { GlobeIcon ,PhoneIcon,PhoneCallIcon,WorkflowIcon } from "lucide-react";
import { PluginCard } from "../components/plugin-card";
import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

const vapiFeature = [
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

const formSchema = z.object({
  publicApiKey: z.string().min(1, {message: "Public API key is required"}),
  privateApiKey: z.string().min(1, {message: "Private API key is required"}),
});

const VapiPluginForm = ({
  open,
  setOpen,
} : {
  open: boolean;
  setOpen: (value: boolean) => void
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        }
      });
      setOpen(false);
      toast.success("Vapi secret created");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your API keys are safely encrypted and stored using AWS Secrets Manager.
        </DialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({field}) => (
                <FormItem>
                  <Label>Public API Key</Label>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Your public API key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({field}) => (
                <FormItem>
                  <Label>Private API Key</Label>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Your private API key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};


export const VapiView = () => {

  const vapiPlugin = useQuery(api.private.plugins.getOne, {service: "vapi"});

  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleSubmit = () => {
    if(vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    };
  }

  return (
    <>
    <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
    <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md: text-4x1">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </div>

          <div className="mt-8">
            {vapiPlugin ? (
              <p>Connected!!</p>
            ) : (
              <PluginCard 
                serviceImage="/vapi.png"
                serviceName="Vapi"
                features={vapiFeature}
                isDisabled={vapiPlugin === undefined}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
