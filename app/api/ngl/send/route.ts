import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { recipientId, message } = await request.json()

    if (!recipientId || !message || typeof message !== "string") {
      return NextResponse.json({ error: "Recipient ID and message are required" }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long (max 500 characters)" }, { status: 400 })
    }

    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const messageId = nanoid(12)

    // Insert NGL message
    const { error } = await supabase.from("ngl_messages").insert({
      id: messageId,
      recipient_id: recipientId,
      message: message.trim(),
      sender_ip: clientIp,
      is_read: false,
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
