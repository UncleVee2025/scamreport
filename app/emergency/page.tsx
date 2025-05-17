"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Shield, AlertTriangle, Building, MapPin } from "lucide-react"

export default function EmergencyContactsPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const emergencyContacts = [
    {
      name: "Namibian Police Force",
      description: "National emergency police services",
      phone: "10111",
      category: "emergency",
    },
    {
      name: "Namibian Police Cybercrime Unit",
      description: "Report cybercrime incidents",
      phone: "+264 61 209 4111",
      category: "cybercrime",
    },
    {
      name: "Ambulance Services",
      description: "Medical emergency services",
      phone: "211 111",
      category: "emergency",
    },
    {
      name: "Fire Department",
      description: "Fire emergency services",
      phone: "302 302",
      category: "emergency",
    },
  ]

  const bankContacts = [
    {
      name: "FNB Namibia",
      description: "Report fraudulent activities on your FNB account",
      phone: "+264 61 299 2222",
      website: "https://www.fnbnamibia.com.na",
      category: "bank",
    },
    {
      name: "Bank Windhoek",
      description: "Report suspicious transactions on your Bank Windhoek account",
      phone: "+264 61 299 1200",
      website: "https://www.bankwindhoek.com.na",
      category: "bank",
    },
    {
      name: "Bank of Namibia",
      description: "Central bank of Namibia",
      phone: "+264 61 283 5111",
      website: "https://www.bon.com.na",
      category: "bank",
    },
    {
      name: "Standard Bank Namibia",
      description: "Report fraud on your Standard Bank account",
      phone: "+264 61 294 2222",
      website: "https://www.standardbank.com.na",
      category: "bank",
    },
  ]

  const regionalContacts = [
    {
      name: "Windhoek City Police",
      description: "Windhoek metropolitan police services",
      phone: "+264 61 302 302",
      location: "Windhoek",
    },
    {
      name: "Swakopmund Police Station",
      description: "Swakopmund local police services",
      phone: "+264 64 410 4111",
      location: "Swakopmund",
    },
    {
      name: "Walvis Bay Police Station",
      description: "Walvis Bay local police services",
      phone: "+264 64 219 048",
      location: "Walvis Bay",
    },
    {
      name: "Oshakati Police Station",
      description: "Oshakati local police services",
      phone: "+264 65 229 404",
      location: "Oshakati",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-blue-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h2 className="font-medium text-red-800">In case of immediate danger</h2>
              <p className="text-sm text-red-700">
                If you are in immediate danger or witnessing a crime in progress, please call the emergency services
                immediately at <strong>10111</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Emergency Services
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Contact these services in case of emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="py-4 first:pt-6 last:pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                      </div>
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Banking Institutions
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Contact these banks to report financial fraud
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {bankContacts.map((contact, index) => (
                  <div key={index} className="py-4 first:pt-6 last:pb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline text-center"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Police Contacts
                </CardTitle>
                <CardDescription className="text-blue-100">Local police stations across Namibia</CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {regionalContacts.map((contact, index) => (
                  <div key={index} className="py-4 first:pt-6 last:pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {contact.location}
                        </p>
                      </div>
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you need to report a scam or cybercrime, please{" "}
            <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => router.push("/register")}>
              register
            </Button>{" "}
            or{" "}
            <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => router.push("/login")}>
              login
            </Button>{" "}
            to submit a detailed report.
          </p>
        </div>
      </div>
    </div>
  )
}
