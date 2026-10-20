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
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted hover:bg-muted">
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Assistant
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Model
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              First Message
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    Loading assistants...
                  </TableCell>
                </TableRow>
              );
            }
            if (assistants.length === 0) {
              return (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    No assistants configured
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant) => (
              <TableRow
                className="border-border hover:bg-muted"
                key={assistant.id}
              >
                <TableCell className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      {assistant.name || "Unnamed assistant"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-muted-foreground">
                    {assistant.model?.model || "Not configured"}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs px-3 py-3">
                  <p className="truncate text-sm text-muted-foreground">
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
