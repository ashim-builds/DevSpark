import { useState, useEffect } from "react";
import Link from "@/components/common/Link";
import { usePathname } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { settingsAPI } from "@/lib/api";

export default function Navbar() {
  const rawPathname = usePathname();
  const pathname = rawPathname === '/' ? '/' : rawPathname?.replace(/\/$/, '') || '';
  const isAdmin = pathname?.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [availableForHire, setAvailableForHire] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    settingsAPI.getAvailableForHire()
      .then((data) => setAvailableForHire(data.available))
      .catch(() => setAvailableForHire(false));
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white pt-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <nav
          className={cn(
            "rounded-2xl sm:rounded-full transition-all duration-300 border flex items-center justify-between px-4 sm:px-5 py-2.5",
            scrolled
              ? "bg-white border-slate-200 shadow-lg shadow-slate-900/8"
              : "bg-white border-slate-200/80 shadow-md shadow-slate-900/5"
          )}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/logo-black.png"
              alt="DevSpark Logo"
              className="w-8 h-8 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-[18px] sm:text-[18px] font-display font-black tracking-tight select-none">
              <span className="text-primary-500">Dev</span>
              <span className="text-slate-900">Spark</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/70">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 select-none",
                    active
                      ? "text-primary-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white border border-orange-200/60 shadow-xs"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {availableForHire && (
              <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for Hire
              </div>
            )}

            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-semibold
                         bg-orange-500 text-white hover:bg-orange-600
                         shadow-sm hover:shadow-md hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95
                         transition-all duration-200"
            >
              Get in Touch
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden overflow-hidden mt-2 rounded-2xl bg-white border border-slate-200 shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "text-primary-600 bg-orange-50 font-semibold border border-orange-200/60"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                  </Link>
                );
              })}
              <div className="pt-2 pb-1">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold
                             bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
