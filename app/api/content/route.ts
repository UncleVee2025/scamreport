import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real app, you would fetch this data from a database
  const featuredContent = [
    {
      id: "1",
      title: "Advanced Analytics",
      description: "Dive deep into your data with our advanced analytics tools.",
      category: "Technology",
      icon: "trending-up",
      color: "from-pink-600 to-purple-600",
    },
    {
      id: "2",
      title: "Smart Automation",
      description: "Automate your workflow with AI-powered tools.",
      category: "Productivity",
      icon: "zap",
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: "3",
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time.",
      category: "Collaboration",
      icon: "users",
      color: "from-amber-600 to-orange-600",
    },
  ]

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({ featuredContent })
}
