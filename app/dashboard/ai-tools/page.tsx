"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { URLChecker } from "@/components/url-checker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileText, Globe, Lightbulb, Phone, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function AIToolsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">AI Safety Tools</h1>
        <p className="text-gray-500">Advanced AI-powered tools to help you stay safe from scams</p>
      </div>

      <Tabs defaultValue="url" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-1 bg-gray-100">
          <TabsTrigger value="url" className="flex items-center gap-2 h-12">
            <Globe className="h-4 w-4" />
            <span>URL Checker</span>
          </TabsTrigger>
          <TabsTrigger value="call" className="flex items-center gap-2 h-12">
            <Phone className="h-4 w-4" />
            <span>Call Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2 h-12">
            <Lightbulb className="h-4 w-4" />
            <span>Smart Tips</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2 h-12">
            <Brain className="h-4 w-4" />
            <span>About AI Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <URLChecker />
          </motion.div>
        </TabsContent>

        <TabsContent value="call">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  AI Call Scam Analyzer
                </CardTitle>
                <CardDescription>Detect potential phone scams using our AI-powered call analyzer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    How It Works
                  </h3>
                  <p className="text-sm text-blue-700">
                    Our AI analyzes call transcripts or recordings to identify common scam patterns, suspicious
                    language, and high-pressure tactics used by scammers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium mb-2">1. Record or Type</div>
                    <p className="text-sm text-gray-600">
                      Record a suspicious call or type out what was said during the conversation
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium mb-2">2. AI Analysis</div>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes the content for common scam patterns and warning signs
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium mb-2">3. Get Results</div>
                    <p className="text-sm text-gray-600">
                      Receive a risk assessment and recommendations on how to proceed
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/dashboard/call-analyzer")} className="w-full">
                  Open Call Analyzer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="tips">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  AI Safety Tips
                </CardTitle>
                <CardDescription>
                  Personalized AI-generated safety advice based on recent scams in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Online Banking Safety
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p>
                        • Always check that the URL starts with https:// and shows a padlock icon before entering
                        banking credentials
                      </p>
                      <p>• Enable two-factor authentication for all financial accounts</p>
                      <p>• Banks will never ask for your full password or PIN via email or phone</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone Call Vigilance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p>
                        • Government agencies will never call demanding immediate payment via gift cards or wire
                        transfers
                      </p>
                      <p>• Never share verification codes or OTPs with anyone over the phone</p>
                      <p>
                        • If pressured to act quickly, it's likely a scam - legitimate organizations give you time to
                        decide
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        Social Media Protection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p>• Be wary of investment opportunities or business offers from strangers on social media</p>
                      <p>• Before sending money, verify the identity through video call or in-person meeting</p>
                      <p>• Check account ages and engagement patterns to spot fake profiles</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Quick Safety Checks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p>
                        • If you're asked to pay with gift cards, cryptocurrency, or wire transfers, it's likely a scam
                      </p>
                      <p>• Verify emails by checking the sender's address carefully for slight misspellings</p>
                      <p>
                        • When in doubt, contact the organization directly using contact information from their official
                        website
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                These safety tips are generated by AI based on recent scam trends and updated regularly
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="about">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  About Our AI Tools
                </CardTitle>
                <CardDescription>Learn how AI technology helps protect you from scams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p>
                    Our ScamReport app uses advanced AI technology to help protect you from various types of scams.
                    Here's how our AI tools work:
                  </p>

                  <h3 className="text-lg font-medium mt-6 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Proactive Protection
                  </h3>
                  <p>
                    Rather than just reporting scams after they happen, our AI tools help you identify potential scams
                    before you become a victim. By analyzing patterns, language, and technical indicators, we can warn
                    you about suspicious activity.
                  </p>

                  <h3 className="text-lg font-medium mt-6 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Data-Driven Insights
                  </h3>
                  <p>
                    Our AI has been trained on thousands of real scam reports, allowing it to recognize patterns that
                    might not be obvious to humans. The system continuously learns from new reports to stay up-to-date
                    with evolving scam tactics.
                  </p>

                  <h3 className="text-lg font-medium mt-6 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Personalized Recommendations
                  </h3>
                  <p>
                    Our AI doesn't just identify scams – it provides tailored advice based on your specific situation.
                    Whether you're checking a suspicious URL or analyzing a phone call, you'll receive personalized
                    guidance on how to proceed safely.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                    <h3 className="font-medium text-blue-800 mb-2">Privacy Notice</h3>
                    <p className="text-sm text-blue-700">
                      We value your privacy. All AI analysis is performed securely, and your data is never shared with
                      third parties. The information you provide is used solely to improve our scam detection
                      capabilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
