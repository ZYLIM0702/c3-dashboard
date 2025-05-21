"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Compass,
  Cpu,
  Database,
  Home,
  Layers,
  LifeBuoy,
  Menu,
  Radio,
  Settings,
  Smartphone,
  Users,
  Waves,
  Wind,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Alerts",
      icon: AlertTriangle,
      href: "/alerts",
      active: pathname === "/alerts",
    },
    {
      label: "Devices",
      icon: Cpu,
      href: "/devices",
      active: pathname === "/devices" || pathname.startsWith("/devices/"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Map",
      icon: Compass,
      href: "/map",
      active: pathname === "/map",
    },
    {
      label: "Events",
      icon: Calendar,
      href: "/events",
      active: pathname === "/events",
    },
    {
      label: "Teams",
      icon: Users,
      href: "/teams",
      active: pathname === "/teams",
    },
    {
      label: "Deployments",
      icon: Layers,
      href: "/deployments",
      active: pathname === "/deployments",
    },
  ]

  const deviceTypes = [
    {
      label: "Ground Nodes",
      icon: Radio,
      href: "/devices/ground-nodes",
      active: pathname === "/devices/ground-nodes",
    },
    {
      label: "Marine Buoys",
      icon: Waves,
      href: "/devices/marine-buoys",
      active: pathname === "/devices/marine-buoys",
    },
    {
      label: "Wearables",
      icon: Smartphone,
      href: "/devices/wearables",
      active: pathname === "/devices/wearables",
    },
    {
      label: "Drones",
      icon: Wind,
      href: "/devices/drones",
      active: pathname === "/devices/drones",
    },
    {
      label: "Smart Helmets",
      icon: LifeBuoy,
      href: "/devices/helmets",
      active: pathname === "/devices/helmets",
    },
  ]

  const SidebarContent = (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">C3 Dashboard</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  route.active ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Device Types</h2>
          <div className="space-y-1">
            {deviceTypes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  route.active ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">System</h2>
          <div className="space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                pathname === "/settings" ? "bg-muted text-primary" : "text-muted-foreground",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/database"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                pathname === "/database" ? "bg-muted text-primary" : "text-muted-foreground",
              )}
            >
              <Database className="h-4 w-4" />
              Database
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <ScrollArea className="h-full">{SidebarContent}</ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden border-r bg-background md:block">
      <ScrollArea className="h-screen">{SidebarContent}</ScrollArea>
    </div>
  )
}
