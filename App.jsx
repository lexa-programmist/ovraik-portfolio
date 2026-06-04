import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const tk = {
  bg:         "#090C10",
  surface:    "#0E1218",
  surfaceHov: "#131820",
  border:     "rgba(255,255,255,0.07)",
  borderHov:  "rgba(255,255,255,0.13)",
  text:       "#E2E5EC",
  muted:      "#4E5666",
  sub:        "#7C8592",
  accent:     "#3B82F6",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 18 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

const Divider = () => (
  <div style={{ height: "1px", background: tk.border, margin: "0 auto", maxWidth: "960px" }} />
);

// ─── GRAIN ───────────────────────────────────────────────────────────────────
const Grain = () => (
  <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.022 }}>
    <filter id="g">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#g)" />
  </svg>
);

// ─── GRID ─────────────────────────────────────────────────────────────────────
const Grid = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
    backgroundSize: "72px 72px",
  }} />
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "About",    id: "about"    },
  { label: "Projects", id: "projects" },
  { label: "Focus",    id: "focus"    },
  { label: "Contact",  id: "contact"  },
];

const Nav = ({ active }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1,  y: 0  }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background:     scrolled ? "rgba(9,12,16,0.9)"     : "transparent",
        backdropFilter: scrolled ? "blur(16px)"            : "none",
        borderBottom:   scrolled ? `1px solid ${tk.border}` : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <div style={{
        maxWidth: "960px", margin: "0 auto", padding: "0 24px",
        height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: tk.sub, letterSpacing: "0.04em" }}>
            ovraik
          </span>
        </a>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: "flex", gap: "28px" }}>
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} style={{
              fontFamily: "'DM Mono',monospace", fontSize: "12px",
              color: active === l.id ? tk.text : tk.muted,
              textDecoration: "none", letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}>{l.label}</a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-mobile"
          onClick={() => setOpen(o => !o)}
          style={{
            background: "none", border: `1px solid ${tk.border}`, borderRadius: "6px",
            padding: "6px 10px", cursor: "pointer", display: "none",
          }}
        >
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.sub, letterSpacing: "0.04em" }}>
            {open ? "✕" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: "rgba(9,12,16,0.97)", borderTop: `1px solid ${tk.border}`,
          padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: "0",
        }}>
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} style={{
              fontFamily: "'DM Mono',monospace", fontSize: "13px",
              color: active === l.id ? tk.text : tk.sub,
              textDecoration: "none", letterSpacing: "0.04em",
              padding: "12px 0",
              borderBottom: `1px solid ${tk.border}`,
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </motion.nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1],    [0, 60]);
  const fadeOut   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center",
      padding: "0 24px", overflow: "hidden",
    }}>
      <motion.div style={{ y: yParallax, opacity: fadeOut, maxWidth: "720px", width: "100%", position: "relative", zIndex: 1 }}>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            fontFamily: "'DM Mono',monospace", fontSize: "11px",
            color: tk.muted, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "36px",
          }}
        >
          Belarus / Remote
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: "-0.035em", color: tk.text,
            margin: "0 0 28px",
          }}
        >
          Building products,<br />
          systems,<br />
          <span style={{ color: tk.sub }}>and useful tools.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: tk.sub, lineHeight: 1.7,
            maxWidth: "480px", margin: "0 0 44px",
          }}
        >
          I build products, automate workflows, and design systems that solve real problems. Most of my work starts as an idea and turns into something usable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <a href="#projects" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "10px 20px", background: tk.accent, color: "#fff",
            borderRadius: "7px", fontFamily: "'DM Mono',monospace", fontSize: "12px",
            letterSpacing: "0.02em", textDecoration: "none",
            transition: "opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)";    }}
          >
            View Projects
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center",
            padding: "10px 20px", background: "transparent", color: tk.sub,
            border: `1px solid ${tk.border}`, borderRadius: "7px",
            fontFamily: "'DM Mono',monospace", fontSize: "12px",
            letterSpacing: "0.02em", textDecoration: "none",
            transition: "border-color 0.2s, color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = tk.borderHov; e.currentTarget.style.color = tk.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border;    e.currentTarget.style.color = tk.sub;  }}
          >
            Get In Touch
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <span style={{
          fontFamily: "'DM Mono',monospace", fontSize: "11px",
          color: tk.muted, letterSpacing: "0.1em",
          textTransform: "uppercase", display: "block", marginBottom: "40px",
        }}>
          About
        </span>
      </Reveal>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }}>
        <Reveal delay={0.08}>
          <div>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: tk.text,
              margin: "0 0 20px", lineHeight: 1.2,
            }}>
              Hi, I'm Alexey Raikov<br />(Ovraik).
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
              I'm a student at BNTU in Belarus. Outside university I spend most of my time building things — products, internal tools, automation workflows, and digital systems.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
              Most of what I know I learned by doing. Reading helps, but nothing clarifies an idea like trying to build it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
              Over the last few years I've worked on marketplace products, automation systems, content workflows, and analytics tools. Some made it to an MVP. Some stayed as experiments. All of them taught me something.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 24px" }}>
              I enjoy turning vague ideas into working systems. Sometimes it's a product. Sometimes it's an automation or an internal tool. The part I find most satisfying is taking something from zero to a usable first version — and learning through the process.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Product Development", "Automation", "Business Operations", "Financial Analysis", "Systems Thinking"].map(tag => (
                <span key={tag} style={{
                  fontFamily: "'DM Mono',monospace", fontSize: "11px",
                  color: tk.muted, border: `1px solid ${tk.border}`,
                  borderRadius: "4px", padding: "3px 9px", letterSpacing: "0.04em",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01",
    title: "Fishka",
    category: "Marketplace · Mini App",
    description: "A marketplace product built as a Telegram Mini App. I identified a gap in how buyers and sellers in a specific category connected, designed the product from scratch, and built it — covering product design, deal flow logic, payment integration, and the full Mini App implementation. Completed MVP. Currently paused.",
    status: "Paused",
    tags: ["Product Design", "Marketplace", "Mini App", "Payments", "MVP"],
  },
  {
    num: "02",
    title: "Content Distribution System",
    category: "Automation",
    description: "A set of tools that automate how content gets published and distributed across platforms. Instead of repeating the same manual steps for each upload — formatting, scheduling, cross-posting to YouTube, TikTok, and other channels — the system handles it. Built to remove friction from a recurring operational task.",
    status: "Ongoing",
    tags: ["Automation", "YouTube", "TikTok", "Publishing", "Workflow Design"],
  },
  {
    num: "03",
    title: "AI Workflow Experiments",
    category: "Internal Tools",
    description: "A personal collection of tools and automations that use AI to speed up recurring tasks — drafting, research, summarisation, and decision support. Not a product, just a working set of systems I use and keep improving as the tools get better.",
    status: "Ongoing",
    tags: ["AI", "Internal Tools", "Automation", "Productivity"],
  },
];

