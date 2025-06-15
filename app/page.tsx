"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, MessageSquare, Lock, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-4xl mx-auto pt-8 scale-75">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800 font-mono tracking-wider">WHISPR</h1>
            <Flame className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-base text-gray-600 font-mono">Anonymous messaging • Self-destructing secrets</p>
          <div className="w-20 h-1 bg-orange-400 mx-auto mt-3 rounded" />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-amber-50/80 border-2 border-orange-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                NGL Messages
              </CardTitle>
              <CardDescription className="font-mono text-gray-600 text-sm">
                Receive anonymous messages from anyone
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="font-mono text-xs text-gray-600 mb-4">
                Get honest feedback, compliments, or questions anonymously
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50/80 border-2 border-red-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg font-mono text-gray-800 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Secret Messages
              </CardTitle>
              <CardDescription className="font-mono text-gray-600 text-sm">
                Share secrets that self-destruct
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-3">🔥</div>
              <p className="font-mono text-xs text-gray-600 mb-4">
                Send passwords, notes, or secrets that burn after reading
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-green-50/80 border-2 border-green-200 shadow-xl backdrop-blur-sm">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-mono font-bold text-gray-800">Get Started</h3>
            </div>
            <p className="font-mono text-sm text-gray-600 mb-4">
              Sign in with Google to access your dashboard and start receiving anonymous messages
            </p>
            <Link href="/auth/signin">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm py-3 px-6 transition-all duration-200 transform hover:scale-105">
                <Flame className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 font-mono text-xs">
          <p>Built with 🔥 for anonymous communication</p>
          <p className="mt-1">Secure • Private • Self-destructing</p>
        </div>
      </div>
    </div>
  )
}
