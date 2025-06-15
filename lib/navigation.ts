import { MessageSquare, Lock, Plus, Inbox, Send, Settings } from "lucide-react"

export const getNavigationItems = (t: (key: string) => string) => [
  {
    title: t('navigation.dashboard'),
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: t('navigation.ngl_messages'),
    url: "/dashboard/ngl",
    icon: MessageSquare,
  },
  {
    title: t('navigation.secret_messages'),
    url: "/dashboard/secrets",
    icon: Lock,
  },
  {
    title: t('navigation.create_secret'),
    url: "/dashboard/create-secret",
    icon: Plus,
  },
  {
    title: t('navigation.settings'),
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export const getMobileNavigationItems = (t: (key: string) => string) => [
  {
    title: t('navigation.dashboard'),
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: t('navigation.messages'),
    url: "/dashboard/ngl",
    icon: MessageSquare,
  },
  {
    title: t('navigation.create'),
    url: "/dashboard/create-secret",
    icon: Plus,
  },
  {
    title: t('navigation.secrets'),
    url: "/dashboard/secrets",
    icon: Lock,
  },
  {
    title: t('navigation.settings'),
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export const getQuickActionItems = (t: (key: string) => string) => [
  {
    title: t('navigation.my_ngl_link'),
    url: (username: string) => `/ngl/${username}`,
    icon: Send,
  },
]

// Legacy exports for backward compatibility
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