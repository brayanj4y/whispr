"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
        title: "Empty message",
        description: "Please enter a message first.",
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
        title: "Message sent!",
        description: "Your anonymous message has been delivered.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="max-w-2xl mx-auto pt-12 scale-75">
          <Card className="bg-red-50/80 border-2 border-red-200 shadow-xl backdrop-blur-sm text-center">
            <CardContent className="py-8">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-mono font-bold text-red-800 mb-2">User Not Found</h3>
              <p className="text-sm font-mono text-red-600 mb-4">
                The username "@{params.username}" doesn't exist or has been deactivated.
              </p>
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Whispr Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-2xl mx-auto pt-8 scale-75">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-800 font-mono tracking-wider">WHISPR</h1>
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </Link>
          <div className="w-20 h-1 bg-orange-400 mx-auto rounded" />
        </div>

        {!messageSent ? (
          /* Send Message Form */
          <Card className="bg-blue-50/80 border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-mono text-blue-800 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send Anonymous Message
              </CardTitle>
              <CardDescription className="font-mono text-blue-600 text-sm">
                to <strong>@{user.username}</strong> ({user.name})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm font-mono font-semibold text-gray-700 mb-2">
                  Your Anonymous Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your anonymous message here... be honest, be kind, or just say hi!"
                  className="min-h-32 font-mono text-base bg-white/80 border-2 border-blue-200 focus:border-blue-400 resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 font-mono mt-1">{message.length}/500</div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="font-mono text-sm text-yellow-800">
                    <strong>Anonymous:</strong> Your identity will not be revealed. The message will be sent completely
                    anonymously to @{user.username}.
                  </div>
                </div>
              </div>

              <Button
                onClick={sendMessage}
                disabled={isSending || !message.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-base py-5 transition-all duration-200 transform hover:scale-105"
              >
                {isSending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Anonymous Message
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Message Sent Success */
          <Card className="bg-green-50/80 border-2 border-green-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-mono text-green-800 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Message Sent Successfully!
              </CardTitle>
              <CardDescription className="font-mono text-green-600 text-sm">
                Your anonymous message has been delivered to @{user.username}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <div className="text-6xl mb-4">✅</div>

              <div className="bg-white/80 border-2 border-green-200 rounded-lg p-4">
                <p className="font-mono text-sm text-gray-700">
                  Your message has been sent anonymously and @{user.username} will see it in their NGL inbox. They won't
                  know who sent it!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 font-mono border-2 border-green-300 hover:bg-green-50 text-sm"
                >
                  Send Another Message
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm">
                    <Home className="w-4 h-4 mr-1" />
                    Go to Whispr
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 font-mono text-xs">
          <p>Anonymous messaging powered by Whispr 🔥</p>
          <p className="mt-1">Your identity is completely protected</p>
        </div>
      </div>
    </div>
  )
}
