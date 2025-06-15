import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user ID
    const { data: user } = await supabase.from("users").select("id").eq("email", session.user.email).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get NGL message count
    const { count: nglCount } = await supabase
      .from("ngl_messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)

    // Get secret count (approximate by IP)
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const { count: secretCount } = await supabase
      .from("secrets")
      .select("*", { count: "exact", head: true })
      .eq("created_by_ip", clientIp)

    // For now, we'll use a placeholder for profile views
    // In a real app, you'd track this in a separate table
    const totalViews = Math.floor(Math.random() * 100) + (nglCount || 0) * 2

    return NextResponse.json({
      nglCount: nglCount || 0,
      secretCount: secretCount || 0,
      totalViews,
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
