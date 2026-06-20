'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Folder, Users, Briefcase, MessageSquare, Mail, Menu, X, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_LINKS } from '@/lib/constants';

const ICONS = { LayoutDashboard, Folder, Users, Briefcase, MessageSquare, Mail };

function Sidebar({ isOpen, onClose, onLogout }) {
  const rawPathname = usePathname();
  const pathname = rawPathname === '/' ? '/' : rawPathname?.replace(/\/$/, '') || '';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 flex flex-col border-r border-dark-800 transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )} style={{ background: '#0d0b09' }}>

        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-dark-800">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <defs>
              <radialGradient id="afl" cx="50%" cy="25%" r="65%">
                <stop offset="0%"   stopColor="#fffbf0" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>
            </defs>
            <path d="M32 20 L8 50 L32 80"  stroke="#f97316" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M68 20 L92 50 L68 80" stroke="#f97316" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M50 74C43 74 37 66 38 56C39 47 43 43 45 36C46 31 45 25 47 21C49 18 52 22 52 27C54 22 58 20 60 25C62 30 59 37 61 42C64 49 63 60 57 67C54 71 52 74 50 74Z" fill="url(#afl)" />
          </svg>
          <span className="font-display font-bold text-white">
            <span className="text-primary-400">Dev</span>Spark
          </span>
          <span className="ml-auto text-xs text-surface-600 font-mono">admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon   = ICONS[link.icon] || Folder;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25'
                    : 'text-surface-400 hover:text-white hover:bg-dark-800'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-dark-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-surface-500
                       hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }) {
  const router     = useRouter();
  const rawPathname = usePathname();
  const pathname = rawPathname === '/' ? '/' : rawPathname?.replace(/\/$/, '') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setChecking(false);
    }
  }, [router, isLoginPage]);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  }

  if (checking && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0b09' }}>
        <div className="w-10 h-10 border-2 border-dark-700 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d0b09', color: '#f5f0e8' }}>
      {!isLoginPage && (
        <>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

          {/* Mobile topbar */}
          <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-4 border-b border-dark-800"
            style={{ background: 'rgba(13,11,9,0.95)', backdropFilter: 'blur(10px)' }}>
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-dark-800 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-semibold text-white">
              <span className="text-primary-400">Dev</span>Spark Admin
            </span>
          </header>
        </>
      )}

      <main className={cn(
        !isLoginPage && 'lg:ml-60 pt-14 lg:pt-0 min-h-screen',
      )}>
        {children}
      </main>
    </div>
  );
}
