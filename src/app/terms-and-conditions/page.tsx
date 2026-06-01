import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function TermsOfServicePage() {
  const lastUpdated = "June 1, 2026"; // Hardcoded for template

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 selection:bg-emerald-500/30 overflow-x-hidden w-full font-sans">
      {/* Premium Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[0%] right-[0%] w-[60%] h-[60%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
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
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-8 shadow-2xl shadow-blue-500/10 border border-blue-500/20">
            <Scale size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">
            Effective Date: <span className="text-blue-600 dark:text-blue-400">{lastUpdated}</span>
          </p>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl shadow-zinc-200/20 dark:shadow-black/50 animate-in slide-in-from-bottom-8 duration-1000 fade-in delay-150">
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-2xl prose-h2:text-zinc-900 dark:prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6 prose-p:font-medium prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:font-medium prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-li:marker:text-blue-500">
            
            <p className="text-lg md:text-xl font-semibold !text-zinc-900 dark:!text-zinc-200 !leading-relaxed">
              These Terms and Conditions ("Terms", "Agreement") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you", "User", "Vendor", "Consumer") and {siteConfig.companyName} ("Company", "we", "us", or "our"), concerning your access to and use of the {siteConfig.url} website as well as any other media form, media channel, mobile website, API, or mobile application related, linked, or otherwise connected thereto (collectively, the "Site" or "Platform").
            </p>
            <p>
              By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by all of these Terms and Conditions. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS AND CONDITIONS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>

            <hr className="border-zinc-200 dark:border-zinc-800 my-10" />

            <div className="space-y-12">
              <section>
                <h2>1. Definitions and Interpretation</h2>
                <div className="pl-4 border-l-4 border-blue-500/30 space-y-4">
                  <p><strong>1.1 "Platform"</strong> refers to the {siteConfig.name} software-as-a-service application, public directory, APIs, mobile applications, and all associated technology.</p>
                  <p><strong>1.2 "Vendor"</strong> refers to any restaurant, tiffin service, cafe, or food service business that registers an account to use the SaaS platform for operations, inventory, or public listing.</p>
                  <p><strong>1.3 "Consumer"</strong> refers to any individual or entity that accesses the public directory or uses the Platform to interact with, order from, or review a Vendor.</p>
                </div>
              </section>

              <section>
                <h2>2. Platform Services and License</h2>
                <p><strong>2.1 Provision of Services:</strong> Subject to these Terms, {siteConfig.companyName} grants you a non-exclusive, non-transferable, revocable limited license to access and use the Platform strictly in accordance with these Terms and any applicable subscription plans.</p>
                <p><strong>2.2 Service Availability:</strong> We strive to maintain the highest possible uptime; however, the Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee that the Platform will always be safe, secure, or error-free or that the Platform will always function without disruptions, delays, or imperfections.</p>
                <p><strong>2.3 Modifications:</strong> We reserve the right to modify, suspend, or discontinue the Platform (or any part or content thereof) at any time with or without notice to you.</p>
              </section>

              <section>
                <h2>3. Account Registration and Security</h2>
                <p><strong>3.1 Registration:</strong> You may be required to register with the Site to access certain features. You agree to keep your password confidential and will be responsible for all use of your account and password.</p>
                <p><strong>3.2 Accuracy of Information:</strong> You represent and warrant that all registration information you submit will be true, accurate, current, and complete. If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account.</p>
              </section>

              <section className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h2 className="!mt-0 !text-blue-700 dark:!text-blue-400">4. Vendor Responsibilities and Marketplace Rules</h2>
                <p>If you are a Vendor utilizing the Platform:</p>
                <ul className="mb-0">
                  <li><strong>Accuracy of Listings:</strong> You are solely responsible for ensuring that all menus, prices, operating hours, and business details listed on your profile or the public explore directory are accurate and up-to-date.</li>
                  <li><strong>Fulfillment of Orders:</strong> You are contractually bound to honor all orders placed through the Platform in a timely, professional, and safe manner, adhering to all local health, safety, and food standards.</li>
                  <li><strong>Prohibited Items:</strong> You agree not to list, sell, or promote any illegal, restricted, or unauthorized items through the Platform.</li>
                  <li><strong>Taxes:</strong> You are solely responsible for determining, collecting, and remitting any applicable taxes to the appropriate tax authorities.</li>
                </ul>
              </section>

              <section>
                <h2>5. Subscription, Fees, and Payments</h2>
                <p><strong>5.1 Subscription Plans:</strong> Access to premium Vendor features requires an active subscription. By selecting a subscription plan, you authorize us to charge your payment method on a recurring basis (monthly or annually) according to the selected plan.</p>
                <p><strong>5.2 Fee Changes:</strong> We reserve the right to change our subscription prices at any time. We will provide at least 30 days advance notice before any price changes take effect on your next billing cycle.</p>
                <p><strong>5.3 Refunds:</strong> Initial subscription purchases are subject to a {siteConfig.policies.refundDays}-day refund policy. After this period, all payments are non-refundable. Cancellation of a subscription will result in the cessation of future billing, but no prorated refunds will be issued for unused time in the current billing cycle.</p>
              </section>

              <section>
                <h2>6. Acceptable Use Policy</h2>
                <p>You agree not to use the Site for any purpose that is unlawful or prohibited by these Terms. You agree not to:</p>
                <ul>
                  <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                  <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                  <li>Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content.</li>
                  <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
                  <li>Upload or transmit viruses, Trojan horses, or other material, including excessive use of capital letters and spamming, that interferes with any party’s uninterrupted use and enjoyment of the Site.</li>
                </ul>
              </section>

              <section>
                <h2>7. Intellectual Property Rights</h2>
                <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.</p>
              </section>

              <section>
                <h2>8. User Generated Content</h2>
                <p>We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").</p>
                <p>By posting Contributions to any part of the Site, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt, and distribute such Contributions for any purpose.</p>
              </section>

              <section>
                <h2>9. Third-Party Websites and Content</h2>
                <p>The Site may contain links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). We do not endorse and are not responsible for any Third-Party Websites or Third-Party Content.</p>
              </section>

              <section className="bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <h2 className="!mt-0">10. Limitation of Liability</h2>
                <p className="font-bold uppercase text-xs tracking-wider !text-zinc-900 dark:!text-zinc-200">
                  IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="mb-0">
                  {siteConfig.companyName} acts solely as a technology provider bridging Vendors and Consumers. We do not prepare, package, or deliver food, and we assume no liability for the quality, safety, legality, or delivery of any items purchased from Vendors through the Platform.
                </p>
              </section>

              <section>
                <h2>11. Indemnification</h2>
                <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Site; (3) breach of these Terms; (4) any breach of your representations and warranties set forth in these Terms; or (5) your violation of the rights of a third party, including but not limited to intellectual property rights.</p>
              </section>

              <section>
                <h2>12. Dispute Resolution and Governing Law</h2>
                <p>These Terms shall be governed by and defined following the laws of the jurisdiction in which {siteConfig.companyName} is registered. Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the state and federal courts located in that jurisdiction, and the parties hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such state and federal courts.</p>
              </section>

              <section>
                <h2>13. Severability</h2>
                <p>If any provision or part of a provision of these Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Terms and does not affect the validity and enforceability of any remaining provisions.</p>
              </section>

              <section>
                <h2>14. DMCA Notice and Copyright Infringement</h2>
                <p>If you believe that any content on the Platform infringes upon your copyright, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the following information in writing: a physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed; identification of the copyrighted work claimed to have been infringed; identification of the material that is claimed to be infringing and where it is located on the Platform; information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address; a statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and a statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</p>
              </section>

              <section>
                <h2>15. Export Controls</h2>
                <p>The software, services, and technology we provide may be subject to export controls and economic sanctions laws. You agree to comply strictly with all such applicable laws and regulations, including but not limited to the Export Administration Regulations maintained by the U.S. Department of Commerce and the trade and economic sanctions maintained by the Treasury Department's Office of Foreign Assets Control. You shall not—directly or indirectly—sell, export, re-export, transfer, divert, or otherwise dispose of any software or service to any end-user without obtaining required authorizations from the appropriate government authorities.</p>
              </section>

              <section>
                <h2>16. Termination</h2>
                <p>We may terminate or suspend your access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
              </section>

              <section>
                <h2>17. Force Majeure</h2>
                <p>We shall not be liable or responsible to you, nor be deemed to have defaulted or breached these Terms, for any failure or delay in fulfilling or performing any term of these Terms when and to the extent such failure or delay is caused by or results from acts or circumstances beyond our reasonable control, including, without limitation, acts of God, flood, fire, earthquake, explosion, governmental actions, war, invasion or hostilities, terrorist threats or acts, riot or other civil unrest, national emergency, revolution, insurrection, epidemic, lockouts, strikes or other labor disputes, or restraints or delays affecting carriers or inability or delay in obtaining supplies of adequate or suitable materials, materials or telecommunication breakdown or power outage.</p>
              </section>

              <section>
                <h2>18. Arbitration and Class Action Waiver</h2>
                <p>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT. Any and all controversies, disputes, demands, counts, claims, or causes of action (including the interpretation and scope of this clause, and the arbitrability of the controversy, dispute, demand, count, claim, or cause of action) between you and {siteConfig.companyName} or our employees, agents, successors, or assigns, shall exclusively be settled through binding and confidential arbitration.</p>
                <p className="font-bold uppercase text-xs tracking-wider !text-zinc-900 dark:!text-zinc-200">
                  Class Action Waiver: YOU AND {siteConfig.companyName.toUpperCase()} AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                </p>
              </section>

              <section>
                <h2>19. Modifications to the Terms</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms.</p>
              </section>

              <section>
                <h2>20. Electronic Communications, Transactions, and Signatures</h2>
                <p>Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing.</p>
              </section>

              <section>
                <h2>21. Waiver</h2>
                <p>Our failure to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by an authorized representative of {siteConfig.companyName}.</p>
              </section>

              <section>
                <h2>22. Entire Agreement</h2>
                <p>These Terms, along with our Privacy Policy and any other legal notices published by us on the Platform, constitute the entire agreement between you and {siteConfig.companyName} concerning your use of the Platform, superseding any prior agreements between you and us (including, but not limited to, any prior versions of the Terms).</p>
              </section>

              <section>
                <h2>23. Feedback and Suggestions</h2>
                <p>You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other information regarding the Site or the Marketplace ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.</p>
              </section>

              <section>
                <h2>24. Contact Us</h2>
                <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
                <address className="not-italic flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 bg-blue-50 dark:bg-zinc-900/80 rounded-2xl border border-blue-100 dark:border-zinc-800 mt-6 shadow-inner shadow-black/5">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-black text-lg block mb-2">{siteConfig.companyName}</span>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium space-y-1">
                      <div>{siteConfig.contact.address}</div>
                      <div>{siteConfig.contact.phone}</div>
                    </div>
                  </div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                    Email Support
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

