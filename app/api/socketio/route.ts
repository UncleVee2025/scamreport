import type { Server as NetServer } from "http"
import type { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Get the res object from the request
    const res = new Response()

    // Get the raw Node.js request and response objects
    const requestAsNextApiRequest = req as unknown as NextApiRequest
    const res_raw = res as unknown as { socket: { server: NetServer } }

    // Check if Socket.IO server is already initialized
    if (!res_raw.socket.server.io) {
      console.log("Initializing Socket.IO server...")

      // Create a new Socket.IO server
      const io = new ServerIO(res_raw.socket.server, {
        path: "/api/socketio",
        addTrailingSlash: false,
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      })

      // Store the Socket.IO server instance
      res_raw.socket.server.io = io

      // Set up event handlers
      io.on("connection", (socket) => {
        console.log("Client connected:", socket.id)

        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id)
        })

        // Admin room for admin-specific events
        socket.on("join-admin", () => {
          socket.join("admin-room")
          console.log("Admin joined:", socket.id)
        })
      })
    }

    return NextResponse.json({ success: true, message: "Socket.IO server running" })
  } catch (error) {
    console.error("Socket.IO initialization error:", error)
    return NextResponse.json({ success: false, message: "Failed to start Socket.IO server" }, { status: 500 })
  }
}
