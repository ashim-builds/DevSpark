'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Users, Briefcase, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardAPI, contactAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

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
        if (err.message?.includes('Invalid')) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
        setChecking(false);
      }
    }
    loadData();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Projects', key: 'projects', Icon: Folder, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
    { label: 'Team Members',   key: 'team',     Icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
    { label: 'Services',       key: 'services', Icon: Briefcase, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { label: 'Messages',       key: 'messages', Icon: Mail, color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Welcome back — here is an overview of your content.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, key, Icon, color, bg, border }, i) => (
          <motion.div key={key} {...fadeUp(i * 0.08)}
            className="rounded-2xl p-5 border"
            style={{ background: bg, borderColor: border }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-surface-400">{label}</p>
              <div className="p-2 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold font-display" style={{ color }}>
              {loading ? '—' : (stats?.[key] ?? 0)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Activity + Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent messages */}
        <motion.div {...fadeUp(0.35)}
          className="card-dark p-6 rounded-2xl border border-dark-700/60">
          <h2 className="font-semibold text-white mb-5">Recent Messages</h2>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 mb-4 last:mb-0">
                  <div className="w-8 h-8 rounded-lg bg-dark-700 shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-dark-700 rounded animate-pulse" />
                    <div className="h-2.5 w-3/4 bg-dark-700 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : messages.length > 0
              ? messages.map(msg => (
                  <div key={msg._id || msg.id} className="flex gap-3 pb-4 mb-4 border-b border-dark-800/60 last:border-0 last:mb-0 last:pb-0">
                    <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 shrink-0">
                      <Mail className="w-4 h-4 text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{msg.name}</p>
                      <p className="text-xs text-primary-400 truncate">{msg.email}</p>
                      <p className="text-xs text-surface-400 mt-1 line-clamp-2">{msg.message}</p>
                      <p className="text-xs text-surface-600 mt-1">{formatDate(msg.createdAt || msg.submitted_at)}</p>
                    </div>
                  </div>
                ))
              : <p className="text-sm text-surface-500 py-4 text-center">No messages yet</p>}
        </motion.div>

        {/* Performance metrics */}
        <motion.div {...fadeUp(0.42)}
          className="card-dark p-6 rounded-2xl border border-dark-700/60">
          <h2 className="font-semibold text-white mb-6">Performance Overview</h2>
          <div className="space-y-5">
            {[
              { label: 'Project Completion Rate', value: 98, color: '#f97316' },
              { label: 'Client Satisfaction',     value: 96, color: '#22c55e' },
              { label: 'On-time Delivery',        value: 94, color: '#3b82f6' },
              { label: 'Response Rate',           value: 100, color: '#a855f7' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-surface-400">{label}</span>
                  <span className="font-semibold" style={{ color }}>{value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-dark-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
