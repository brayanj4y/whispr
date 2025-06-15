"use client"

import type React from "react"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Flame, MessageSquare, Lock, Plus, Inbox, Send, LogOut, Settings } from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "NGL Messages",
    url: "/dashboard/ngl",
    icon: MessageSquare,
  },
  {
    title: "Secret Messages",
    url: "/dashboard/secrets",
    icon: Lock,
  },
  {
    title: "Create Secret",
    url: "/dashboard/create-secret",
    icon: Plus,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <span className="text-lg font-bold font-mono text-gray-800">WHISPR</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-mono">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="text-xs font-mono">
                      <item.icon className="w-3 h-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-mono">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/ngl/${session?.user?.username}`} className="text-xs font-mono">
                    <Send className="w-3 h-3" />
                    <span>My NGL Link</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-xs">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 font-mono truncate">@{session?.user?.username}</p>
          </div>
        </div>
        <Button onClick={() => signOut()} variant="outline" size="sm" className="w-full text-xs font-mono">
          <LogOut className="w-3 h-3 mr-1" />
          Sign Out
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
