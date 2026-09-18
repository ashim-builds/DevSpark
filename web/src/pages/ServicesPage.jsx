import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Smartphone, Palette, Cloud, Server, Zap, Globe, ArrowRight, CheckCircle, X, MessageSquare, Database, Layout, Shield } from 'lucide-react';
import Link from '@/components/common/Link';
import SEO from '@/components/common/SEO';
import { servicesAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

export function getServiceIcon(svc) {
  const iconStr = (svc?.icon || "").toLowerCase();
  if (iconStr === "smartphone" || iconStr === "mobile" || iconStr === "android") return Smartphone;
  if (iconStr === "database" || iconStr === "sql" || iconStr === "erp") return Database;
  if (iconStr === "layout" || iconStr === "ecommerce" || iconStr === "store") return Layout;
  if (iconStr === "palette" || iconStr === "design" || iconStr === "ui") return Palette;
  if (iconStr === "cloud" || iconStr === "devops") return Cloud;
  if (iconStr === "server" || iconStr === "backend" || iconStr === "management") return Server;
  if (iconStr === "zap" || iconStr === "pwa" || iconStr === "fast") return Zap;
  if (iconStr === "globe" || iconStr === "web" || iconStr === "website") return Globe;
  if (iconStr === "shield" || iconStr === "security") return Shield;
  if (iconStr === "code" || iconStr === "code2") return Code2;

  const titleStr = (svc?.title || "").toLowerCase();
  if (titleStr.includes("android") || titleStr.includes("mobile") || titleStr.includes("app")) return Smartphone;
  if (titleStr.includes("direct app") || titleStr.includes("pwa") || titleStr.includes("install")) return Zap;
  if (titleStr.includes("unified") || (titleStr.includes("erp") && titleStr.includes("commerce"))) return Database;
  if (titleStr.includes("management") || titleStr.includes("erp") || titleStr.includes("portal") || titleStr.includes("system")) return Server;
  if (titleStr.includes("ecommerce") || titleStr.includes("e-commerce") || titleStr.includes("storefront") || titleStr.includes("store")) return Layout;
  if (titleStr.includes("website") || titleStr.includes("showcase") || titleStr.includes("web")) return Globe;
  if (titleStr.includes("design") || titleStr.includes("ui") || titleStr.includes("ux")) return Palette;
  if (titleStr.includes("cloud") || titleStr.includes("devops")) return Cloud;
  return Code2;
}

const defaultFeatures = {
  'Custom Business & Showcase Websites': [
    'Responsive Multi-Device UI',
    'SEO & Social Meta Optimization',
    'Interactive Contact & Lead Forms',
    'Lightning-Fast Load Times (<1s)',
    'Modern UI/UX & Brand Aesthetics'
  ],
  'Business Management & ERP Systems': [
    'Role-Based Access Control (RBAC)',
    'Real-Time Inventory & Stock Tracking',
    'Live Analytics & Financial Reports',
    'Automated Invoicing & Billing',
    'Secure REST API Architecture'
  ],
  'Scalable E-Commerce Storefronts': [
    'Payment Gateway Integration',
    'Dynamic Product Filter & Search',
    'Cart, Wishlist & Instant Checkout',
    'Coupon & Discount Engine',
    'Order Tracking & Notifications'
  ],
  'Unified ERP + E-Commerce Systems': [
    'Live Stock & Store Auto-Sync',
    'Centralized Multi-Channel Orders',
    'Integrated Accounting & P&L',
    'Supplier & Purchase Management',
    'Multi-Warehouse Inventory Control'
  ],
  'Advanced Android E-Commerce Apps': [
    'High-Performance Native Android Experience',
    'Push Notifications & Flash Alerts',
    'Fast Mobile Checkout & Wallet Pay',
    'Offline Product Browsing & Caching',
    'No iOS Overhead or Delays'
  ],
  'Web + Direct App Installation (PWA / APK)': [
    '1-Click Install Directly from Website',
    'Works Offline with Local Caching',
    'Zero App Store Fees & Waiting Times',
    'Automatic Background Updates',
    'Lightweight & Storage Friendly'
  ],
};

function getServiceFeatures(service) {
  if (service?.features && Array.isArray(service.features) && service.features.length > 0) {
    return service.features;
  }
  const title = (service?.title || "").toLowerCase();
  for (const [key, featList] of Object.entries(defaultFeatures)) {
    if (key.toLowerCase() === title) return featList;
  }
  if (title.includes('android') || title.includes('mobile')) {
    return defaultFeatures['Advanced Android E-Commerce Apps'];
  }
  if (title.includes('direct app') || title.includes('pwa') || title.includes('install')) {
    return defaultFeatures['Web + Direct App Installation (PWA / APK)'];
  }
  if (title.includes('unified') || (title.includes('erp') && title.includes('commerce'))) {
    return defaultFeatures['Unified ERP + E-Commerce Systems'];
  }
  if (title.includes('management') || title.includes('erp') || title.includes('system')) {
    return defaultFeatures['Business Management & ERP Systems'];
  }
  if (title.includes('ecommerce') || title.includes('e-commerce') || title.includes('store')) {
    return defaultFeatures['Scalable E-Commerce Storefronts'];
  }
  if (title.includes('website') || title.includes('showcase') || title.includes('web')) {
    return defaultFeatures['Custom Business & Showcase Websites'];
  }
  return [
    'Customized Architecture',
    'High Performance & Security',
    'Modern Scalable Stack',
    'Ongoing Maintenance & Support',
    'End-to-End Delivery'
  ];
}

/* ── Service Detail Modal ── */
function ServiceModal({ service, onClose }) {
  const name     = service.title;
  const Icon     = getServiceIcon(service);
  const features = getServiceFeatures(service);
  const desc     = service.description || `Professional ${name.toLowerCase()} services tailored to your business needs.`;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 shadow-2xl bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8">
            {/* Icon + title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-950">{name}</h2>
                <p className="text-sm text-primary-600 mt-0.5 font-medium">Professional Service</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">What's Included</h3>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 w-full justify-center px-6 py-3.5 rounded-xl font-semibold text-white
                         bg-primary-500 hover:bg-primary-600 transition-all shadow-sm hover:shadow-orange-500/25 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" /> Get a Quote for This Service
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function ServicesPage() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    servicesAPI.getAll()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Our Services — DevSpark Software Agency"
        description="Explore DevSpark's tailored development services: Custom Business Websites, ERP Systems, Scalable E-Commerce Storefronts, Advanced Android Apps, and Web+Direct App Installers."
        url="https://devspark.com/services"
      />

      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 65%)' }} />
        <div className="container-custom text-center relative z-10">
          <div className="flex justify-center mb-1">
            <motion.span {...fadeUp(0)} className="section-label">What We Do</motion.span>
          </div>
          <motion.h1 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-950 mt-3 mb-3">Our Services</motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Comprehensive software development services. Click any card to learn more.
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section bg-[#faf8f5] border-y border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-light rounded-2xl p-6 animate-pulse space-y-4 bg-white border border-[#f0eae1]">
                    <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                    <div className="h-5 w-2/3 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-4/5 bg-slate-100 rounded" />
                  </div>
                ))
              : services.map((svc, i) => {
                  const name = svc.title;
                  const desc = svc.description;
                  const Icon = getServiceIcon(svc);
                  const features = getServiceFeatures(svc);
                  return (
                    <motion.div
                      key={svc._id || svc.id || i}
                      {...fadeUp(i * 0.07)}
                      className="card-glow p-6 rounded-2xl group flex flex-col cursor-pointer bg-white border border-[#f0eae1] shadow-sm hover:border-primary-500/40 hover:shadow-xl transition-all"
                      onClick={() => setSelected(svc)}
                    >
                      <div className="p-4 rounded-2xl w-fit mb-5 transition-all duration-300
                                      bg-primary-50 border border-primary-200/80 text-primary-600
                                      group-hover:bg-primary-100">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="heading-sm text-slate-900 mb-3">{name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{desc}</p>
                      <ul className="space-y-2 mb-6">
                        {features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                        {features.length > 3 && (
                          <li className="text-xs text-primary-600 pl-5">+{features.length - 3} more features…</li>
                        )}
                      </ul>
                      <div className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold group/link">
                        View Details
                        <ArrowRight className="w-4 h-4 group/link:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-2">
              <span className="section-label">How We Work</span>
            </div>
            <h2 className="heading-md text-slate-950 mt-4">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-slate-200" />

            {[
              { step: '01', title: 'Discovery',   desc: 'We analyse requirements and understand your business goals.' },
              { step: '02', title: 'Planning',     desc: 'We create a detailed roadmap and timeline for your project.' },
              { step: '03', title: 'Development',  desc: 'Our team builds your solution using modern agile standards.' },
              { step: '04', title: 'Delivery',     desc: 'We deploy, test, and provide ongoing maintenance support.' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center
                                border border-primary-200 bg-primary-50 relative shadow-sm">
                  <span className="text-2xl font-bold font-display text-primary-600">{item.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto card-light p-12 rounded-3xl border border-[#f0eae1] bg-white shadow-md">
            <h2 className="heading-md text-slate-950 mb-4">Ready to Start?</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">Let us help you build something amazing. Contact us today for a free project consultation.</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white
                         bg-primary-500 hover:bg-primary-600 transition-all duration-200
                         shadow-sm hover:shadow-orange-500/25 active:scale-95"
            >
              Contact Us Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && <ServiceModal service={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