const ProjectCard = ({ num, title, category, description, status, tags, delay }) => {
  const [hov, setHov] = useState(false);
  const ongoing = status === "Ongoing";
  return (
    <Reveal delay={delay}>
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        style={{
          background: hov ? tk.surfaceHov : tk.surface,
          border: `1px solid ${hov ? tk.borderHov : tk.border}`,
          borderRadius: "10px", padding: "32px",
          transition: "all 0.22s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted, letterSpacing: "0.08em" }}>
            Project {num}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: ongoing ? "#22c55e" : tk.muted,
              display: "inline-block",
            }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted, letterSpacing: "0.05em" }}>
              {status}
            </span>
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700,
          letterSpacing: "-0.025em", color: tk.text, margin: "0 0 6px",
        }}>
          {title}
        </h3>
        <span style={{
          fontFamily: "'DM Mono',monospace", fontSize: "11px",
          color: tk.accent, letterSpacing: "0.06em",
          display: "block", marginBottom: "16px",
        }}>
          {category}
        </span>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.sub, lineHeight: 1.75, margin: "0 0 20px" }}>
          {description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'DM Mono',monospace", fontSize: "10px",
              color: tk.muted, background: "rgba(255,255,255,0.03)",
              border: `1px solid ${tk.border}`, borderRadius: "4px",
              padding: "2px 7px", letterSpacing: "0.04em",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
};

const Projects = () => (
  <section id="projects" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: "11px",
            color: tk.muted, letterSpacing: "0.1em",
            textTransform: "uppercase", display: "block", marginBottom: "14px",
          }}>
            Selected Projects
          </span>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: tk.text, margin: 0,
          }}>
            Things I've built or am building.
          </h2>
        </div>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {projects.map((p, i) => <ProjectCard key={p.num} {...p} delay={i * 0.09} />)}
      </div>
    </div>
  </section>
);

