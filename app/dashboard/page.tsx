"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Lock, Plus, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface DashboardStats {
  nglCount: number
  secretCount: number
  unreadNgl: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats>({ nglCount: 0, secretCount: 0, unreadNgl: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const copyNglLink = async () => {
    const nglUrl = `${window.location.origin}/ngl/${session?.user?.username}`
    try {
      await navigator.clipboard.writeText(nglUrl)
      toast({
        title: t('settings.link_copied'),
        description: t('dashboard.copy_link'),
      })
    } catch (error) {
      toast({
        title: t('settings.link_copy_failed'),
        description: t('common.try_again'),
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-gray-800 mb-1">
          {t('dashboard.welcome_back')}, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-sm text-gray-600 font-mono">{t('dashboard.manage_messages')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-blue-50/80 border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-blue-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('navigation.ngl_messages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold font-mono text-blue-900">{stats.nglCount}</span>
              {stats.unreadNgl > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.unreadNgl} {t('common.new')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/80 border-2 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-red-800 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t('dashboard.secret_links')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold font-mono text-red-900">{stats.secretCount}</span>
          </CardContent>
        </Card>

        <Card className="bg-green-50/80 border-2 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-green-800 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('dashboard.quick_actions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/create-secret">
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white font-mono text-xs">
                {t('navigation.create_secret')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* NGL Link Card */}
      <Card className="bg-amber-50/80 border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-gray-800">{t('dashboard.your_ngl_link')}</CardTitle>
          <CardDescription className="font-mono text-gray-600 text-sm">
            {t('dashboard.share_ngl_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/ngl/${session?.user?.username}`}
              readOnly
              className="flex-1 p-2 text-xs font-mono bg-white border-2 border-orange-200 rounded-md"
            />
            <Button onClick={copyNglLink} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Link href={`/ngl/${session?.user?.username}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full font-mono text-xs border-2">
                <ExternalLink className="w-3 h-3 mr-1" />
                {t('dashboard.preview_link')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/80 border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-mono text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('dashboard.recent_ngl')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.nglCount > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-mono text-gray-600">{t('dashboard.you_have')} {stats.nglCount} {t('dashboard.anonymous_messages')}</p>
                <Link href="/dashboard/ngl">
                  <Button size="sm" variant="outline" className="w-full font-mono text-xs">
                    {t('dashboard.view_all_messages')}
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs font-mono text-gray-500">{t('dashboard.no_messages_yet')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-mono text-gray-800 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t('navigation.secret_messages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-600">{t('dashboard.create_secret_desc')}</p>
              <Link href="/dashboard/create-secret">
                <Button size="sm" variant="outline" className="w-full font-mono text-xs">
                  {t('dashboard.create_new_secret')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
