"use client";

import { BotIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiAssistants } from "../../hooks/use-vapi-data";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading } = useVapiAssistants();

  return (
    <div className="bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] bg-[#F1F5F9] hover:bg-[#F1F5F9]">
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              Assistant
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              Model
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              First Message
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-[#475569]"
                  >
                    Loading assistants...
                  </TableCell>
                </TableRow>
              );
            }
            if (assistants.length === 0) {
              return (
                <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-[#475569]"
                  >
                    No assistants configured
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant) => (
              <TableRow
                className="border-[#E2E8F0] hover:bg-[#F1F5F9]"
                key={assistant.id}
              >
                <TableCell className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 shrink-0 text-[#475569]" />
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {assistant.name || "Unnamed assistant"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-[#475569]">
                    {assistant.model?.model || "Not configured"}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs px-3 py-3">
                  <p className="truncate text-sm text-[#475569]">
                    {assistant.firstMessage || "No greeting configured"}
                  </p>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
