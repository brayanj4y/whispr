import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: secret, error } = await supabase
      .from("secrets")
      .select("expires_at, is_read")
      .eq("id", params.id)
      .single()

    if (error || !secret) {
      return NextResponse.json({ error: "Secret not found or has been destroyed" }, { status: 404 })
    }

    if (secret.is_read) {
      return NextResponse.json({ error: "This secret has already been read and destroyed" }, { status: 410 })
    }

    if (new Date() > new Date(secret.expires_at)) {
      // Clean up expired secret
      await supabase.from("secrets").delete().eq("id", params.id)

      return NextResponse.json({ error: "This secret has expired and been destroyed" }, { status: 410 })
    }

    return NextResponse.json({
      expiresAt: secret.expires_at,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Get the secret
    const { data: secret, error: fetchError } = await supabase.from("secrets").select("*").eq("id", params.id).single()

    if (fetchError || !secret) {
      return NextResponse.json({ error: "Secret not found or has been destroyed" }, { status: 404 })
    }

    if (secret.is_read) {
      return NextResponse.json({ error: "This secret has already been read and destroyed" }, { status: 410 })
    }

    if (new Date() > new Date(secret.expires_at)) {
      // Clean up expired secret
      await supabase.from("secrets").delete().eq("id", params.id)

      return NextResponse.json({ error: "This secret has expired and been destroyed" }, { status: 410 })
    }

    // Mark as read and delete the secret
    const { error: deleteError } = await supabase.from("secrets").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Delete error:", deleteError)
      return NextResponse.json({ error: "Failed to retrieve secret" }, { status: 500 })
    }

    // Log the access
    await supabase.from("secret_access_logs").insert({
      secret_id: params.id,
      accessed_by_ip: clientIp,
      accessed_at: new Date().toISOString(),
    })

    return NextResponse.json({
      message: secret.message,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
