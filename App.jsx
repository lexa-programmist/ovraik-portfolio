import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const t = {
  bg: "#090C10",
  surface: "#0E1218",
  surfaceHover: "#131820",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  text: "#E2E5EC",
  muted: "#4E5666",
  sub: "#7C8592",
  accent: "#3B82F6",
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
  <div style={{ height: "1px", background: t.border, margin: "0 auto", maxWidth: "960px" }} />
);

// ─── GRAIN ───────────────────────────────────────────────────────────────────
const Grain = () => (
  <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.022 }}>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter="url(#g)" />
  </svg>
);

// ─── GRID ─────────────────────────────────────────────────────────────────────
const Grid = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
    backgroundSize: "72px 72px",
  }} />
);

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const Cursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; setDot({ x: e.clientX, y: e.clientY }); };
    const over = (e) => { if (e.target.closest("a,button")) setHov(true); };
    const out  = (e) => { if (e.target.closest("a,button")) setHov(false); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    let raf;
    const lerp = (a, b, n) => a + (b - a) * n;
    const tick = () => { setPos(p => ({ x: lerp(p.x, posRef.current.x, 0.13), y: lerp(p.y, posRef.current.y, 0.13) })); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", left: dot.x - 3, top: dot.y - 3, width: 6, height: 6, borderRadius: "50%", background: t.accent, pointerEvents: "none", zIndex: 9999 }} />
      <div style={{ position: "fixed", left: pos.x - 18, top: pos.y - 18, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${hov ? t.accent : "rgba(255,255,255,0.14)"}`, pointerEvents: "none", zIndex: 9999, transform: `scale(${hov ? 1.4 : 1})`, transition: "transform 0.25s, border-color 0.2s" }} />
    </>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = ({ active }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Focus", id: "focus" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(9,12,16,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: t.sub, letterSpacing: "0.04em" }}>ovraik</span>
        </a>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: "flex", gap: "28px" }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} style={{
              fontFamily: "'DM Mono',monospace", fontSize: "12px",
              color: active === l.id ? t.text : t.muted,
              textDecoration: "none", letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}>{l.label}</a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: "6px", padding: "6px 10px", cursor: "pointer", display: "none" }}
        >
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.sub, letterSpacing: "0.04em" }}>{open ? "✕" : "menu"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: "rgba(9,12,16,0.97)", borderTop: `1px solid ${t.border}`, padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} style={{
              fontFamily: "'DM Mono',monospace", fontSize: "13px",
              color: active === l.id ? t.text : t.sub,
              textDecoration: "none", letterSpacing: "0.04em",
              padding: "8px 0",
              borderBottom: `1px solid ${t.border}`,
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
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fadeOut   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 24px", overflow: "hidden" }}>
      <motion.div style={{ y: yParallax, opacity: fadeOut, maxWidth: "720px", width: "100%", position: "relative", zIndex: 1 }}>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "36px" }}
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
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            color: t.text,
            margin: "0 0 28px",
          }}
        >
          Building products,<br />
          automation,<br />
          <span style={{ color: t.sub }}>and Telegram ecosystems.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: t.sub, lineHeight: 1.7, maxWidth: "480px", margin: "0 0 44px" }}
        >
          I build Telegram projects, automation systems, and digital products. Most of my work starts as an idea, then turns into a prototype, a workflow, or a real product.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <a href="#projects" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "10px 20px", background: t.accent, color: "#fff",
            borderRadius: "7px", fontFamily: "'DM Mono',monospace", fontSize: "12px",
            letterSpacing: "0.02em", textDecoration: "none",
            transition: "opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            View Projects
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center",
            padding: "10px 20px", background: "transparent", color: t.sub,
            border: `1px solid ${t.border}`, borderRadius: "7px",
            fontFamily: "'DM Mono',monospace", fontSize: "12px",
            letterSpacing: "0.02em", textDecoration: "none",
            transition: "border-color 0.2s, color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderHover; e.currentTarget.style.color = t.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.sub; }}
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
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "40px" }}>
          About
        </span>
      </Reveal>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }}>
        <Reveal delay={0.08}>
          <div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", color: t.text, margin: "0 0 20px", lineHeight: 1.2 }}>
              Hi, I'm Alexey Raikov<br />(Ovraik).
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: t.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
              I'm a student at BNTU in Belarus. Outside university I spend most of my time building things — Telegram projects, automation systems, digital products, and tools for internal use.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: t.sub, lineHeight: 1.75, margin: 0 }}>
              Most of what I know comes from building things myself. I learn by doing.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: t.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
              Over the last few years I've experimented with Telegram bots, Mini Apps, automation workflows, AI tools, crypto analytics, and product ideas.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: t.sub, lineHeight: 1.75, margin: "0 0 24px" }}>
              I enjoy taking an idea from zero to a working product and learning through execution.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Telegram Ecosystem", "Automation", "Product Development", "Financial Analytics", "AI Tools"].map(tag => (
                <span key={tag} style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, border: `1px solid ${t.border}`, borderRadius: "4px", padding: "3px 9px", letterSpacing: "0.04em" }}>
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
    category: "Telegram Mini App · Marketplace",
    description: "A marketplace infrastructure project built inside the Telegram ecosystem. Covered the full product lifecycle — marketplace mechanics, deal flows, payment integration, and Telegram Mini App implementation. Paused due to limited resources and current priorities.",
    status: "Paused",
    tags: ["Telegram Mini App", "Marketplace", "Product Design", "Payments"],
  },
  {
    num: "02",
    title: "Content Distribution Systems",
    category: "Automation",
    description: "A set of automation tools for cross-platform content distribution. Covers YouTube and TikTok publishing pipelines, workflow automation, repetitive task reduction, and internal tooling for scalable content operations.",
    status: "Ongoing",
    tags: ["YouTube", "TikTok", "Pipelines", "Automation", "Internal Tools"],
  },
  {
    num: "03",
    title: "AI Tooling Experiments",
    category: "Internal Tools",
    description: "A growing collection of AI-assisted tools, automations, and workflow experiments focused on productivity and faster decision-making. Built for personal use and ongoing exploration.",
    status: "Ongoing",
    tags: ["AI", "Productivity", "Workflow", "Experimentation"],
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
          background: hov ? t.surfaceHover : t.surface,
          border: `1px solid ${hov ? t.borderHover : t.border}`,
          borderRadius: "10px",
          padding: "32px",
          transition: "all 0.22s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.08em" }}>Project {num}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: ongoing ? "#22c55e" : t.muted, display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.05em" }}>{status}</span>
          </div>
        </div>

        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, letterSpacing: "-0.025em", color: t.text, margin: "0 0 6px" }}>
          {title}
        </h3>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.accent, letterSpacing: "0.06em", display: "block", marginBottom: "16px" }}>
          {category}
        </span>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: t.sub, lineHeight: 1.75, margin: "0 0 20px" }}>
          {description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: t.muted, background: "rgba(255,255,255,0.03)", border: `1px solid ${t.border}`, borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.04em" }}>
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
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "14px" }}>
            Selected Projects
          </span>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", color: t.text, margin: 0 }}>
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
  { title: "Telegram Ecosystem", icon: "✦", desc: "Building Mini Apps, bots, marketplaces, and tools inside Telegram. Most of my recent product work lives here." },
  { title: "Automation", icon: "◈", desc: "Designing workflows and reducing repetitive work through automation. Finding the right abstraction to handle recurring tasks." },
  { title: "Financial Analytics", icon: "◇", desc: "Using Python and data analysis to understand markets and businesses. Unit economics, financial modeling, signal extraction." },
  { title: "AI-Assisted Development", icon: "◉", desc: "Building products faster using AI as a development tool — not a gimmick. Integrating AI into real workflows and systems." },
];

const CurrentFocus = () => (
  <section id="focus" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <div style={{ marginBottom: "48px" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "14px" }}>
            Current Focus
          </span>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", color: t.text, margin: 0 }}>
            What I'm working on right now.
          </h2>
        </div>
      </Reveal>
      <div className="focus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: t.border, borderRadius: "10px", overflow: "hidden" }}>
        {focusCards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ background: t.surfaceHover }}
              style={{ background: t.surface, padding: "28px 24px", minHeight: "160px", transition: "background 0.2s" }}
            >
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "16px", color: t.accent, display: "block", marginBottom: "12px" }}>{c.icon}</span>
              <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "15px", fontWeight: 600, color: t.text, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{c.title}</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: t.muted, lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── CURRENTLY EXPLORING ─────────────────────────────────────────────────────
const exploringItems = [
  { title: "Product Development", desc: "Turning messy problems into something that works. Covering design, logic, iteration, and shipping." },
  { title: "Telegram Mini Apps", desc: "Exploring what's possible inside Telegram's growing ecosystem for products and marketplaces." },
  { title: "Business Operations", desc: "How things actually run inside organizations — process design, tooling, and operational efficiency." },
  { title: "Automation Systems", desc: "Replacing manual repetition with reliable systems. More output, less overhead." },
  { title: "Startup Ecosystems", desc: "How companies form, iterate, and grow. Early-stage patterns, product-market fit, and venture dynamics." },
  { title: "Systems Thinking", desc: "Modeling complex situations to find leverage points. Thinking in loops rather than lines." },
];

const Exploring = () => (
  <section id="exploring" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <Reveal>
        <div style={{ marginBottom: "48px" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "14px" }}>
            Currently Exploring
          </span>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", color: t.text, margin: 0 }}>
            Topics I keep coming back to.
          </h2>
        </div>
      </Reveal>
      <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: t.border, borderRadius: "10px", overflow: "hidden" }}>
        {exploringItems.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <motion.div
              whileHover={{ background: t.surfaceHover }}
              style={{ background: t.surface, padding: "24px 22px", transition: "background 0.2s" }}
            >
              <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "14px", fontWeight: 600, color: t.text, margin: "0 0 7px", letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: t.muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── CONTACT ─────────────────────────────────────────────────────────────────
const contactLinks = [
  { label: "Telegram", handle: "@ovraik", href: "https://t.me/ovraik" },
  { label: "GitHub", handle: "github.com/ovraik", href: "https://github.com/ovraik" },
  { label: "LinkedIn", handle: "linkedin.com/in/ovraik", href: "#" },
  { label: "Email", handle: "hello@ovraik.com", href: "mailto:hello@ovraik.com" },
];

const Contact = () => (
  <section id="contact" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
    <Divider />
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }}>
        <Reveal>
          <div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "24px" }}>
              Contact
            </span>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: t.text, margin: "0 0 16px", lineHeight: 1.1 }}>
              Let's talk.
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: t.sub, lineHeight: 1.7, margin: 0 }}>
              Reach out if you have a project idea, want to collaborate, or just want to connect.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "4px" }}>
            {contactLinks.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: "7px",
                  border: "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.surface; e.currentTarget.style.borderColor = t.border; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted, minWidth: "60px" }}>{l.label}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: t.text }}>{l.handle}</span>
                </div>
                <span style={{ color: t.muted, fontSize: "14px" }}>↗</span>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div style={{ marginTop: "72px", paddingTop: "24px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted }}>Alexey Raikov · Ovraik · 2026</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: t.muted }}>Belarus / Remote</span>
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
    <div style={{ background: t.bg, minHeight: "100vh", position: "relative", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body, a { cursor: none !important; }
        ::selection { background: rgba(59,130,246,0.2); color: #E2E5EC; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

        /* Responsive nav */
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }

        /* About 2-col → 1-col */
        @media (max-width: 720px) {
          .about-grid    { grid-template-columns: 1fr !important; gap: 28px !important; }
          .contact-grid  { grid-template-columns: 1fr !important; gap: 40px !important; }
          .focus-grid    { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .focus-grid    { grid-template-columns: 1fr !important; }
          .explore-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Grain />
      <Grid />
      <Cursor />
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
