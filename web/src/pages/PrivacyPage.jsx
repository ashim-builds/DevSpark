import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { COMPANY_INFO } from '@/lib/constants';

const sections = [
  { id: 'introduction', label: '1. Introduction', icon: FileText },
  { id: 'information-collect', label: '2. Information We Collect', icon: Eye },
  { id: 'how-use', label: '3. How We Use Information', icon: Shield },
  { id: 'sharing', label: '4. Information Sharing', icon: ArrowRight },
  { id: 'security', label: '5. Data Security', icon: Lock },
  { id: 'rights', label: '6. Your Rights & Choices', icon: CheckCircle },
  { id: 'contact', label: '7. Contact Us', icon: Mail },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

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
      const offset = 100;
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
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy — DevSpark"
        description="Review DevSpark's privacy policy, data practices, security commitments, and information usage guidelines."
        url="https://devspark.com/privacy"
      />
      {/* Hero Banner */}
      <section className="relative py-10 md:py-14 overflow-hidden border-b border-slate-100">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)' }} 
        />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-1">
              <span className="section-label">Trust & Security</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 mt-3 mb-2">Privacy Policy</h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sticky Table of Contents Sidebar */}
            <div className="lg:col-span-4 sticky top-28 hidden lg:block">
              <div className="p-6 rounded-2xl border border-[#f0eae1] bg-[#faf8f5] shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
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
                            ? 'bg-orange-50 text-orange-600 border border-orange-200 font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Document Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Introduction */}
              <div id="introduction" className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">01.</span> Introduction
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    Welcome to <strong>{COMPANY_INFO.name}</strong>. We value your trust and are committed to protecting your personal information and privacy rights. This Privacy Policy describes how we collect, use, disclose, and safeguard your data when you visit our website or use our software development and consulting services.
                  </p>
                  <p>
                    By accessing our site or utilizing our services, you consent to the collection and use of information in accordance with this policy. If you do not agree with any terms of this policy, please discontinue the use of our website and services immediately.
                  </p>
                </div>
              </div>

              {/* Information We Collect */}
              <div id="information-collect" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">02.</span> Information We Collect
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    We collect information that you provide directly to us or that is automatically generated during your interaction with our site and services. This includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>
                      <strong className="text-slate-900">Personal Identifiers:</strong> Name, email address, phone number, physical address, and billing information when you contact us or contract our services.
                    </li>
                    <li>
                      <strong className="text-slate-900">Professional Details:</strong> Company name, job title, and project requirements that you share via our contact or request-for-proposal forms.
                    </li>
                    <li>
                      <strong className="text-slate-900">Usage and Device Information:</strong> IP address, browser type, operating system, page views, and access times automatically collected through cookies and tracking tools.
                    </li>
                  </ul>
                </div>
              </div>

              {/* How We Use Information */}
              <div id="how-use" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">03.</span> How We Use Information
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    We use the collected information for various professional purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>To deliver, maintain, and optimize our software engineering and design services.</li>
                    <li>To manage client relationships, handle invoicing, and respond to project inquiries.</li>
                    <li>To send administrative information, update alerts, and occasional promotional communications.</li>
                    <li>To monitor website traffic trends and improve our digital presence and user experience.</li>
                    <li>To comply with legal obligations, enforce agreements, and protect the rights and safety of our agency and clients.</li>
                  </ul>
                </div>
              </div>

              {/* Information Sharing */}
              <div id="sharing" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">04.</span> Information Sharing
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    We do not sell, rent, or trade your personal information. We may share information under these limited circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>
                      <strong className="text-slate-900">Service Providers:</strong> With trusted contractors or third-party vendors who assist in hosting, database management, and operational tool services under strict confidentiality agreements.
                    </li>
                    <li>
                      <strong className="text-slate-900">Legal Compliance:</strong> When required by law, subpoena, or government authority to protect legal rights or ensure safety.
                    </li>
                    <li>
                      <strong className="text-slate-900">Business Transfers:</strong> In connection with any merger, acquisition, or asset sale, subject to transfer of privacy commitments.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Security */}
              <div id="security" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">05.</span> Data Security
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    We implement industry-standard administrative, physical, and technical security measures (such as SSL encryption, firewalls, and secure access protocols) to defend your personal data from unauthorized access, alteration, or disclosure.
                  </p>
                  <p>
                    However, please note that no method of transmission over the internet or system of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your details, we cannot guarantee absolute security.
                  </p>
                </div>
              </div>

              {/* Your Rights & Choices */}
              <div id="rights" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">06.</span> Your Rights & Choices
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    Depending on your location, you may have specific rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li><strong className="text-slate-900">Access & Correction:</strong> The right to request access to or correct your personal data.</li>
                    <li><strong className="text-slate-900">Deletion:</strong> The right to request that we delete your personal information, subject to certain legal exceptions.</li>
                    <li><strong className="text-slate-900">Opt-Out:</strong> The right to opt-out of marketing emails at any time by clicking the "Unsubscribe" link in the footer of our newsletters.</li>
                    <li><strong className="text-slate-900">Cookie Preferences:</strong> You can manage cookie settings directly through your browser configuration.</li>
                  </ul>
                </div>
              </div>

              {/* Contact Us */}
              <div id="contact" className="scroll-mt-28 space-y-4">
                <div className="w-full h-px bg-slate-200 my-4" />
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600">07.</span> Contact Us
                </h2>
                <div className="text-slate-600 space-y-4 leading-relaxed text-base">
                  <p>
                    If you have questions, comments, or concerns about this Privacy Policy or our data practices, please reach out to us at:
                  </p>
                  <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#f0eae1] grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Email</div>
                        <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-slate-600 hover:text-primary-600 transition-colors break-all">
                          {COMPANY_INFO.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Phone</div>
                        <span className="text-sm text-slate-600">{COMPANY_INFO.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Office</div>
                        <span className="text-sm text-slate-600">{COMPANY_INFO.address}</span>
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
