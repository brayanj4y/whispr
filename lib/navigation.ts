import { MessageSquare, Lock, Plus, Inbox, Send, Settings } from "lucide-react"

export const navigationItems = [
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

export const mobileNavigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "Messages",
    url: "/dashboard/ngl",
    icon: MessageSquare,
  },
  {
    title: "Create",
    url: "/dashboard/create-secret",
    icon: Plus,
  },
  {
    title: "Secrets",
    url: "/dashboard/secrets",
    icon: Lock,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export const quickActionItems = [
  {
    title: "My NGL Link",
    url: (username: string) => `/ngl/${username}`,
    icon: Send,
  },
] 