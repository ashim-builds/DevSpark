'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Calendar, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to delete message');
    }
  }

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-surface-500 text-sm">View messages from your contact form</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-surface-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-surface-500">No messages found</div>
        ) : filteredMessages.map(message => (
          <div key={message._id || message.id} className="card-dark rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/10 rounded-xl">
                  <Mail className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-surface-500" />
                    <h3 className="font-semibold text-white">{message.name}</h3>
                  </div>
                  <p className="text-sm text-primary-400 mb-2">{message.email}</p>
                  <p className="text-surface-400">{message.message}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-surface-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(message.createdAt || message.submitted_at)}
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(message._id || message.id)} className="p-2 hover:bg-red-900/30 rounded">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
