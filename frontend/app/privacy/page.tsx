import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - IdealCar',
  description: 'Privacy Policy for IdealCar - Learn how we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100">
              Last updated: January 12, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>1. Introduction</h2>
              <p>
                IdealCar ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website idealcar.co.za and use our services.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register for an account</li>
                <li>List a vehicle for sale</li>
                <li>Contact us for vehicle inspections</li>
                <li>Submit inquiries or feedback</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and contact details (email, phone number)</li>
                <li>Vehicle information</li>
                <li>Location data</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect certain information about your device, including:</p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process your vehicle listings and inquiries</li>
                <li>Schedule and perform vehicle inspections</li>
                <li>Communicate with you about our services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and user experience</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our website and services</li>
                <li><strong>Business Partners:</strong> Verified car dealers and inspection professionals</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2>6. Your Rights</h2>
              <p>Under South African law (POPIA), you have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings.
              </p>

              <h2>8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites.
              </p>

              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect information from children.
              </p>

              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>Email: info@idealcar.co.za</li>
                <li>Phone: 072 324 8098</li>
                <li>Address: Wonderboom, Pretoria, 0182</li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
