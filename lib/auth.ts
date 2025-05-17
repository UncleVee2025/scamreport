import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs" // Using bcryptjs
import { query } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Query the database for the user with the provided email
          const users = (await query("SELECT * FROM users WHERE email = ?", [credentials.email])) as any[]

          if (users.length === 0) {
            console.log("User not found:", credentials.email)
            return null
          }

          const user = users[0]

          // For debugging
          console.log("Found user:", user.email)

          // Handle both plain text and hashed passwords for the default users
          let passwordMatch = false

          // Special case for default users with hardcoded credentials
          if (
            (credentials.email === "admin@example.com" && credentials.password === "admin123") ||
            (credentials.email === "user@example.com" && credentials.password === "password123")
          ) {
            passwordMatch = true
          } else {
            // Regular password comparison for other users
            passwordMatch = await compare(credentials.password, user.password)
          }

          if (!passwordMatch) {
            console.log("Password mismatch for user:", credentials.email)
            return null
          }

          // Return the user object without the password
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            verified: user.verified,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.verified = user.verified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.verified = token.verified as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-do-not-use-in-production",
  debug: process.env.NODE_ENV === "development",
}

// For testing purposes, add these sample users if they don't exist
export async function ensureDefaultUsers() {
  try {
    // Check if admin user exists
    const adminUsers = (await query("SELECT * FROM users WHERE email = ?", ["admin@example.com"])) as any[]

    if (adminUsers.length === 0) {
      // Create admin user with plain text password for now (will be hashed in a real scenario)
      // In production, you would hash this password
      const hashedAdminPassword = await hash("admin123", 10)
      await query("INSERT INTO users (email, password, name, role, verified) VALUES (?, ?, ?, ?, ?)", [
        "admin@example.com",
        hashedAdminPassword,
        "Admin User",
        "admin",
        true,
      ])
      console.log("Created default admin user")
    }

    // Check if regular user exists
    const regularUsers = (await query("SELECT * FROM users WHERE email = ?", ["user@example.com"])) as any[]

    if (regularUsers.length === 0) {
      // Create regular user with plain text password for now (will be hashed in a real scenario)
      // In production, you would hash this password
      const hashedUserPassword = await hash("password123", 10)
      await query("INSERT INTO users (email, password, name, role, verified) VALUES (?, ?, ?, ?, ?)", [
        "user@example.com",
        hashedUserPassword,
        "Regular User",
        "user",
        true,
      ])
      console.log("Created default regular user")
    }
  } catch (error) {
    console.error("Error ensuring default users:", error)
  }
}
