"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Send, Clock, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CreateSecret() {
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  const [expiryMinutes, setExpiryMinutes] = useState("60")
  const [isCreating, setIsCreating] = useState(false)
  const [secretUrl, setSecretUrl] = useState("")
  const { toast } = useToast()

  const createSecret = async () => {
    if (!message.trim()) {
      toast({
        title: t('secrets.empty_message'),
        description: t('secrets.empty_message_desc'),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          expiryMinutes: Number.parseInt(expiryMinutes),
        }),
      })

      if (!response.ok) throw new Error("Failed to create secret")

      const { id } = await response.json()
      const url = `${window.location.origin}/secret/${id}`
      setSecretUrl(url)
      setMessage("")
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('secrets.create_error'),
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secretUrl)
      toast({
        title: t('common.copied'),
        description: t('secrets.link_copied'),
      })
    } catch (error) {
      toast({
        title: t('common.copy_failed'),
        description: t('common.try_again'),
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setSecretUrl("")
    setMessage("")
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-gray-800 mb-1 flex items-center gap-2">
          <Flame className="w-6 h-6" />
          {t('secrets.create_secret')}
        </h1>
        <p className="text-sm text-gray-600 font-mono">{t('secrets.create_secret_desc')}</p>
      </div>

      {!secretUrl ? (
        /* Create Secret Form */
        <Card className="bg-amber-50/80 border-2 border-orange-200 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-mono text-gray-800 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              {t('secrets.compose_secret')}
            </CardTitle>
            <CardDescription className="font-mono text-gray-600 text-sm">
              {t('secrets.write_message')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-sm font-mono font-semibold text-gray-700 mb-2">{t('secrets.your_secret_message')}</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('secrets.placeholder')}
                className="min-h-32 font-mono text-base bg-white/80 border-2 border-orange-200 focus:border-orange-400 resize-none"
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 font-mono mt-1">{message.length}/1000</div>
            </div>

            <div>
              <label className="text-sm font-mono font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('secrets.auto_delete_timer')}
              </label>
              <Select value={expiryMinutes} onValueChange={setExpiryMinutes}>
                <SelectTrigger className="font-mono bg-white/80 border-2 border-orange-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 {t('secrets.minutes')}</SelectItem>
                  <SelectItem value="30">30 {t('secrets.minutes')}</SelectItem>
                  <SelectItem value="60">1 {t('secrets.hour')}</SelectItem>
                  <SelectItem value="180">3 {t('secrets.hours')}</SelectItem>
                  <SelectItem value="720">12 {t('secrets.hours')}</SelectItem>
                  <SelectItem value="1440">24 {t('secrets.hours')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {t('secrets.message_auto_delete')}
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div className="font-mono text-sm text-yellow-800">
                  <strong>{t('secrets.important')}</strong> {t('secrets.self_destruct_notice')}
                </div>
              </div>
            </div>

            <Button
              onClick={createSecret}
              disabled={isCreating || !message.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono text-base py-5 transition-all duration-200 transform hover:scale-105"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('secrets.creating_secret')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  {t('secrets.create_secret_link')}
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Secret Created */
        <Card className="bg-green-50/80 border-2 border-green-200 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-mono text-green-800 flex items-center justify-center gap-2">
              <Flame className="w-5 h-5" />
              {t('secrets.secret_created')}
            </CardTitle>
            <CardDescription className="font-mono text-green-600 text-sm">
              {t('secrets.share_carefully')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-sm font-mono font-semibold text-gray-700 mb-2">{t('secrets.your_secret_link')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={secretUrl}
                  readOnly
                  className="flex-1 p-3 font-mono text-sm bg-white border-2 border-green-200 rounded-md"
                />
                <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 text-white px-4">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div className="font-mono text-sm text-yellow-800">
                  <strong>{t('secrets.warning')}</strong> {t('secrets.warning_notice', { minutes: expiryMinutes })}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 font-mono border-2 border-gray-300 hover:bg-gray-50 text-sm"
              >
                {t('secrets.create_another')}
              </Button>
              <Link href="/dashboard/secrets" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full font-mono border-2 border-green-300 hover:bg-green-50 text-sm"
                >
                  {t('secrets.view_all_secrets')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
