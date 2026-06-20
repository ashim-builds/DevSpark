'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '@/lib/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '', company: '', message: '', rating: 5, photo: ''
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchTestimonials();
  }, [router]);

  async function fetchTestimonials() {
    try {
      const data = await testimonialsAPI.getAll();
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }

  function openModal(testimonial = null) {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        client_name: testimonial.client_name || '',
        company: testimonial.company || '',
        message: testimonial.message || '',
        rating: testimonial.rating || 5,
        photo: testimonial.photo || ''
      });
    } else {
      setEditingTestimonial(null);
      setFormData({ client_name: '', company: '', message: '', rating: 5, photo: '' });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTestimonial) {
        await testimonialsAPI.update(editingTestimonial._id || editingTestimonial.id, { ...formData, rating: parseInt(formData.rating) });
        toast.success('Testimonial updated');
      } else {
        await testimonialsAPI.create({ ...formData, rating: parseInt(formData.rating) });
        toast.success('Testimonial added');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-surface-500 text-sm">Manage client testimonials</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-surface-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full text-center py-8 text-surface-500">No testimonials found</div>
        ) : testimonials.map(testimonial => (
          <div key={testimonial._id || testimonial.id} className="card-dark rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={testimonial.photo || 'https://via.placeholder.com/60'} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-white">{testimonial.client_name}</h3>
                  <p className="text-sm text-surface-500">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(testimonial)} className="p-1 hover:bg-dark-700 rounded">
                  <Edit className="w-4 h-4 text-surface-500" />
                </button>
                <button onClick={() => handleDelete(testimonial._id || testimonial.id)} className="p-1 hover:bg-red-900/30 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-4 h-4 ${star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-700'}`} />
              ))}
            </div>
            <p className="text-sm text-surface-400 italic">"{testimonial.message}"</p>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Client Name" value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} required />
          <Input label="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          <Textarea label="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} required />
          <Input label="Photo URL" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })}>
                  <Star className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-700'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingTestimonial ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
