import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - AI SaaS Discovery Platform",
  description: "Privacy Policy for AI SaaS Discovery Platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Introduction</h2>
              <p className="mb-3">
                At our AI SaaS Discovery Platform, we highly value the protection of your personal data. This privacy
                policy explains how we collect, use, and protect your information when you use our
                platform. We are committed to providing a safe and transparent discovery and showcase platform for AI SaaS project creators and users.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Information We Collect</h2>
              <p className="mb-3">
                <strong>Information you provide to us:</strong>
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (username, avatar, bio)</li>
                <li>Content you publish (AI SaaS project submissions, comments, reviews)</li>
                <li>Communications with us</li>
                <li>Project-related information (project descriptions, tech stack, categories, pricing models)</li>
                <li>AI tool preferences and usage patterns</li>
              </ul>

              <p className="mb-3">
                <strong>Information automatically collected:</strong>
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Usage data (pages visited, time spent, interaction patterns)</li>
                <li>Device information (device type, operating system, browser)</li>
                <li>Geographic location (country/region)</li>
                <li>AI SaaS discovery behavior and preferences</li>
                <li>Search queries and filtering preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Provide, maintain, and improve our AI SaaS discovery platform</li>
                <li>Create and manage your account and profile</li>
                <li>Process project submissions and showcase AI SaaS tools</li>
                <li>Facilitate discovery of relevant AI SaaS projects</li>
                <li>Communicate with you about platform updates and featured projects</li>
                <li>Personalize your AI tool discovery experience</li>
                <li>Provide recommendations based on your interests and usage patterns</li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Analyze platform usage to improve AI SaaS categorization and search</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Sharing Your Information</h2>
              <p className="mb-3">
                We do not sell your personal data. We may share your information in the following
                situations:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>
                  <strong>With service providers</strong> who help us operate our AI SaaS discovery platform (hosting, analytics, email services)
                </li>
                <li>
                  <strong>Public project information</strong> that you choose to make visible (project names, descriptions, categories) to help others discover AI SaaS tools
                </li>
                <li>
                  <strong>For legal obligations</strong> (when required by law or to protect our rights and the rights of our users)
                </li>
                <li>
                  <strong>With your explicit consent</strong> or according to your instructions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Your Rights and Choices</h2>
              <p className="mb-3">You have the following rights regarding your personal data:</p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Access your data</li>
                <li>Rectify or update your information</li>
                <li>Delete your account and data (with certain limitations)</li>
                <li>Limit the processing of your data</li>
                <li>Withdraw your consent</li>
              </ul>
              <p className="mb-3">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:dongshan1025@gmail.com"
                  className="text-primary hover:underline"
                >
                  dongshan1025@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Data Security</h2>
              <p className="mb-3">
                We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, and regular security assessments. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Data Retention</h2>
              <p className="mb-3">
                We retain your personal data for as long as necessary to provide you with our AI SaaS discovery services and as required by law. When you delete your account, we delete your personal data or anonymize it, unless retention is necessary for legal reasons or to maintain the integrity of project discovery features. Published project information may remain visible to maintain the continuity of the discovery platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Children</h2>
              <p className="mb-3">
                Our service is not intended for individuals under the age of 13. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Changes to This Policy</h2>
              <p className="mb-3">
                We may update this privacy policy from time to time. We will notify you of
                significant changes, but we encourage you to review this page regularly to stay
                informed.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <p className="mb-3">
                <a
                  href="mailto:dongshan1025@gmail.com"
                  className="text-primary hover:underline"
                >
                  dongshan1025@gmail.com
                </a>
              </p>
            </section>

            
          </div>

          <div className="mt-8 border-t pt-6 dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
