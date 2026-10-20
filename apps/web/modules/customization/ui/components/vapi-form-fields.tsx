import { UseFormReturn } from "react-hook-form";
import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/hooks/use-vapi-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FormSchema } from "../../types";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
}
export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assiantansLoading } =
    useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers();
  const disabled = form.formState.isSubmitting;
  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-foreground">
              Voice Assistant
            </FormLabel>
            <Select
              disabled={disabled || assiantansLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-10 border-border bg-card text-sm text-foreground data-placeholder:text-muted-foreground focus:border-ring">
                  <SelectValue
                    placeholder={
                      assiantansLoading
                        ? "Loading assistants..."
                        : "Select a voice assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-border bg-card">
                <SelectItem
                  value="none"
                  className="text-sm text-foreground focus:bg-accent focus:text-foreground"
                >
                  None
                </SelectItem>
                {assistants.map((assistant) => (
                  <SelectItem
                    key={assistant.id}
                    value={assistant.id}
                    className="text-sm text-foreground focus:bg-accent focus:text-foreground"
                  >
                    {assistant.name || "Unnamed Assistant"} -{" "}
                    {assistant.model?.model || "Unknown Model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              The Vapi assistant to use for voice calling
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-foreground">
              Display Phone Number
            </FormLabel>
            <Select
              disabled={disabled || phoneNumbersLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-10 border-border bg-card text-sm text-foreground data-placeholder:text-muted-foreground focus:border-ring">
                  <SelectValue
                    placeholder={
                      assiantansLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-border bg-card">
                <SelectItem
                  value="none"
                  className="text-sm text-foreground focus:bg-accent focus:text-foreground"
                >
                  None
                </SelectItem>
                {phoneNumbers.map((phone) => (
                  <SelectItem
                    key={phone.id}
                    value={phone.number || phone.id}
                    className="text-sm text-foreground focus:bg-accent focus:text-foreground"
                  >
                    {phone.number || "Unknown"} - {phone.name || "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Phone number to display in the widget
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
