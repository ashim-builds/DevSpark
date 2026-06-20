"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { contactAPI } from "@/lib/api";
import toast from "react-hot-toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) {
      setErrors(ve);
      return;
    }
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success("Message sent!");
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

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
          <motion.span {...fadeUp(0)} className="section-label">
            Get In Touch
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="heading-xl text-white mt-4 mb-5"
          >
            Contact Us
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-surface-400 text-lg max-w-xl mx-auto"
          >
            Have a project in mind? We would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section" style={{ background: "#100e0c" }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div {...fadeUp(0)} className="lg:col-span-3">
              <div className="card-dark p-8 rounded-2xl border border-dark-700/60">
                <h2 className="heading-sm text-white mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-surface-400 mb-6">
                      Thank you for reaching out. We will get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl border border-dark-700 text-surface-300 hover:border-primary-500/50 hover:text-primary-400 transition-all text-sm"
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
                        <p className="mt-1.5 text-xs text-red-400">
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
                        <p className="mt-1.5 text-xs text-red-400">
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
                        <p className="mt-1.5 text-xs text-red-400">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white
                                 bg-primary-500 hover:bg-primary-600 transition-all duration-200
                                 shadow-[0_0_25px_rgba(249,115,22,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="card-dark p-5 rounded-2xl flex items-start gap-4 border border-dark-700/60
                                            hover:border-primary-500/30 transition-all group"
                >
                  <div
                    className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 shrink-0
                                  group-hover:bg-primary-500/20 transition-all"
                  >
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-surface-200 hover:text-primary-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-surface-200">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Hours */}
              <div className="card-dark p-5 rounded-2xl border border-dark-700/60">
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-3">
                  Working Hours
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Mon – Fri</span>
                    <span className="text-white">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Sat - Sun</span>
                    <span className="text-surface-500">Closed</span>
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
