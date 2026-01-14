import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - IdealCar',
  description: 'Terms of Service for IdealCar - Read our terms and conditions for using our car marketplace platform.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
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
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing and using IdealCar (idealcar.co.za), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
              </p>

              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily access the materials on IdealCar for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>

              <h2>3. User Accounts</h2>
              <h3>3.1 Account Creation</h3>
              <p>To use certain features, you may need to create an account. You must provide accurate, complete information and keep your account credentials confidential.</p>
              
              <h3>3.2 Account Responsibilities</h3>
              <ul>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>

              <h2>4. Vehicle Listings</h2>
              <h3>4.1 Seller Responsibilities</h3>
              <p>If you list a vehicle for sale, you agree to:</p>
              <ul>
                <li>Provide accurate and truthful information</li>
                <li>Have the legal right to sell the vehicle</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Be responsible for the accuracy of your listing</li>
                <li>Not engage in fraudulent or deceptive practices</li>
              </ul>

              <h3>4.2 Prohibited Listings</h3>
              <p>You may not list vehicles that:</p>
              <ul>
                <li>Are stolen or have disputed ownership</li>
                <li>Have falsified or tampered documentation</li>
                <li>Violate any applicable laws</li>
                <li>Contain false or misleading information</li>
              </ul>

              <h2>5. Vehicle Inspection Services</h2>
              <p>Our inspection services are provided on an "as-is" basis. While we strive for accuracy:</p>
              <ul>
                <li>Inspections are visual and non-invasive</li>
                <li>We are not liable for undiscovered defects</li>
                <li>Reports are for informational purposes only</li>
                <li>Final purchase decisions are the buyer's responsibility</li>
              </ul>

              <h2>6. Payments and Fees</h2>
              <ul>
                <li>Inspection fees are due at time of booking</li>
                <li>Premium listing fees (if applicable) are non-refundable</li>
                <li>All prices are in South African Rand (ZAR)</li>
                <li>We reserve the right to change fees with notice</li>
              </ul>

              <h2>7. Disclaimer</h2>
              <p>
                The materials on IdealCar are provided on an 'as is' basis. IdealCar makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <h2>8. Limitations</h2>
              <p>
                In no event shall IdealCar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on IdealCar.
              </p>

              <h2>9. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Harass, threaten, or impersonate other users</li>
                <li>Post spam or unauthorized advertising</li>
                <li>Violate any laws or regulations</li>
                <li>Interfere with the website's operation</li>
                <li>Collect user information without consent</li>
              </ul>

              <h2>10. Intellectual Property</h2>
              <p>
                All content on IdealCar, including text, graphics, logos, and software, is the property of IdealCar and protected by copyright laws.
              </p>

              <h2>11. Privacy</h2>
              <p>
                Your use of IdealCar is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>

              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless IdealCar from any claims, damages, or expenses arising from your use of our services or violation of these terms.
              </p>

              <h2>13. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service.
              </p>

              <h2>14. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of South Africa, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>

              <h2>15. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.
              </p>

              <h2>16. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to:
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
