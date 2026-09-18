import Link from '@/components/common/Link';
import { usePathname } from '@/lib/router';
import { Twitter, Linkedin, Github, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { COMPANY_INFO, NAV_LINKS } from '@/lib/constants';

function DevSparkLogoFooter() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="fflame" cx="50%" cy="25%" r="65%">
          <stop offset="0%"   stopColor="#fffbf0" />
          <stop offset="45%"  stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
      </defs>
      <path d="M32 20 L8 50 L32 80" stroke="#f97316" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#fglow)" />
      <path d="M68 20 L92 50 L68 80" stroke="#f97316" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#fglow)" />
      <path d="M50 74C43 74 37 66 38 56C39 47 43 43 45 36C46 31 45 25 47 21C49 18 52 22 52 27C54 22 58 20 60 25C62 30 59 37 61 42C64 49 63 60 57 67C54 71 52 74 50 74Z"
        fill="url(#fflame)" filter="url(#fglow)" />
      <path d="M50 68C47 68 44 63 44.5 57C45 51 48 48 49.5 43C50.5 40 51 43 51.5 47C53 43 56 41 56.5 46C57.5 52 56 63 53 67C52 68 51 68 50 68Z"
        fill="#fffbf0" opacity="0.85" />
    </svg>
  );
}

const socialLinks = [
  { href: COMPANY_INFO.socialLinks.twitter,  Icon: Twitter,  label: 'Twitter' },
  { href: COMPANY_INFO.socialLinks.linkedin, Icon: Linkedin, label: 'LinkedIn' },
  { href: COMPANY_INFO.socialLinks.github,   Icon: Github,   label: 'GitHub' },
];

const serviceList = [
  'Web Development',
  'Mobile App Development',
  'Custom Software',
  'UI/UX Design',
  'Cloud Solutions',
  'API Development',
];

export default function Footer() {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-zinc-800/80 bg-[#121316] text-white">
      {/* Subtle warm ambient light glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 800px at 50% -20%, rgba(249,115,22,0.07) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-5">
              <div className="relative">
                <img
                  src="/logo-white.png"
                  alt="DevSpark Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <span className="text-xl font-display font-bold">
                <span className="text-primary-500">Dev</span>
                <span className="text-white">Spark</span>
              </span>
            </Link>

            <p className="text-zinc-300 text-sm leading-relaxed mb-6 max-w-sm">
              Innovating the future, one line at a time. We craft exceptional digital experiences that transform businesses.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300
                             hover:text-white hover:border-primary-500/60 hover:bg-primary-500/10
                             transition-all duration-200 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-primary-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary-500 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceList.map((svc) => (
                <li key={svc}>
                  <span className="text-sm text-zinc-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-primary-500 transition-colors" />
                    {svc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-zinc-300 hover:text-white transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-300">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-300">{COMPANY_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/80" />

      {/* Bottom bar */}
      <div className="container-custom py-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>&copy; {year} {COMPANY_INFO.name}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>

            {/* Admin login */}
            <Link
              href="/admin/login"
              title="Admin"
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-primary-400 transition-colors duration-200 group"
            >
              <Settings className="w-3 h-3 group-hover:rotate-45 transition-transform duration-300" />
              <span className="sr-only">Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
