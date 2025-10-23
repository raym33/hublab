import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - HubLab',
  description: 'Privacy Policy for HubLab marketplace',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-light text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to HubLab ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website and tell you
              about your privacy rights and how the law protects you.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This privacy policy applies to information we collect through our website and in email, text, and other electronic
              communications sent through or in connection with our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">2.1 Information You Provide to Us</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Account information (email address, username, password)</li>
              <li>Profile information (name, profile picture, bio)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Communications with us (support tickets, feedback, messages)</li>
              <li>Content you upload (prototypes, descriptions, images)</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">2.2 Information Automatically Collected</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, clicks, searches)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log data (access times, pages viewed, referring URLs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to comments, questions, and provide customer service</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Personalize and improve your experience</li>
              <li>Send marketing communications (with your consent where required)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the data and context:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Contract:</strong> Processing necessary to provide services you requested</li>
              <li><strong>Consent:</strong> You have given us permission for specific purposes</li>
              <li><strong>Legitimate interests:</strong> Processing is in our legitimate interests (security, fraud prevention)</li>
              <li><strong>Legal obligation:</strong> We need to comply with the law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">5. Sharing Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service providers:</strong> Third parties who perform services on our behalf (hosting, analytics, payment processing)</li>
              <li><strong>Business transfers:</strong> In connection with a merger, sale, or acquisition</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">6. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. These countries may have data
              protection laws that are different from the laws of your country. We take appropriate safeguards to ensure that your
              personal information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required by law. When we no longer need your information, we will securely delete
              or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
              <li><strong>Complaint:</strong> Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">9. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to say no to the sale of personal information</li>
              <li>Right to access your personal information</li>
              <li>Right to equal service and price</li>
              <li>Right to deletion of personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">10. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect and track information about your browsing activities.
              For more information about the cookies we use and your choices, please see our{' '}
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">11. Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method
              of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal
              information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">12. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information
              from children. If we become aware that we have collected personal information from a child without parental consent,
              we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy
              Policy on this page and updating the "Last Updated" date. Your continued use of our services after such modifications
              constitutes your acknowledgment and acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> hublab@outlook.es</p>
            </div>
          </section>

          <section className="border-t pt-8 mt-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4">For EU Residents</h2>
            <p className="text-gray-700 leading-relaxed">
              If you are located in the European Union, you have the right to lodge a complaint with your local data protection
              authority. For a list of data protection authorities in the EU, please visit:{' '}
              <a
                href="https://edpb.europa.eu/about-edpb/board/members_en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://edpb.europa.eu/about-edpb/board/members_en
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
