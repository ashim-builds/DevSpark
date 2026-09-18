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
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }

  function openModal(project = null) {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        tech_stack: (project.tech_stack || []).join(', '),
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        category: project.category || ''
      });
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '', image: '', tech_stack: '', live_url: '', github_url: '', category: '' });
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
    } catch (error) {
      toast.error('Failed to delete project');
    }
  }

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-surface-500 text-sm">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="card-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">Tech Stack</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-surface-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-surface-500">No projects found</td></tr>
              ) : filteredProjects.map(project => (
                <tr key={project._id || project.id} className="hover:bg-dark-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={project.image || 'https://via.placeholder.com/60'} alt={project.title} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-sm text-surface-500 truncate max-w-xs">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-surface-400">{project.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(project.tech_stack || []).slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-dark-700 rounded text-xs text-surface-400">{tech}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-dark-700 rounded">
                          <ExternalLink className="w-4 h-4 text-surface-500" />
                        </a>
                      )}
                      <button onClick={() => openModal(project)} className="p-1 hover:bg-dark-700 rounded">
                        <Edit className="w-4 h-4 text-surface-500" />
                      </button>
                      <button onClick={() => handleDelete(project._id || project.id)} className="p-1 hover:bg-red-900/30 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Project Image</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Image URL or upload to MySQL..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 bg-dark-900/60 border border-dark-700/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
              />
              <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-sm font-medium text-dark-200 hover:bg-dark-700 cursor-pointer transition-colors whitespace-nowrap ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4 text-primary-400" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload to MySQL'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-dark-900/40 rounded-lg border border-dark-800">
                <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded" />
                <span className="text-xs text-dark-400 truncate flex-1">{formData.image}</span>
              </div>
            )}
          </div>
          <Input label="Tech Stack (comma separated)" value={formData.tech_stack} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} placeholder="React, Node.js, MySQL" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Live URL" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} />
            <Input label="GitHub URL" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} />
          </div>
          <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={PROJECT_CATEGORIES.map(c => ({ value: c, label: c }))} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingProject ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
