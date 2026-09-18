import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import ScrollToTop from '@/components/common/ScrollToTop';

// Public Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import TeamPage from '@/pages/TeamPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

// Admin Pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminServicesPage from '@/pages/admin/AdminServicesPage';
import AdminTeamPage from '@/pages/admin/AdminTeamPage';
import AdminTestimonialsPage from '@/pages/admin/AdminTestimonialsPage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
