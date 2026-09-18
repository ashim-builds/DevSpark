import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useRouter, usePathname } from '@/lib/router';
import Link from '@/components/common/Link';
import {
  LayoutDashboard, Folder, Users, Briefcase, MessageSquare, Mail, Menu, X, LogOut, Home, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { Toaster } from 'react-hot-toast';

const ICONS = { LayoutDashboard, Folder, Users, Briefcase, MessageSquare, Mail };

function Sidebar({ isOpen, onClose, onLogout }) {
  const rawPathname = usePathname();
  const pathname = rawPathname === '/' ? '/' : rawPathname?.replace(/\/$/, '') || '';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 sm:w-64 flex flex-col bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-xs',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>

        {/* Brand & Close button on mobile */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
            <img src="/logo-black.png" alt="DevSpark" className="w-9 h-9 object-contain" />
            <span className="font-display font-black text-xl tracking-tight">
              <span className="text-primary-500">Dev</span>
              <span className="text-slate-950">Spark</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-md font-bold font-mono bg-orange-50 text-orange-600 border border-orange-200">
              admin
            </span>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3.5 sm:p-4 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon   = ICONS[link.icon] || Folder;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-orange-500' : 'text-slate-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 space-y-1.5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                       hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Go to Website</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                       hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout() {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900">
      {!isLoginPage && (
        <>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

          {/* Mobile topbar */}
          <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-display font-bold text-slate-900 text-base">
                <span className="text-primary-500">Dev</span>Spark Admin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="p-2 text-xs font-semibold text-slate-600 hover:text-primary-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
                title="View Website"
              >
                <span className="hidden xs:inline">Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>
        </>
      )}

      <main className={cn(
        !isLoginPage && 'lg:ml-64 pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen'
      )}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
    </div>
  );
}
