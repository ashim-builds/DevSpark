import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X, Building2, MessageCircle, User } from "lucide-react";
import SEO from "@/components/common/SEO";
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
          className={`${cls} ${i < rating ? "text-orange-500 fill-orange-500" : "text-slate-200"}`}
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-8 pb-6">
            <Quote className="w-12 h-12 text-orange-200 mb-4" />
            <Stars rating={t.rating} size="lg" />
            <p className="mt-5 text-slate-700 text-base leading-relaxed italic">
              "{t.message}"
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-[#f0eae1] bg-[#faf8f5]">
            <div className="flex items-center gap-4">
              {t.photo ? (
                <img
                  src={t.photo}
                  alt={t.client_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-50 border-2 border-orange-200 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-base">
                  {t.client_name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-primary-500" />
                  <p className="text-sm text-primary-600 font-medium">{t.company}</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-orange-500 fill-orange-500"
                    />
                  ))}
                  <span className="text-xs text-slate-500 ml-1 font-medium">
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
export default function TestimonialsPage() {
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
        testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
        testimonials.length
      ).toFixed(1)
    : "0.0";
  const satisfactionRate = testimonials.length
    ? Math.round(
        (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
          (testimonials.length * 5)) *
          100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Client Testimonials & Reviews — DevSpark"
        description="Read client testimonials and verified reviews from founders and enterprise leaders who partnered with DevSpark."
        url="https://devspark.com/testimonials"
      />
      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="container-custom text-center relative z-10">
          <div className="flex justify-center mb-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label"
            >
              Client Stories
            </motion.span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 mt-3 mb-3"
          >
            Testimonials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto"
          >
            Hear what our clients have to say about working with DevSpark. Click any card to read the full review.
          </motion.p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#f0eae1] rounded-2xl p-6 space-y-4 animate-pulse shadow-sm"
                  >
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-5/6 bg-slate-200 rounded" />
                    <div className="h-3 w-3/4 bg-slate-200 rounded" />
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-2/3 bg-slate-200 rounded" />
                        <div className="h-2.5 w-1/2 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : testimonials.map((t, i) => (
                  <motion.div
                    key={t._id || t.id}
                    {...fadeUp(i * 0.08)}
                    className="bg-white border border-[#f0eae1] p-6 rounded-2xl flex flex-col relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all duration-300"
                    onClick={() => setSelected(t)}
                  >
                    <Quote className="absolute top-4 right-4 w-10 h-10 text-orange-100 group-hover:text-orange-200 transition-colors" />

                    <Stars rating={t.rating} />
                    <p className="mt-4 mb-5 text-slate-700 text-sm leading-relaxed italic flex-1 line-clamp-4">
                      "{t.message}"
                    </p>

                    {/* "Read more" hint */}
                    <div className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold mb-4 group-hover:text-primary-700 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Click to read full review</span>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt={t.client_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-primary-500 transition-colors shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-50 border border-slate-200 group-hover:border-primary-500 transition-colors shadow-sm text-primary-600 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {t.client_name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{t.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!loading && testimonials.length === 0 && (
            <p className="text-center text-slate-500 py-12">
              No testimonials found.
            </p>
          )}
        </div>
      </section>

      {/* Stats bar — live from DB */}
      <section className="section bg-white border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#faf8f5] p-6 rounded-2xl text-center border border-[#f0eae1] animate-pulse"
                  >
                    <div className="h-8 w-16 bg-slate-200 rounded mx-auto mb-2" />
                    <div className="h-3 w-24 bg-slate-200 rounded mx-auto" />
                  </div>
                ))
              : [
                  { num: satisfactionRate + "%", label: "Satisfaction Rate" },
                  { num: testimonials.length > 0 ? `${testimonials.length}+` : "0", label: "Happy Clients" },
                  { num: avgRating, label: "Average Rating" },
                  { num: testimonials.length > 0 ? `${testimonials.length}+` : "0", label: "Reviews Written" },
                ].map(({ num, label }, i) => (
                  <motion.div
                    key={label}
                    {...fadeUp(i * 0.1)}
                    className="bg-[#faf8f5] p-6 rounded-2xl text-center border border-[#f0eae1] hover:border-primary-500/40 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-3xl font-bold font-display text-primary-600 mb-1">
                      {num}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">{label}</div>
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
