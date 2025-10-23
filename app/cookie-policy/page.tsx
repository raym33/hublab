import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy - HubLab',
  description: 'Cookie Policy for HubLab marketplace',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-light text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website.
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies allow websites to recognize your device and store information about your preferences or past actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HubLab uses cookies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and advertisements</li>
              <li>Ensure the security of our platform</li>
              <li>Analyze website traffic and performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">3. Types of Cookies We Use</h2>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.1 Necessary Cookies (Always Active)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are essential for the website to function properly. They enable core functionality such as security,
              network management, and accessibility. You cannot opt out of these cookies.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li><strong>auth_token:</strong> Keeps you logged in during your session</li>
                <li><strong>csrf_token:</strong> Protects against cross-site request forgery attacks</li>
                <li><strong>cookieConsent:</strong> Stores your cookie preferences</li>
              </ul>
            </div>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.2 Functional Cookies (Optional)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers
              whose services we have added to our pages.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li><strong>language_preference:</strong> Remembers your language selection</li>
                <li><strong>theme_preference:</strong> Stores your display preferences</li>
                <li><strong>recent_searches:</strong> Saves your recent searches for convenience</li>
              </ul>
            </div>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.3 Analytics Cookies (Optional)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information
              anonymously. This helps us improve our website's performance and user experience.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li><strong>_ga, _gid:</strong> Google Analytics cookies that track visitor behavior</li>
                <li><strong>_gat:</strong> Used to throttle request rate</li>
                <li><strong>analytics_session:</strong> Tracks session duration and interactions</li>
              </ul>
            </div>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">3.4 Marketing Cookies (Optional)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many
              times you see an advertisement. We may share this information with other organizations such as advertisers.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li><strong>_fbp:</strong> Facebook Pixel for advertising and analytics</li>
                <li><strong>ads_preferences:</strong> Stores advertising preferences</li>
                <li><strong>marketing_id:</strong> Tracks marketing campaign effectiveness</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we use various third-party services that may set cookies on your device:
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.1 Analytics Services</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Google Analytics:</strong> Analyzes how users interact with our website</li>
              <li><strong>Mixpanel:</strong> Tracks user behavior and engagement</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.2 Payment Processing</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Stripe:</strong> Processes payments securely</li>
              <li><strong>PayPal:</strong> Alternative payment method</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.3 Authentication Services</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Supabase Auth:</strong> Manages user authentication</li>
              <li><strong>OAuth Providers:</strong> Third-party login services (Google, GitHub, etc.)</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">4.4 Content Delivery</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Cloudflare:</strong> Provides CDN and security services</li>
              <li><strong>AWS CloudFront:</strong> Delivers content efficiently</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">5. How Long Do Cookies Last</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies have different durations:
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">5.1 Session Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Temporary cookies that are deleted when you close your browser. Used for essential functions like maintaining your
              login session.
            </p>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">5.2 Persistent Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Remain on your device for a set period or until you delete them. Used to remember your preferences between visits.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-2">Typical Duration:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Authentication cookies: 30 days</li>
                <li>Preference cookies: 1 year</li>
                <li>Analytics cookies: 2 years</li>
                <li>Marketing cookies: 90 days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.1 On Our Website</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can manage your cookie preferences at any time using our cookie consent banner. To change your preferences:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Click the "Cookie Settings" link in the footer</li>
              <li>Choose which categories of cookies to accept or reject</li>
              <li>Save your preferences</li>
            </ul>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.2 Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies after each session</li>
              <li>Accept all cookies</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Browser Cookie Settings:</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
              </ul>
            </div>

            <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">6.3 Impact of Blocking Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Blocking or deleting cookies may impact your experience on our website. Some features may not work properly,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Staying logged in to your account</li>
              <li>Saving your preferences</li>
              <li>Personalized content and recommendations</li>
              <li>Shopping cart functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">7. Do Not Track Signals</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online
              activities tracked. Currently, there is no uniform standard for how to respond to DNT signals. We do not currently
              respond to DNT browser signals, but we do provide you with options to manage your cookie preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">8. Cookies and Mobile Devices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mobile devices may use alternative tracking technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Mobile device identifiers</li>
              <li>SDK integrations</li>
              <li>Local storage</li>
              <li>Mobile advertising IDs</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can manage these through your device settings (iOS: Settings → Privacy, Android: Settings → Google → Ads).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">9. Updates to This Cookie Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business
              practices. We will post any updates on this page and update the "Last Updated" date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">10. More Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For more information about cookies and how to control them, visit:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  AboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  AllAboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://ico.org.uk/for-the-public/online/cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  UK ICO - Cookies
                </a>
              </li>
              <li>
                <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Your Online Choices (EU)
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@hublab.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> [To be determined upon company registration]</p>
              <p className="text-gray-700">
                <strong>Related Policies:</strong>{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                {' | '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
