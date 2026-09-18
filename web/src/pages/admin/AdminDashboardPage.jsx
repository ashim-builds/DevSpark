import { useEffect, useState } from 'react';
import { useRouter } from '@/lib/router';
import { Folder, Users, Briefcase, Mail, Loader2, Sliders, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardAPI, contactAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

const DEFAULT_METRICS = [
  { key: 'project_completion_rate', label: 'Project Completion Rate', value: 98, color: '#f97316' },
  { key: 'client_satisfaction',     label: 'Client Satisfaction',     value: 96, color: '#22c55e' },
  { key: 'on_time_delivery',        label: 'On-time Delivery',        value: 94, color: '#3b82f6' },
  { key: 'response_rate',           label: 'Response Rate',           value: 100, color: '#a855f7' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [performance, setPerformance] = useState(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDraft, setEditDraft] = useState(DEFAULT_METRICS);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [autoCalculating, setAutoCalculating] = useState(false);

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

        if (statsData?.performance && Array.isArray(statsData.performance) && statsData.performance.length > 0) {
          setPerformance(statsData.performance);
          setEditDraft(statsData.performance);
        } else {
          // Fallback fetch if /stats didn't include it
          try {
            const perfRes = await dashboardAPI.getPerformance();
            if (perfRes?.metrics && Array.isArray(perfRes.metrics)) {
              setPerformance(perfRes.metrics);
              setEditDraft(perfRes.metrics);
            }
          } catch {
            // keep defaults
          }
        }
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
  }, [router]);

  function handleOpenEdit() {
    setEditDraft([...performance]);
    setIsEditModalOpen(true);
  }

  function handleSliderChange(key, newValue) {
    setEditDraft(prev =>
      prev.map(m => (m.key === key ? { ...m, value: Number(newValue) } : m))
    );
  }

  async function handleAutoCalculate() {
    setAutoCalculating(true);
    try {
      const res = await dashboardAPI.getPerformance();
      if (res?.autoCalculated) {
        setEditDraft(prev =>
          prev.map(m => {
            if (res.autoCalculated[m.key] !== undefined) {
              return { ...m, value: res.autoCalculated[m.key] };
            }
            return m;
          })
        );
        toast.success('Metrics recalculated from database (reviews & messages)');
      }
    } catch {
      toast.error('Could not fetch auto calculations from database');
    } finally {
      setAutoCalculating(false);
    }
  }

  async function handleSaveMetrics(e) {
    e.preventDefault();
    setSavingMetrics(true);
    try {
      const res = await dashboardAPI.updatePerformance(editDraft);
      if (res?.metrics) {
        setPerformance(res.metrics);
      } else {
        setPerformance(editDraft);
      }
      toast.success('Performance metrics updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update performance metrics');
    } finally {
      setSavingMetrics(false);
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

        {/* Dynamic Performance metrics */}
        <motion.div {...fadeUp(0.42)}
          className="card-dark p-6 rounded-2xl border border-dark-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="font-semibold text-white">Performance Overview</h2>
              </div>
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/25 transition-all hover:scale-105 active:scale-95"
                title="Adjust Performance Metrics"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust</span>
              </button>
            </div>

            <div className="space-y-5">
              {performance.map(({ key, label, value, color }) => (
                <div key={key || label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-surface-400">{label}</span>
                    <span className="font-semibold transition-colors duration-300" style={{ color }}>
                      {value}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-dark-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-800/60 flex items-center justify-between text-xs text-surface-500">
            <span>Powered by MySQL & live metrics</span>
            <button
              onClick={handleOpenEdit}
              className="text-primary-400 hover:text-primary-300 hover:underline"
            >
              Configure targets →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Adjust Metrics Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !savingMetrics && setIsEditModalOpen(false)}
        title="Adjust Performance Metrics"
        size="md"
      >
        <form onSubmit={handleSaveMetrics} className="space-y-5">
          <p className="text-xs text-surface-400">
            Adjust the live performance percentages or auto-calculate based on actual testimonials and messages stored in the database.
          </p>

          <div className="space-y-4 pt-1">
            {editDraft.map((metric) => (
              <div key={metric.key || metric.label} className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-700/60 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium">{metric.label}</span>
                  <span
                    className="px-2 py-0.5 rounded-md font-bold text-xs"
                    style={{ background: `${metric.color}20`, color: metric.color, border: `1px solid ${metric.color}40` }}
                  >
                    {metric.value}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metric.value}
                    onChange={(e) => handleSliderChange(metric.key, e.target.value)}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-dark-700 accent-primary-500"
                    style={{ accentColor: metric.color }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metric.value}
                    onChange={(e) => handleSliderChange(metric.key, Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-16 px-2 py-1 bg-dark-800 border border-dark-700 rounded-lg text-white text-xs text-center font-mono focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Mini Preview Bar */}
                <div className="h-1 rounded-full bg-dark-800 overflow-hidden">
                  <div
                    className="h-full transition-all duration-200"
                    style={{ width: `${metric.value}%`, background: metric.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={autoCalculating || savingMetrics}
              onClick={handleAutoCalculate}
              className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-white px-3 py-1.5 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors disabled:opacity-50"
            >
              {autoCalculating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              )}
              <span>Calculate from DB</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={savingMetrics}
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={savingMetrics}
                className="flex items-center gap-1.5"
              >
                {savingMetrics && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
