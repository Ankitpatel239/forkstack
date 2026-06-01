import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 1, 2026"; // Hardcoded for template

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 selection:bg-emerald-500/30 overflow-x-hidden w-full font-sans">
      {/* Premium Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[0%] left-[0%] w-[60%] h-[60%] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-white/5 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
              <ArrowLeft size={16} className="text-zinc-500 dark:text-zinc-400" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">Return to {siteConfig.name}</span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow container max-w-4xl mx-auto py-16 md:py-24 px-4 relative z-10">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl mb-8 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
            Privacy Policy
          </h1>
          <p className="mt-6 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">
            Effective Date: <span className="text-emerald-600 dark:text-emerald-400">{lastUpdated}</span>
          </p>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl shadow-zinc-200/20 dark:shadow-black/50 animate-in slide-in-from-bottom-8 duration-1000 fade-in delay-150">
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-2xl prose-h2:text-zinc-900 dark:prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6 prose-p:font-medium prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:font-medium prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-li:marker:text-emerald-500">
            
            <p className="text-lg md:text-xl font-semibold !text-zinc-900 dark:!text-zinc-200 !leading-relaxed">
              Welcome to {siteConfig.name} ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at <a href={`mailto:${siteConfig.contact.email}`} className="text-emerald-600 dark:text-emerald-400 no-underline hover:underline">{siteConfig.contact.email}</a>.
            </p>

            <hr className="border-zinc-200 dark:border-zinc-800 my-10" />

            <div className="space-y-12">
              <section>
                <h2>1. Information We Collect</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the {siteConfig.name} platform, express an interest in obtaining information about us or our products and Services, when you participate in activities on the platform, or otherwise when you contact us.</p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="p-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
                    <h3 className="!mt-0 !text-lg !mb-4">Vendor Data</h3>
                    <ul className="mb-0">
                      <li>Business Name & Owner Details</li>
                      <li>Email & Contact Numbers</li>
                      <li>Physical HQ Address</li>
                      <li>Billing & Subscription Data</li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
                    <h3 className="!mt-0 !text-lg !mb-4">Consumer Data</h3>
                    <ul className="mb-0">
                      <li>Name & Contact Data</li>
                      <li>Order History & Preferences</li>
                      <li>Delivery Addresses</li>
                      <li>Public Reviews</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2>2. How We Use Your Information</h2>
                <p>We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                <ul className="grid sm:grid-cols-2 gap-4 gap-y-2 mt-4 pl-0 list-none">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>To facilitate account creation and logon process.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>To fulfill and manage your orders, payments, and subscriptions.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>To post vendor listings in our public explore directory.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>To send administrative information to you.</li>
                </ul>
              </section>

              <section>
                <h2>3. Will Your Information Be Shared With Anyone?</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. This includes third-party service providers (like Stripe for payments and AWS/Supabase for cloud hosting) who perform services for us or on our behalf and require access to such information to do that work.</p>
              </section>

              <section>
                <h2>4. Cookies and Similar Technologies</h2>
                <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
              </section>

              <section>
                <h2>5. How Long Do We Keep Your Information?</h2>
                <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).</p>
              </section>

              <section>
                <h2>6. How Can You Contact Us About This Notice?</h2>
                <p>If you have questions or comments about this notice, you may email us at {siteConfig.contact.email} or by post to:</p>
                <address className="not-italic flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 bg-emerald-50 dark:bg-zinc-900/80 rounded-2xl border border-emerald-100 dark:border-zinc-800 mt-6 shadow-inner shadow-black/5">
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg block mb-2">{siteConfig.companyName}</span>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium space-y-1">
                      <div>{siteConfig.contact.address}</div>
                    </div>
                  </div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap">
                    Contact Privacy Team
                  </a>
                </address>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200/50 dark:border-white/5 py-12 bg-zinc-100/50 dark:bg-zinc-950/50 relative z-10 backdrop-blur-xl">
        <div className="container mx-auto text-center flex flex-col items-center">
          <div className="h-1 w-12 bg-zinc-300 dark:bg-zinc-800 rounded-full mb-8"></div>
          <p className="text-zinc-500 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
