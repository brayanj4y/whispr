"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { getMobileNavigationItems } from "@/lib/navigation"

export function MobileBottomNav() {
  const { data: session, status } = useSession()
  const { t } = useTranslation()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Only show on mobile and when user is authenticated
  if (!isMobile || status !== "authenticated" || !session) {
    return null
  }

  // Only show on dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return null
  }

  const navigationItems = getMobileNavigationItems(t)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-sm border-t-2 border-orange-200 px-2 py-2">
        <nav className="flex items-center justify-around max-w-md mx-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.url
            const Icon = item.icon
            
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive ? "text-orange-700" : "text-gray-600")} />
                <span className={cn("text-xs font-mono font-medium", isActive ? "text-orange-700" : "text-gray-600")}>
                  {item.title}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 