import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const { data: existingUser } = await supabase.from("users").select("*").eq("email", user.email).single()

          if (!existingUser) {
            // Create new user
            const username = user.email?.split("@")[0] + "_" + nanoid(4)
            await supabase.from("users").insert({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              username: username,
            })
          }
          return true
        } catch (error) {
          console.error("Error creating user:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const { data: user } = await supabase.from("users").select("*").eq("email", session.user.email).single()

        if (user) {
          session.user.id = user.id
          session.user.username = user.username
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
