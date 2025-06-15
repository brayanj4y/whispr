import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/components/i18n-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whispr - Anonymous Messages & Self-Destructing Secrets",
  description: "Send anonymous NGL messages and create self-destructing secret links",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <Providers>
            {children}
            <Toaster />
            <Analytics />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  )
}