// ─── CURRENT FOCUS ────────────────────────────────────────────────────────────
const focusCards = [
  {
    title: "Product Development",
    icon: "✦",
    desc: "Taking ideas from zero to a working product. I'm interested in the full arc — identifying a problem, shaping a solution, and building something usable.",
  },
  {
    title: "Business Operations",
    icon: "◈",
    desc: "How things actually run inside organizations. Process design, operational workflows, and removing the manual work that slows teams down.",
  },
  {
    title: "Financial Analysis",
    icon: "◇",
    desc: "Exploring financial analysis, market research, and data-driven decision-making using Python and analytical tools. Learning how numbers inform business decisions.",
  },
  {
    title: "Automation",
    icon: "◉",
    desc: "Building systems that handle recurring tasks reliably. The goal is always the same: less manual work, more consistent output.",
  },
];

const CurrentFocus = () => (
  <section id="focus" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: "11px",
            color: tk.muted, letterSpacing: "0.1em",
            textTransform: "uppercase", display: "block", marginBottom: "14px",
          }}>
            Current Focus
          </span>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: tk.text, margin: 0,
          }}>
            What I'm working on and thinking about.
          </h2>
        </div>
      </Reveal>
      <div className="focus-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1px", background: tk.border, borderRadius: "10px", overflow: "hidden",
      }}>
        {focusCards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ background: tk.surfaceHov }}
              style={{ background: tk.surface, padding: "28px 24px", minHeight: "160px", transition: "background 0.2s" }}
            >
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "16px", color: tk.accent, display: "block", marginBottom: "12px" }}>
                {c.icon}
              </span>
              <h3 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "15px",
                fontWeight: 600, color: tk.text, margin: "0 0 8px", letterSpacing: "-0.01em",
              }}>
                {c.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: tk.muted, lineHeight: 1.65, margin: 0 }}>
                {c.desc}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── CURRENTLY EXPLORING ─────────────────────────────────────────────────────
const exploringItems = [
  {
    title: "Product Development",
    desc: "Turning messy, undefined problems into structured products. Design, iteration, and shipping — not just planning.",
  },
  {
    title: "Business Operations",
    desc: "How teams and processes actually function at scale. Where things break, where they slow down, and how to fix both.",
  },
  {
    title: "Automation",
    desc: "Replacing manual, repetitive work with systems that run reliably. The goal is leverage — same effort, better output.",
  },
  {
    title: "Startup Dynamics",
    desc: "How early-stage companies form, make decisions, and find traction. I'm interested in the operational and product side.",
  },
  {
    title: "Systems Thinking",
    desc: "Modeling how things are connected. Finding leverage points instead of just treating symptoms.",
  },
  {
    title: "Financial Analysis",
    desc: "Using data and analytical tools to understand businesses and markets. How numbers translate into decisions.",
  },
];

const Exploring = () => (
  <section id="exploring" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: "11px",
            color: tk.muted, letterSpacing: "0.1em",
            textTransform: "uppercase", display: "block", marginBottom: "14px",
          }}>
            Currently Exploring
          </span>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: tk.text, margin: 0,
          }}>
            Topics I keep coming back to.
          </h2>
        </div>
      </Reveal>
      <div className="explore-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1px", background: tk.border, borderRadius: "10px", overflow: "hidden",
      }}>
        {exploringItems.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <motion.div
              whileHover={{ background: tk.surfaceHov }}
              style={{ background: tk.surface, padding: "24px 22px", transition: "background 0.2s" }}
            >
              <h3 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "14px",
                fontWeight: 600, color: tk.text, margin: "0 0 7px", letterSpacing: "-0.01em",
              }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: tk.muted, lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── CONTACT ─────────────────────────────────────────────────────────────────

