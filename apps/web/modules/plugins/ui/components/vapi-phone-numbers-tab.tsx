"use client";

import { CheckCircleIcon, PhoneIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();

  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted hover:bg-muted">
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Phone Number
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Name
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Status
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
                    Loading phone numbers...
                  </TableCell>
                </TableRow>
              );
            }
            if (phoneNumbers.length === 0) {
              return (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    No phone numbers configured
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumbers.map((phone) => {
              const isActive = phone.status === "active";
              return (
                <TableRow
                  className="border-border hover:bg-muted"
                  key={phone.id}
                >
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-mono text-sm text-foreground">
                        {phone.number || "Not configured"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                    {phone.name || "Unnamed"}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <Badge
                      className={
                        isActive
                          ? "border-transparent bg-green-100 font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400 capitalize"
                          : "border-transparent bg-slate-100 font-semibold text-slate-600 dark:bg-slate-500/15 dark:text-slate-400 capitalize"
                      }
                    >
                      {isActive && <CheckCircleIcon />}
                      {phone.status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            });
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
