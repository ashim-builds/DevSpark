import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/common/Link';
import SEO from '@/components/common/SEO';
import { projectsAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.45, delay, ease: 'easeOut' },
});

/* ── Main Page ── */
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    projectsAPI.getAll()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Portfolio & Case Studies — DevSpark"
        description="Explore our portfolio of successful projects, ERP systems, web applications, and e-commerce platforms delivered by DevSpark."
        url="https://devspark.com/projects"
      />

      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />
        <div className="container-custom text-center relative z-10">
          <div className="flex justify-center mb-1">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label">Our Work</motion.span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 mt-3 mb-3">
            Our Projects
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Explore our portfolio of successful projects. Click any card to see full details.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="section bg-[#faf8f5] border-t border-[#f0eae1]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[#f0eae1] rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-video bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-2/3 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))
              : projects.map((project, i) => (
                  <motion.div
                    key={project._id || project.id}
                    {...fadeUp(i * 0.04)}
                    className="bg-white border border-[#f0eae1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all duration-300 group cursor-pointer flex flex-col"
                    onClick={() => navigate(`/projects/${project._id || project.id}`)}
                  >
                    {/* Image container: object-contain so full image fits without cropping */}
                    <div className="relative overflow-hidden bg-slate-50 border-b border-[#f0eae1]" style={{height: '220px'}}>
                      <img
                        src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'}
                        alt={project.title}
                        className="object-contain object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold
                                       bg-white/95 text-slate-800 shadow-sm border border-slate-200/80 backdrop-blur-sm">
                        {project.category}
                      </span>
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity
                                      flex items-center justify-center">
                        <span className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold shadow-md">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors mb-2">{project.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(project.tech_stack || []).slice(0, 4).map(t => (
                          <span key={t} className="px-2.5 py-0.5 rounded-md text-xs bg-[#faf8f5] border border-[#f0eae1] text-slate-600 font-mono font-medium">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!loading && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">No projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white border-t border-[#f0eae1]">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto bg-[#faf8f5] border border-[#f0eae1] p-10 md:p-12 rounded-3xl shadow-sm">
            <div className="flex justify-center mb-2">
              <span className="section-label">Start Building</span>
            </div>
            <h2 className="heading-md text-slate-900 mt-4 mb-4">Have a Project Idea?</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">Let us help you bring it to life. Contact our engineering team for a free consultation.</p>
            <Link href="/contact"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white
                          bg-primary-500 hover:bg-primary-600 transition-all shadow-md hover:shadow-lg">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
