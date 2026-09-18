require("dotenv").config({ path: __dirname + "/.env" });

const { initDB } = require("./db");
const Admin = require("./models/Admin");
const Service = require("./models/Service");
const Project = require("./models/Project");
const TeamMember = require("./models/TeamMember");
const Testimonial = require("./models/Testimonial");

async function seed() {
  try {
    await initDB();
    console.log("Connected to MySQL database");

    // 1. Clear and seed admin
    await Admin.deleteMany();
    console.log("Cleared existing admin data");

    const admin = await Admin.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "devsparkhq@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Devspark@2009!",
    });
    console.log("Created admin user:", admin.email);

    // 2. Seed initial services if empty
    const serviceCount = await Service.count();
    if (serviceCount === 0) {
      const initialServices = [
        {
          title: "Web Development",
          description: "Full-stack custom web applications engineered with modern frontend frameworks, secure backend architectures, and high-performance databases.",
          icon: "Code",
        },
        {
          title: "Mobile App Development",
          description: "High-performance cross-platform iOS and Android mobile solutions built for fluid user experiences, speed, and enterprise reliability.",
          icon: "Smartphone",
        },
        {
          title: "Custom Software Development",
          description: "Tailor-made enterprise software solutions engineered to automate complex workflows, scale operations, and solve unique challenges.",
          icon: "Server",
        },
        {
          title: "UI/UX Design",
          description: "Intuitive design systems, wireframes, and user-centric interfaces crafted to elevate brand identity and maximize conversion rates.",
          icon: "Palette",
        },
        {
          title: "Cloud Solutions",
          description: "Scalable cloud infrastructure, automated CI/CD deployment pipelines, and high-availability systems on AWS, GCP, and Azure.",
          icon: "Cloud",
        },
        {
          title: "API Development",
          description: "Robust, secure, and developer-friendly RESTful and GraphQL APIs engineered for high-throughput traffic and seamless system integrations.",
          icon: "Zap",
        },
      ];
      for (const s of initialServices) {
        await Service.create(s);
      }
      console.log(`Seeded ${initialServices.length} initial services`);
    }

    // 3. Seed initial projects if empty
    const projectCount = await Project.count();
    if (projectCount === 0) {
      const initialProjects = [
        {
          title: "FinTech Dashboard Platform",
          description: "A real-time financial metrics dashboard featuring advanced analytics and transactions.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
          tech_stack: ["Next.js", "Node.js", "MySQL", "Tailwind CSS"],
          live_url: "https://example.com/fintech",
          github_url: "https://github.com/example/fintech",
          category: "Web App",
        },
        {
          title: "HealthTrack Mobile Application",
          description: "Patient appointment scheduling, health tracker, and doctor consultation portal.",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
          tech_stack: ["React Native", "Express", "MySQL"],
          live_url: "https://example.com/healthtrack",
          github_url: "https://github.com/example/healthtrack",
          category: "Mobile",
        },
        {
          title: "E-Commerce Cloud Marketplace",
          description: "High-throughput marketplace platform with dynamic cart, checkout, and inventory tracking.",
          image: "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=800",
          tech_stack: ["Next.js", "Node.js", "MySQL", "Stripe"],
          live_url: "https://example.com/ecommerce",
          github_url: "https://github.com/example/ecommerce",
          category: "E-Commerce",
        },
      ];
      for (const p of initialProjects) {
        await Project.create(p);
      }
      console.log(`Seeded ${initialProjects.length} initial projects`);
    }

    // 4. Seed initial team members if empty
    const teamCount = await TeamMember.count();
    if (teamCount === 0) {
      const initialTeam = [
        {
          name: "Alex Morgan",
          role: "Chief Technology Officer",
          bio: "10+ years engineering scalable cloud systems and architecting performant enterprise platforms.",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
          skills: ["Architecture", "Node.js", "MySQL", "AWS"],
          social_links: {
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            github: "https://github.com",
          },
        },
        {
          name: "Sarah Chen",
          role: "Lead UI/UX Designer",
          bio: "Specializing in design systems, delightful interactions, and clean user-centric digital products.",
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
          skills: ["Figma", "Design Systems", "UI/UX", "Prototyping"],
          social_links: {
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            dribbble: "https://dribbble.com",
          },
        },
      ];
      for (const tm of initialTeam) {
        await TeamMember.create(tm);
      }
      console.log(`Seeded ${initialTeam.length} initial team members`);
    }

    // 5. Seed initial testimonials if empty
    const testimonialCount = await Testimonial.count();
    if (testimonialCount === 0) {
      const initialTestimonials = [
        {
          client_name: "Elena Rostova",
          company: "Apex Innovations",
          message: "DevSpark transformed our legacy system into a blazingly fast modern application ahead of schedule.",
          rating: 5,
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        },
        {
          client_name: "Marcus Vance",
          company: "CloudScale Inc.",
          message: "Exceptional code quality, responsive team, and rock-solid architecture. Highly recommended!",
          rating: 5,
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        },
      ];
      for (const t of initialTestimonials) {
        await Testimonial.create(t);
      }
      console.log(`Seeded ${initialTestimonials.length} initial testimonials`);
    }

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
