import { projectsAPI, servicesAPI, testimonialsAPI, teamAPI } from '@/lib/api';
import {
  HeroSection,
  IntroductionSection,
  ServicesPreviewSection,
  ProjectsPreviewSection,
  TestimonialsPreviewSection,
  CTASection,
} from '@/components/sections/HomeSections';

async function fetchData() {
  try {
    const [projects, services, testimonials, team] = await Promise.all([
      projectsAPI.getAll(),
      servicesAPI.getAll(),
      testimonialsAPI.getAll(),
      teamAPI.getAll(),
    ]);

    // Calculate dynamic satisfaction rate from testimonials
    const totalRating = testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const maxPossibleRating = testimonials.length * 5;
    const satisfactionRate = maxPossibleRating > 0
      ? Math.round((totalRating / maxPossibleRating) * 100)
      : 98;

    return {
      projectsPreview: projects.slice(0, 3),
      projectsCount: projects.length,
      services,
      testimonialsPreview: testimonials.slice(0, 3),
      testimonialsCount: testimonials.length,
      teamCount: team.length,
      satisfactionRate,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      projectsPreview: [],
      projectsCount: 0,
      services: [],
      testimonialsPreview: [],
      testimonialsCount: 0,
      teamCount: 0,
      satisfactionRate: 98,
    };
  }
}

export default async function HomePage() {
  const {
    projectsPreview,
    projectsCount,
    services,
    testimonialsPreview,
    testimonialsCount,
    teamCount,
    satisfactionRate,
  } = await fetchData();

  return (
    <>
      <HeroSection
        projectsCount={projectsCount}
        happyClientsCount={testimonialsCount}
        teamCount={teamCount}
        satisfactionRate={satisfactionRate}
      />
      <IntroductionSection />
      <ServicesPreviewSection services={services} />
      <ProjectsPreviewSection projects={projectsPreview} />
      <TestimonialsPreviewSection testimonials={testimonialsPreview} />
      <CTASection />
    </>
  );
}
