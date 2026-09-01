import {
  profile,
  skillCategories,
  experience,
  education,
  projects,
  certifications,
  aboutCards,
} from "@/data/portfolio";

export type QuickReply =
  | { kind: "topic"; id: string; label: string }
  | { kind: "action"; id: "send-message" | "view-resume" | "download-resume" | "menu"; label: string };

export type BotReply = {
  text: string;
  quickReplies?: QuickReply[];
};

const MAIN_MENU: QuickReply[] = [
  { kind: "topic", id: "about", label: "About Gargi" },
  { kind: "topic", id: "skills", label: "Skills" },
  { kind: "topic", id: "experience", label: "Experience" },
  { kind: "topic", id: "projects", label: "Projects" },
  { kind: "topic", id: "education", label: "Education" },
  { kind: "topic", id: "resume", label: "Resume" },
  { kind: "topic", id: "contact", label: "Contact" },
];

export function mainMenu(): QuickReply[] {
  return MAIN_MENU;
}

function projectQuickReplies(): QuickReply[] {
  return [
    ...projects.map((p) => ({ kind: "topic" as const, id: `project:${p.slug}`, label: p.name })),
    { kind: "action", id: "menu", label: "⟵ Main menu" },
  ];
}

export function getResponse(topic: string): BotReply {
  if (topic.startsWith("project:")) {
    const slug = topic.slice("project:".length);
    const p = projects.find((proj) => proj.slug === slug);
    if (!p) return getResponse("projects");
    const links = [
      p.liveUrl ? `🔗 Live: ${p.liveUrl}` : null,
      p.githubUrl ? `💻 Code: ${p.githubUrl}` : null,
      !p.liveUrl && !p.githubUrl ? "🔒 Private / enterprise codebase" : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      text: `**${p.name}** (${p.type})\n\n${p.longDescription}\n\nBuilt with: ${p.tech.join(", ")}\n\n${links}`,
      quickReplies: [
        { kind: "topic", id: "projects", label: "⟵ All projects" },
        { kind: "action", id: "menu", label: "Main menu" },
      ],
    };
  }

  switch (topic) {
    case "greeting":
      return {
        text: `Hey! 👋 I'm Gargi's portfolio assistant. Ask me anything, or just tap one of these:`,
        quickReplies: mainMenu(),
      };

    case "about": {
      const who = aboutCards.find((c) => c.icon === "sparkles");
      return {
        text: `${profile.heroDescription}\n\n${who?.body ?? profile.tagline}\n\nBased in ${profile.location}, currently building at Code Cafe Lab IT Solutions.`,
        quickReplies: [
          { kind: "topic", id: "skills", label: "See her skills" },
          { kind: "topic", id: "experience", label: "See experience" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };
    }

    case "skills": {
      const lines = skillCategories
        .map((c) => `• **${c.title}** — ${c.skills.join(", ")}`)
        .join("\n");
      return {
        text: `Here's the toolkit:\n\n${lines}`,
        quickReplies: [
          { kind: "topic", id: "projects", label: "See it in action" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };
    }

    case "experience": {
      const lines = experience
        .map((e) => `**${e.role}** — ${e.org} (${e.period})\n${e.bullets[0]}`)
        .join("\n\n");
      return {
        text: `Work experience:\n\n${lines}`,
        quickReplies: [
          { kind: "topic", id: "education", label: "Education" },
          { kind: "topic", id: "resume", label: "Full resume" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };
    }

    case "education": {
      const certLines = certifications.map((c) => `• ${c.title} — ${c.issuer}${c.highlight ? ` (${c.highlight})` : ""}`).join("\n");
      return {
        text: `🎓 ${education.degree}\n${education.school} (${education.period}) — ${education.detail}\n\nCertifications:\n${certLines}`,
        quickReplies: [
          { kind: "topic", id: "experience", label: "⟵ Experience" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };
    }

    case "projects": {
      const lines = projects.map((p) => `• **${p.name}** — ${p.description}`).join("\n");
      return {
        text: `A few things she's built:\n\n${lines}\n\nWant details on one?`,
        quickReplies: projectQuickReplies(),
      };
    }

    case "resume":
      return {
        text: `The full resume (experience, skills, education, certifications) is one PDF, updated ${profile.resumeUpdated}. You can preview it right here or grab the file.`,
        quickReplies: [
          { kind: "action", id: "view-resume", label: "👁 View resume" },
          { kind: "action", id: "download-resume", label: "⬇ Download PDF" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };

    case "contact":
      return {
        text: `Best ways to reach her:\n\n📧 ${profile.email}\n📱 ${profile.phone}\n📍 ${profile.location}\n💻 ${profile.github}\n🔗 ${profile.linkedin}\n\nOr just send a message right now — I'll deliver it.`,
        quickReplies: [
          { kind: "action", id: "send-message", label: "✍️ Send a message" },
          { kind: "action", id: "menu", label: "Main menu" },
        ],
      };

    default:
      return {
        text: `I'm not sure about that one yet — but here's what I can help with:`,
        quickReplies: mainMenu(),
      };
  }
}

const KEYWORD_MAP: [RegExp, string][] = [
  [/\b(hi|hello|hey|yo|sup)\b/i, "greeting"],
  [/\b(who|about|bio|yourself|background)\b/i, "about"],
  [/\b(skill|stack|tech|language|framework|tool)\b/i, "skills"],
  [/\b(experience|work|job|career|company|role)\b/i, "experience"],
  [/\b(education|degree|college|university|study|studied|school|certif)\b/i, "education"],
  [/\b(project|app|built|build|portfolio piece|work sample)\b/i, "projects"],
  [/\b(resume|cv)\b/i, "resume"],
  [/\b(contact|email|reach|phone|call|linkedin|github|hire|message)\b/i, "contact"],
];

export function matchIntent(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "fallback";
  for (const [re, topic] of KEYWORD_MAP) {
    if (re.test(trimmed)) return topic;
  }
  return "fallback";
}
