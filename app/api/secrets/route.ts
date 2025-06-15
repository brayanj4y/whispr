import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, expiryMinutes } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 })
    }

    const id = nanoid(12)
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const { error } = await supabase.from("secrets").insert({
      id,
      message,
      expires_at: expiresAt.toISOString(),
      created_by_ip: clientIp,
      is_read: false,
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
