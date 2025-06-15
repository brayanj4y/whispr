"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Settings, User, LinkIcon, Shield, Trash2, Copy, Check } from "lucide-react"
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
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    publicProfile: true,
    allowAnonymous: true,
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
        title: "Name required",
        description: "Please enter your display name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.username.trim() || formData.username.length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      })
      return
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username unavailable",
        description: "This username is already taken. Please choose another.",
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
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
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
        title: "Copied!",
        description: "Your NGL link has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        })
        // Redirect to sign out
        window.location.href = "/api/auth/signout"
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
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
        <p className="text-sm font-mono text-gray-600">Failed to load profile. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-gray-800 mb-1 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Profile Settings
        </h1>
        <p className="text-sm text-gray-600 font-mono">Manage your account and customize your Whispr experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/80 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{profile.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-mono text-gray-500">Google Account</p>
                  <p className="text-sm font-mono text-gray-800">{profile.email}</p>
                  <p className="text-xs font-mono text-gray-500">Joined {formatDate(profile.created_at)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-mono font-semibold text-gray-700">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="font-mono text-sm bg-white border-2 border-gray-200 focus:border-orange-400"
                    placeholder="Your display name"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 font-mono mt-1">This is how others will see your name</p>
                </div>

                <div>
                  <Label htmlFor="username" className="text-sm font-mono font-semibold text-gray-700">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className="font-mono text-sm bg-white border-2 border-gray-200 focus:border-orange-400 pr-8"
                      placeholder="your_username"
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
                        ? "Username not available"
                        : usernameAvailable === true
                          ? "Username available"
                          : "Lowercase letters, numbers, and underscores only"}
                    </p>
                    <span className="text-xs text-gray-400 font-mono">{formData.username.length}/30</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={saveProfile}
                disabled={isSaving || usernameAvailable === false}
                className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* NGL Link */}
          <Card className="bg-blue-50/80 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Your NGL Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
                <p className="text-xs font-mono text-gray-600 mb-1">Share this link to receive anonymous messages:</p>
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
                Anyone with this link can send you anonymous messages. Share it on social media, in your bio, or with
                friends!
              </p>
            </CardContent>
          </Card>

          {/* Privacy & Preferences */}
          <Card className="bg-white/80 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono font-semibold text-gray-700">Email Notifications</p>
                  <p className="text-xs font-mono text-gray-500">Get notified when you receive new messages</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono font-semibold text-gray-700">Public Profile</p>
                  <p className="text-xs font-mono text-gray-500">Allow others to find your NGL link</p>
                </div>
                <Switch
                  checked={preferences.publicProfile}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, publicProfile: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono font-semibold text-gray-700">Allow Anonymous Messages</p>
                  <p className="text-xs font-mono text-gray-500">Accept messages from anonymous senders</p>
                </div>
                <Switch
                  checked={preferences.allowAnonymous}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, allowAnonymous: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Actions Sidebar */}
        <div className="space-y-4">
          {/* Account Stats */}
          <Card className="bg-green-50/80 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-gray-800">Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">NGL Messages</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.nglCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">Secrets Created</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.secretCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">Profile Views</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {stats.totalViews}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-white/80 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-gray-800">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">Active Account</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">Google Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-mono text-gray-700">NGL Enabled</span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-50/80 border-2 border-red-200">
            <CardHeader>
              <CardTitle className="text-base font-mono text-red-800">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-red-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button onClick={deleteAccount} variant="destructive" size="sm" className="w-full font-mono text-xs">
                <Trash2 className="w-3 h-3 mr-1" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
