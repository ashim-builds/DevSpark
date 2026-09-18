import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "@/components/common/Link";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Palette,
  Cloud,
  Server,
  Zap,
  Globe,
  Shield,
  Database,
  Layout,
  Users,
  User,
  Star,
  ExternalLink,
  Github,
  X,
} from "lucide-react";

/* ── Shared animation variants ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: "easeOut" },
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

/* ════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════ */
export function HeroSection({
  projectsCount = 0,
  happyClientsCount = 0,
  teamCount = 0,
  satisfactionRate = 0,
}) {
  return (
    <section className="relative min-h-[92svh] flex items-center overflow-hidden bg-white">
      {/* Dynamic Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Warm ambient radial glow top-center */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(249,115,22,0.35) 0%, rgba(251,146,60,0.1) 60%, transparent 80%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       border border-orange-200/90 bg-orange-50/90 text-primary-700
                       text-xs font-semibold mb-8 shadow-xs backdrop-blur-xs"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Leading Digital Innovation
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-slate-950 tracking-tight leading-[1.08] mb-6"
          >
            Crafting Exceptional
            <br />
            <span className="text-gradient">Digital Experiences</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            We engineer high-performance web applications, scalable mobile
            solutions, and custom software that empower modern brands to grow.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold
                         bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200
                         shadow-sm hover:shadow-orange-500/25 active:scale-95"
            >
              View Our Work
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold
                         border border-slate-300 text-slate-800 hover:border-primary-500 hover:text-primary-600 hover:bg-orange-50/50 transition-all duration-200 bg-white shadow-sm"
            >
              Get in Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {[
              { num: projectsCount > 0 ? `${projectsCount}+` : "0", label: "Projects Delivered" },
              { num: happyClientsCount > 0 ? `${happyClientsCount}+` : "0", label: "Happy Clients" },
              { num: teamCount > 0 ? `${teamCount}+` : "0", label: "Team Members" },
              { num: `${satisfactionRate}%`, label: "Satisfaction Rate" },
            ].map(({ num, label }) => (
              <div key={label} className="group">
                <div className="card-light p-6 rounded-2xl text-center bg-white border border-slate-200/90 shadow-sm hover:border-primary-500/40 hover:shadow-md transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold font-display text-primary-500 mb-1 group-hover:scale-105 transition-transform">
                    {num}
                  </div>
                  <div className="text-sm font-medium text-slate-500">{label}</div>
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
    <section className="section bg-[#faf8f5] border-y border-[#f0eae1]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp(0)}>
            <div className="mb-2">
              <span className="section-label">Who We Are</span>
            </div>
            <h2 className="heading-md text-slate-950 mb-6">
              A Team of Passionate
              <br />
              Innovators
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                DevSpark was founded with a clear vision: to transform
                how businesses approach software development. We combine
                technical excellence with user-centric design.
              </p>
              <p>
                Our team of skilled developers, designers, and project managers
                work collaboratively to turn your ideas into high-performing reality with
                transparent communication and modern agile workflows.
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
                  className="flex items-start gap-3 p-4 rounded-xl border border-[#f0eae1] bg-white shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-primary-50 border border-primary-200 text-primary-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
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
            <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-xl scale-105 pointer-events-none" />
            <img
              src="/about-team.jpg"
              alt="DevSpark team collaborating"
              className="relative rounded-2xl w-full object-cover shadow-xl border border-[#f0eae1]"
              style={{ aspectRatio: "4/3" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SERVICES PREVIEW
════════════════════════════════════════ */
export function ServicesPreviewSection({ services = [], loading = false }) {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-3">
            <motion.span {...fadeUp(0)} className="section-label">
              What We Offer
            </motion.span>
          </div>
          <motion.h2 {...fadeUp(0.1)} className="heading-md text-slate-950">
            Our Services
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card-light p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4 bg-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-4/5 bg-slate-100 rounded" />
                  </div>
                </div>
              ))
            : (services || []).slice(0, 6).map((svc, i) => {
                const Icon = getServiceIcon(svc);
                return (
                  <motion.div
                    key={svc.id || svc._id || i}
                    {...fadeUp(i * 0.07)}
                    className="card-glow p-6 rounded-2xl cursor-default bg-white border border-slate-200 shadow-sm hover:border-primary-500/40 hover:shadow-md"
                  >
                    <div
                      className="p-3.5 rounded-xl bg-primary-50 border border-primary-200/80 w-fit mb-5
                                 text-primary-600 transition-all"
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="heading-sm text-slate-900 mb-2">{svc.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {svc.description}
                    </p>
                  </motion.div>
                );
              })}
        </div>

        <motion.div {...fadeUp(0.4)} className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-800
                       hover:border-primary-500 hover:text-primary-600 hover:bg-orange-50/50 transition-all duration-200 text-sm font-semibold bg-white shadow-sm"
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
  const navigate = useNavigate();

  return (
    <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <div className="mb-3">
              <span className="section-label">Our Portfolio</span>
            </div>
            <h2 className="heading-md text-slate-950">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).slice(0, 3).map((project, i) => (
            <motion.div
              key={project.id || i}
              {...fadeUp(i * 0.1)}
              onClick={() => navigate(`/projects/${project._id || project.id}`)}
              className="group cursor-pointer overflow-hidden bg-white border border-[#f0eae1] rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all duration-300 flex flex-col"
            >
              {/* Full image — object-contain so nothing is cropped */}
              <div className="relative overflow-hidden bg-slate-50 border-b border-[#f0eae1]" style={{ height: '220px' }}>
                <img
                  src={project.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"}
                  alt={project.title}
                  className="w-full h-full object-contain object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold
                             bg-white/90 border border-slate-200 text-slate-800 shadow-sm backdrop-blur-sm">
                  {project.category}
                </span>
                {/* hover overlay */}
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold shadow-md">
                    View Details
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="heading-sm text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(project.tech_stack || []).slice(0, 4).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-[#faf8f5] border border-[#f0eae1] text-slate-700 font-mono">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                       onClick={e => e.stopPropagation()}
                       className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg
                                  bg-primary-50 border border-primary-200 text-primary-600 hover:bg-primary-100 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                       onClick={e => e.stopPropagation()}
                       className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg
                                  bg-[#faf8f5] border border-[#f0eae1] text-slate-700 hover:bg-slate-100 transition-all">
                      <Github className="w-3.5 h-3.5" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "View All" link */}
        <motion.div {...fadeUp(0.3)} className="text-center mt-10">
          <Link href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-800
                       hover:border-primary-500 hover:text-primary-600 hover:bg-orange-50/50 transition-all duration-200 text-sm font-semibold bg-white shadow-sm">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TESTIMONIALS PREVIEW
════════════════════════════════════════ */
export function TestimonialsPreviewSection({ testimonials }) {
  return (
    <section className="section bg-white border-t border-[#f0eae1]">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-3">
            <motion.span {...fadeUp(0)} className="section-label">
              Client Stories
            </motion.span>
          </div>
          <motion.h2 {...fadeUp(0.1)} className="heading-md text-slate-950">
            What Our Clients Say
          </motion.h2>
        </div>

        {(!testimonials || testimonials.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No client reviews published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id || i}
                {...fadeUp(i * 0.1)}
                className="card-glow p-6 rounded-2xl flex flex-col bg-white border border-[#f0eae1] shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${j < t.rating ? "text-primary-500 fill-primary-500" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic flex-1 mb-5">
                  "{t.message}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.client_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-slate-200 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.client_name}
                    </p>
                    <p className="text-xs text-slate-500">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div {...fadeUp(0.4)} className="text-center mt-12">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-800
                       hover:border-primary-500 hover:text-primary-600 hover:bg-orange-50/50 transition-all duration-200 text-sm font-semibold bg-white shadow-sm"
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
    <section className="section bg-[#faf8f5] border-t border-[#f0eae1] relative overflow-hidden">
      {/* Subtle warm orange ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-white border border-[#f0eae1] rounded-3xl p-10 md:p-16 shadow-xl shadow-orange-500/5 relative overflow-hidden">
          {/* Subtle warm accent line on top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

          <motion.div
            {...fadeUp(0)}
            className="flex justify-center mb-5"
          >
            <span className="section-label">
              Start Today
            </span>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="heading-lg text-slate-950 mb-5">
            Ready to Start Your
            <br />
            <span className="text-gradient">Next Project?</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-slate-600 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Let's discuss how we can bring your ideas to life. Get in touch
            today and accelerate your digital journey.
          </motion.p>
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold
                         bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200
                         shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95"
            >
              Contact Us Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold
                         border border-slate-300 text-slate-800 hover:border-primary-500 hover:text-primary-600 hover:bg-orange-50/50 bg-white transition-all duration-200 shadow-sm hover:-translate-y-0.5"
            >
              See Our Work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
