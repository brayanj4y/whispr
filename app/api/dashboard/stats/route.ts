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

    // Get unread NGL count
    const { count: unreadNgl } = await supabase
      .from("ngl_messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("is_read", false)

    // Get secret count (created by this user's IP - approximate)
    const { count: secretCount } = await supabase.from("secrets").select("*", { count: "exact", head: true })

    return NextResponse.json({
      nglCount: nglCount || 0,
      secretCount: secretCount || 0,
      unreadNgl: unreadNgl || 0,
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
