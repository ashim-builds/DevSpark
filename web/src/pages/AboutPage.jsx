import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Award, Users, Eye, Target, Code2 } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { TIMELINE_EVENTS, VALUES, COMPANY_INFO } from '@/lib/constants';
import { projectsAPI, testimonialsAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const valueIcons = { Innovation: Lightbulb, Quality: Award, Collaboration: Users, Transparency: Eye };

export default function AboutPage() {
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
    <div className="min-h-screen bg-white">
      <SEO
        title="About Us — DevSpark Software Development"
        description="Learn more about DevSpark, our mission, vision, journey, and the core values guiding our software engineering team."
        url="https://devspark.com/about"
      />

      {/* ── Hero ── */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 65%)' }} />
        <div className="container-custom text-center relative z-10">
          <div className="flex justify-center mb-1">
            <motion.span {...fadeUp(0)} className="section-label">Our Story</motion.span>
          </div>
          <motion.h1 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-950 mt-3 mb-3">About DevSpark</motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            A team of passionate innovators building software that makes a real difference.
          </motion.p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section bg-[#faf8f5] border-y border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp(0)}>
              <div className="mb-2">
                <span className="section-label">Our Journey</span>
              </div>
              <h2 className="heading-md text-slate-950 mt-4 mb-6">From Vision to Reality</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>DevSpark was founded with a clear vision: to transform how businesses approach software development. What started as a dedicated group of engineers has grown into a full-service agency.</p>
                <p>We have helped businesses of all sizes — from ambitious startups to established enterprises — build digital products that drive growth and create lasting value.</p>
                <p>Today, we continue to push boundaries, embrace modern technologies, and deliver solutions that exceed expectations.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10">
                {statsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="card-light p-4 rounded-xl text-center border border-[#f0eae1] bg-white animate-pulse">
                        <div className="h-7 w-12 bg-slate-200 rounded mx-auto mb-2" />
                        <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
                      </div>
                    ))
                  : [
                      { n: yearsExp > 0 ? `${yearsExp}+` : "0", l: 'Years Exp.' },
                      { n: stats.projects > 0 ? `${stats.projects}+` : "0", l: 'Projects' },
                      { n: stats.clients > 0 ? `${stats.clients}+` : "0", l: 'Clients' },
                    ].map(({ n, l }) => (
                      <div key={l} className="card-light p-4 rounded-xl text-center border border-[#f0eae1] bg-white shadow-sm">
                        <div className="text-2xl font-bold font-display text-primary-500">{n}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{l}</div>
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
              <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-xl scale-105 pointer-events-none" />
              <img
                src="/about-team.jpg"
                alt="DevSpark team working together"
                className="relative rounded-2xl w-full object-cover border border-[#f0eae1] shadow-xl"
                style={{ aspectRatio: '4/3' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { Icon: Target, title: 'Our Mission', color: 'primary',
                text: 'Empower businesses with innovative software solutions that drive growth, enhance efficiency, and create exceptional user experiences.' },
              { Icon: Eye,    title: 'Our Vision', color: 'accent',
                text: 'To be the leading software development partner for businesses worldwide, known for our technical excellence and unwavering commitment to client success.' },
            ].map(({ Icon, title, text }) => (
              <motion.div key={title} {...fadeUp(0)} className="card-light p-8 rounded-2xl border border-[#f0eae1] bg-white shadow-sm hover:border-primary-500/40 transition-all">
                <div className="p-3.5 rounded-xl w-fit mb-5 bg-primary-50 border border-primary-200 text-primary-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="heading-sm text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-2">
              <span className="section-label">What Drives Us</span>
            </div>
            <h2 className="heading-md text-slate-950 mt-4">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((value, i) => {
              const Icon = valueIcons[value.title] || Code2;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="card-glow p-6 rounded-2xl text-center group bg-white border border-[#f0eae1] shadow-sm hover:border-primary-500/40 hover:shadow-md"
                >
                  <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-200 w-fit mx-auto mb-4
                                  text-primary-600 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
