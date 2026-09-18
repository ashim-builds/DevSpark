import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { Plus, Edit, Trash2, Code2, Smartphone, Palette, Cloud, Server, Zap, Globe, Shield, Database, Layout, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { servicesAPI } from '@/lib/api';

const iconMap = {
  Code2, Smartphone, Palette, Cloud, Server, Zap, Globe, Shield, Database, Layout
};

const iconOptions = [
  { value: 'Code2', label: 'Web / Code', Icon: Code2 },
  { value: 'Smartphone', label: 'Mobile App', Icon: Smartphone },
  { value: 'Palette', label: 'UI / UX Design', Icon: Palette },
  { value: 'Cloud', label: 'Cloud / DevOps', Icon: Cloud },
  { value: 'Server', label: 'Backend / Server', Icon: Server },
  { value: 'Zap', label: 'API / Fast', Icon: Zap },
  { value: 'Globe', label: 'Web Platform', Icon: Globe },
  { value: 'Shield', label: 'Cybersecurity', Icon: Shield },
  { value: 'Database', label: 'Database / SQL', Icon: Database },
  { value: 'Layout', label: 'Frontend / CMS', Icon: Layout },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Code2' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchServices();
  }, [router]);

  async function fetchServices() {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }

  function openModal(service = null) {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description || '',
        icon: service.icon || 'Code2'
      });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'Code2' });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService) {
        await servicesAPI.update(editingService._id || editingService.id, formData);
        toast.success('Service updated');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Services</h1>
          <p className="text-slate-500 text-sm">Manage your service offerings and consulting capabilities</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">No services found</div>
        ) : services.map(service => {
          const Icon = iconMap[service.icon] || Code2;
          return (
            <div key={service._id || service.id} className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(service)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors" title="Edit Service">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(service._id || service.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Service">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Custom Software Development" required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what this service entails..." rows={3} required />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Icon</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl">
              {iconOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: opt.value })}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    formData.icon === opt.value
                      ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <opt.Icon className="w-4 h-4 shrink-0 text-primary-500" />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingService ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
