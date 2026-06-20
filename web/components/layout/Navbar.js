"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const rawPathname = usePathname();
  const pathname = rawPathname === '/' ? '/' : rawPathname?.replace(/\/$/, '') || '';
  const isAdmin = pathname?.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dark-950/96 backdrop-blur-xl border-b border-dark-800 shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
          : "bg-transparent",
      )}
      style={{ background: scrolled ? "rgba(13,11,9,0.96)" : "transparent" }}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-primary-500/15 blur-md
               group-hover:bg-primary-500/25 transition-all duration-300"
              />
              <Image
                src="/devspark-icon.png"
                alt="DevSpark Logo"
                width={100}
                height={100}
                priority
                className="relative object-contain"
              />
            </div>
            <span className="text-xl font-display font-bold tracking-tight select-none">
              <span className="text-primary-400">Dev</span>
              <span className="text-white">Spark</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    active
                      ? "text-primary-400"
                      : "text-surface-400 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary-500/10 border border-primary-500/25"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.35,
                      }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold
                         bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200
                         shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
            >
              Get in Touch
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-surface-300 hover:text-white hover:bg-dark-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="border-t border-dark-800/70 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-primary-400 bg-primary-500/10 border border-primary-500/20"
                        : "text-surface-300 hover:text-white hover:bg-dark-800/70",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 px-0">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold
                               bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
