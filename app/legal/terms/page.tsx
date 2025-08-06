/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"

export const metadata = {
  title: "Terms of Service - AI SaaS Discovery Platform",
  description: "Terms of Service for AI SaaS Discovery Platform. Read our terms and conditions for using our AI SaaS discovery and showcase platform.",
  alternates: {
    canonical: "https://ai-saas.org/legal/terms",
  },
  openGraph: {
    title: "Terms of Service - AI SaaS Discovery Platform",
    description: "Terms of Service for AI SaaS Discovery Platform. Read our terms and conditions.",
    type: "website",
    url: "https://ai-saas.org/legal/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Terms of Service</h1>
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
                Welcome to our AI SaaS Discovery Platform. These Terms of Service govern your use of our platform,
                which focuses on discovering, showcasing, and supporting AI SaaS projects and tools.
              </p>
              <p className="mb-3">
                By using our AI SaaS Discovery Platform, you agree to these terms. If you don't agree, please don't use
                our services.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Using Our Service</h2>
              <p className="mb-3">
                <strong>Age Requirements:</strong> You must be at least 13 years old to use
                our AI SaaS Discovery Platform.
              </p>
              <p className="mb-3">
                <strong>Account Responsibility:</strong> If you create an account, you're
                responsible for maintaining its security and for all activities under your account.
              </p>
              <p className="mb-3">
                <strong>Acceptable Use:</strong> When using our platform, you agree not to:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Submit false or misleading information about AI SaaS projects</li>
                <li>Post content that's illegal, harmful, or violates others' rights</li>
                <li>Misrepresent yourself, your projects, or your affiliation with others</li>
                <li>Interfere with the platform's operation or security</li>
                <li>Collect user data without permission</li>
                <li>Use the service for spam or unauthorized commercial purposes</li>
                <li>Submit projects that violate intellectual property rights</li>
                <li>Manipulate project rankings or reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Content and AI SaaS Project Submissions</h2>
              <p className="mb-3">
                <strong>Your Content:</strong> When you submit AI SaaS projects, descriptions, comments, or other content
                on our platform, you retain ownership, but grant us permission to display, promote, and use
                that content on our platform and in related marketing materials.
              </p>
              <p className="mb-3">
                <strong>Project Accuracy:</strong> You're responsible for ensuring that all information about your AI SaaS projects is accurate, up-to-date, and truthful. This includes pricing, features, availability, and technical specifications.
              </p>
              <p className="mb-3">
                <strong>Responsibility:</strong> You're responsible for the content you submit. Make
                sure you have the right to share it and that it doesn't violate any laws, intellectual property rights, or these terms.
              </p>
              <p className="mb-3">
                <strong>Our Rights:</strong> We can remove any content at our discretion if we
                believe it violates these terms, is inaccurate, or might harm our platform, users, or third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. AI SaaS Project Discovery and Third-Party Services</h2>
              <p className="mb-3">
                Our platform may contain links to third-party AI SaaS tools, websites, or services. We're not responsible for the content, policies, practices, availability, or functionality of these third-party AI services.
              </p>
              <p className="mb-3">
                Your interactions with third-party AI SaaS providers, including purchases, subscriptions, or use of their services, are between you and that third party. We do not endorse or guarantee the quality, security, or reliability of any third-party AI tools.
              </p>
              <p className="mb-3">
                <strong>Project Verification:</strong> While we strive to maintain accurate information, we cannot guarantee that all AI SaaS project information is current or accurate. Users should verify details directly with project creators.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Termination</h2>
              <p className="mb-3">
                We can suspend or terminate your access to our AI SaaS Discovery Platform at any time for any reason,
                particularly if you violate these terms, submit false information, or engage in harmful behavior.
              </p>
              <p className="mb-3">
                If your account is terminated, you'll no longer have access to your submitted projects, account information, or platform features. However, publicly visible project information may remain on the platform to maintain discovery continuity.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Disclaimers</h2>
              <p className="mb-3">
                Our AI SaaS Discovery Platform is provided "as is" without warranties of any kind. We don't guarantee
                that the service will be uninterrupted, secure, or error-free.
              </p>
              <p className="mb-3">
                We're not responsible for the accuracy, reliability, quality, or performance of any AI SaaS projects, tools, or content posted by users or third parties. We do not endorse any specific AI SaaS solutions and encourage users to conduct their own research.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Limitation of Liability</h2>
              <p className="mb-3">
                To the extent permitted by law, our AI SaaS Discovery Platform and its team will not be liable for any
                indirect, incidental, special, or consequential damages resulting from your use of
                or inability to use our service, including any issues arising from third-party AI SaaS tools discovered through our platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Changes to These Terms</h2>
              <p className="mb-3">
                We may update these terms from time to time. We'll notify you of significant
                changes, but it's your responsibility to review these terms periodically.
              </p>
              <p className="mb-3">
                Your continued use of our AI SaaS Discovery Platform after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Contact Us</h2>
              <p className="mb-3">If you have questions about these terms, please contact us at:</p>
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
