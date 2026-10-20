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
    <div className="bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] bg-[#F1F5F9] hover:bg-[#F1F5F9]">
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              Phone Number
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              Name
            </TableHead>
            <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              Status
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
                    Loading phone numbers...
                  </TableCell>
                </TableRow>
              );
            }
            if (phoneNumbers.length === 0) {
              return (
                <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 px-3 py-8 text-center text-sm text-[#475569]"
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
                  className="border-[#E2E8F0] hover:bg-[#F1F5F9]"
                  key={phone.id}
                >
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="size-4 shrink-0 text-[#475569]" />
                      <span className="font-mono text-sm text-[#0F172A]">
                        {phone.number || "Not configured"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-[#475569]">
                    {phone.name || "Unnamed"}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <Badge
                      className={
                        isActive
                          ? "border-transparent bg-green-100 font-semibold text-green-700 capitalize"
                          : "border-transparent bg-slate-100 font-semibold text-slate-600 capitalize"
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
