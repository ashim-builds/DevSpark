import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { Plus, Edit, Trash2, Search, ExternalLink, Loader2, Upload } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { projectsAPI, imagesAPI } from '@/lib/api';
import { PROJECT_CATEGORIES } from '@/lib/constants';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', image: '', tech_stack: '', live_url: '', github_url: '', category: ''
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
      setFormData(prev => ({ ...prev, image: res.url }));
      toast.success('Image stored in MySQL successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchProjects();
  }, [router]);

  async function fetchProjects() {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }

  function openModal(project = null) {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        image: project.image || '',
        tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        category: project.category || PROJECT_CATEGORIES[0]
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '', description: '', image: '', tech_stack: '', live_url: '', github_url: '', category: PROJECT_CATEGORIES[0]
      });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject._id || editingProject.id, payload);
        toast.success('Project updated');
      } else {
        await projectsAPI.create(payload);
        toast.success('Project created');
      }
      setModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  }

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm">Manage your portfolio projects and live builds</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-full" />
        </div>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">Project</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">Tech Stack</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No projects found</td></tr>
              ) : filteredProjects.map(project => (
                <tr key={project._id || project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100'} alt={project.title} className="w-11 h-11 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{project.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(project.tech_stack || []).slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-mono">{tech}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors" title="Live Preview">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => openModal(project)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors" title="Edit Project">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project._id || project.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Project">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Image</label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Image URL or upload to MySQL..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-xs"
              />
              <label className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4 text-primary-500" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {formData.image && (
              <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <img src={formData.image} alt="Preview" className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 shrink-0" />
                <span className="text-xs text-slate-500 truncate flex-1 font-mono">{formData.image}</span>
              </div>
            )}
          </div>
          <Input label="Tech Stack (comma separated)" value={formData.tech_stack} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} placeholder="React, Node.js, MySQL" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Live Demo URL" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} placeholder="https://example.com" />
            <Input label="GitHub URL" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={PROJECT_CATEGORIES.map(c => ({ value: c, label: c }))} />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingProject ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
