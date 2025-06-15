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

    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ available: false, reason: "Username too short" })
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json({ available: false, reason: "Invalid characters" })
    }

    // Check if username exists (excluding current user)
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .neq("email", session.user.email)
      .single()

    return NextResponse.json({
      available: !existingUser,
      reason: existingUser ? "Username already taken" : null,
    })
  } catch (error) {
    console.error("Username check error:", error)
    return NextResponse.json({ available: false, reason: "Check failed" })
  }
}
