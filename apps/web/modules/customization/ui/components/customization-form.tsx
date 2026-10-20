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
        <Card className="border-[#E2E8F0] bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#0F172A]">
              General Chat Settings
            </CardTitle>
            <CardDescription className="text-sm text-[#475569]">
              Configure basic chat widget behaviour and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#0F172A]">
                    Greeting Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Welcome message shown when the chat open"
                      rows={3}
                      className="border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-[#475569]">
                    The first message customers see when they open the chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-[#E2E8F0]" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm leading-snug font-semibold text-[#0F172A]">
                  Default Suggestions
                </h3>
                <p className="text-sm text-[#475569]">
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
                      <FormLabel className="text-sm font-semibold text-[#0F172A]">
                        Suggestion 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., How do I get started?"
                          className="h-10 border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
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
                      <FormLabel className="text-sm font-semibold text-[#0F172A]">
                        Suggestion 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., What are your pricing plans?"
                          className="h-10 border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
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
                      <FormLabel className="text-sm font-semibold text-[#0F172A]">
                        Suggestion 3
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., I need help with my account"
                          className="h-10 border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
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
          <Card className="border-[#E2E8F0] bg-white shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#0F172A]">
                Voice Assistant Settings
              </CardTitle>
              <CardDescription className="text-sm text-[#475569]">
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
            className="h-10 bg-[#127CDD] px-4 text-sm font-semibold text-white hover:bg-[#0F2D52] disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:opacity-100"
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
