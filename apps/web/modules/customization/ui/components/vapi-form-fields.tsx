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
            <FormLabel className="text-sm font-semibold text-[#0F172A]">
              Voice Assistant
            </FormLabel>
            <Select
              disabled={disabled || assiantansLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-10 border-[#E2E8F0] bg-white text-sm text-[#0F172A] data-placeholder:text-[#475569] focus:border-[#0F2D52]">
                  <SelectValue
                    placeholder={
                      assiantansLoading
                        ? "Loading assistants..."
                        : "Select a voice assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-[#E2E8F0] bg-white">
                <SelectItem
                  value="none"
                  className="text-sm text-[#0F172A] focus:bg-[#EBF5FF] focus:text-[#0F2D52]"
                >
                  None
                </SelectItem>
                {assistants.map((assistant) => (
                  <SelectItem
                    key={assistant.id}
                    value={assistant.id}
                    className="text-sm text-[#0F172A] focus:bg-[#EBF5FF] focus:text-[#0F2D52]"
                  >
                    {assistant.name || "Unnamed Assistant"} -{" "}
                    {assistant.model?.model || "Unknown Model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-[#475569]">
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
            <FormLabel className="text-sm font-semibold text-[#0F172A]">
              Display Phone Number
            </FormLabel>
            <Select
              disabled={disabled || phoneNumbersLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-10 border-[#E2E8F0] bg-white text-sm text-[#0F172A] data-placeholder:text-[#475569] focus:border-[#0F2D52]">
                  <SelectValue
                    placeholder={
                      assiantansLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-[#E2E8F0] bg-white">
                <SelectItem
                  value="none"
                  className="text-sm text-[#0F172A] focus:bg-[#EBF5FF] focus:text-[#0F2D52]"
                >
                  None
                </SelectItem>
                {phoneNumbers.map((phone) => (
                  <SelectItem
                    key={phone.id}
                    value={phone.number || phone.id}
                    className="text-sm text-[#0F172A] focus:bg-[#EBF5FF] focus:text-[#0F2D52]"
                  >
                    {phone.number || "Unknown"} - {phone.name || "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-[#475569]">
              Phone number to display in the widget
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