// SVG arrow icon — monochrome, minimal, no emoji
const ArrowIcon = ({ style }) => (
  <svg
    width="14" height="14" viewBox="0 0 14 14"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M2.5 11.5L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Single contact row (Telegram, Email)
const ContactRow = ({ label, handle, href }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto") ? "_self" : "_blank"}
      rel="noopener noreferrer"
      whileHover={{ x: 3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "15px 16px",
        borderBottom: `1px solid ${tk.border}`,
        textDecoration: "none",
        background: hovered ? tk.surface : "transparent",
        transition: "background 0.18s",
      }}
    >
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{
          fontFamily: "'DM Mono',monospace", fontSize: "11px",
          color: tk.muted, minWidth: "64px", letterSpacing: "0.04em",
        }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.text }}>
          {handle}
        </span>
      </div>
      <ArrowIcon style={{
        color: hovered ? tk.text : tk.muted,
        opacity: hovered ? 1 : 0.6,
        transition: "color 0.18s, opacity 0.18s",
        flexShrink: 0,
      }} />
    </motion.a>
  );
};

// LinkedIn row — two separate actions: Profile + Open App
const LinkedInRow = () => {
  const [hovered, setHovered] = useState(false);
  const profileUrl = "https://www.linkedin.com/in/alexey-raikov-20224228a";
  const appUrl = "linkedin://in/alexey-raikov-20224228a";

  const handleOpenApp = (e) => {
    e.preventDefault();
    // Try app first, fall back to browser
    const start = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.open(profileUrl, "_blank", "noopener,noreferrer");
      }
    }, 800);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "15px 16px",
        borderBottom: `1px solid ${tk.border}`,
        background: hovered ? tk.surface : "transparent",
        transition: "background 0.18s",
      }}
    >
      {/* Left — label + handle */}
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{
          fontFamily: "'DM Mono',monospace", fontSize: "11px",
          color: tk.muted, minWidth: "64px", letterSpacing: "0.04em",
        }}>
          LinkedIn
        </span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.text }}>
          Alexey Raikov
        </span>
      </div>

      {/* Right — two action links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <LinkedInAction href={profileUrl} label="Profile" />
        <span style={{ color: tk.border, fontSize: "11px", userSelect: "none" }}>·</span>
        <LinkedInAction href={appUrl} label="Open App" onClick={handleOpenApp} />
      </div>
    </div>
  );
};

const LinkedInAction = ({ href, label, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        fontFamily: "'DM Mono',monospace", fontSize: "11px",
        color: h ? tk.text : tk.muted,
        textDecoration: "none",
        letterSpacing: "0.04em",
        padding: "3px 6px",
        borderRadius: "3px",
        background: h ? "rgba(255,255,255,0.05)" : "transparent",
        transition: "color 0.15s, background 0.15s",
      }}
    >
      {label}
      <ArrowIcon style={{
        width: 11, height: 11,
        color: h ? tk.text : tk.muted,
        opacity: h ? 1 : 0.55,
        transition: "color 0.15s, opacity 0.15s",
      }} />
    </a>
  );
};

const Contact = () => (
  <section id="contact" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }}>

        {/* Left */}
        <Reveal>
          <div>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: "11px",
              color: tk.muted, letterSpacing: "0.1em",
              textTransform: "uppercase", display: "block", marginBottom: "24px",
            }}>
              Contact
            </span>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: tk.text,
              margin: "0 0 16px", lineHeight: 1.1,
            }}>
              Let's talk.
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.7, margin: 0 }}>
              Open to interesting projects, collaborations, or just a good conversation. Reach out directly.
            </p>
          </div>
        </Reveal>

        {/* Right — contact rows */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", paddingTop: "4px" }}>
            <ContactRow label="Telegram" handle="@ovraik" href="https://t.me/ovraik" />
            <LinkedInRow />
            <ContactRow label="Email" handle="ovraikin@gmail.com" href="mailto:ovraikin@gmail.com" />
          </div>
        </Reveal>

      </div>

      {/* Footer */}
      <Reveal delay={0.15}>
        <div style={{
          marginTop: "72px", paddingTop: "24px",
          borderTop: `1px solid ${tk.border}`,
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted }}>
            Alexey Raikov · Ovraik · 2026
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted }}>
            Belarus / Remote
          </span>
        </div>
      </Reveal>
    </div>
  </section>
);

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(59,130,246,0.2); color: #E2E5EC; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @media (max-width: 720px) {
          .about-grid   { grid-template-columns: 1fr !important; gap: 28px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .focus-grid   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .focus-grid   { grid-template-columns: 1fr !important; }
          .explore-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Grain />
      <Grid />
      <Nav active={active} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: "100%" }}>
        <Hero />
        <About />
        <Projects />
        <CurrentFocus />
        <Exploring />
        <Contact />
      </main>
    </div>
  );
}
