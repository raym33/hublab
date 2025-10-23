import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - HubLab',
  description: 'Terms of Service for HubLab marketplace',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-light text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using HubLab ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you
              disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HubLab is a marketplace platform that enables users to buy and sell AI-generated application prototypes and related
              digital products. The Service provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>A marketplace for listing and purchasing digital prototypes</li>
              <li>Tools for uploading and managing digital products</li>
              <li>Payment processing for transactions</li>
              <li>User accounts and profiles</li>
              <li>Communication between buyers and sellers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.2 Account Eligibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to create an account and use the Service. By creating an account, you represent
              that you are of legal age to form a binding contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">4. Seller Terms</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.1 Listing Products</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a seller, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate descriptions of your products</li>
              <li>Only list products you have the right to sell</li>
              <li>Deliver products as described</li>
              <li>Provide reasonable support to buyers</li>
              <li>Maintain appropriate licenses for any third-party code or assets</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.2 Prohibited Products</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not list products that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Infringe on intellectual property rights</li>
              <li>Contain malicious code or security vulnerabilities</li>
              <li>Violate any laws or regulations</li>
              <li>Promote illegal activities</li>
              <li>Contain adult or offensive content</li>
              <li>Are fraudulent or misleading</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.3 Seller Fees</h3>
            <p className="text-gray-700 leading-relaxed">
              HubLab charges a commission on each sale. The current fee structure will be communicated to sellers upon registration
              and may be updated with notice. Payment processing fees may also apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">5. Buyer Terms</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">5.1 Purchases</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a buyer, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate payment information</li>
              <li>Pay all applicable fees and taxes</li>
              <li>Use purchased products in accordance with their license</li>
              <li>Not redistribute or resell products without permission</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">5.2 Refunds and Disputes</h3>
            <p className="text-gray-700 leading-relaxed">
              Due to the digital nature of products, all sales are generally final. However, refunds may be considered if:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The product is significantly different from its description</li>
              <li>The product contains critical defects</li>
              <li>You were charged incorrectly</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Refund requests must be made within 14 days of purchase for EU buyers, or within 7 days for other regions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.1 Platform Content</h3>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are owned by HubLab and are protected by
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.2 User Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of content you upload to the Service. By uploading content, you grant HubLab a worldwide,
              non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Display and distribute your content on the platform</li>
              <li>Create derivative works for promotional purposes</li>
              <li>Use your content in marketing materials</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.3 Copyright Infringement</h3>
            <p className="text-gray-700 leading-relaxed">
              We respect intellectual property rights. If you believe your work has been infringed, please contact us with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Identification of the copyrighted work</li>
              <li>Location of the infringing material</li>
              <li>Your contact information</li>
              <li>A statement of good faith belief</li>
              <li>A statement of accuracy under penalty of perjury</li>
              <li>Physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or harmful materials</li>
              <li>Harass, abuse, or harm others</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Scrape or harvest data without permission</li>
              <li>Use automated systems to access the Service</li>
              <li>Engage in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">8. Payments and Taxes</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">8.1 Payment Processing</h3>
            <p className="text-gray-700 leading-relaxed">
              Payments are processed through third-party payment processors. You agree to comply with their terms and conditions.
              HubLab is not responsible for payment processing errors or issues.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">8.2 Taxes</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for determining and paying any applicable taxes related to your use of the Service, including
              sales tax, VAT, and income tax. Sellers are responsible for collecting and remitting applicable taxes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">9. Disclaimers and Limitation of Liability</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">9.1 Service "As Is"</h3>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
              BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">9.2 No Warranty on User Content</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not warrant the quality, accuracy, or legality of products listed by sellers. We do not guarantee that products
              will meet your requirements or be error-free.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">9.3 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, HUBLAB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY,
              OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless HubLab and its officers, directors, employees, and agents from any claims,
              damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you upload or sell through the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability,
              for any reason, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Breach of these Terms</li>
              <li>Fraudulent activity</li>
              <li>At your request</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Upon termination, your right to use the Service will cease immediately. All provisions that should survive
              termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">12. Dispute Resolution</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">12.1 Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction to be determined],
              without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">12.2 Arbitration</h3>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where
              prohibited by law. EU consumers retain their right to bring proceedings in their local courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Posting the updated Terms on the Service</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for material changes)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">14. General Provisions</h2>
            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">14.1 Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute the entire agreement between you and HubLab regarding the Service.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">14.2 Severability</h3>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">14.3 Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              Failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@hublab.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> [To be determined upon company registration]</p>
              <p className="text-gray-700"><strong>Support:</strong> support@hublab.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
