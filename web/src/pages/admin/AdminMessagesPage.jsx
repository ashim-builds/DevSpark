import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { Mail, Trash2, Search, Calendar, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchMessages();
  }, [router]);

  async function fetchMessages() {
    try {
      const data = await contactAPI.getAll();
      setMessages(data);
    } catch {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Message deleted');
      fetchMessages();
    } catch {
      toast.error('Failed to delete message');
    }
  }

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Contact Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5">View and manage messages submitted through your website contact form</p>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-full bg-white border-slate-200 text-slate-900" />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">No inquiries found</div>
        ) : filteredMessages.map(message => (
          <div key={message._id || message.id} className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-5 sm:p-6 hover:border-slate-300 transition-all">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base">{message.name}</h3>
                  </div>
                  <a href={`mailto:${message.email}`} className="text-xs sm:text-sm font-semibold text-primary-600 hover:underline inline-block mb-2 break-all">
                    {message.email}
                  </a>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(message.createdAt || message.submitted_at)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(message._id || message.id)}
                className="self-end sm:self-start p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100 shrink-0"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
