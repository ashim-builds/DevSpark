'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Globe, Smartphone, Code2, Palette, Cloud, Zap, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { servicesAPI } from '@/lib/api';

const iconOptions = [
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'Code', label: 'Code', icon: Code2 },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Cloud', label: 'Cloud', icon: Cloud },
  { value: 'Server', label: 'Server', icon: Zap },
];

const iconMap = { Globe, Smartphone, Code: Code2, Palette, Cloud, Server: Zap };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });
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
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }

  function openModal(service = null) {
    if (service) {
      setEditingService(service);
      setFormData({ title: service.title || '', description: service.description || '', icon: service.icon || '' });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: '' });
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
    } catch (error) {
      toast.error('Failed to delete service');
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-surface-500 text-sm">Manage your service offerings</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-surface-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-8 text-surface-500">No services found</div>
        ) : services.map(service => {
          const Icon = iconMap[service.icon] || Code2;
          return (
            <div key={service._id || service.id} className="card-dark rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-500/10 rounded-xl">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(service)} className="p-1 hover:bg-dark-700 rounded">
                    <Edit className="w-4 h-4 text-surface-500" />
                  </button>
                  <button onClick={() => handleDelete(service._id || service.id)} className="p-1 hover:bg-red-900/30 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-white">{service.title}</h3>
              <p className="text-sm text-surface-400 mt-2 line-clamp-3">{service.description}</p>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {iconOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: opt.value })}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    formData.icon === opt.value
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 hover:border-dark-600'
                  }`}
                >
                  <opt.icon className="w-5 h-5 text-surface-400" />
                  <span className="text-sm text-surface-300">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingService ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
