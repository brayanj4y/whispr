"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, User, LinkIcon, Trash2, Copy, Check, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  name: string
  image: string
  username: string
  created_at: string
  updated_at: string
}

interface UserStats {
  nglCount: number
  secretCount: number
  totalViews: number
}

export default function ProfileSettings() {
  const { data: session, update } = useSession()
  const { t } = useTranslation()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({ nglCount: 0, secretCount: 0, totalViews: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
  })
  const [linkCopied, setLinkCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])



  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          name: data.profile.name || "",
          username: data.profile.username || "",
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/profile/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profile?.username) {
      setUsernameAvailable(null)
      return
    }

    if (username.length < 3) {
      setUsernameAvailable(false)
      return
    }

    setIsCheckingUsername(true)
    try {
      const response = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (error) {
      setUsernameAvailable(false)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    // Clean username: lowercase, alphanumeric + underscore only
    const cleanUsername = value.toLowerCase().replace(/[^a-z0-9_]/g, "")
    setFormData({ ...formData, username: cleanUsername })

    // Debounce username check
    setTimeout(() => checkUsernameAvailability(cleanUsername), 500)
  }

  const saveProfile = async () => {
    if (!formData.name.trim()) {
      toast({
        title: t('settings.name_required'),
        description: t('settings.name_required_desc'),
        variant: "destructive",
      })
      return
    }

    if (!formData.username.trim() || formData.username.length < 3) {
      toast({
        title: t('settings.invalid_username'),
        description: t('settings.invalid_username_desc'),
        variant: "destructive",
      })
      return
    }

    if (usernameAvailable === false) {
      toast({
        title: t('settings.username_unavailable'),
        description: t('settings.username_unavailable_desc'),
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.profile)

      // Update session if username changed
      if (formData.username !== profile?.username) {
        await update({ username: formData.username })
      }

      toast({
        title: t('settings.profile_updated'),
        description: t('settings.profile_updated_desc'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyNglLink = async () => {
    const nglUrl = `${window.location.origin}/ngl/${formData.username}`
    try {
      await navigator.clipboard.writeText(nglUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
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

  const deleteAccount = async () => {
    if (!confirm(t('settings.delete_account_confirm'))) {
      return
    }

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: t('settings.account_deleted'),
          description: t('settings.account_deleted_desc'),
        })
        // Redirect to sign out
        window.location.href = "/api/auth/signout"
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.delete_account_error'),
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-sm font-mono text-gray-600">{t('settings.failed_to_load')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-gray-800 mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          {t('settings.profile_settings')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-mono">{t('settings.profile_settings_desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/80 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('settings.profile_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{profile.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-mono text-gray-500">{t('settings.google_account')}</p>
                  <p className="text-sm font-mono text-gray-800">{profile.email}</p>
                  <p className="text-xs font-mono text-gray-500">{t('settings.joined')} {formatDate(profile.created_at)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-mono font-semibold text-gray-700">
                    {t('settings.display_name')}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="font-mono text-sm bg-white border-2 border-gray-200 focus:border-orange-400"
                    placeholder={t('settings.display_name_placeholder')}
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 font-mono mt-1">{t('settings.display_name_desc')}</p>
                </div>

                <div>
                  <Label htmlFor="username" className="text-sm font-mono font-semibold text-gray-700">
                    {t('settings.username')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className="font-mono text-sm bg-white border-2 border-gray-200 focus:border-orange-400 pr-8"
                      placeholder={t('settings.username_placeholder')}
                      maxLength={30}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {isCheckingUsername ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : usernameAvailable === true ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : usernameAvailable === false ? (
                        <span className="text-red-600 text-xs">✗</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 font-mono">
                      {usernameAvailable === false
                        ? t('settings.username_not_available')
                        : usernameAvailable === true
                          ? t('settings.username_available')
                          : t('settings.username_desc')}
                    </p>
                    <span className="text-xs text-gray-400 font-mono">{formData.username.length}/30</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={saveProfile}
                disabled={isSaving || usernameAvailable === false}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm py-2 sm:py-3"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('settings.saving')}
                  </div>
                ) : (
                  t('settings.save_changes')
                )}
              </Button>
            </CardContent>
          </Card>

          {/* NGL Link */}
          <Card className="bg-blue-50/80 border-2 border-blue-200">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg font-mono text-gray-800 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('settings.your_ngl_link')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
                <p className="text-xs font-mono text-gray-600 mb-1">{t('settings.share_link_desc')}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-blue-800 bg-blue-50 p-2 rounded">
                    {typeof window !== "undefined" && `${window.location.origin}/ngl/${formData.username}`}
                  </code>
                  <Button onClick={copyNglLink} size="sm" variant="outline" className="font-mono text-xs">
                    {linkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-600">
                {t('settings.share_link_help')}
              </p>
            </CardContent>
          </Card>


        </div>

        {/* Stats & Actions Sidebar */}
        <div className="space-y-4">
          {/* Account Stats */}
          <Card className="bg-green-50/80 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-gray-800">{t('settings.account_statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">{t('settings.ngl_messages')}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.nglCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">{t('settings.secrets_created')}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.secretCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">{t('settings.profile_views')}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.totalViews}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-white/80 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-gray-800">{t('settings.account_status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">{t('settings.active_account')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">{t('settings.google_verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">{t('settings.ngl_enabled')}</span>
              </div>
              
              <Separator />
              
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                size="sm"
                className="w-full font-mono text-xs border-2 border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-3 h-3 mr-1" />
                {t('auth.sign_out')}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-50/80 border-2 border-red-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-red-800">{t('settings.danger_zone')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-red-600 mb-3">
                {t('settings.danger_zone_desc')}
              </p>
              <Button onClick={deleteAccount} variant="destructive" size="sm" className="w-full font-mono text-xs">
                <Trash2 className="w-3 h-3 mr-1" />
                {t('settings.delete_account')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
