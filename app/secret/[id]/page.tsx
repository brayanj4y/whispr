"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Eye, Clock, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function SecretPage() {
  const params = useParams()
  const { t } = useTranslation()
  const [secret, setSecret] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBurning, setIsBurning] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const revealSecret = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/secrets/${params.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('secret_page.failed_to_retrieve'))
      }

      const data = await response.json()
      setSecret(data.message)
      setIsRevealed(true)

      // Start burn animation after 10 seconds
      setTimeout(() => {
        setIsBurning(true)
      }, 10000)
    } catch (error) {
      setError(error instanceof Error ? error.message : t('secret_page.error_occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  // Check if secret exists and get time remaining
  useEffect(() => {
    const checkSecret = async () => {
      try {
        const response = await fetch(`/api/secrets/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.expiresAt) {
            const now = new Date().getTime()
            const expiry = new Date(data.expiresAt).getTime()
            const remaining = Math.max(0, expiry - now)
            setTimeLeft(remaining)
          }
        } else {
          const errorData = await response.json()
          setError(errorData.error || t('secret_page.not_found'))
        }
      } catch (error) {
        setError(t('secret_page.failed_to_check'))
      }
    }

    checkSecret()
  }, [params.id, t])

  // Update countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1000) {
          setError(t('secret_page.expired'))
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, t])

  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      {/* Vintage paper texture overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-2xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4 hover:scale-105 transition-transform">
              <Flame className="w-8 h-8 text-orange-600" />
              <h1 className="text-5xl font-bold text-gray-800 font-mono tracking-wider">WHISPR</h1>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </Link>
          <div className="w-24 h-1 bg-orange-400 mx-auto mt-4 rounded" />
        </div>

        {error ? (
          /* Error State */
          <Card className="bg-red-50/80 border-2 border-red-200 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-mono text-red-800 flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                {t('secret_page.not_found')}
              </CardTitle>
              <CardDescription className="font-mono text-red-600">{error}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">💨</div>
                <p className="font-mono text-gray-600">{t('secret_page.not_found_desc')}</p>
              </div>
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono">
                  <Home className="w-4 h-4 mr-2" />
                  {t('secret_page.create_your_own')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : !isRevealed ? (
          /* Reveal Secret */
          <Card className="bg-amber-50/80 border-2 border-orange-200 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-mono text-gray-800 flex items-center justify-center gap-2">
                <Eye className="w-6 h-6" />
                {t('secret_page.waiting')}
              </CardTitle>
              <CardDescription className="font-mono text-gray-600">
                {t('secret_page.waiting_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {timeLeft !== null && timeLeft > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-yellow-800 font-mono">
                    <Clock className="w-4 h-4" />
                    <span>{t('secret_page.expires_in')} {formatTimeLeft(timeLeft)}</span>
                  </div>
                </div>
              )}

              <div className="text-6xl mb-4">📜</div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Flame className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="font-mono text-sm text-red-800">
                    <strong>{t('secret_page.warning')}</strong> {t('secret_page.warning_desc')}
                  </div>
                </div>
              </div>

              <Button
                onClick={revealSecret}
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-lg py-6 px-8 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('secret_page.revealing')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {t('secret_page.reveal_secret')}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Show Secret with Burn Animation */
          <Card
            className={`bg-white/90 border-2 border-gray-200 shadow-2xl backdrop-blur-sm transition-all duration-1000 ${
              isBurning ? "animate-pulse bg-red-100 border-red-300" : ""
            }`}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-mono text-gray-800 flex items-center justify-center gap-2">
                <Flame className={`w-6 h-6 ${isBurning ? "text-red-600 animate-bounce" : "text-orange-600"}`} />
                {t('secret_page.message_revealed')}
              </CardTitle>
              <CardDescription className="font-mono text-gray-600">
                {isBurning ? t('secret_page.burning') : t('secret_page.read_carefully')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-6 transition-all duration-1000 ${
                  isBurning ? "bg-red-50 border-red-200 opacity-75" : ""
                }`}
              >
                <div
                  className={`font-mono text-lg leading-relaxed whitespace-pre-wrap transition-all duration-1000 ${
                    isBurning ? "text-red-800" : "text-gray-800"
                  }`}
                >
                  {secret}
                </div>
              </div>

              {isBurning && (
                <div className="text-center">
                  <div className="text-4xl mb-2 animate-bounce">🔥</div>
                  <p className="font-mono text-red-600 animate-pulse">{t('secret_page.self_destructing')}</p>
                </div>
              )}

              <div className="text-center">
                <Link href="/">
                  <Button variant="outline" className="font-mono border-2 border-gray-300 hover:bg-gray-50">
                    <Home className="w-4 h-4 mr-2" />
                    {t('secret_page.create_your_own')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 font-mono text-sm">
          <p>{t('secret_page.destroyed_forever')}</p>
        </div>
      </div>
    </div>
  )
}
