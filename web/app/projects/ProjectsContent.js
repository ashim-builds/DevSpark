'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, X, Tag, Code2 } from 'lucide-react';
import { projectsAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.45, delay, ease: 'easeOut' },
});

/* ── Project Detail Modal ── */
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!project) return null;

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-dark-700/80 shadow-2xl"
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

          {/* Cover image */}
          <div className="aspect-video relative overflow-hidden rounded-t-2xl">
            <img
              src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/90 via-transparent to-transparent" />
            {project.category && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
                               bg-primary-500/25 border border-primary-500/50 text-primary-300 backdrop-blur-sm">
                {project.category}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold font-display text-white mb-3">{project.title}</h2>
            <p className="text-surface-300 leading-relaxed mb-6">{project.description}</p>

            {/* Tech stack */}
            {project.tech_stack?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-semibold text-white">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg text-sm bg-dark-800 border border-dark-700 text-surface-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-dark-700/60">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                              bg-primary-500 hover:bg-primary-600 text-white transition-all
                              shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                              bg-dark-800 border border-dark-700 text-surface-300
                              hover:border-primary-500/40 hover:text-white transition-all">
                  <Github className="w-4 h-4" /> View Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function ProjectsContent() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    projectsAPI.getAll()
      .then(setProjects)
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
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label">Our Work</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-xl text-white mt-4 mb-5">
            Our Projects
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-surface-400 text-lg max-w-xl mx-auto">
            Explore our portfolio of successful projects. Click any card to see full details.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="section" style={{ background: '#0d0b09' }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-dark rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-dark-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 bg-dark-700 rounded" />
                      <div className="h-3 w-full bg-dark-700 rounded" />
                      <div className="h-3 w-2/3 bg-dark-700 rounded" />
                    </div>
                  </div>
                ))
              : projects.map((project, i) => (
                  <motion.div
                    key={project._id || project.id}
                    {...fadeUp(i * 0.04)}
                    className="card-glow overflow-hidden group cursor-pointer"
                    onClick={() => setSelected(project)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium
                                       bg-primary-500/20 border border-primary-500/40 text-primary-300 backdrop-blur-sm">
                        {project.category}
                      </span>
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity
                                      flex items-center justify-center">
                        <span className="px-4 py-2 rounded-xl bg-primary-500/90 text-white text-sm font-semibold backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-white mb-2">{project.title}</h3>
                      <p className="text-sm text-surface-400 line-clamp-2 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(project.tech_stack || []).slice(0, 4).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-xs bg-dark-800 border border-dark-700 text-surface-400 font-mono">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary-400 font-medium">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!loading && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-surface-500">No projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: '#100e0c' }}>
        <div className="container-custom text-center">
          <div className="max-w-xl mx-auto card-dark p-10 rounded-3xl border border-primary-500/10"
            style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07), transparent)' }}>
            <h2 className="heading-md text-white mb-4">Have a Project Idea?</h2>
            <p className="text-surface-400 mb-6">Let us help you bring it to life. Contact us for a free consultation.</p>
            <a href="/contact"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white
                          bg-primary-500 hover:bg-primary-600 transition-all shadow-[0_0_25px_rgba(249,115,22,0.35)]">
              Get Started <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
