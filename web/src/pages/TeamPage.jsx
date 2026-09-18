import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Github, Dribbble, X, User, Briefcase, Globe } from 'lucide-react';
import SEO from '@/components/common/SEO';
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

  const skills = member.skills || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner */}
          <div className="h-32 w-full relative rounded-t-2xl overflow-hidden bg-gradient-to-r from-orange-200 via-orange-100 to-amber-100 border-b border-orange-200/50">
            <div className="absolute inset-0 opacity-15"
              style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.6) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>

          {/* Avatar centred with negative margin */}
          <div className="flex justify-center -mt-14 relative z-10">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-orange-50 border-4 border-white shadow-xl text-primary-600 flex items-center justify-center">
                <User className="w-14 h-14" />
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-4 text-center">
            {/* Name + role */}
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">{member.name}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1 mb-6">
              <Briefcase className="w-3.5 h-3.5 text-primary-500" />
              <p className="text-sm text-primary-600 font-semibold">{member.role}</p>
            </div>

            {/* About */}
            {member.bio && (
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary-500" />
                  <h3 className="text-sm font-bold text-slate-900">About</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-primary-500" />
                  <h3 className="text-sm font-bold text-slate-900">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {member.social_links && Object.keys(member.social_links).length > 0 && (
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Connect</h3>
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
                                   border border-[#f0eae1] bg-[#faf8f5] text-slate-700
                                   hover:text-primary-600 hover:border-primary-400 hover:bg-orange-50 transition-all font-medium"
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
export default function TeamPage() {
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
    <div className="min-h-screen bg-white">
      <SEO
        title="Meet the Engineering Team — DevSpark"
        description="Meet the passionate engineers, designers, and innovators building high-performance digital products at DevSpark."
        url="https://devspark.com/team"
      />

      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />
        <div className="container-custom text-center relative z-10">
          <div className="flex justify-center mb-1">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label">Our People</motion.span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 mt-3 mb-3">
            Meet Our Team
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            The talented individuals who make the magic happen. Click a card to see their profile.
          </motion.p>
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 shadow-xs">
              <span className="text-2xl font-bold font-display text-primary-600">{team.length}</span>
              <span className="text-slate-700 text-sm font-medium">Team Members</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Team grid */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[#f0eae1] rounded-2xl p-6 text-center animate-pulse shadow-sm">
                    <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-slate-200" />
                    <div className="h-5 w-3/4 mx-auto mb-2 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 mx-auto bg-slate-200 rounded" />
                  </div>
                ))
              : team.map((member, i) => (
                  <motion.div
                    key={member._id || member.id}
                    {...fadeUp(i * 0.07)}
                    className="bg-white border border-[#f0eae1] p-6 rounded-2xl text-center group cursor-pointer shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all duration-300 flex flex-col items-center"
                    onClick={() => setSelected(member)}
                  >
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="relative w-full h-full rounded-full object-cover border-2 border-slate-100 group-hover:border-primary-500 transition-colors shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-orange-50 border-2 border-slate-100 group-hover:border-primary-500 transition-colors shadow-sm text-primary-600 flex items-center justify-center">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-0.5 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                    <p className="text-primary-600 font-semibold text-sm mb-3">{member.role}</p>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{member.bio}</p>

                    {/* Skills preview */}
                    {member.skills?.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {member.skills.slice(0, 2).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-xs bg-orange-50 border border-orange-200 text-orange-700 font-medium">
                            {s}
                          </span>
                        ))}
                        {member.skills.length > 2 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 border border-slate-200 text-slate-600">
                            +{member.skills.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View profile button */}
                    <div className="text-xs text-primary-600 group-hover:text-primary-700 transition-colors font-semibold mt-auto pt-2">
                      View Profile →
                    </div>

                    {/* Social icons (small) */}
                    {member.social_links && Object.keys(member.social_links).length > 0 && (
                      <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-slate-100 w-full">
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
                              className="p-2 rounded-lg border border-[#f0eae1] bg-[#faf8f5]
                                         text-slate-500 hover:text-primary-600 hover:border-primary-400 hover:bg-orange-50 transition-all"
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
            <p className="text-center text-slate-500 py-12">No team members found.</p>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="section bg-white border-t border-[#f0eae1]">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto bg-[#faf8f5] border border-[#f0eae1] p-12 rounded-3xl shadow-sm">
            <div className="flex justify-center mb-2">
              <span className="section-label">Careers</span>
            </div>
            <h2 className="heading-md text-slate-900 mt-4 mb-4">Join Our Team</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              We are always looking for talented engineers and designers who share our passion for high quality code and innovation.
            </p>
            <a href="mailto:devsparkhq@gmail.com"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white
                          bg-primary-500 hover:bg-primary-600 transition-all shadow-md hover:shadow-lg">
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
