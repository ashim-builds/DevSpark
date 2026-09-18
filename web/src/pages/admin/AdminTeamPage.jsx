import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { Plus, Edit, Trash2, Search, Loader2, Upload, User } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { teamAPI, imagesAPI } from '@/lib/api';

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', photo: '', skills: '',
    social_links: { linkedin: '', twitter: '', github: '', dribbble: '' }
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
    fetchTeam();
  }, [router]);

  async function fetchTeam() {
    try {
      const data = await teamAPI.getAll();
      setTeam(data);
    } catch {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }

  function openModal(member = null) {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        photo: member.photo || '',
        skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
        social_links: {
          linkedin: member.social_links?.linkedin || '',
          twitter: member.social_links?.twitter || '',
          github: member.social_links?.github || '',
          dribbble: member.social_links?.dribbble || ''
        }
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '', role: '', bio: '', photo: '', skills: '',
        social_links: { linkedin: '', twitter: '', github: '', dribbble: '' }
      });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingMember) {
        await teamAPI.update(editingMember._id || editingMember.id, payload);
        toast.success('Team member updated');
      } else {
        await teamAPI.create(payload);
        toast.success('Team member added');
      }
      setModalOpen(false);
      fetchTeam();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await teamAPI.delete(id);
      toast.success('Team member removed');
      fetchTeam();
    } catch {
      toast.error('Failed to delete team member');
    }
  }

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Team Members</h1>
          <p className="text-slate-500 text-sm">Manage your engineering and leadership roster</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search team..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-full" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></div>
        ) : filteredTeam.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">No team members found</div>
        ) : filteredTeam.map(member => (
          <div key={member._id || member.id} className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-primary-600 shadow-xs shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{member.name}</h3>
                    <p className="text-xs font-semibold text-primary-600 truncate">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openModal(member)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors" title="Edit Member">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(member._id || member.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Member">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{member.bio}</p>
              {member.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMember ? 'Edit Team Member' : 'Add Team Member'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Role / Title" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Lead Architect" required />
          </div>
          <Textarea label="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo</label>
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
          <Input label="Skills (comma separated)" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Node.js, Docker, Kubernetes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="LinkedIn URL" value={formData.social_links.linkedin} onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, linkedin: e.target.value } })} />
            <Input label="Twitter / X URL" value={formData.social_links.twitter} onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, twitter: e.target.value } })} />
            <Input label="GitHub URL" value={formData.social_links.github} onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, github: e.target.value } })} />
            <Input label="Dribbble URL" value={formData.social_links.dribbble} onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, dribbble: e.target.value } })} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingMember ? 'Update' : 'Add Member')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
