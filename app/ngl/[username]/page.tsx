"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, Heart, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface User {
  id: string
  name: string
  username: string
}

export default function NglPage() {
  const params = useParams()
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [messageSent, setMessageSent] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.username}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.username])

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: t('ngl.empty_message'),
        description: t('ngl.empty_message_desc'),
        variant: "destructive",
      })
      return
    }

    if (!user) return

    setIsSending(true)
    try {
      const response = await fetch("/api/ngl/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: user.id,
          message: message.trim(),
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setMessage("")
      setMessageSent(true)
      toast({
        title: t('ngl.message_sent'),
        description: t('ngl.message_delivered'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('ngl.send_error'),
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const resetForm = () => {
    setMessageSent(false)
    setMessage("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-2 sm:p-4">
        <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="max-w-2xl mx-auto pt-8 sm:pt-12 scale-75 sm:scale-90 lg:scale-100">
          <Card className="bg-red-50/80 border-2 border-red-200 shadow-xl backdrop-blur-sm text-center">
            <CardContent className="py-6 sm:py-8 px-4 sm:px-6">
              <div className="text-4xl sm:text-6xl mb-4">❌</div>
              <h3 className="text-lg sm:text-xl font-mono font-bold text-red-800 mb-2">{t('ngl.user_not_found')}</h3>
              <p className="text-xs sm:text-sm font-mono text-red-600 mb-4">
                {t('ngl.user_not_found_desc', { username: params.username })}
              </p>
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm py-2 sm:py-3">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t('ngl.go_to_whispr_home')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-2 sm:p-4">
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-2xl mx-auto pt-4 sm:pt-8 scale-75 sm:scale-90 lg:scale-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-mono tracking-wider">WHISPR</h1>
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </Link>
          <div className="w-16 sm:w-20 h-1 bg-orange-400 mx-auto rounded" />
        </div>

        {!messageSent ? (
          /* Send Message Form */
          <Card className="bg-blue-50/80 border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl font-mono text-blue-800 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('ngl.send_anonymous')}
              </CardTitle>
              <CardDescription className="font-mono text-blue-600 text-xs sm:text-sm">
                {t('ngl.send_to')} <strong>@{user.username}</strong> ({user.name})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-semibold text-gray-700 mb-2">
                  {t('ngl.your_message')}
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('ngl.placeholder')}
                  className="min-h-28 sm:min-h-32 font-mono text-sm sm:text-base bg-white/80 border-2 border-blue-200 focus:border-blue-400 resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs sm:text-sm text-gray-500 font-mono mt-1">{message.length}/500 {t('ngl.character_limit')}</div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1 sm:mt-2 flex-shrink-0" />
                  <div className="font-mono text-xs sm:text-sm text-yellow-800">
                    <strong>{t('ngl.anonymous_label')}</strong> {t('ngl.anonymous_notice')} @{user.username}.
                  </div>
                </div>
              </div>

              <Button
                onClick={sendMessage}
                disabled={isSending || !message.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm sm:text-base py-4 sm:py-5 transition-all duration-200 transform hover:scale-105"
              >
                {isSending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('ngl.sending_message')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('ngl.send_anonymous')}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Message Sent Success */
          <Card className="bg-green-50/80 border-2 border-green-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl font-mono text-green-800 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('ngl.thank_you')}
              </CardTitle>
              <CardDescription className="font-mono text-green-600 text-xs sm:text-sm">
                {t('ngl.message_delivered_desc')} @{user.username}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 text-center px-4 sm:px-6">
              <div className="text-4xl sm:text-6xl mb-4">✅</div>

              <div className="bg-white/80 border-2 border-green-200 rounded-lg p-3 sm:p-4">
                <p className="font-mono text-xs sm:text-sm text-gray-700">
                  {t('ngl.success_message', { username: user.username })}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 font-mono border-2 border-green-300 hover:bg-green-50 text-xs sm:text-sm py-2 sm:py-3"
                >
                  {t('ngl.send_another')}
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm py-2 sm:py-3">
                    <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {t('ngl.back_home')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 font-mono text-xs">
          <p>{t('ngl.footer_powered')}</p>
          <p className="mt-1">{t('ngl.footer_protected')}</p>
        </div>
      </div>
    </div>
  )
}
