import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code2, Tag, Calendar, Loader2 } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { projectsAPI } from '@/lib/api';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await projectsAPI.getById(id);
        setProject(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-slate-500 text-lg">Project not found.</p>
        <button onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </div>
    );
  }

  const techStack = project.tech_stack || [];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <SEO
        title={`${project.title} — Case Study`}
        description={project.description || `Read about how DevSpark engineered ${project.title}.`}
        image={project.image || 'https://devspark.com/banner.png'}
        url={`https://devspark.com/projects/${project._id || project.id}`}
        type="article"
      />
      {/* Hero image container */}
      <div className="relative w-full bg-slate-900/5 border-b border-[#f0eae1] flex items-center justify-center overflow-hidden py-4 sm:py-6" style={{ minHeight: '320px', maxHeight: '540px' }}>
        <img
          src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200'}
          alt={project.title}
          className="w-full max-h-[500px] object-contain object-center"
        />
        {/* gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Back button */}
        <motion.button
          {...fadeUp(0)}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mt-8 mb-6 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </motion.button>

        {/* Category + Title */}
        <motion.div {...fadeUp(0.05)}>
          {project.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 border border-orange-200 text-orange-600 mb-4">
              <Tag className="w-3 h-3" /> {project.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {project.description}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div {...fadeUp(0.1)} className="flex flex-wrap gap-3 mb-10">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-sm hover:shadow-md hover:shadow-orange-500/20 hover:scale-[1.02]">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Github className="w-4 h-4" /> View Code
            </a>
          )}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-[#f0eae1] mb-10" />

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <motion.div {...fadeUp(0.15)} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-slate-900">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t}
                  className="px-4 py-1.5 rounded-xl text-sm font-semibold bg-white border border-[#f0eae1] text-slate-700 font-mono shadow-xs hover:border-orange-300 hover:text-orange-700 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
