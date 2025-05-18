"use client"

import { useEffect, useState } from "react"
import io, { type Socket } from "socket.io-client"

// Singleton pattern to ensure only one socket instance
let socket: Socket | null = null

export const initializeSocket = () => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    socket = io(socketUrl, {
      path: "/api/socketio",
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on("connect", () => {
      console.log("Socket connected")
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
    })
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initializeSocket()
  }
  return socket
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Custom hooks for different real-time features
export const useNewReports = () => {
  const [newReports, setNewReports] = useState(0)

  useEffect(() => {
    const socket = getSocket()

    const handleNewReport = () => {
      setNewReports((prev) => prev + 1)
    }

    socket.on("new-report", handleNewReport)

    return () => {
      socket.off("new-report", handleNewReport)
    }
  }, [])

  return { newReports, resetCounter: () => setNewReports(0) }
}

export const useNewComments = () => {
  const [newComments, setNewComments] = useState(0)

  useEffect(() => {
    const socket = getSocket()

    const handleNewComment = () => {
      setNewComments((prev) => prev + 1)
    }

    socket.on("new-comment", handleNewComment)

    return () => {
      socket.off("new-comment", handleNewComment)
    }
  }, [])

  return { newComments, resetCounter: () => setNewComments(0) }
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const socket = getSocket()

    const handleNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 5))
    }

    socket.on("admin-notification", handleNotification)

    return () => {
      socket.off("admin-notification", handleNotification)
    }
  }, [])

  return { notifications, clearNotifications: () => setNotifications([]) }
}
