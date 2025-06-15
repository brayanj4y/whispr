"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Plus, Clock, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Secret {
  id: string
  message: string
  expires_at: string
  created_at: string
  is_read: boolean
  created_by_ip: string
}

export default function SecretMessages() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    fetchSecrets()
  }, [])

  const fetchSecrets = async () => {
    try {
      const response = await fetch("/api/secrets/user")
      if (response.ok) {
        const data = await response.json()
        setSecrets(data.secrets)
      }
    } catch (error) {
      console.error("Failed to fetch secrets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSecret = async (secretId: string) => {
    try {
      const response = await fetch(`/api/secrets/user/${secretId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSecrets(secrets.filter((secret) => secret.id !== secretId))
        toast({
          title: "Secret deleted",
          description: "The secret has been permanently deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete secret.",
        variant: "destructive",
      })
    }
  }

  const copySecretLink = async (secretId: string) => {
    const url = `${window.location.origin}/secret/${secretId}`
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Copied!",
        description: "Secret link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffInMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60))

    if (diffInMinutes <= 0) return "Expired"
    if (diffInMinutes < 60) return `${diffInMinutes}m left`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h left`
    return `${Math.floor(diffInMinutes / 1440)}d left`
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const secretDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - secretDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-gray-800 mb-1 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            {t("yourSecretMessages")}
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            {t("selfDestructingSecretsYouveCreated")} • {t("total")}: {secrets.length}
          </p>
        </div>
        <Link href="/dashboard/create-secret">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm">
            <Plus className="w-4 h-4 mr-1" />
            {t("createNewSecret")}
          </Button>
        </Link>
      </div>

      {/* Secrets */}
      {secrets.length === 0 ? (
        <Card className="bg-amber-50/80 border-2 border-orange-200 text-center">
          <CardContent className="py-8">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-lg font-mono font-bold text-gray-800 mb-2">{t("noSecretsCreatedYet")}</h3>
            <p className="text-sm font-mono text-gray-600 mb-4">{t("createYourFirstSelfDestructingSecretMessage")}</p>
            <Link href="/dashboard/create-secret">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm">
                <Plus className="w-4 h-4 mr-2" />
                {t("createYourFirstSecret")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {secrets.map((secret) => {
            const isExpired = new Date() > new Date(secret.expires_at)
            const timeLeft = formatTimeLeft(secret.expires_at)

            return (
              <Card
                key={secret.id}
                className={`transition-all duration-200 ${
                  isExpired || secret.is_read
                    ? "bg-red-50/80 border-2 border-red-200 opacity-75"
                    : "bg-green-50/80 border-2 border-green-200"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono text-gray-800 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      {t("secretMessage")}
                      {secret.is_read && (
                        <Badge variant="destructive" className="text-xs">
                          {t("readDestroyed")}
                        </Badge>
                      )}
                      {isExpired && !secret.is_read && (
                        <Badge variant="secondary" className="text-xs">
                          {t("expired")}
                        </Badge>
                      )}
                      {!isExpired && !secret.is_read && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          {t("active")}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Clock className="w-3 h-3" />
                      {t("created")} {formatTimeAgo(secret.created_at)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="font-mono text-sm leading-relaxed text-gray-800">
                      {secret.is_read ? (
                        <span className="text-red-600 italic">🔥 {t("thisSecretHasBeenReadAndDestroyed")}</span>
                      ) : secret.message.length > 100 ? (
                        `${secret.message.substring(0, 100)}...`
                      ) : (
                        secret.message
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {!secret.is_read && !isExpired && <span className="text-green-600">⏰ {timeLeft}</span>}
                      {isExpired && !secret.is_read && <span className="text-red-600">⏰ {t("expired")}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      {!secret.is_read && !isExpired && (
                        <Button
                          onClick={() => copySecretLink(secret.id)}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {t("copyLink")}
                        </Button>
                      )}

                      <Button
                        onClick={() => deleteSecret(secret.id)}
                        variant="destructive"
                        size="sm"
                        className="font-mono text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
