"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    try {
      const { token, admin } = await authAPI.login({ email, password });
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(admin));
      toast.success("Welcome back!");
      router.push("/admin");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0d0b09" }}
      >
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.12) 0%, #0d0b09 60%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-0.5 group mb-5"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-lg group-hover:blur-xl transition-all" />

              <Image
                src="/DevSpark Icon.png"
                alt="DevSpark Logo"
                width={100}
                height={100}
                priority
                className="relative object-contain"
              />
            </div>
            <span className="text-4xl font-display font-bold">
              <span className="text-primary-400">Dev</span>
              <span className="text-white">Spark</span>
            </span>
          </Link>

          <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
          <p className="text-sm text-surface-500 mt-1">
            Sign in to manage your content
          </p>
        </div>

        {/* Card */}
        <div className="card-dark p-8 rounded-2xl border border-dark-700/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white
                         bg-primary-500 hover:bg-primary-600 transition-all duration-200
                         shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-5">
          <Link
            href="/"
            className="text-xs text-surface-600 hover:text-primary-400 transition-colors"
          >
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
