"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Trash2, Eye, EyeOff, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NglMessage {
  id: string
  message: string
  created_at: string
  is_read: boolean
  sender_ip: string
}

export default function NglMessages() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<NglMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/ngl/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/ngl/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !currentStatus }),
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, is_read: !currentStatus } : msg)))
        toast({
          title: !currentStatus ? "Marked as read" : "Marked as unread",
          description: "Message status updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/ngl/messages/${messageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== messageId))
        toast({
          title: "Message deleted",
          description: "The message has been permanently deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const messageDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-gray-800 mb-1 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Your Anonymous Messages
        </h1>
        <p className="text-sm text-gray-600 font-mono">
          Messages sent anonymously to your NGL link • Total: {messages.length}
        </p>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <Card className="bg-amber-50/80 border-2 border-orange-200 text-center">
          <CardContent className="py-8">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-mono font-bold text-gray-800 mb-2">No messages yet</h3>
            <p className="text-sm font-mono text-gray-600 mb-4">
              Share your NGL link to start receiving anonymous messages!
            </p>
            <div className="bg-white/80 border-2 border-orange-200 rounded-lg p-3 font-mono text-xs">
              <strong>Your NGL Link:</strong>
              <br />
              {typeof window !== "undefined" && `${window.location.origin}/ngl/${session?.user?.username}`}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`transition-all duration-200 ${
                message.is_read
                  ? "bg-white/80 border-2 border-gray-200"
                  : "bg-blue-50/80 border-2 border-blue-200 shadow-md"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-mono text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Anonymous Message
                    {!message.is_read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(message.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleReadStatus(message.id, message.is_read)}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {message.is_read ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Mark Unread
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Mark Read
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={() => deleteMessage(message.id)}
                    variant="destructive"
                    size="sm"
                    className="font-mono text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
