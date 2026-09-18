import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useRouter } from "@/lib/router";
import Link from "@/components/common/Link";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      authAPI
        .verify()
        .then(() => router.push("/admin"))
        .catch(() => localStorage.removeItem("adminToken"))
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const { token, admin } = await authAPI.login({ email, password });
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(admin));
      toast.success("Welcome back to DevSpark Admin!");
      router.push("/admin");
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-primary-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-[#faf8f5] overflow-hidden">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Warm Ambient Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-orange-500/20 via-primary-400/10 to-transparent blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group mb-4 p-2 rounded-2xl transition-transform hover:scale-105 duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-orange-500/5 flex items-center justify-center p-2 group-hover:border-primary-400 transition-colors">
              <img
                src="/logo-black.png"
                alt="DevSpark Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-slate-900">
              <span className="text-primary-500">Dev</span>
              <span>Spark</span>
            </span>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-orange-50 text-orange-600 border border-orange-200 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
              ADMIN CONSOLE
            </span>
          </div>

          <h1 className="text-2xl font-bold font-display text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            Sign in to manage your portfolio, team, services, and live client inquiries
          </p>
        </div>

        {/* Elevated Glass Card */}
        <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/5 relative overflow-hidden">
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary-500 to-amber-400" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@devspark.com"
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-primary-500 to-orange-600 hover:from-primary-600 hover:to-orange-700
                         shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-primary-600 bg-white/70 hover:bg-white border border-slate-200/80 shadow-xs transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to DevSpark Website</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
