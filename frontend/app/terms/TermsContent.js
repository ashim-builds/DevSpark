'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, UserCheck, AlertTriangle, ShieldCheck, HelpCircle, Scale, Mail, Phone, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

const sections = [
  { id: 'agreement', label: '1. Agreement to Terms', icon: FileText },
  { id: 'intellectual-property', label: '2. Intellectual Property', icon: Award },
  { id: 'representations', label: '3. User Representations', icon: UserCheck },
  { id: 'prohibited-activities', label: '4. Prohibited Activities', icon: AlertTriangle },
  { id: 'billing', label: '5. Services & Billing', icon: ShieldCheck },
  { id: 'liability', label: '6. Limitation of Liability', icon: HelpCircle },
  { id: 'governing-law', label: '7. Governing Law', icon: Scale },
  { id: 'contact', label: '8. Contact Us', icon: Mail },
];

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState('agreement');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better triggering

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d0b09' }}>
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 65%)' }} 
        />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">Legal Agreement</span>
            <h1 className="heading-xl text-white mt-4 mb-4">Terms of Service</h1>
            <p className="text-surface-400 text-sm max-w-lg mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sticky Table of Contents Sidebar */}
            <div className="lg:col-span-4 sticky top-28 hidden lg:block">
              <div className="card-dark p-6 rounded-2xl border border-dark-700/60 bg-dark-900/40 backdrop-blur-sm">
                <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 font-medium'
                            : 'text-surface-400 hover:text-white hover:bg-dark-800/40 border border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-surface-500'}`} />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Document Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Agreement */}
              <div id="agreement" className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">01.</span> Agreement to Terms
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>{COMPANY_INFO.name}</strong> (“we,” “us,” or “our”), concerning your access to and use of our website as well as any other media form, media channel, mobile website, or related software development, design, and consulting services.
                  </p>
                  <p>
                    By accessing our website or utilizing our services, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using our site and services and must discontinue use immediately.
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div id="intellectual-property" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">02.</span> Intellectual Property Rights
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    Unless otherwise indicated, the website and all of its content, including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics, as well as the trademarks, service marks, and logos contained therein, are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                  </p>
                  <p>
                    Except as expressly provided in these Terms, no part of the website or content may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                  </p>
                </div>
              </div>

              {/* User Representations */}
              <div id="representations" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">03.</span> User Representations
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    By using the website and our services, you represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-surface-400">
                    <li>All registration and contact information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                    <li>You will not access the website through automated or non-human means, whether through a bot, script or otherwise.</li>
                    <li>Your use of the website or services will not violate any applicable law or regulation.</li>
                  </ul>
                </div>
              </div>

              {/* Prohibited Activities */}
              <div id="prohibited-activities" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">04.</span> Prohibited Activities
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    You may not access or use the website or services for any purpose other than that for which we make them available. Prohibited activities include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-surface-400">
                    <li>Systematically retrieving data or other content from the website to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                    <li>Circumventing, disabling, or otherwise interfering with security-related features of the website.</li>
                    <li>Engaging in unauthorized framing of or linking to the website.</li>
                    <li>Interfering with, disrupting, or creating an undue burden on the website or the networks or services connected to the website.</li>
                    <li>Using any information obtained from the website in order to harass, abuse, or harm another person.</li>
                  </ul>
                </div>
              </div>

              {/* Services & Billing */}
              <div id="billing" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">05.</span> Services & Billing
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    For custom software engineering, consulting, and design services, specific statements of work (SOW) or service agreements will govern payment, milestones, timelines, and delivery.
                  </p>
                  <p>
                    All billing terms, project phases, and scope of works will be detailed in individual contract agreements signed between you and {COMPANY_INFO.name}. Payment defaults or scope changes may lead to service interruption or adjustments according to the signed project agreement terms.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div id="liability" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">06.</span> Limitation of Liability
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the website or services, even if we have been advised of the possibility of such damages.
                  </p>
                  <p>
                    Notwithstanding anything to the contrary contained herein, our liability to you for any cause whatsoever and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) month period prior to any cause of action arising.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div id="governing-law" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">07.</span> Governing Law
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    These Terms of Service and your use of the website and services are governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms will be subject to the exclusive jurisdiction of the courts located in Kaski, Nepal.
                  </p>
                </div>
              </div>

              {/* Contact Us */}
              <div id="contact" className="scroll-mt-28 space-y-4">
                <div className="glow-line my-4 opacity-40" />
                <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">08.</span> Contact Us
                </h2>
                <div className="text-surface-400 space-y-4 leading-relaxed text-base">
                  <p>
                    In order to resolve a complaint regarding the website or services, or to receive further information regarding use of the services, please contact us at:
                  </p>
                  <div className="card-dark p-6 rounded-2xl border border-dark-700/60 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Email</div>
                        <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-surface-400 hover:text-primary-400 transition-colors break-all">
                          {COMPANY_INFO.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Phone</div>
                        <span className="text-sm text-surface-400">{COMPANY_INFO.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Office</div>
                        <span className="text-sm text-surface-400">{COMPANY_INFO.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
