import { useState, useEffect } from "react";
import { projectsAPI, servicesAPI, testimonialsAPI, teamAPI, publicStatsAPI } from "@/lib/api";
import {
  HeroSection,
  IntroductionSection,
  ServicesPreviewSection,
  ProjectsPreviewSection,
  TestimonialsPreviewSection,
  CTASection,
} from "@/components/sections/HomeSections";

export default function HomePage() {
  const [data, setData] = useState({
    projectsPreview: [],
    projectsCount: 0,
    services: [],
    testimonialsPreview: [],
    testimonialsCount: 0,
    teamCount: 0,
    satisfactionRate: 96,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [projects, services, testimonials, team, publicStats] = await Promise.all([
          projectsAPI.getAll().catch(() => []),
          servicesAPI.getAll().catch(() => []),
          testimonialsAPI.getAll().catch(() => []),
          teamAPI.getAll().catch(() => []),
          publicStatsAPI.getStats().catch(() => null),
        ]);

        if (!isMounted) return;

        // Calculate or retrieve live satisfaction rate
        let liveSatisfactionRate = 96;
        if (publicStats?.satisfactionRate !== undefined && publicStats?.satisfactionRate !== null) {
          liveSatisfactionRate = Number(publicStats.satisfactionRate);
        } else if (testimonials.length > 0) {
          const totalRating = testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0);
          liveSatisfactionRate = Math.round((totalRating / (testimonials.length * 5)) * 100);
        }

        const pCount = publicStats?.projects ?? projects.length;
        const tCount = publicStats?.testimonials ?? testimonials.length;
        const tmCount = publicStats?.team ?? team.length;

        setData({
          projectsPreview: projects.slice(0, 3),
          projectsCount: pCount,
          services,
          testimonialsPreview: testimonials.slice(0, 3),
          testimonialsCount: tCount,
          teamCount: tmCount,
          satisfactionRate: liveSatisfactionRate,
        });
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <HeroSection
        projectsCount={data.projectsCount}
        happyClientsCount={data.testimonialsCount}
        teamCount={data.teamCount}
        satisfactionRate={data.satisfactionRate}
      />
      <IntroductionSection />
      <ServicesPreviewSection services={data.services} loading={loading} />
      <ProjectsPreviewSection projects={data.projectsPreview} />
      <TestimonialsPreviewSection testimonials={data.testimonialsPreview} />
      <CTASection />
    </>
  );
}
