'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Award, Users, Eye, Target, Code2 } from 'lucide-react';
import { TIMELINE_EVENTS, VALUES, COMPANY_INFO } from '@/lib/constants';
import { projectsAPI, testimonialsAPI, teamAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const valueIcons = { Innovation: Lightbulb, Quality: Award, Collaboration: Users, Transparency: Eye };

export default function AboutContent() {
  const yearsExp = new Date().getFullYear() - COMPANY_INFO.founded;
  const [stats, setStats] = useState({ projects: 0, clients: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsAPI.getAll(), testimonialsAPI.getAll()])
      .then(([projects, testimonials]) => {
        setStats({ projects: projects.length, clients: testimonials.length });
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0d0b09' }}>

      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.14) 0%, transparent 65%)' }} />
        <div className="container-custom text-center relative z-10">
          <motion.span {...fadeUp(0)} className="section-label">Our Story</motion.span>
          <motion.h1 {...fadeUp(0.1)} className="heading-xl text-white mt-4 mb-5">About DevSpark</motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-surface-400 text-lg max-w-xl mx-auto">
            A team of passionate innovators building software that makes a real difference.
          </motion.p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp(0)}>
              <span className="section-label">Our Journey</span>
              <h2 className="heading-md text-white mt-4 mb-6">From Vision to Reality</h2>
              <div className="space-y-4 text-surface-400 leading-relaxed">
                <p>DevSpark was founded in {COMPANY_INFO.founded} with a clear vision: to transform how businesses approach software development. What started as a small team has grown into a full-service agency.</p>
                <p>We have helped businesses of all sizes — from ambitious startups to established enterprises — build digital products that drive growth and create lasting value.</p>
                <p>Today, we continue to push boundaries, embrace new technologies, and deliver solutions that exceed expectations.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10">
                {statsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="card-dark p-4 rounded-xl text-center border border-dark-700/60 animate-pulse">
                        <div className="h-7 w-12 bg-dark-700 rounded mx-auto mb-2" />
                        <div className="h-3 w-16 bg-dark-700 rounded mx-auto" />
                      </div>
                    ))
                  : [
                      { n: yearsExp + '+',         l: 'Years Exp.' },
                      { n: stats.projects + '+',   l: 'Projects' },
                      { n: stats.clients + '+',    l: 'Clients' },
                    ].map(({ n, l }) => (
                      <div key={l} className="card-dark p-4 rounded-xl text-center border border-dark-700/60">
                        <div className="text-2xl font-bold font-display text-primary-400">{n}</div>
                        <div className="text-xs text-surface-500 mt-1">{l}</div>
                      </div>
                    ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-2xl scale-110 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700"
                alt="DevSpark team"
                className="relative rounded-2xl w-full object-cover border border-dark-700/60
                           shadow-[0_0_60px_rgba(0,0,0,0.6)]"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl border-2 border-primary-500/30 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section" style={{ background: '#0d0b09' }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { Icon: Target, title: 'Our Mission', color: 'primary',
                text: 'Empower businesses with innovative software solutions that drive growth, enhance efficiency, and create exceptional user experiences.' },
              { Icon: Eye,    title: 'Our Vision', color: 'accent',
                text: 'To be the leading software development partner for businesses worldwide, known for our technical excellence and unwavering commitment to client success.' },
            ].map(({ Icon, title, text, color }) => (
              <motion.div key={title} {...fadeUp(0)} className="card-dark p-8 rounded-2xl">
                <div className={`p-3 rounded-xl w-fit mb-5 ${color === 'primary' ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-accent-500/10 border border-accent-500/20'}`}>
                  <Icon className={`w-6 h-6 ${color === 'primary' ? 'text-primary-400' : 'text-accent-400'}`} />
                </div>
                <h3 className="heading-sm text-white mb-3">{title}</h3>
                <p className="text-surface-400 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-label">What Drives Us</span>
            <h2 className="heading-md text-white mt-4">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((value, i) => {
              const Icon = valueIcons[value.title] || Code2;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="card-glow p-6 rounded-2xl text-center group"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 w-fit mx-auto mb-4
                                  group-hover:bg-primary-500/20 group-hover:border-primary-500/40 transition-all">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section" style={{ background: '#0d0b09' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-label">Milestones</span>
            <h2 className="heading-md text-white mt-4">Our Journey</h2>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.4) 10%, rgba(249,115,22,0.4) 90%, transparent)' }} />

            {TIMELINE_EVENTS.map((evt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-center mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-[calc(50%-20px)] ${i % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="card-dark p-5 rounded-xl inline-block text-left w-full">
                    <span className="text-primary-400 font-bold font-display text-lg">{evt.year}</span>
                    <h3 className="font-semibold text-white mt-1 mb-1">{evt.title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{evt.description}</p>
                  </div>
                </div>
                {/* Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4"
                  style={{ borderColor: '#0d0b09', boxShadow: '0 0 16px rgba(249,115,22,0.6)' }} />
                <div className="w-[calc(50%-20px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
