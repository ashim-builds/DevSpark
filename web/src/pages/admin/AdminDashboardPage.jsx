import { useEffect, useState } from 'react';
import { useRouter } from '@/lib/router';
import Link from '@/components/common/Link';
import { Folder, Users, Briefcase, Mail, Loader2, ArrowRight, MessageSquare, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardAPI, contactAPI, settingsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [availableForHire, setAvailableForHire] = useState(false);
  const [togglingHire, setTogglingHire] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function loadData() {
      try {
        const [statsData, messagesData] = await Promise.all([
          dashboardAPI.getStats(),
          contactAPI.getAll()
        ]);
        setStats(statsData);
        setMessages(messagesData.slice(0, 5));
      } catch (err) {
        if (err.message?.includes('Invalid') || err.message?.includes('token')) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
        setChecking(false);
      }
    }
    loadData();

    // Load available for hire setting
    settingsAPI.getAvailableForHire()
      .then(d => setAvailableForHire(d.available))
      .catch(() => {});
  }, [router]);

  async function handleToggleHire() {
    setTogglingHire(true);
    try {
      const next = !availableForHire;
      await settingsAPI.setAvailableForHire(next);
      setAvailableForHire(next);
      toast.success(next ? '"Available for Hire" is now ON' : '"Available for Hire" is now OFF');
    } catch {
      toast.error('Failed to update setting');
    } finally {
      setTogglingHire(false);
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Projects', key: 'projects', Icon: Folder, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', href: '/admin/projects' },
    { label: 'Team Members',   key: 'team',     Icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', href: '/admin/team' },
    { label: 'Services',       key: 'services', Icon: Briefcase, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', href: '/admin/services' },
    { label: 'Messages',       key: 'messages', Icon: Mail, color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', href: '/admin/messages' },
  ];

  const quickLinks = [
    { title: 'Manage Projects', desc: 'Add or update showcased portfolio work', href: '/admin/projects', Icon: Folder, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { title: 'Manage Services', desc: 'Update software engineering offerings', href: '/admin/services', Icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { title: 'Manage Team', desc: 'Add and edit team member profiles', href: '/admin/team', Icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { title: 'Manage Testimonials', desc: 'Review client feedback & ratings', href: '/admin/testimonials', Icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { title: 'View All Messages', desc: 'Read and reply to user inquiries', href: '/admin/messages', Icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back to the DevSpark administration panel</p>
        </div>
      </div>

      {/* Available for Hire Switcher */}
      <motion.div {...fadeUp(0.05)} className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors ${
            availableForHire ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-100 border border-slate-200'
          }`}>
            {availableForHire ? '🟢' : '🔴'}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Available for Hire</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {availableForHire ? 'Shown on the public navbar' : 'Hidden from the public navbar'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleHire}
          disabled={togglingHire}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            availableForHire ? 'bg-emerald-500' : 'bg-slate-300'
          } ${togglingHire ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label="Toggle available for hire"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              availableForHire ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, key, Icon, color, bg, border, href }, i) => (
          <motion.div key={key} {...fadeUp(i * 0.08)}>
            <Link
              href={href}
              className="block bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</p>
                <div className="p-2.5 rounded-xl transition-transform group-hover:scale-105" style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-3xl font-bold font-display" style={{ color }}>
                {loading ? '—' : (stats?.[key] ?? 0)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Activity + Quick Navigation */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent messages */}
        <motion.div {...fadeUp(0.35)}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-slate-900">Recent Inquiries</h2>
              </div>
              <Link href="/admin/messages" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                View all →
              </Link>
            </div>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 mb-4 last:mb-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                      <div className="h-2.5 w-3/4 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              : messages.length > 0
                ? messages.map(msg => (
                    <div key={msg._id || msg.id} className="flex gap-3 pb-4 mb-4 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
                      <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 shrink-0 self-start">
                        <Mail className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">{msg.name}</p>
                          <span className="text-[11px] text-slate-400 shrink-0">{formatDate(msg.createdAt || msg.submitted_at)}</span>
                        </div>
                        <p className="text-xs font-medium text-primary-600 truncate">{msg.email}</p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{msg.message}</p>
                      </div>
                    </div>
                  ))
                : <p className="text-sm text-slate-500 py-12 text-center">No inquiries received yet.</p>}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Contact inquiries from public form</span>
            <Link href="/admin/messages" className="text-primary-600 font-semibold hover:underline">
              Inbox →
            </Link>
          </div>
        </motion.div>

        {/* Quick Management Navigation */}
        <motion.div {...fadeUp(0.42)}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Quick Actions</h2>
              <span className="text-xs text-slate-400 font-medium">Manage Site Content</span>
            </div>

            <div className="space-y-3">
              {quickLinks.map(({ title, desc, href, Icon, color, bg }) => (
                <Link
                  key={title}
                  href={href}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${bg} shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{title}</p>
                      <p className="text-xs text-slate-500 truncate">{desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>DevSpark Management System</span>
            <Link href="/" target="_blank" className="text-primary-600 font-semibold hover:underline">
              View live site ↗
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
