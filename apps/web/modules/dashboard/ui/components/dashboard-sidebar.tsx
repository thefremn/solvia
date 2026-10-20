"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

type NavBadge = {
  label: string;
  tone: "neutral" | "pending";
};

const BADGE_STYLES: Record<NavBadge["tone"], string> = {
  // DESIGN.md 1.2 status colour map
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
};

type NavItem = {
  title: string;
  url: string;
  icon: typeof InboxIcon;
  badge?: NavBadge;
};

const customerSupportItems: NavItem[] = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems: NavItem[] = [
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
  },
];

const accountItems: NavItem[] = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

const navGroups = [
  { label: "Customer Support", items: customerSupportItems },
  { label: "Configuration", items: configurationItems },
  { label: "Account", items: accountItems },
];

const SidebarCollapseToggle = ({
  direction,
  className,
}: {
  direction: "collapse" | "expand";
  className?: string;
}) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      aria-label={
        direction === "collapse" ? "Collapse Sidebar" : "Expand Sidebar"
      }
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {direction === "collapse" ? <ChevronLeft /> : <ChevronRight />}
    </Button>
  );
};

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Link
            href="/conversations"
            className="flex items-center gap-2"
            aria-label="Solvia home"
          >
            <Image src="/logo.svg" alt="Solvia logo" width={24} height={24} />
            <span className="text-base font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
              Solvia
            </span>
          </Link>
          <SidebarCollapseToggle
            direction="collapse"
            className="ml-auto group-data-[collapsible=icon]:hidden"
          />
        </div>
        <div className="hidden justify-center group-data-[collapsible=icon]:flex">
          <SidebarCollapseToggle direction="expand" />
        </div>
        <div className="rounded-md border border-border bg-card group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <OrganizationSwitcher
                  hidePersonal
                  skipInvitationScreen
                  appearance={{
                    elements: {
                      rootBox: "w-full! h-10!",
                      avatarBox: "size-6! rounded-md",
                      organizationSwitcherTrigger:
                        "w-full! justify-start! rounded-md! px-2! hover:bg-muted! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                      organizationPreview:
                        "group-data-[collapsible=icon]:justify-center! gap-2!",
                      organizationPreviewTextContainer:
                        "group-data-[collapsible=icon]:hidden! text-sm! font-semibold! text-foreground!",
                      organizationSwitcherTriggerIcon:
                        "group-data-[collapsible=icon]:hidden! ml-auto! text-muted-foreground!",
                    },
                  }}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-10 rounded-md text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground",
                          active &&
                            "bg-accent font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Link href={item.url} className="relative">
                          <span
                            aria-hidden
                            className={cn(
                              "absolute top-1/2 -left-2 hidden h-5 w-[3px] -translate-y-1/2 rounded-full group-data-[collapsible=icon]:block",
                              active ? "bg-brand-accent" : "bg-transparent",
                            )}
                          />
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0",
                              active ? "text-brand-accent" : "text-muted-foreground",
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold group-data-[collapsible=icon]:hidden",
                                BADGE_STYLES[item.badge.tone],
                              )}
                            >
                              {item.badge.label}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "w-full! h-10!",
                  userButtonTrigger:
                    "w-full! rounded-md! p-2! hover:bg-muted! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                  userButtonBox:
                    "w-full! flex-row-reverse! justify-end! gap-2! text-foreground! group-data-[collapsible=icon]:justify-center!",
                  userButtonOuterIdentifier:
                    "pl-0! text-sm! font-semibold! group-data-[collapsible=icon]:hidden!",
                  avatarBox: "size-6! rounded-full",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
