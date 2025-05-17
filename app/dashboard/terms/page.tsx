"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Shield, Scale, Mail, Phone, MapPin } from "lucide-react"

export default function TermsPage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <p className="text-gray-500">Legal information about using ScamReport Namibia</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="terms">
              <FileText className="h-4 w-4 mr-2" />
              Terms
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-blue-500" />
                  Terms and Conditions
                </CardTitle>
                <CardDescription>Last updated: May 17, 2025</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">1. Introduction</h3>
                    <p>
                      Welcome to ScamReport Namibia. By accessing or using our platform, you agree to be bound by these
                      Terms and Conditions, including any future amendments. These terms govern your use of our
                      services, the submission of reports, and interactions on the platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">2. Definitions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Platform:</strong> ScamReport Namibia mobile application and its associated services.
                      </li>
                      <li>
                        <strong>User:</strong> Any individual or entity accessing the platform, submitting reports, or
                        viewing content.
                      </li>
                      <li>
                        <strong>Reporter:</strong> A User submitting information regarding scams, cyberbullying, or
                        phishing activities.
                      </li>
                      <li>
                        <strong>Investor:</strong> Any individual or entity considering financial involvement with
                        ScamReport Namibia.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">3. User Responsibilities and Liabilities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Users are solely responsible for the accuracy, completeness, and truthfulness of the information
                        they provide on the platform.
                      </li>
                      <li>
                        By submitting a report, the User confirms that the information is factual to the best of their
                        knowledge.
                      </li>
                      <li>
                        False reporting, misleading information, or defamatory content may result in suspension or
                        permanent removal from the platform and may be subject to legal consequences under Namibian law.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">4. Platform Disclaimer</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        ScamReport Namibia acts solely as a platform for reporting and information sharing and does not
                        independently verify the accuracy of reports.
                      </li>
                      <li>
                        We are not liable for any damages or losses resulting from information submitted by Users.
                      </li>
                      <li>
                        The platform reserves the right to remove or edit reports that violate community guidelines or
                        Namibian law.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">5. Data Privacy and Reporting Integrity</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        User data submitted to the platform, including evidence, is protected under our privacy policies
                        and the applicable Namibian data protection laws.
                      </li>
                      <li>
                        Users may choose to remain anonymous during submission, but full anonymity may limit follow-up
                        communication if further evidence is required.
                      </li>
                      <li>
                        ScamReport Namibia is not responsible for third-party access to information if Users share their
                        login credentials.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">6. Investor Confidence and Platform Transparency</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        ScamReport Namibia provides transparent reporting mechanisms to build trust with both Users and
                        Investors.
                      </li>
                      <li>
                        Financial data, platform performance, and transparency reports will be made available to
                        verified Investors upon request.
                      </li>
                      <li>
                        Investors are encouraged to conduct due diligence before making any financial commitments.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">7. Legal Protections and Indemnification</h3>
                    <p>
                      Users agree to indemnify and hold ScamReport Namibia, its officers, partners, and employees
                      harmless from any claims or demands arising from User-provided information, misuse of the
                      platform, or violation of these Terms and Conditions.
                    </p>
                    <p>
                      We reserve the right to cooperate with legal authorities in investigations of alleged fraud or
                      illegal activities reported on our platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">8. Amendments and Modifications</h3>
                    <p>
                      ScamReport Namibia reserves the right to modify or update these Terms and Conditions at any time.
                      Users will be notified of significant changes via the platform or email.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">9. Governing Law</h3>
                    <p>These Terms and Conditions are governed by the laws of the Republic of Namibia.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">10. Contact Information</h3>
                    <p>For further inquiries or legal concerns, please contact us at:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Email: info@popya.org</li>
                      <li>Phone: +264811511511</li>
                      <li>Address: Erf 1298, Ekuku, Oshakati</li>
                    </ul>
                  </section>

                  <p className="font-medium">
                    By continuing to use ScamReport Namibia, you acknowledge that you have read, understood, and agree
                    to be bound by these Terms and Conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Privacy Policy
                </CardTitle>
                <CardDescription>Last updated: May 17, 2025</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">1. Information We Collect</h3>
                    <p>
                      ScamReport Namibia collects personal information during registration, report submission, and
                      platform usage. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Personal identifiers (name, ID number, contact information)</li>
                      <li>Identity verification documents</li>
                      <li>Report content and evidence uploads</li>
                      <li>Usage data and interaction with the platform</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">2. How We Use Your Information</h3>
                    <p>We use collected information to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Verify user identity and prevent fraudulent accounts</li>
                      <li>Process and display scam reports</li>
                      <li>Notify users of relevant updates and activities</li>
                      <li>Improve platform functionality and user experience</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">3. Information Sharing</h3>
                    <p>ScamReport Namibia may share information with:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Law enforcement agencies when legally required</li>
                      <li>Other users (only if you choose to make your report public)</li>
                      <li>Service providers who assist in platform operations</li>
                    </ul>
                    <p>We will never sell your personal information to third parties.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">4. Data Security</h3>
                    <p>
                      We implement appropriate security measures to protect your personal information from unauthorized
                      access, alteration, or disclosure. These measures include encryption, secure servers, and regular
                      security assessments.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">5. Your Rights</h3>
                    <p>As a user, you have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Delete your account and associated data</li>
                      <li>Object to certain processing of your information</li>
                      <li>Report privacy concerns to relevant authorities</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">6. Cookies and Tracking</h3>
                    <p>
                      Our platform uses cookies and similar technologies to enhance user experience, analyze usage
                      patterns, and improve functionality. You can manage cookie preferences through your browser
                      settings.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium">7. Changes to Privacy Policy</h3>
                    <p>
                      We may update this Privacy Policy periodically. Significant changes will be notified to users via
                      email or platform notifications.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-500" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with ScamReport Namibia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+264 81 151 1511</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">info@popya.org</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">Erf 1298, Ekuku, Oshakati, Namibia</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Legal Inquiries</h3>
                    <p className="text-sm text-blue-700">
                      For legal matters, please contact our legal department at legal@popya.org
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Support Hours</h3>
                    <p className="text-sm text-blue-700">
                      Monday to Friday: 8:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
