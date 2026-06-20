"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Palette,
  Cloud,
  Server,
  Zap,
  Shield,
  Users,
  Star,
  ExternalLink,
  Github,
} from "lucide-react";
import Image from "next/image";

/* ── Shared animation variants ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

/* ── Logo SVG (reusable in hero) ── */

const serviceIcons = {
  "Web Development": Code2,
  "Mobile App Development": Smartphone,
  "Custom Software Development": Server,
  "UI/UX Design": Palette,
  "Cloud Solutions": Cloud,
  "API Development": Zap,
};

/* ════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════ */
export function HeroSection({
  projectsCount = 0,
  happyClientsCount = 0,
  teamCount = 0,
  satisfactionRate = 98,
}) {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background: radial orange glow + dark grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(249,115,22,0.15),transparent)",
        }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(245,158,11,0.12),transparent)",
        }}
      />

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-6 flex justify-center">
            <span className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Innovating Since 2020
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div {...fadeUp(0.05)} className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full animate-glow-pulse pointer-events-none" />

              <Image
                src="/devspark-icon.png"
                alt="DevSpark Logo"
                width={120}
                height={120}
                priority
                className="relative object-contain animate-float"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.1)} className="heading-xl text-white mb-6">
            We Build{" "}
            <span className="relative inline-block">
              <span className="text-gradient">Exceptional</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5 Q75 1 150 5 Q225 9 299 5"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
            <br />
            Digital Experiences
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg md:text-xl text-surface-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your business with cutting-edge software solutions. We
            craft modern web and mobile applications that drive growth and
            delight users.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold
                         bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200
                         shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)]"
            >
              View Our Work
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold
                         border border-surface-600 text-surface-200 hover:border-primary-500 hover:text-primary-400 transition-all duration-200"
            >
              Get in Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { num: `${projectsCount}+`, label: "Projects Delivered" },
              { num: `${happyClientsCount}+`, label: "Happy Clients" },
              { num: `${teamCount}+`, label: "Team Members" },
              { num: `${satisfactionRate}%`, label: "Satisfaction Rate" },
            ].map(({ num, label }) => (
              <div key={label} className="group">
                <div className="card-dark p-6 rounded-2xl text-center hover:border-primary-500/30 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold font-display text-primary-400 mb-1 text-glow group-hover:scale-110 transition-transform">
                    {num}
                  </div>
                  <div className="text-sm text-surface-500">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   INTRODUCTION
════════════════════════════════════════ */
export function IntroductionSection() {
  return (
    <section className="section" style={{ background: "#100e0c" }}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp(0)}>
            <span className="section-label">Who We Are</span>
            <h2 className="heading-md text-white mb-6">
              A Team of Passionate
              <br />
              Innovators
            </h2>
            <div className="space-y-4 text-surface-400 leading-relaxed">
              <p>
                DevSpark was founded in 2020 with a clear vision: to transform
                how businesses approach software development. We combine
                technical expertise with creative thinking.
              </p>
              <p>
                Our team of skilled developers, designers, and project managers
                work collaboratively to turn your ideas into reality with
                transparent communication and agile methodologies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                {
                  Icon: Shield,
                  title: "Secure & Scalable",
                  desc: "Enterprise-grade solutions",
                },
                {
                  Icon: Users,
                  title: "Client-Centric",
                  desc: "Your success, our priority",
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 rounded-xl border border-dark-700/60 bg-dark-800/40"
                >
                  <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 shrink-0">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
                  </div>
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
              alt="DevSpark team collaborating"
              className="relative rounded-2xl w-full object-cover shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-dark-700/60"
              style={{ aspectRatio: "4/3" }}
            />
            {/* Decorative corner accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl border-2 border-primary-500/40 pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl border border-primary-500/20 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SERVICES PREVIEW
════════════════════════════════════════ */
export function ServicesPreviewSection({ services }) {
  const items = services?.length
    ? services
    : Object.keys(serviceIcons).map((title) => ({ title, description: "" }));

  return (
    <section className="section" style={{ background: "#0d0b09" }}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <motion.span {...fadeUp(0)} className="section-label block mb-2">
            What We Offer
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="heading-md text-white">
            Our Services
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.slice(0, 6).map((svc, i) => {
            const Icon = serviceIcons[svc.title] || Code2;
            return (
              <motion.div
                key={svc.id || i}
                {...fadeUp(i * 0.07)}
                className="group card-glow p-6 cursor-default"
              >
                <div
                  className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 w-fit mb-5
                                group-hover:bg-primary-500/20 group-hover:border-primary-500/40 transition-all"
                >
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="heading-sm text-white mb-2">{svc.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed line-clamp-3">
                  {svc.description ||
                    `Professional ${svc.title.toLowerCase()} services tailored to your needs.`}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.4)} className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-dark-700 text-surface-300
                       hover:border-primary-500/50 hover:text-primary-400 transition-all duration-200 text-sm font-medium"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   PROJECTS PREVIEW
════════════════════════════════════════ */
export function ProjectsPreviewSection({ projects }) {
  return (
    <section className="section" style={{ background: "#100e0c" }}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <span className="section-label block mb-2">Our Portfolio</span>
            <h2 className="heading-md text-white">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(projects || []).slice(0, 3).map((project, i) => (
            <motion.div
              key={project.id || i}
              {...fadeUp(i * 0.1)}
              className="group card-glow overflow-hidden"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"
                  }
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                <span
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium
                                 bg-primary-500/20 border border-primary-500/40 text-primary-300 backdrop-blur-sm"
                >
                  {project.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="heading-sm text-white mb-2">{project.title}</h3>
                <p className="text-sm text-surface-400 line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.tech_stack || []).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-xs bg-dark-800 border border-dark-700 text-surface-400 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                                  bg-primary-500/10 border border-primary-500/30 text-primary-400
                                  hover:bg-primary-500/20 transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                                  bg-dark-800 border border-dark-700 text-surface-400
                                  hover:border-surface-600 hover:text-white transition-all"
                    >
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TESTIMONIALS PREVIEW
════════════════════════════════════════ */
export function TestimonialsPreviewSection({ testimonials }) {
  return (
    <section className="section" style={{ background: "#0d0b09" }}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <motion.span {...fadeUp(0)} className="section-label block mb-2">
            Client Stories
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="heading-md text-white">
            What Our Clients Say
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(testimonials || []).slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id || i}
              {...fadeUp(i * 0.1)}
              className="card-glow p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? "text-accent-400 fill-accent-400" : "text-dark-700"}`}
                  />
                ))}
              </div>
              <p className="text-surface-300 text-sm leading-relaxed italic flex-1 mb-5">
                "{t.message}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-dark-700/60">
                <img
                  src={t.photo || "https://via.placeholder.com/48"}
                  alt={t.client_name}
                  className="w-10 h-10 rounded-full object-cover border border-dark-700"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t.client_name}
                  </p>
                  <p className="text-xs text-surface-500">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-dark-700 text-surface-300
                       hover:border-primary-500/50 hover:text-primary-400 transition-all duration-200 text-sm font-medium"
          >
            Read More Reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CTA SECTION
════════════════════════════════════════ */
export function CTASection() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: "#100e0c" }}
    >
      {/* Orange glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex justify-center mb-6"
          >
            <span className="section-label">Start Today</span>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="heading-lg text-white mb-5">
            Ready to Start Your
            <br />
            <span className="text-gradient">Next Project?</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-surface-400 mb-10 text-lg">
            Let's discuss how we can bring your ideas to life. Get in touch
            today and start your digital transformation.
          </motion.p>
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold
                         bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200
                         shadow-[0_0_40px_rgba(249,115,22,0.35)] hover:shadow-[0_0_60px_rgba(249,115,22,0.55)]"
            >
              Contact Us Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold
                         border border-dark-700 text-surface-200 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-200"
            >
              See Our Work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
