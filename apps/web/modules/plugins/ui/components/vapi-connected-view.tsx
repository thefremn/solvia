"use client";

import { BotIcon, PhoneIcon, SettingsIcon, UnplugIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { VapiPhoneNumbersTab } from "./vapi-phone-numbers-tab";
import { VapiAssistantsTab } from "./vapi-assistants-tab";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Image
                alt="Vapi"
                className="rounded-lg object-contain"
                height={48}
                width={48}
                src="/vapi.png"
              />
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-foreground">
                  Vapi Integration
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Manage your phone numbers and AI assistants
                </CardDescription>
              </div>
            </div>

            <Button onClick={onDisconnect} size="sm" variant="destructive">
              <UnplugIcon />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                <SettingsIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-foreground">
                  Widget Configuration
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Set up voice calls for your chat widget
                </CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href="/customization">
                <SettingsIcon />
                Configure
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <Tabs
          className="gap-0"
          defaultValue="phone-numbers"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-none border-b border-border bg-muted p-1">
            <TabsTrigger
              className="h-full rounded-md text-sm text-muted-foreground data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              value="phone-numbers"
            >
              <PhoneIcon />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger
              className="h-full rounded-md text-sm text-muted-foreground data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              value="assistants"
            >
              <BotIcon />
              AI Assistants
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone-numbers" className="mt-0">
            <VapiPhoneNumbersTab />
          </TabsContent>
          <TabsContent value="assistants" className="mt-0">
            <VapiAssistantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
