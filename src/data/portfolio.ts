export const profile = {
  name: "Gargi Arya",
  firstName: "Gargi",
  title: "Software Developer",
  roles: [
    "Software Developer",
    "Agentic AI Builder",
    "ERP & CRM Architect",
    "Full-Stack Engineer",
  ],
  location: "Jaipur, India",
  phone: "+91 6386130066",
  email: "gargi.arya67@gmail.com",
  github: "https://github.com/gargiarya1",
  linkedin: "https://www.linkedin.com/in/gargi-arya-b4b95b257/",
  tagline:
    "I design and build intelligent, enterprise-grade software — from Agentic AI systems that hold real conversations, to ERP platforms that run entire businesses.",
  heroDescription:
    "Software Developer based in Jaipur, crafting AI-powered applications, enterprise ERP/CRM systems, and conversational platforms that solve real business problems end-to-end.",
  bio: [
    "I'm Gargi — a software developer who believes the best products disappear into the background and just work, beautifully. What started as curiosity about how applications talk to each other has grown into a career building AI calling systems, enterprise ERP platforms, and conversational agents that handle real workflows for real companies.",
    "I care about the parts most people skip: the API that fails gracefully, the dashboard that loads instantly, the automation that quietly saves someone hours every week. Currently building at Code Cafe Lab IT Solutions, where I sit across the entire SDLC — from a client's first requirement to the moment a feature ships to production.",
    "Outside of enterprise work, I build things that matter to me personally too — a safety app for women, a learning platform for students — because the best way to grow as a developer is to keep shipping.",
  ],
  resumeUrl: "/Gargi_Arya_Resume.pdf",
};

export const stats = [
  { label: "Projects Delivered", value: 6, suffix: "+" },
  { label: "Enterprise Platforms", value: 4, suffix: "" },
  { label: "Third-Party Integrations", value: 10, suffix: "+" },
  { label: "Certifications Earned", value: 4, suffix: "" },
];

