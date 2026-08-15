'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Search, Linkedin, Twitter, Github, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { teamAPI } from '@/lib/api';

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', photo: '', skills: '', linkedin: '', twitter: '', github: ''
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchTeam();
  }, [router]);

  async function fetchTeam() {
    try {
      const data = await teamAPI.getAll();
      setTeam(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }

  function openModal(member = null) {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        photo: member.photo || '',
        skills: (member.skills || []).join(', '),
        linkedin: member.social_links?.linkedin || '',
        twitter: member.social_links?.twitter || '',
        github: member.social_links?.github || ''
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', role: '', bio: '', photo: '', skills: '', linkedin: '', twitter: '', github: '' });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      photo: formData.photo,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      social_links: {
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        github: formData.github
      }
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
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  }

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-surface-500 text-sm">Manage your team roster</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <Input placeholder="Search team..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-surface-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : filteredTeam.length === 0 ? (
          <div className="col-span-full text-center py-8 text-surface-500">No team members found</div>
        ) : filteredTeam.map(member => (
          <div key={member._id || member.id} className="card-dark rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={member.photo || 'https://via.placeholder.com/60'} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-primary-400">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(member)} className="p-1 hover:bg-dark-700 rounded">
                  <Edit className="w-4 h-4 text-surface-500" />
                </button>
                <button onClick={() => handleDelete(member._id || member.id)} className="p-1 hover:bg-red-900/30 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-sm text-surface-400 line-clamp-2">{member.bio}</p>
            {member.social_links && (
              <div className="flex gap-2 mt-4">
                {member.social_links.linkedin && <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 text-surface-500 hover:text-primary-400" /></a>}
                {member.social_links.twitter && <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-4 h-4 text-surface-500 hover:text-primary-400" /></a>}
                {member.social_links.github && <a href={member.social_links.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 text-surface-500 hover:text-primary-400" /></a>}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMember ? 'Edit Team Member' : 'Add Team Member'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          <Textarea label="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
          <Input label="Photo URL" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} />
          <div>
            <Input
              label="Skills (comma-separated)"
              placeholder="e.g. React, Node.js, TypeScript"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
            <p className="text-xs text-surface-600 mt-1">Separate each skill with a comma</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            <Input label="Twitter URL" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
          </div>
          <Input label="GitHub URL" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingMember ? 'Update' : 'Create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
