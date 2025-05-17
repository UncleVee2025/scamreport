import type React from "react"
import ClientLayout from "./ClientLayout"

export const metadata = {
  title: "ScamReport Namibia - Report Scams & Cybercrime",
  description:
    "Report online scams, cybercrime, phishing schemes, and online bullying in Namibia. Help protect others from becoming victims.",
  keywords: "scam report, namibia, cybercrime, phishing, online fraud, scam alert, cyber security, online safety",
  authors: [{ name: "Popya" }],
  openGraph: {
    title: "ScamReport Namibia - Report Scams & Cybercrime",
    description:
      "Report online scams, cybercrime, phishing schemes, and online bullying in Namibia. Help protect others from becoming victims.",
    url: "https://scamreport.popya.org",
    siteName: "ScamReport Namibia",
    locale: "en_NA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamReport Namibia - Report Scams & Cybercrime",
    description: "Report online scams, cybercrime, phishing schemes, and online bullying in Namibia",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'