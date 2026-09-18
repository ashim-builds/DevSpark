import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { Plus, Edit, Trash2, Star, Loader2, Upload, User } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { testimonialsAPI, imagesAPI } from '@/lib/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '', company: '', message: '', rating: 5, photo: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await imagesAPI.upload(file);
      setFormData(prev => ({ ...prev, photo: res.url }));
      toast.success('Photo stored in MySQL successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchTestimonials();
  }, [router]);

  async function fetchTestimonials() {
    try {
      const data = await testimonialsAPI.getAll();
      setTestimonials(data);
    } catch {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }

  function openModal(testimonial = null) {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        client_name: testimonial.client_name,
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
        await testimonialsAPI.update(editingTestimonial._id || editingTestimonial.id, formData);
        toast.success('Testimonial updated');
      } else {
        await testimonialsAPI.create(formData);
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
    } catch {
      toast.error('Failed to delete testimonial');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Testimonials</h1>
          <p className="text-slate-500 text-sm">Manage client reviews and satisfaction ratings</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">No testimonials found</div>
        ) : testimonials.map(testimonial => (
          <div key={testimonial._id || testimonial.id} className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.photo ? (
                    <img src={testimonial.photo} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 text-primary-600 flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{testimonial.client_name}</h3>
                    <p className="text-xs font-medium text-slate-500 truncate">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openModal(testimonial)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors" title="Edit Testimonial">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(testimonial._id || testimonial.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Testimonial">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-4 h-4 ${star <= testimonial.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">"{testimonial.message}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Client Name" value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} placeholder="e.g. Sarah Jenkins" required />
            <Input label="Company / Organization" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Apex Global" />
          </div>
          <Textarea label="Client Message / Review" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} placeholder="What did the client say about working with DevSpark?" required />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Photo</label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Photo URL or upload to MySQL..."
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-xs"
              />
              <label className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4 text-primary-500" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {formData.photo && (
              <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <img src={formData.photo} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-slate-200 shrink-0" />
                <span className="text-xs text-slate-500 truncate flex-1 font-mono">{formData.photo}</span>
              </div>
            )}
          </div>
          <Select
            label="Rating"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            options={[
              { value: 5, label: '⭐⭐⭐⭐⭐ 5 Stars' },
              { value: 4, label: '⭐⭐⭐⭐ 4 Stars' },
              { value: 3, label: '⭐⭐⭐ 3 Stars' },
              { value: 2, label: '⭐⭐ 2 Stars' },
              { value: 1, label: '⭐ 1 Star' },
            ]}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingTestimonial ? 'Update' : 'Add Testimonial')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
