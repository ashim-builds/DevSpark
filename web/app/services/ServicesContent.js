'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Smartphone, Palette, Cloud, Server, Zap, ArrowRight, CheckCircle, X, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { servicesAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const serviceIcons = {
  'Web Development':             Code2,
  'Mobile App Development':      Smartphone,
  'Custom Software Development': Server,
  'UI/UX Design':                Palette,
  'Cloud Solutions':             Cloud,
  'API Development':             Zap,
};

const defaultFeatures = {
  'Web Development':             ['Responsive Design', 'Modern Frameworks', 'SEO Optimized', 'Performance Focused', 'Secure Architecture'],
  'Mobile App Development':      ['iOS & Android', 'Cross-Platform', 'Native Performance', 'Offline Support', 'Push Notifications'],
  'Custom Software Development': ['Tailored Solutions', 'Scalable Architecture', 'Integration Ready', '24/7 Support', 'Maintenance Included'],
  'UI/UX Design':                ['User Research', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Systems'],
  'Cloud Solutions':             ['AWS & Azure', 'Auto-Scaling', 'Cost Optimization', 'High Availability', 'Disaster Recovery'],
  'API Development':             ['RESTful APIs', 'GraphQL', 'Documentation', 'Rate Limiting', 'Authentication'],
};

/* ── Service Detail Modal ── */
function ServiceModal({ service, onClose }) {
  const name     = service.title;
  const Icon     = serviceIcons[name] || Code2;
  const features = defaultFeatures[name] || [];
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
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-dark-700/80 shadow-2xl"
          style={{ background: '#1a1612' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-surface-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8">
            {/* Icon + title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 shrink-0">
                <Icon className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white">{name}</h2>
                <p className="text-sm text-primary-400 mt-0.5">Professional Service</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-surface-300 leading-relaxed mb-6">{desc}</p>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">What's Included</h3>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-surface-300">
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
                         bg-primary-500 hover:bg-primary-600 transition-all
                         shadow-[0_0_25px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]"
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
export default function ServicesContent() {
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
    <div className="min-h-screen" style={{ background: '#0d0b09' }}>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.14) 0%, transparent 65%)' }} />
        <div className="container-custom text-center relative z-10">
          <motion.span {...fadeUp(0)} className="section-label">What We Do</motion.span>
          <motion.h1 {...fadeUp(0.1)} className="heading-xl text-white mt-4 mb-5">Our Services</motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-surface-400 text-lg max-w-xl mx-auto">
            Comprehensive software development services. Click any card to learn more.
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-dark rounded-2xl p-6 animate-pulse space-y-4">
                    <div className="w-14 h-14 bg-dark-700 rounded-2xl" />
                    <div className="h-5 w-2/3 bg-dark-700 rounded" />
                    <div className="h-3 w-full bg-dark-700 rounded" />
                    <div className="h-3 w-4/5 bg-dark-700 rounded" />
                  </div>
                ))
              : services.map((svc, i) => {
                  const name = svc.title;
                  const desc = svc.description || `Professional ${name.toLowerCase()} services tailored to your business needs.`;
                  const Icon = serviceIcons[name] || Code2;
                  const features = defaultFeatures[name] || [];
                  return (
                    <motion.div
                      key={svc._id || svc.id || i}
                      {...fadeUp(i * 0.07)}
                      className="card-glow p-6 rounded-2xl group flex flex-col cursor-pointer"
                      onClick={() => setSelected(svc)}
                    >
                      <div className="p-4 rounded-2xl w-fit mb-5 transition-all duration-300
                                      bg-primary-500/10 border border-primary-500/20
                                      group-hover:bg-primary-500/20 group-hover:border-primary-500/40">
                        <Icon className="w-7 h-7 text-primary-400" />
                      </div>
                      <h3 className="heading-sm text-white mb-3">{name}</h3>
                      <p className="text-sm text-surface-400 leading-relaxed mb-5 flex-1">{desc}</p>
                      <ul className="space-y-2 mb-6">
                        {features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-surface-400">
                            <CheckCircle className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                        {features.length > 3 && (
                          <li className="text-xs text-primary-400/70 pl-5">+{features.length - 3} more features…</li>
                        )}
                      </ul>
                      <div className="flex items-center gap-1.5 text-sm text-primary-400 font-medium group/link">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ background: '#0d0b09' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-label">How We Work</span>
            <h2 className="heading-md text-white mt-4">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.3), rgba(249,115,22,0.3), transparent)' }} />

            {[
              { step: '01', title: 'Discovery',   desc: 'We analyse requirements and understand your business goals.' },
              { step: '02', title: 'Planning',     desc: 'We create a detailed roadmap and timeline for your project.' },
              { step: '03', title: 'Development',  desc: 'Our team builds your solution using agile methodologies.' },
              { step: '04', title: 'Delivery',     desc: 'We deploy, test, and provide ongoing support.' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center
                                border border-primary-500/30 bg-primary-500/10 relative">
                  <span className="text-2xl font-bold font-display text-primary-400">{item.step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto card-dark p-12 rounded-3xl border border-primary-500/10"
            style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08), transparent)' }}>
            <h2 className="heading-md text-white mb-4">Ready to Start?</h2>
            <p className="text-surface-400 mb-8">Let us help you build something amazing. Contact us for a free consultation.</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white
                         bg-primary-500 hover:bg-primary-600 transition-all duration-200
                         shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
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
