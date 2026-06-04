import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  <div style={{ height: "1px", background: tk.border, margin: "0 auto", maxWidth: "800px" }} />
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

// ─── GRID ────────────────────────────────────────────────────────────────────
const Grid = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
    backgroundSize: "72px 72px",
  }} />
);

// ─── CASE STUDY ──────────────────────────────────────────────────────────────
export default function FishkaCaseStudy() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(59,130,246,0.2); color: #E2E5EC; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }
      `}</style>

      <Grain />
      <Grid />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(9,12,16,0.9)", backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${tk.border}`,
        }}
      >
        <div style={{ padding: "0 40px", height: "52px", display: "flex", alignItems: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              fontFamily: "'DM Mono',monospace", fontSize: "12px",
              color: tk.sub, letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = tk.text}
            onMouseLeave={e => e.currentTarget.style.color = tk.sub}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M3 7L7 3M3 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Portfolio
          </button>
        </div>
      </motion.div>

      <main style={{ position: "relative", zIndex: 1, paddingTop: "52px" }}>
        {/* Hero */}
        <section ref={ref} style={{ padding: "120px 40px 80px", position: "relative" }}>
          <motion.div style={{ y: yParallax, opacity: fadeOut, maxWidth: "800px", margin: "0 auto" }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", marginBottom: "24px",
              }}
            >
              Case Study
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(42px, 6vw, 64px)",
                fontWeight: 700, lineHeight: 1.08,
                letterSpacing: "-0.035em", color: tk.text,
                margin: "0 0 28px",
              }}
            >
              Fishka
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: tk.sub, lineHeight: 1.7,
                maxWidth: "640px", margin: 0,
              }}
            >
              A Telegram Mini App marketplace for streetwear resellers and independent brands. Built, shipped, and paused. A retrospective on what worked, what didn't, and what I learned.
            </motion.p>
          </motion.div>
        </section>

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 40px 100px" }}>
          <Divider />

          {/* Problem */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                Problem
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                Fragmented marketplace activity across Telegram chats
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                Streetwear resellers and independent brands in CIS countries operate primarily through Telegram. Product discovery, communication, and transactions happen across dozens of unstructured group chats.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                Buyers scroll through chat histories to find products. Sellers repost the same items across multiple groups. There's no central place where supply and demand meet in a structured way.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                The opportunity was clear: build a dedicated marketplace inside Telegram where resellers and brands could list products, buyers could browse structured catalogs, and transactions could happen in one environment.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* Approach */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                Approach
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                Building inside the Telegram ecosystem
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                The decision to build a Telegram Mini App was deliberate. The target audience already lived in Telegram. Asking them to download a separate app would add friction. A Mini App meant zero install barrier and immediate access.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                I started by researching how resellers and brands actually operated. I joined relevant Telegram groups, observed how transactions happened, and identified pain points. The research phase took about two weeks.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                Once I understood the problem, I designed the product flows. The marketplace needed two sides: sellers listing products and buyers browsing catalogs. I sketched user flows, designed the interface, and mapped out the core features.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                Then I built it. Solo. The entire product — frontend, backend, payment integration, and Mini App implementation. The goal was to ship an MVP that worked, not to build a perfect product.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* What Was Built */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                What Was Built
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                A working marketplace MVP
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 24px" }}>
                The MVP included:
              </p>
              <ul style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "12px" }}>Seller accounts with product listing capabilities</li>
                <li style={{ marginBottom: "12px" }}>Buyer browsing with category filters and search</li>
                <li style={{ marginBottom: "12px" }}>Product pages with images, descriptions, and pricing</li>
                <li style={{ marginBottom: "12px" }}>Payment integration for transactions</li>
                <li style={{ marginBottom: "12px" }}>Order management and tracking</li>
                <li style={{ marginBottom: "12px" }}>Telegram authentication and user profiles</li>
              </ul>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                The product worked. Users could list items, browse catalogs, and complete purchases. The core marketplace loop was functional. It wasn't polished, but it was usable.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* Challenges */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                Challenges
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                The hard parts weren't technical
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                Building the product was the easy part. The hard part was everything that came after.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Marketplace liquidity.</strong> A marketplace needs both buyers and sellers. Getting the first sellers to list products was difficult because there were no buyers yet. Getting buyers was difficult because there were no products yet. Classic chicken-and-egg problem.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>User acquisition.</strong> Growing a marketplace requires constant outreach, community building, and marketing. As a solo builder, I had limited time and resources. I was still studying at university while building and trying to grow the product.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Operations.</strong> Running a marketplace means handling support, moderation, disputes, and trust issues. These operational tasks compound quickly and require dedicated attention.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                The product worked, but sustaining and growing it required resources I didn't have as a solo operator.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* Why It Was Paused */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                Why It Was Paused
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                Building is easier than sustaining
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                The project wasn't abandoned because of technical failure. The MVP was complete. The product worked.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                I paused development because maintaining and growing a marketplace requires operational resources that weren't available to me as a solo builder. User acquisition, community management, support, moderation — these tasks don't scale with code.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                I could have kept pushing, but the effort required to reach meaningful traction would have meant sacrificing other priorities. I made the decision to pause and move on to other projects.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* What I Learned */}
          <section style={{ paddingTop: "80px", marginBottom: "80px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                What I Learned
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                Lessons from building and pausing
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Marketplaces are hard.</strong> Two-sided platforms require solving for both supply and demand simultaneously. Liquidity is the hardest problem, not the technology.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Building is often easier than sustaining.</strong> Shipping an MVP is one thing. Growing it, maintaining it, and handling operations is another. Product development is just one part of the equation.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Solo building has limits.</strong> You can build a product alone, but scaling it often requires a team. Some problems can't be solved with more code.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                <strong style={{ color: tk.text }}>Execution matters more than ideas.</strong> The idea for Fishka wasn't unique. What mattered was actually building it, shipping it, and learning from the process.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: tk.text }}>Knowing when to pause is important.</strong> Not every project needs to become a business. Sometimes the value is in what you learn, not what you scale.
              </p>
            </Reveal>
          </section>

          <Divider />

          {/* Current Status */}
          <section style={{ paddingTop: "80px", marginBottom: "40px" }}>
            <Reveal>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: "11px",
                color: tk.muted, letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: "24px",
              }}>
                Current Status
              </span>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: tk.text,
                margin: "0 0 24px", lineHeight: 1.2,
              }}>
                Paused, not abandoned
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: "0 0 16px" }}>
                The project is currently paused. The code exists. The MVP is complete. The infrastructure is there.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: tk.sub, lineHeight: 1.75, margin: 0 }}>
                I'm not actively working on it, but the lessons from building Fishka continue to inform how I approach product development, marketplace dynamics, and execution.
              </p>
            </Reveal>
          </section>
        </div>
      </main>
    </div>
  );
}
