import { useState, useEffect } from "react";
import SEO from "@/components/common/SEO";
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
    satisfactionRate: 0,
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

        // Calculate live satisfaction rate strictly from real testimonials
        let liveSatisfactionRate = 0;
        if (testimonials.length > 0) {
          const totalRating = testimonials.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          liveSatisfactionRate = Math.round((totalRating / (testimonials.length * 5)) * 100);
        } else if (publicStats?.testimonials > 0 && publicStats?.satisfactionRate) {
          liveSatisfactionRate = Number(publicStats.satisfactionRate);
        } else {
          liveSatisfactionRate = 0;
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
      <SEO
        title="DevSpark — Software Development Agency"
        description="DevSpark crafts exceptional digital experiences. We build modern websites, ERP business management platforms, and high-performance Android mobile apps."
        url="https://devspark.com"
      />
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
