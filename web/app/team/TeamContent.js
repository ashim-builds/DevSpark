'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Github, Dribbble, X, User, Briefcase, Globe } from 'lucide-react';
import { teamAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const socialIcons = { linkedin: Linkedin, twitter: Twitter, github: Github, dribbble: Dribbble };
const socialLabels = { linkedin: 'LinkedIn', twitter: 'Twitter', github: 'GitHub', dribbble: 'Dribbble' };

/* ── Team Member Profile Modal ── */
function TeamMemberModal({ member, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!member) return null;

  // Parse skills from bio or social_links — if skills are stored as array on model, use them
  const skills = member.skills || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-dark-700/80 shadow-2xl"
          style={{ background: '#1a1612' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-surface-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner */}
          <div className="h-24 w-full relative rounded-t-2xl overflow-hidden"
            style={{ background: 'radial-gradient(ellipse 120% 200% at 50% -20%, rgba(249,115,22,0.35) 0%, rgba(13,11,9,0.8) 70%)' }}>
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.5) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-12 mb-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-primary-500/25 blur-lg" />
                <img
                  src={member.photo || 'https://via.placeholder.com/120'}
                  alt={member.name}
                  className="relative w-24 h-24 rounded-full object-cover border-4 shadow-xl"
                  style={{ borderColor: '#1a1612' }}
                />
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold font-display text-white">{member.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary-400" />
                  <p className="text-sm text-primary-400 font-medium">{member.role}</p>
                </div>
              </div>
            </div>

            {/* About */}
            {member.bio && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary-400" />
                  <h3 className="text-sm font-semibold text-white">About</h3>
                </div>
                <p className="text-surface-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-primary-400" />
                  <h3 className="text-sm font-semibold text-white">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-xs font-medium
                                                  bg-primary-500/10 border border-primary-500/20 text-primary-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {member.social_links && Object.keys(member.social_links).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(member.social_links).map(([platform, url]) => {
                    const Icon = socialIcons[platform];
                    if (!Icon || !url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                                   border border-dark-700 bg-dark-800/60 text-surface-400
                                   hover:text-primary-400 hover:border-primary-500/40 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        {socialLabels[platform] || platform}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function TeamContent() {
  const [team, setTeam]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    teamAPI.getAll()
      .then(setTeam)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0d0b09' }}>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.14) 0%, transparent 65%)' }} />
        <div className="container-custom text-center relative z-10">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label">Our People</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-xl text-white mt-4 mb-5">
            Meet Our Team
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-surface-400 text-lg mb-6">
            The talented individuals who make the magic happen. Click a card to see their profile.
          </motion.p>
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary-500/30 bg-primary-500/10">
              <span className="text-3xl font-bold font-display text-primary-400">{team.length}</span>
              <span className="text-surface-400">Team Members</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Team grid */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card-dark rounded-2xl p-6 text-center animate-pulse">
                    <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-dark-700" />
                    <div className="h-5 w-3/4 mx-auto mb-2 bg-dark-700 rounded" />
                    <div className="h-3 w-1/2 mx-auto bg-dark-700 rounded" />
                  </div>
                ))
              : team.map((member, i) => (
                  <motion.div
                    key={member._id || member.id}
                    {...fadeUp(i * 0.07)}
                    className="card-glow p-6 rounded-2xl text-center group cursor-pointer"
                    onClick={() => setSelected(member)}
                  >
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={member.photo || 'https://via.placeholder.com/200'}
                        alt={member.name}
                        className="relative w-full h-full rounded-full object-cover border-2 border-dark-700 group-hover:border-primary-500/50 transition-colors"
                      />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-0.5">{member.name}</h3>
                    <p className="text-primary-400 text-sm mb-3">{member.role}</p>
                    <p className="text-surface-500 text-xs leading-relaxed mb-4 line-clamp-2">{member.bio}</p>

                    {/* Skills preview */}
                    {member.skills?.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {member.skills.slice(0, 2).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-xs bg-primary-500/10 border border-primary-500/20 text-primary-400">
                            {s}
                          </span>
                        ))}
                        {member.skills.length > 2 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-dark-800 border border-dark-700 text-surface-500">
                            +{member.skills.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View profile button */}
                    <div className="text-xs text-primary-400/60 group-hover:text-primary-400 transition-colors font-medium">
                      View Profile →
                    </div>

                    {/* Social icons (small) */}
                    {member.social_links && Object.keys(member.social_links).length > 0 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Object.entries(member.social_links).map(([platform, url]) => {
                          const Icon = socialIcons[platform];
                          if (!Icon || !url) return null;
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg border border-dark-700 bg-dark-800/60
                                         text-surface-500 hover:text-primary-400 hover:border-primary-500/40 transition-all"
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
          </div>

          {!loading && team.length === 0 && (
            <p className="text-center text-surface-500 py-12">No team members found.</p>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="section" style={{ background: '#0d0b09' }}>
        <div className="container-custom text-center">
          <div className="max-w-xl mx-auto card-dark p-12 rounded-3xl border border-primary-500/10"
            style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07), transparent)' }}>
            <h2 className="heading-md text-white mb-4">Join Our Team</h2>
            <p className="text-surface-400 mb-8">
              Always looking for talented individuals who share our passion for technology and innovation.
            </p>
            <a href="mailto:careers@devspark.com"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white
                          bg-primary-500 hover:bg-primary-600 transition-all shadow-[0_0_25px_rgba(249,115,22,0.35)]">
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {selected && <TeamMemberModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