export type SkillCategory = {
  title: string;
  description: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    description: "Core languages I think and build in",
    skills: ["C", "C++", "JavaScript", "Python"],
  },
  {
    title: "Frontend Development",
    description: "Crafting interfaces people enjoy using",
    skills: ["React.js", "Next.js", "HTML5", "CSS3"],
  },
  {
    title: "Mobile Development",
    description: "Cross-platform app experiences",
    skills: ["Flutter"],
  },
  {
    title: "Backend Development",
    description: "APIs and systems that hold up under load",
    skills: ["Node.js", "Python Scripting", "ASP.NET MVC", "RESTful APIs"],
  },
  {
    title: "Databases",
    description: "Modeling and querying data at scale",
    skills: ["MySQL", "PostgreSQL"],
  },
  {
    title: "AI & Automation",
    description: "Where most of my recent work lives",
    skills: [
      "Agentic AI",
      "Conversational AI",
      "STT Models",
      "TTS Models",
      "LLM Integrations",
    ],
  },
  {
    title: "Business Systems",
    description: "Software that runs entire operations",
    skills: ["ERP Development", "Workflow Automation", "IAM"],
  },
  {
    title: "Cloud & DevOps",
    description: "Shipping and keeping things live",
    skills: ["Hostinger", "Server-Side Rendering", "Deployment"],
  },
  {
    title: "Tools & Productivity",
    description: "My day-to-day toolkit",
    skills: [
      "Git / GitHub",
      "Postman",
      "Claude",
      "Cursor",
      "Gemini CLI",
      "ChatGPT CLI",
      "Google AI Studio",
      "Perplexity",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  type: "Enterprise Project" | "Personal Project";
  category: string;
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  challenges: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: "Live" | "Private / Enterprise";
};

export const projects: Project[] = [
  {
    slug: "ai-caller-system",
    name: "AI Caller System",
    type: "Enterprise Project",
    category: "Agentic AI / Conversational AI",
    description:
      "A conversational AI calling platform that lets a business run real, natural phone conversations — automatically.",
    longDescription:
      "Built end-to-end using an Agentic AI architecture, the AI Caller System handles real-time voice conversations for business use cases like lead qualification and customer outreach. It streams speech in and out over WebSockets, reasons over the conversation with LLMs, and hands off to WhatsApp and Meta for follow-up — all running live in production.",
    tech: ["Agentic AI", "WebSockets", "STT", "TTS", "LLM Integrations", "Node.js", "REST APIs"],
    features: [
      "Real-time STT → LLM → TTS pipeline over WebSockets",
      "Authentication and session workflows for live calls",
      "WhatsApp and Meta integration for conversation hand-off",
      "Deployed and maintained on a live production server",
    ],
    challenges: [
      "Keeping voice latency low enough for natural back-and-forth conversation",
      "Orchestrating multiple third-party AI services reliably under real call load",
    ],
    liveUrl: "https://aicaller.codecafelab.in",
    status: "Live",
  },
  {
    slug: "suncity-solar-erp",
    name: "Suncity Solar — ERP System",
    type: "Enterprise Project",
    category: "ERP / Business Systems",
    description:
      "A full ERP system for a solar company — managing leads, projects, and incentives across every role in the business.",
    longDescription:
      "Designed and customized ERP modules for solar lead management, project tracking, and incentive management. The system handles role-based access control and automated incentive-generation workflows for advisors and site surveyors, plus the API integrations needed to keep operations running day to day.",
    tech: ["React.js", "Node.js", "MySQL", "RBAC", "REST APIs"],
    features: [
      "Role-based access control across advisors, surveyors and admins",
      "Automated incentive-generation workflows",
      "Lead and project tracking dashboards",
      "API integrations for operational management",
    ],
    challenges: [
      "Modeling multi-role commission and incentive logic accurately",
      "Supporting production deployments while iterating on live enterprise data",
    ],
    status: "Private / Enterprise",
  },
  {
    slug: "t2u-lms-panel",
    name: "T2U LMS Panel",
    type: "Enterprise Project",
    category: "Business Management Platform",
    description:
      "A single platform that runs a company's courses, accounting, HR, and payroll — built as one coherent system.",
    longDescription:
      "T2U unifies five distinct business domains into one web platform: a course/LMS module, an accounting module, a business management module, a salary & PF module, and a full HRMS. Built with React and Node, it gives every department its own workflow without fragmenting the underlying data model.",
    tech: ["React.js", "Node.js", "MySQL", "REST APIs"],
    features: [
      "Course management (LMS) module",
      "Accounting module",
      "HRMS with salary & PF processing",
      "Unified, role-aware business dashboard",
    ],
    challenges: [
      "Unifying five different business domains into one coherent data model",
      "Designing role-based views so each department only sees what it needs",
    ],
    liveUrl: "https://t2upgrade.com",
    status: "Live",
  },
  {
    slug: "zyra-whatsapp",
    name: "Zyra WhatsApp",
    type: "Enterprise Project",
    category: "Agentic AI / Conversational Automation",
    description:
      "A WhatsApp-native AI assistant that runs full business conversations automatically, LLM-driven end to end.",
    longDescription:
      "Zyra brings Agentic AI conversation flows directly into WhatsApp Business, similar in spirit to assistants like Lemini AI. It listens, reasons with an LLM, and responds in natural language inside the constraints of the WhatsApp API — automating conversations that would otherwise need a human on the other end.",
    tech: ["Agentic AI", "WhatsApp Business API", "LLM Integrations", "Node.js", "Webhooks"],
    features: [
      "Automated, context-aware conversations over WhatsApp",
      "LLM-driven response generation",
      "Business automation logic and webhook handling",
    ],
    challenges: [
      "Replicating natural, multi-turn conversation within WhatsApp's API constraints",
      "Keeping responses context-aware across long conversation threads",
    ],
    liveUrl: "https://zyra.codecafelab.in",
    status: "Live",
  },
  {
    slug: "mindsnap",
    name: "MindSnap",
    type: "Personal Project",
    category: "E-Learning Platform",
    description:
      "A full-stack LMS built from scratch — authentication, role-based dashboards, and course management.",
    longDescription:
      "MindSnap is a self-built learning management system with user authentication, role-based dashboards for students and admins, course management, and a fully responsive UI — built to understand LMS architecture from the ground up.",
    tech: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"],
    features: [
      "User authentication and session management",
      "Role-based dashboards for students and admins",
      "Course creation and management",
      "Fully responsive interface",
    ],
    challenges: [
      "Structuring clean role-based access without a heavy framework",
      "Keeping the UI responsive and fast across devices",
    ],
    githubUrl: "https://github.com/gargiarya1/MindSnap",
    status: "Live",
  },
  {
    slug: "bsafe",
    name: "BSafe — Women Safety App",
    type: "Personal Project",
    category: "Safety / Location-Based App",
    description:
      "A real-time safety app with GPS tracking and SOS alerts — plus a trusted marketplace for booking verified house help.",
    longDescription:
      "BSafe is a real-time safety application built around GPS tracking, one-tap SOS alerts, and Firebase authentication. Beyond emergency safety, it includes a two-sided marketplace where verified house help can register, and users can browse, chat with, and book them directly through the app — all backed by Google Maps for location and trust.",
    tech: ["Firebase", "Google Maps API", "GPS / Location Services", "JavaScript"],
    features: [
      "Real-time GPS tracking and one-tap SOS alerts",
      "Firebase authentication",
      "Google Maps integration for live location",
      "Verified house-help registration, booking and in-app conversation",
    ],
    challenges: [
      "Maintaining accurate, battery-conscious real-time location tracking",
      "Building trust into a two-sided marketplace inside a safety-first product",
    ],
    liveUrl: "https://wsabsafe.netlify.app/",
    githubUrl: "https://github.com/gargiarya1/Women_Safety_Application",
    status: "Live",
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Developer",
    org: "Code Cafe Lab IT Solutions",
    location: "Jaipur, India",
    period: "June 2025 — Present",
    bullets: [
      "Developed ERP and CRM-based business management systems using React.js, Node.js, MySQL, and Python scripts.",
      "Implemented modules for lead management, incentive generation, identity and access management (IAM), workflow automation, and reporting dashboards for enterprise-grade ERP applications.",
      "Designed, consumed, and tested RESTful APIs using Postman for internal and third-party services.",
      "Built a company-level AI Caller system using Agentic AI and conversational workflows.",
      "Integrated WhatsApp APIs, Meta integrations, payment gateways, and multiple third-party platforms.",
      "Collaborated across the complete SDLC — requirement analysis, development, testing, deployment, and production support.",
    ],
  },
  {
    role: "Web Development Intern",
    org: "CodeSpaze",
    location: "Jaipur, India",
    period: "Oct 2023 — Nov 2023",
    bullets: [
      "Built and optimized responsive web applications using HTML, CSS, JavaScript, and React.js.",
      "Improved UI/UX through interactive components and API integrations.",
      "Ensured cross-browser compatibility and performance optimization.",
    ],
  },
];

export const education = {
  degree: "B.Tech in Computer Science and Engineering",
  school: "University of Engineering and Management, Jaipur",
  period: "2021 — 2025",
  detail: "CGPA: 8.9",
};

export type Certification = {
  title: string;
  issuer: string;
  highlight?: string;
};

export const certifications: Certification[] = [
  {
    title: "Big Data Computing",
    issuer: "NPTEL",
    highlight: "Top 5%",
  },
  {
    title: "AI-ML Virtual Internship",
    issuer: "Google for Developers",
  },
  {
    title: "Data Analytics and Process Automation",
    issuer: "Alteryx",
  },
  {
    title: "Android Developer Virtual Internship",
    issuer: "Google for Developers",
  },
];

export const socials = [
  { label: "GitHub", url: profile.github, icon: "github" },
  { label: "LinkedIn", url: profile.linkedin, icon: "linkedin" },
  { label: "Email", url: `mailto:${profile.email}`, icon: "mail" },
] as const;
