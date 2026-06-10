import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import BusinessCard from "./BusinessCard";
// ─── TOKENS ──────────────────────────────────────────────────────────────────
const tk = {
bg: "#090C10",
surface: "#0E1218",
surfaceHov: "#131820",
border: "rgba(255,255,255,0.07)",
borderHov: "rgba(255,255,255,0.13)",
text: "#E2E5EC",
muted: "#4E5666",
sub: "#7C8592",
accent: "#3B82F6",
};
// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => {
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: "-32px" });
return (
<motion.div ref={ref}
initial={{ opacity: 0 }}
animate={inView ? { opacity: 1 } : {}}
transition={{ duration: 0.45, delay, ease: "easeOut" }}
>{children}</motion.div>
);
};
const Divider = () => (
<div style={{ height: "1px", background: tk.border, margin: "0 auto", maxWidth: "960px" }}
);
// ─── GRAIN ───────────────────────────────────────────────────────────────────
// FIX: added transform + willChange to put grain on its own GPU layer (stops repaint jitter
const Grain = () => (
<svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "n
<filter id="g">
<feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stit
<feColorMatrix type="saturate" values="0" />
</filter>
<rect width="100%" height="100%" filter="url(#g)" />
</svg>
);
// ─── GRID ─────────────────────────────────────────────────────────────────────
// FIX: same GPU layer fix as Grain
const Grid = () => (
<div style={{
position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
backgroundSize: "72px 72px",
transform: "translateZ(0)", willChange: "transform",
}} />
);
// ─── NAV ─────────────────────────────────────────────────────────────────────
const navLinks = [
{ label: "About", id: "about" },
{ label: "Projects", id: "projects" },
{ label: "Focus", id: "focus" },
{ label: "Contact", id: "contact" },
];
const Nav = ({ active }) => {
const [scrolled, setScrolled] = useState(false);
const [open, setOpen] = useState(false);
useEffect(() => {
const h = () => setScrolled(window.scrollY > 32);
window.addEventListener("scroll", h);
return () => window.removeEventListener("scroll", h);
}, []);
return (
<motion.nav
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
style={{
position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
background: scrolled ? "rgba(9,12,16,0.9)" : "transparent",
backdropFilter: scrolled ? "blur(16px)" : "none",
borderBottom: scrolled ? `1px solid ${tk.border}` : "1px solid transparent",
transition: "all 0.35s ease",
>
}}
<div style={{
padding: "0 40px",
height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between
}}>
<a href="#" style={{ textDecoration: "none" }}>
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: tk.sub,
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
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.sub,
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
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] }
// FIX: disable parallax and fadeOut on mobile — prevents scroll jitter on iOS
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const yParallax = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 60]);
const fadeOut = useTransform(scrollYProgress, [0.4, 1], isMobile ? [1, 1] : [1, 0]);
return (
<section ref={ref} id="hero" style={{
position: "relative", minHeight: "100vh",
display: "flex", alignItems: "center",
padding: "0 40px", overflow: "hidden",
}}>
<motion.div
style={{ y: yParallax, opacity: fadeOut, width: "100%", position: "relative", zIndex:
className="hero-inner"
>
{/* Two-column layout: left = text, right = card */}
<div className="hero-layout">
{/* LEFT: hero text */}
<div className="hero-text">
<motion.h1
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
style={{
fontFamily: "'Bricolage Grotesque',sans-serif",
fontSize: "clamp(38px, 5.5vw, 72px)",
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
I build products, automate workflows, and design systems that solve real proble
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
onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.
onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.sty
>
View Projects
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
<path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" </svg>
</a>
<a href="#contact" style={{
display: "inline-flex", alignItems: "center",
padding: "10px 20px", background: "transparent", color: tk.sub,
border: `1px solid ${tk.border}`, borderRadius: "7px",
fontFamily: "'DM Mono',monospace", fontSize: "12px",
letterSpacing: "0.02em", textDecoration: "none",
transition: "border-color 0.2s, color 0.2s",
stroke
}}
e.curr
onMouseEnter={e => { e.currentTarget.style.borderColor = tk.borderHov; onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.current
>
Get In Touch
</a>
</motion.div>
</div>
{/* RIGHT: business card (desktop only — on mobile it goes below via CSS) */}
<motion.div
className="hero-card-desktop"
initial={{ opacity: 0, x: 24 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
>
<BusinessCard />
</motion.div>
</div>
{/* MOBILE: card below hero text, above About */}
<motion.div
className="hero-card-mobile"
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.65, duration: 0.6 }}
style={{ display: "none" }}
>
<BusinessCard />
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
<div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", g
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
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub,
I build products, automation systems, and tools. Most of my time goes into taki
</p>
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub,
I'm also a student at BNTU, but most of what I know came from building things,
</p>
</div>
</Reveal>
<Reveal delay={0.16}>
<div>
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub,
I've built marketplace products, automation systems, content distribution tools
</p>
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub,
What I care about: solving real problems, building systems that scale, and lear
</p>
<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
{["Product Development", "Automation", "Business Operations", "Analytics", "Sys
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
description: "Telegram Mini App marketplace connecting buyers and sellers. Built the full
status: "Paused",
tags: ["Product Design", "Marketplace", "Mini App", "Payments", "MVP"],
caseStudyLink: "/fishka",
},
{
num: "02",
title: "Content Distribution System",
category: "Automation",
description: "Automation system for multi-platform content publishing. Handles formatting
status: "Ongoing",
tags: ["Automation", "YouTube", "TikTok", "Publishing", "Workflow Design"],
},
{
num: "03",
title: "AI Workflow Experiments",
category: "Internal Tools",
description: "Collection of AI-powered tools for productivity. Automates drafting, status: "Ongoing",
tags: ["AI", "Internal Tools", "Automation", "Productivity"],
resear
},
];
const ProjectCard = ({ num, title, category, description, status, tags, delay, caseStudyLink
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
tk.mut
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-sta
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted
Project {num}
</span>
<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
<span style={{
width: "5px", height: "5px", borderRadius: "50%",
background: ongoing ? "#22c55e" : tk.muted,
display: "inline-block",
}} />
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: {status}
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
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.sub, line
{description}
</p>
<div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: caseStudyL
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
{caseStudyLink && (
<Link to={caseStudyLink} style={{
display: "inline-flex", alignItems: "center", gap: "6px",
fontFamily: "'DM Mono',monospace", fontSize: "12px",
color: tk.accent, textDecoration: "none",
letterSpacing: "0.04em", marginTop: "12px",
transition: "opacity 0.2s",
}}
onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
onMouseLeave={e => e.currentTarget.style.opacity = "1"}
>
View Case Study
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
<path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLine
</svg>
</Link>
)}
</motion.div>
</Reveal>
);
};
const Projects = () => (
<section id="projects" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1
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
icon: "\u2726",
desc: "Taking ideas from zero to a working product. I'm interested in the full arc — iden
},
{
title: "Business Operations",
icon: "\u25c8",
desc: "How things actually run inside organizations. Process design, operational workflow
},
{
title: "Analytics & Decision Making",
icon: "\u25c7",
desc: "Using data to understand problems and make better decisions. Working with Python,
},
{
title: "Automation",
icon: "\u25c9",
desc: "Building systems that handle recurring tasks reliably. The goal is always the same
},
];
const CurrentFocus = () => (
<section id="focus" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}
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
gap: "12px",
}}>
{focusCards.map((c, i) => (
<Reveal key={c.title} delay={i * 0.07}>
<motion.div
whileHover={{ background: tk.surfaceHov }}
style={{ background: tk.surface, padding: "28px 24px", height: "100%", minHeigh
>
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "16px", color: tk.a
{c.icon}
</span>
<h3 style={{
fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "15px",
fontWeight: 600, color: tk.text, margin: "0 0 8px", letterSpacing: "-0.01em",
}}>
{c.title}
</h3>
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: {c.desc}
</p>
</motion.div>
</Reveal>
tk.mut
))}
</div>
</div>
</section>
);
// ─── CURRENTLY EXPLORING ─────────────────────────────────────────────────────
const exploringItems = [
{
title: "Product Development",
desc: "Turning messy, undefined problems into structured products. Design, iteration, and
},
{
title: "Business Operations",
desc: "How teams and processes actually function at scale. Where things break, where they
},
{
title: "Automation",
desc: "Replacing manual, repetitive work with systems that run reliably. The goal is leve
},
{
title: "Startup Dynamics",
desc: "How early-stage companies form, make decisions, and find traction. I'm interested
},
{
title: "Systems Thinking",
desc: "Modeling how things are connected. Finding leverage points instead of just treatin
},
{
title: "Financial Analysis",
desc: "Using data and analytical tools to understand businesses and markets. How numbers
},
];
const Exploring = () => (
<section id="exploring" style={{ padding: "80px 24px 100px", position: "relative", zIndex:
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
style={{ background: tk.surface, padding: "24px 22px", transition: "background
>
<h3 style={{
fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "14px",
fontWeight: 600, color: tk.text, margin: "0 0 7px", letterSpacing: "-0.01em",
}}>
{item.title}
</h3>
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: {item.desc}
</p>
</motion.div>
</Reveal>
tk.mut
))}
</div>
</div>
</section>
);
// ─── CONTACT ─────────────────────────────────────────────────────────────────
const ArrowIcon = ({ style }) => (
<svg
width="14" height="14" viewBox="0 0 14 14"
fill="none" xmlns="http://www.w3.org/2000/svg"
style={style}
>
</svg>
<path d="M2.5 11.5L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" stroke
);
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
<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.text }
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
const LinkedInRow = () => {
const [hovered, setHovered] = useState(false);
const profileUrl = "https://www.linkedin.com/in/alexey-raikov-20224228a";
const appUrl = "linkedin://in/alexey-raikov-20224228a";
const handleOpenApp = (e) => {
e.preventDefault();
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
<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
<span style={{
fontFamily: "'DM Mono',monospace", fontSize: "11px",
color: tk.muted, minWidth: "64px", letterSpacing: "0.04em",
}}>
LinkedIn
</span>
<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: tk.text }
Alexey Raikov
</span>
</div>
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
<section id="contact" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1
<Divider />
<div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
<div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
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
<p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub,
Open to interesting projects, collaborations, or just a good conversation. Reac
</p>
</div>
</Reveal>
<Reveal delay={0.1}>
<div style={{ display: "flex", flexDirection: "column", paddingTop: "4px" }}>
<ContactRow label="Telegram" handle="@ovraik" href="https://t.me/ovraik" />
<LinkedInRow />
<ContactRow label="Email" handle="ovraikin@gmail.com" href="mailto:ovraikin@gmail
</div>
</Reveal>
</div>
<Reveal delay={0.15}>
<div style={{
marginTop: "72px", paddingTop: "24px",
borderTop: `1px solid ${tk.border}`,
display: "flex", justifyContent: "space-between",
flexWrap: "wrap", gap: "12px",
}}>
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted
Alexey Raikov · Ovraik · 2026
</span>
<span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: tk.muted
Remote
</span>
</div>
</Reveal>
</div>
</section>
);
// ─── APP ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
const [active, setActive] = useState("hero");
const location = useLocation();
useEffect(() => {
if (location.state?.scrollTo) {
const el = document.getElementById(location.state.scrollTo);
if (el) {
setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
}
window.history.replaceState({}, "");
}
}, []);
useEffect(() => {
const obs = new IntersectionObserver(
(entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
{ threshold: 0.35 }
);
document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
return () => obs.disconnect();
}, []);
useEffect(() => {
const blockCtx = e => e.preventDefault();
const blockKeys = e => {
const k = e.key;
if (k === "F12") { e.preventDefault(); return; }
if (e.ctrlKey || e.metaKey) {
if (["c","C","x","X","s","S","u","U","a","A"].includes(k)) { e.preventDefault(); retu
if (e.shiftKey && ["i","I","j","J","c","C"].includes(k)) { e.preventDefault(); return
}
};
const blockDrag = e => e.preventDefault();
document.addEventListener("contextmenu", blockCtx);
document.addEventListener("keydown", blockKeys);
document.addEventListener("dragstart", blockDrag, { passive: true });
return () => {
document.removeEventListener("contextmenu", blockCtx);
document.removeEventListener("keydown", blockKeys);
document.removeEventListener("dragstart", blockDrag, { passive: true });
};
}, []);
return (
<div style={{ background: tk.bg, minHeight: "100vh", position: "relative", overflowX: "hi
<style>{`
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; overflow-y: auto; height: auto; }
html { scroll-behavior: smooth; touch-action: pan-y; overscroll-behavior: none; }
body { touch-action: pan-y; overscroll-behavior-y: auto; }
html, body, p, h1, h2, h3, h4, h5, h6, span, div {
-webkit-tap-highlight-color: transparent;
}
a, button, input, textarea { user-select: auto; -webkit-user-select: auto; }
img {
user-select: none;
-webkit-user-select: none;
-webkit-user-drag: none;
pointer-events: none;
}
a img, button img { pointer-events: auto; }
::selection { background: transparent; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: @media (max-width: 640px) {
.nav-desktop { display: none !important; }
.nav-mobile { display: flex !important; }
2px; }
}
.hero-layout {
display: flex;
align-items: center;
gap: 40px;
width: 100%;
max-width: 1400px;
margin: 0 auto;
}
.hero-text {
flex: 1;
min-width: 0;
max-width: 520px;
}
.hero-card-desktop {
flex: 1;
display: flex;
align-items: center;
justify-content: center;
min-width: 0;
}
.hero-card-mobile {
display: none !important;
@media (max-width: 1280px) {
.hero-card-desktop { width: 660px; }
}
}
@media (max-width: 1080px) {
.hero-card-desktop { width: 560px; }
}
@media (max-width: 900px) {
.hero-layout { flex-direction: column; align-items: flex-start; gap: 0; max-width:
.hero-card-desktop { display: none !important; }
.hero-card-mobile { display: flex !important; width: 100%; max-width: 100%; margin:
}
@media (max-width: 720px) {
.about-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
.contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
.focus-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 480px) {
.focus-grid { grid-template-columns: 1fr !important; }
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
{/* Hidden SEO section for search engines */}
<section style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px",
<h2>About Alexey Raikov (Ovraik)</h2>
<p>
</p>
<p>
</p>
<p>
</p>
</section>
</main>
</div>
Alexey Raikov, also known as Ovraik, is a product builder and automation develope
Specializing in Telegram Mini Apps development, AI workflows, and automation syst
Creator of Fishka, a Telegram Mini App marketplace for streetwear resellers and i
Skills include product development, marketplace design, automation systems, AI-po
internal tooling, and distribution systems. Based in Belarus, working remotely on
and automation solutions.
Projects: Fishka Telegram Mini App, Content Distribution System, AI Workflow Expe
Focus areas: Telegram ecosystem, product development, business operations, analyt
);
}
