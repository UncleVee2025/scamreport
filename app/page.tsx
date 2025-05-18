"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LandingAnimation } from "@/components/landing-animation"
import { FeatureCard } from "@/components/feature-card"
import { Footer } from "@/components/footer"
import { Search, Shield, AlertTriangle, FileText, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="ScamReport Logo" className="h-10 w-auto mr-2" />
            <span className="font-bold text-xl">ScamReport</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Report Scams & Protect <span className="text-primary">Namibia</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Join our community to report scams, share experiences, and help others stay safe from fraud.
                  </p>

                  {/* Search bar at the top of landing page */}
                  <form onSubmit={handleSearch} className="relative max-w-md mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="search"
                      placeholder="Search for scams..."
                      className="pl-10 pr-20 py-6 text-base rounded-lg border-2 border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                      Search
                    </Button>
                  </form>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="text-base" onClick={() => router.push("/register")}>
                      Report a Scam
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base"
                      onClick={() => router.push("/explore-scams")}
                    >
                      Explore Reports
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <LandingAnimation />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ScamReport Namibia makes it easy to report scams and help protect your community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Report a Scam"
                description="Submit details about a scam you've encountered to warn others"
                icon={AlertTriangle}
                iconColor="text-amber-500"
                iconBgColor="bg-amber-100"
              />
              <FeatureCard
                title="Browse Reports"
                description="Search through reported scams to stay informed about current threats"
                icon={FileText}
                iconColor="text-blue-500"
                iconBgColor="bg-blue-100"
              />
              <FeatureCard
                title="Stay Protected"
                description="Get alerts and tips to protect yourself from the latest scams"
                icon={Shield}
                iconColor="text-green-500"
                iconBgColor="bg-green-100"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest Scam Reports</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay informed about the most recent scams reported in Namibia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <Card>
                <CardContent className="p-6">
                  <div className="text-amber-500 mb-4">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Banking SMS Scam</h3>
                  <p className="text-gray-600 mb-4">
                    SMS claiming to be from FNB asking to verify account details through a suspicious link.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">2 days ago</span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-amber-500 mb-4">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fake Job Offer</h3>
                  <p className="text-gray-600 mb-4">
                    Email offering a high-paying remote job but requiring payment for "training materials".
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">3 days ago</span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-amber-500 mb-4">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">WhatsApp Investment Scam</h3>
                  <p className="text-gray-600 mb-4">
                    WhatsApp messages promising 300% returns on cryptocurrency investments within a week.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">5 days ago</span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={() => router.push("/explore-scams")} className="group">
                View All Reports
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Help make Namibia safer by reporting scams and sharing your experiences with others.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => router.push("/register")}
            >
              Register Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
