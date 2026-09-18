import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import SEO from "@/components/common/SEO";
import { COMPANY_INFO } from "@/lib/constants";
import { contactAPI } from "@/lib/api";
import toast from "react-hot-toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await contactAPI.send(form);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact Us — Get In Touch with DevSpark"
        description="Have a project in mind? Contact the DevSpark team today for custom software, web apps, ERP systems, and Android development."
        url="https://devspark.com/contact"
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
            <motion.span {...fadeUp(0)} className="section-label">
              Get In Touch
            </motion.span>
          </div>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 mt-3 mb-3"
          >
            Contact Us
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto"
          >
            Have a project in mind? We would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div {...fadeUp(0)} className="lg:col-span-3">
              <div className="bg-white p-8 rounded-2xl border border-[#f0eae1] shadow-sm">
                <h2 className="heading-sm text-slate-900 mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl border border-[#f0eae1] text-slate-700 hover:border-primary-500 hover:text-primary-600 bg-white hover:bg-orange-50 transition-all text-sm font-semibold shadow-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="label">Your Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`input ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">Your Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`input ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">Your Message</label>
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project…"
                        className={`input resize-none ${errors.message ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white
                                 bg-primary-500 hover:bg-primary-600 transition-all duration-200
                                 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div
              {...fadeUp(0.15)}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              {[
                {
                  Icon: Mail,
                  label: "Email Us",
                  value: COMPANY_INFO.email,
                  href: `mailto:${COMPANY_INFO.email}`,
                },
                {
                  Icon: Phone,
                  label: "Call Us",
                  value: COMPANY_INFO.phone,
                  href: null,
                },
                {
                  Icon: MapPin,
                  label: "Visit Us",
                  value: COMPANY_INFO.address,
                  href: null,
                },
              ].map(({ Icon, label, value, href }) => (
                <div
                  key={label}
                  className="bg-white p-5 rounded-2xl flex items-start gap-4 border border-slate-200/90 shadow-sm
                             hover:border-primary-500/40 hover:shadow-md transition-all group"
                >
                  <div
                    className="p-3 rounded-xl bg-orange-50 border border-orange-200 shrink-0
                               group-hover:bg-primary-500 group-hover:border-primary-500 transition-all"
                  >
                    <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Hours */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                  Working Hours
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Mon – Fri</span>
                    <span className="text-slate-900 font-semibold">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Sat – Sun</span>
                    <span className="text-slate-500 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
