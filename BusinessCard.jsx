import { useState } from "react";

// ─── TOKEN PALETTE ────────────────────────────────────────────────────────────
const C = {
  bg:      "#0B0F16",
  surface: "#0E1218",
  border:  "rgba(255,255,255,0.08)",
  borderB: "rgba(255,255,255,0.05)",
  text:    "#E2E5EC",
  muted:   "#4E5666",
  sub:     "#7C8592",
  accent:  "#3B82F6",
  green:   "#22c55e",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
  .bc-scene {
    perspective: 1000px;
    width: 100%;
    height: 100%;
  }
  .bc-card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .bc-card.flipped {
    transform: rotateY(180deg);
  }
  .bc-face {
    position: absolute;
    inset: 0;
    border-radius: 13px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .bc-face-front {
    transform: rotateY(0deg);
  }
  .bc-face-back {
    transform: rotateY(180deg);
  }
  .bc-scene:hover .bc-face {
    border-color: rgba(255,255,255,0.13);
    box-shadow: 0 8px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.07) inset;
  }
`;

// ─── ARROW ────────────────────────────────────────────────────────────────────
const Arrow = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
    style={{ display: "inline", verticalAlign: "middle", marginLeft: "3px", flexShrink: 0 }}>
    <path d="M1.5 7.5L7 2M7 2H3M7 2V6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── CONTACT LINK ─────────────────────────────────────────────────────────────
const ContactLink = ({ label, href }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? "_self" : "_blank"}
    rel="noopener noreferrer"
    style={{
      display: "inline-flex", alignItems: "center",
      fontFamily: "'DM Mono', monospace", fontSize: "11px",
      color: C.sub, textDecoration: "none",
      lineHeight: 1, whiteSpace: "nowrap",
      transition: "color 0.15s",
    }}
    onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
    onMouseLeave={e => { e.currentTarget.style.color = C.sub;  }}
  >
    {label}<Arrow />
  </a>
);

// ─── FLIP BUTTON ──────────────────────────────────────────────────────────────
const FlipBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent", border: "none",
      cursor: "pointer", display: "inline-flex",
      alignItems: "center", gap: "4px",
      padding: "4px 0",
    }}
  >
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1 8L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: "10px",
      color: C.muted, letterSpacing: "0.05em",
      pointerEvents: "none", userSelect: "none",
    }}>Tap to flip</span>
  </button>
);

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ src }) => (
  <div style={{
    flexShrink: 0, width: "100px", height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1c2d4a 0%, #0f1a2e 100%)",
    border: "1px solid rgba(59,130,246,0.22)",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.05)",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    marginTop: "2px",
  }}>
    {src
      ? <img
          src={src}
          alt="Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          onError={e => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
      : null
    }
    <span style={{
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontSize: "21px", fontWeight: 700,
      color: "rgba(180,200,230,0.7)",
      letterSpacing: "-0.01em", userSelect: "none",
      display: src ? "none" : "flex",
    }}>AR</span>
  </div>
);

// ─── FRONT FACE ───────────────────────────────────────────────────────────────
const Front = ({ onFlip, avatarSrc }) => (
  <div
    className="bc-face bc-face-front"
    style={{
      background: "linear-gradient(155deg, #0E1320 0%, #0B0F16 55%, #090C12 100%)",
      border: `1px solid ${C.border}`,
      boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
      padding: "18px 20px 16px 20px",
      display: "flex", flexDirection: "row", gap: "0",
      overflow: "hidden",
    }}
  >
    {/* Акцент сверху */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "1px",
      background: "linear-gradient(90deg, transparent 5%, rgba(59,130,246,0.28) 40%, rgba(59,130,246,0.28) 60%, transparent 95%)",
    }} />

    {/* Подпись — левый нижний угол */}
    <span style={{
      position: "absolute", bottom: "14px", left: "20px",
      fontFamily: "'DM Mono', monospace", fontSize: "9px",
      color: "rgba(78,86,102,0.35)", letterSpacing: "0.06em",
      pointerEvents: "none", userSelect: "none",
    }}>ovraik · 2026</span>

    {/* ══ ЛЕВАЯ КОЛОНКА ~60% ══ */}
    <div style={{
      width: "60%", display: "flex", flexDirection: "row",
      alignItems: "flex-start", gap: "14px", flexShrink: 0,
    }}>
      <Avatar src={avatarSrc} />

      {/* Текстовый блок */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0", minWidth: 0 }}>
        {/* 1. Имя */}
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px", fontWeight: 700,
          color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1,
          marginBottom: "3px",
        }}>Alexey Raikov</div>

        {/* 2. Фраза */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11.5px", color: C.sub,
          lineHeight: 1.35, marginBottom: "10px",
        }}>Building products and systems.</div>

        {/* 3. Статус */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: C.green, flexShrink: 0,
            boxShadow: `0 0 5px ${C.green}55`,
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "10px",
            color: "rgba(34,197,94,0.5)", letterSpacing: "0.03em",
          }}>Open to Opportunities</span>
        </div>

        {/* 4. Роли */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["Builder", "Operator"].map(r => (
            <span key={r} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "10px",
              color: C.muted, border: `1px solid rgba(255,255,255,0.07)`,
              borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.04em",
            }}>{r}</span>
          ))}
        </div>
      </div>
    </div>

    {/* Вертикальный разделитель */}
    <div style={{
      width: "1px", alignSelf: "stretch",
      background: "rgba(255,255,255,0.05)",
      margin: "0 18px", flexShrink: 0,
    }} />

    {/* ══ ПРАВАЯ КОЛОНКА ~40% ══ */}
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      justifyContent: "space-between", minWidth: 0,
    }}>
      {/* 5. Контакты — по центру колонки */}
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", paddingTop: "2px" }}>
        <ContactLink label="Telegram" href="https://t.me/ovraik" />
        <ContactLink label="LinkedIn" href="https://www.linkedin.com/in/alexey-raikov-20224228a" />
        <ContactLink label="Email"    href="mailto:ovraikin@gmail.com" />
      </div>

    </div>

    {/* Flip — абсолютно правый нижний угол, как на Back */}
    <div style={{ position: "absolute", bottom: "16px", right: "20px" }}>
      <FlipBtn onClick={onFlip} />
    </div>
  </div>
);

// ─── BACK FACE ────────────────────────────────────────────────────────────────
const Back = ({ onFlip }) => (
  <div
    className="bc-face bc-face-back"
    style={{
      background: "linear-gradient(145deg, #0D1219 0%, #0B0F16 60%, #0A0D13 100%)",
      border: `1px solid ${C.border}`,
      boxShadow: "0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    {/* Тонкая полоска-акцент сверху */}
    <div style={{
      position: "absolute", top: 0, left: "20px", right: "20px", height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.35), transparent)",
    }} />

    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "19px",
      color: "rgba(226,229,236,0.75)",
      letterSpacing: "0.05em",
      textShadow: `0 0 32px rgba(59,130,246,0.22)`,
    }}>Have a good day ;)</span>

    <div style={{ position: "absolute", bottom: "16px", right: "20px" }}>
      <FlipBtn onClick={onFlip} />
    </div>
  </div>
);

// ─── BUSINESS CARD ────────────────────────────────────────────────────────────
export default function BusinessCard({ style = {} }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(f => !f);

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="bc-scene"
        style={{
          width: "100%", maxWidth: "590px", height: "210px",
          ...style,
        }}
      >
        <div className={`bc-card ${flipped ? "flipped" : ""}`}>
          <Front onFlip={handleFlip} avatarSrc="/ovraik.jpg" />
          <Back onFlip={handleFlip} />
        </div>
      </div>
    </>
  );
}
