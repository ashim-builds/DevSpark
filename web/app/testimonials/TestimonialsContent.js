"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X, Building2, MessageCircle } from "lucide-react";
import { testimonialsAPI } from "@/lib/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

function Stars({ rating, size = "md" }) {
  const cls = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < rating ? "text-accent-400 fill-accent-400" : "text-dark-700"}`}
        />
      ))}
    </div>
  );
}

/* ── Testimonial Detail Modal ── */
function TestimonialModal({ testimonial: t, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!t) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-2xl border border-dark-700/80 shadow-2xl overflow-hidden"
          style={{ background: "#1a1612" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-surface-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-8 pb-6">
            <Quote className="w-12 h-12 text-primary-500/20 mb-4" />
            <Stars rating={t.rating} size="lg" />
            <p className="mt-5 text-surface-200 text-base leading-relaxed italic">
              "{t.message}"
            </p>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-6 border-t border-dark-700/60"
            style={{ background: "rgba(0,0,0,0.2)" }}
          >
            <div className="flex items-center gap-4">
              <img
                src={t.photo || "https://via.placeholder.com/64"}
                alt={t.client_name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/30"
              />
              <div>
                <p className="font-semibold text-white text-base">
                  {t.client_name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-primary-400" />
                  <p className="text-sm text-primary-400">{t.company}</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-accent-400 fill-accent-400"
                    />
                  ))}
                  <span className="text-xs text-surface-500 ml-1">
                    {t.rating}.0 / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    testimonialsAPI
      .getAll()
      .then(setTestimonials)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute live stats from DB data
  const avgRating = testimonials.length
    ? (
        testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
        testimonials.length
      ).toFixed(1)
    : "5.0";
  const satisfactionRate = testimonials.length
    ? Math.round(
        (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
          (testimonials.length * 5)) *
          100,
      )
    : 98;

  return (
    <div className="min-h-screen" style={{ background: "#0d0b09" }}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.14) 0%, transparent 65%)",
          }}
        />
        <div className="container-custom text-center relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label"
          >
            Client Stories
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl text-white mt-4 mb-5"
          >
            Testimonials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-surface-400 text-lg max-w-xl mx-auto"
          >
            Hear what our clients have to say. Click any card to read the full
            review.
          </motion.p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="section" style={{ background: "#100e0c" }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="card-dark rounded-2xl p-6 space-y-4 animate-pulse"
                  >
                    <div className="h-4 w-1/3 bg-dark-700 rounded" />
                    <div className="h-3 w-full bg-dark-700 rounded" />
                    <div className="h-3 w-5/6 bg-dark-700 rounded" />
                    <div className="h-3 w-3/4 bg-dark-700 rounded" />
                    <div className="flex items-center gap-3 pt-2 border-t border-dark-700">
                      <div className="w-10 h-10 rounded-full bg-dark-700" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-2/3 bg-dark-700 rounded" />
                        <div className="h-2.5 w-1/2 bg-dark-700 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : testimonials.map((t, i) => (
                  <motion.div
                    key={t._id || t.id}
                    {...fadeUp(i * 0.08)}
                    className="card-glow p-6 rounded-2xl flex flex-col relative overflow-hidden group cursor-pointer"
                    onClick={() => setSelected(t)}
                  >
                    <Quote className="absolute top-4 right-4 w-10 h-10 text-primary-500/5 group-hover:text-primary-500/10 transition-colors" />

                    <Stars rating={t.rating} />
                    <p className="mt-4 mb-5 text-surface-300 text-sm leading-relaxed italic flex-1 line-clamp-4">
                      "{t.message}"
                    </p>

                    {/* "Read more" hint */}
                    <div className="flex items-center gap-1.5 text-xs text-primary-400/70 mb-4 group-hover:text-primary-400 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Click to read full review</span>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-dark-700/70">
                      <img
                        src={t.photo || "https://via.placeholder.com/48"}
                        alt={t.client_name}
                        className="w-10 h-10 rounded-full object-cover border border-dark-700 group-hover:border-primary-500/40 transition-colors"
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

          {!loading && testimonials.length === 0 && (
            <p className="text-center text-surface-500 py-12">
              No testimonials found.
            </p>
          )}
        </div>
      </section>

      {/* Stats bar — live from DB */}
      <section className="section" style={{ background: "#0d0b09" }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="card-dark p-6 rounded-2xl text-center border border-dark-700/60 animate-pulse"
                  >
                    <div className="h-8 w-16 bg-dark-700 rounded mx-auto mb-2" />
                    <div className="h-3 w-24 bg-dark-700 rounded mx-auto" />
                  </div>
                ))
              : [
                  { num: satisfactionRate + "%", label: "Satisfaction Rate" },
                  { num: testimonials.length + "+", label: "Happy Clients" },
                  { num: avgRating, label: "Average Rating" },
                  { num: testimonials.length + "+", label: "Reviews Written" },
                ].map(({ num, label }, i) => (
                  <motion.div
                    key={label}
                    {...fadeUp(i * 0.1)}
                    className="card-dark p-6 rounded-2xl text-center border border-dark-700/60 hover:border-primary-500/30 transition-all"
                  >
                    <div className="text-3xl font-bold font-display text-primary-400 mb-1">
                      {num}
                    </div>
                    <div className="text-sm text-surface-500">{label}</div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <TestimonialModal
          testimonial={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
