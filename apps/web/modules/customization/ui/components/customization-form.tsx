import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Spinner } from "@workspace/ui/components/spinner";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { api } from "@workspace/backend/_generated/api";
import { useMutation } from "convex/react";
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingsSchema } from "../../schemas";

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi! How can I help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId || "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber || "",
      },
    },
  });
  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };
      await upertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      });
      toast.success("Widget settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Card className="border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              General Chat Settings
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Configure basic chat widget behaviour and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Greeting Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Welcome message shown when the chat open"
                      rows={3}
                      className="border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    The first message customers see when they open the chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-muted" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm leading-snug font-semibold text-foreground">
                  Default Suggestions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quick reply suggestions shown to customers to help guide the
                  conversation
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="defaultSuggestions.suggestion1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Suggestion 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., How do I get started?"
                          className="h-10 border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultSuggestions.suggestion2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Suggestion 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., What are your pricing plans?"
                          className="h-10 border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultSuggestions.suggestion3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Suggestion 3
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., I need help with my account"
                          className="h-10 border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card className="border-border bg-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Voice Assistant Settings
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Configure voice calling features powered by Vapi
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="h-10 bg-brand-accent-fill px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          >
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
