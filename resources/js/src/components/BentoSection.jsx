import React, { useEffect, useRef, useState } from "react";
import CatAvatar from "./CatAvatar.jsx";
import { projects } from "../data/projects.js";
 
function Icon({ name }) {
  const common = {
    className: "social-ic",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  switch (name) {
    case "x":
      return (
        <svg {...common} fill="none">
          <path
            d="M18.9 2H22l-6.8 7.8L23 22h-6.8l-5.3-6.7L5 22H2l7.3-8.4L1 2h6.9l4.8 6.1L18.9 2Z"
            fill="currentColor"
          />
        </svg>
      );

    case "github":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 2C6.48 2 2 6.6 2 12.27c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.79.62-3.38-1.37-3.38-1.37-.46-1.18-1.12-1.49-1.12-1.49-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.89 1.58 2.34 1.12 2.91.86.09-.67.35-1.12.64-1.38-2.23-.26-4.57-1.14-4.57-5.09 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.33.1-2.78 0 0 .84-.27 2.75 1.06A9.2 9.2 0 0 1 12 7.13c.82 0 1.65.11 2.42.33 1.91-1.33 2.75-1.06 2.75-1.06.55 1.45.2 2.52.1 2.78.64.72 1.03 1.64 1.03 2.77 0 3.96-2.34 4.82-4.58 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49C19.14 20.65 22 16.8 22 12.27 22 6.6 17.52 2 12 2Z"
            fill="currentColor"
          />
        </svg>
      );

    case "instagram":
      return (
        <svg {...common} fill="none">
          <path
            d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4Z"
            fill="currentColor"
          />
          <path
            d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
            fill="currentColor"
          />
          <path
            d="M17.5 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
            fill="currentColor"
          />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...common} fill="none">
          <path
            d="M6.5 7.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM5 21V9h3v12H5Zm6 0V9h2.9v1.64h.04c.4-.75 1.4-1.54 2.9-1.54 3.1 0 3.7 2.05 3.7 4.7V21h-3v-6.1c0-1.46 0-3.33-2.03-3.33-2.04 0-2.35 1.6-2.35 3.23V21h-3Z"
            fill="currentColor"
          />
        </svg>
      );

    case "facebook":
      return (
        <svg {...common} fill="none">
          <g transform="scale(1.2) translate(-3 -3)">
            <path
              d="M13.5 22v-8h2.7l.4-3H13.5V9.2c0-.87.24-1.46 1.5-1.46h1.62V5.05c-.28-.04-1.25-.12-2.38-.12-2.36 0-3.98 1.44-3.98 4.08V11H8v3h2.26v8h3.24Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );

    case "telegram":
      return (
        <svg {...common} fill="none">
          <path
            d="M21.7 3.7 2.9 11.2c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.1.9.7.9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.2-15.1c.3-1.3-.5-1.9-1.7-1.4Zm-2.7 4.2-9 8.1-.3 3.1-1.5-4.8 12.1-7.6c.6-.4 1.1-.2.7.2Z"
            fill="currentColor"
          />
        </svg>
      );

    default:
      return null;
  }
}


function ProjectModal({ project, index, setIndex, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const shots =
    Array.isArray(project?.shots) && project.shots.length
      ? project.shots
      : [project?.preview].filter(Boolean);

  // lock scroll + keyboard shortcuts
  useEffect(() => {
    if (!project) return;

    // Ensure each open starts "fresh" (so close animation doesn't persist)
    setIsClosing(false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        // Keep close animation consistent for all close paths
        setIsClosing(true);
        window.setTimeout(() => onClose?.(), 220);
        return;
      }
      if (shots.length > 1 && e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % shots.length);
      }
      if (shots.length > 1 && e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + shots.length) % shots.length);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, shots.length, onClose, setIndex]);

  if (!project) return null;

  const safeIndex = Math.max(0, Math.min(index, Math.max(0, shots.length - 1)));
  const src = shots[safeIndex];

  // Frame aspect ratio (so the frame fits the current image — no letterboxing inside the frame)
  const [frameAR, setFrameAR] = useState(null);

  useEffect(() => {
    // reset whenever image changes
    setFrameAR(null);
  }, [src]);

  const requestClose = () => {
    // Play CSS close animation first, then unmount.
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => onClose?.(), 220);
  };

  return (
    <div
      className={`pModalOverlay ${isClosing ? "isClosing" : "isOpen"}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div className="pModalBackdrop" onClick={requestClose} />
      <div className="pModalCard" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="pModalTop">
          <div className="pModalHead">
            <div className="pModalKicker">PROJECT</div>
            <div className="pModalTitle">{project.title}</div>
            {project?.tags?.length ? (
              <div className="pModalTags">{project.tags.join(" • ")}</div>
            ) : null}
          </div>

          <button className="pModalClose" type="button" onClick={requestClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="pModalMain">
          <div className="pModalMedia">
            <div className="pModalFrame" style={frameAR ? { aspectRatio: frameAR, width: "100%", maxHeight: "100%" } : { width: "100%", maxHeight: "100%" }}>
              {src ? (
                <img
                  className="pModalImg"
                  src={src}
                  alt={`${project.title} screenshot ${safeIndex + 1}`}
                />
              ) : null}

              {shots.length > 1 ? (
                <div className="pModalNav" aria-hidden="true">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i - 1 + shots.length) % shots.length)}
                  >
                    ←
                  </button>
                  <div className="pModalCount">
                    {safeIndex + 1} / {shots.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i + 1) % shots.length)}
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pModalSide">
            {project?.blurb ? <div className="pModalBlurb">{project.blurb}</div> : null}

            {shots.length > 1 ? (
              <div className="pModalThumbs" aria-label="Project screenshots">
                {shots.map((s, i) => (
                  <button
                    key={`${project.id}-shot-${i}`}
                    type="button"
                    className={`pModalThumb ${i === safeIndex ? "isActive" : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={s} alt="" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="pModalActions">
              {project?.links?.live && project.links.live !== "#" ? (
                <a className="pModalLink" href={project.links.live} target="_blank" rel="noreferrer">
                  Live ↗
                </a>
              ) : null}
              {project?.links?.github && project.links.github !== "#" ? (
                <a className="pModalLink" href={project.links.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              ) : null}
            </div>

            <div className="pModalTip">Esc to close • ← → to switch</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BentoSection() {
  const socials = [
    { key: "x", label: "X", href: "https://x.com/kraven_314" },
    { key: "github", label: "GitHub", href: "https://github.com/nagisa314" },
    { key: "instagram", label: "Instagram", href: "https://instagram.com/kravennnnnnnn" },
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/kraven-añonuevo-b972b93a4/" },
    { key: "facebook", label: "Facebook", href: "https://www.facebook.com/kraven.anonuevo" },
    { key: "telegram", label: "Telegram", href: "https://t.me/chunchumaru" },
  ];

  // Use ONE email for both Grid I + Grid L
  const CONTACT_EMAIL = "sc.kraven.anonuevo@cvsu.edu.ph"; // TODO: replace with your email

  // Grid L: Copy email interaction
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = CONTACT_EMAIL;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(t);
  }, [copied]);

  // Grid I: Mini contact
  const [contactFrom, setContactFrom] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactState, setContactState] = useState("idle"); // idle | error | sending
  const [activeChip, setActiveChip] = useState(null); // ✅ FIXED: hook must be inside component

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

  const sendMiniContact = () => {
    const emailOk = isValidEmail(contactFrom);
    const msgOk = contactMsg.trim().length >= 3;

    if (!emailOk || !msgOk) {
      setContactState("error");
      return;
    }

    setContactState("sending");

    const subject = `Portfolio inquiry from ${contactFrom.trim()}`;
    const body =
      `From: ${contactFrom.trim()}\n\n` +
      `${contactMsg.trim()}\n\n` +
      `— sent from your portfolio`;

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => setContactState("idle"), 1200);
  };

  // Premium hover spotlight (follows cursor)
  useEffect(() => {
    const tiles = document.querySelectorAll(".bento2-tile");
    const onMove = (e) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    tiles.forEach((t) => t.addEventListener("mousemove", onMove));
    return () => tiles.forEach((t) => t.removeEventListener("mousemove", onMove));
  }, []);


// Grid H: click-to-open project modal
const gridProjects = Array.isArray(projects) ? projects : [];
const [modalProject, setModalProject] = useState(null);
const [modalShotIndex, setModalShotIndex] = useState(0);

// Grid H: micro "tap" animation before modal opens (no layout changes)
const [openingProjectId, setOpeningProjectId] = useState(null);
const [isOpeningProject, setIsOpeningProject] = useState(false);
const openTimerRef = useRef(null);

useEffect(() => {
  return () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  };
}, []);

const openProject = (p) => {
  if (!p) return;
  setModalProject(p);
  setModalShotIndex(0);
};

// Plays a tiny click animation on the row, then opens the modal.
// Keeps the design/layout intact — only a transient transform/flash.
const openProjectAnimated = (p) => {
  if (!p || isOpeningProject) return;

  setIsOpeningProject(true);
  setOpeningProjectId(p.id);

  // 150–180ms feels snappy but noticeable
  if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  openTimerRef.current = window.setTimeout(() => {
    setOpeningProjectId(null);
    setIsOpeningProject(false);
    // Open after the tiny tap animation finishes.
    openProject(p);
  }, 170);
};

const closeProject = () => {
  if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  openTimerRef.current = null;

  setOpeningProjectId(null);
  setIsOpeningProject(false);

  setModalProject(null);
  setModalShotIndex(0);
};


  return (
    <section id="bento" className="bento2-shell">
      <div className="bento2-grid">
        {/* GRID A — Intro */}
        <div className="bento2-tile a introTile">
          <div className="introHeader">Hi, I’m Kraven —</div>
          <div className="introBody">
            4th year IT student, currently practicing UI/UX and backend development using
            Laravel and React.
          </div>
        </div>
        

        {/* B — Image tile 1 */}
        <div className="bento2-tile b imgTile">
          <div className="imgMock img1" aria-hidden="true" />
          <img src="/image/download (2).jpg" alt="Project preview" className="img1" />
        </div>

        {/* C — Image tile 2 */}
        <div className="bento2-tile c imgTile">
          <div className="imgMock img2" aria-hidden="true" />
          <img
            src="/image/f4f2589d-cb9d-4a7c-8382-0bfd4db6b31d.jpg"
            alt="Project preview"
            className="img2"
          />
        </div>

        {/* D — Socials cluster */}
        <div className="d">
          <div className="bento2-socials-float" aria-label="Social links">
            {socials.map((s) => (
              <a
                key={s.key}
                className="social-btn"
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name={s.key} />
              </a>
            ))}
          </div>
        </div>

        {/* E — Cat tile */}
        <div className="bento2-tile e catTile">
          <div className="catCenter">
            <CatAvatar size={320} trackId="bento" />
          </div>
          
        </div>

        {/* F — About */}
        <div className="bento2-tile f aboutTile">
          <div className="aboutKicker">ABOUT</div>
          <div className="aboutText">
            I like making elegant, minimal interfaces — and hunting for cat cafés and
            cozy coffee shops.
          </div>
          <div className="corner-cta" aria-hidden="true">❤</div>
        </div>

        {/* G — Laptop image tile */}
        <div className="bento2-tile g imgTile">
          <div className="imgMock img4" aria-hidden="true" />
          <img
            src="/image/970affc5-3a54-4c45-b8d8-3feda79b94e0.jpg"
            alt="Project preview"
            className="img4"
          />
        </div>

        {/* H — Projects */}
        <div className="bento2-tile h resources resourcesHover" aria-label="Projects">
          <div className="resourcesHead">
            <div className="kicker">PROJECTS</div>
          </div>

          
<div className="resourcesListHover" role="list">
  {gridProjects.map((p) => (
    <a
      key={p.id}
      href="#projects"
      className={`resRow ${openingProjectId === p.id ? "isOpening" : ""}`}
      role="listitem"
      aria-label={p.title}
      onClick={(e) => {
        e.preventDefault();
        openProjectAnimated(p);
      }}
    >
      <span className="resRowTitle">{p.title}</span>
      <span className="resFloat" aria-hidden="true">
        <img src={p.preview} alt="" loading="lazy" />
      </span>
    </a>
  ))}
</div>

<div className="resourcesHint">Hover a title to preview • Click to open</div>
        </div>

        {/* I — Mini Contact */}
        <div className={`bento2-tile i miniContact ${contactState === "error" ? "isError" : ""}`}>
          <div className="miniContactTop">
            <div className="miniContactKicker">SEND A QUICK MESSAGE</div>
            

            <div className="miniContactChips" aria-label="Quick templates">
              {[
                {
                  label: "Hire",
                  preset:
                    "Hi Kraven — I’d like to hire you for a project.\nTimeline:\nBudget:\nDetails:",
                },
                {
                  label: "Collab",
                  preset: "Hey Kraven — want to collaborate?\nIdea:\nYour role:\nTimeline:",
                },
                {
                  label: "Question",
                  preset: "Hi Kraven — quick question about: ",
                },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className={`miniChip ${activeChip === chip.label ? "isActive" : ""}`}
                  onClick={() => {
                    setActiveChip(chip.label);
                    setContactMsg(chip.preset);
                    if (contactState !== "idle") setContactState("idle");
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="miniContactField">
            <textarea
              className="miniContactTextarea"
              placeholder="Tell me about your project…"
              value={contactMsg}
              onChange={(e) => {
                setContactMsg(e.target.value);
                if (contactState !== "idle") setContactState("idle");
              }}
              rows={1}
            />

            <div className="miniContactMeta" aria-hidden="true">
              <span className="miniCount">{Math.min(contactMsg.length, 500)}/500</span>
            </div>
          </div>

          <div className="miniContactRow">
            <input
              className="miniContactInput"
              placeholder="Your email"
              value={contactFrom}
              onChange={(e) => {
                setContactFrom(e.target.value);
                if (contactState !== "idle") setContactState("idle");
              }}
              inputMode="email"
              autoComplete="email"
            />

            <button
              className={`btn2 miniContactBtn ${contactState === "sending" ? "isCopied" : ""}`}
              type="button"
              onClick={sendMiniContact}
              disabled={!(isValidEmail(contactFrom) && contactMsg.trim().length >= 3)}
            >
              {contactState === "sending" ? "Opening…" : "Send ↗"}
            </button>
          </div>
        </div>

        {/* J — Stack */}
        <div className="bento2-tile j stackTile">
          <div className="stackTitle">Stack I use</div>
          <div className="stackIcons">
            <a className="stackIcon"  aria-label="React">
              <img src="/react.png" alt="" />
            </a>
            <a className="stackIcon"  aria-label="Laravel">
              <img src="/image/Laravel.png" alt="" />
            </a>
            <a className="stackIcon"  aria-label="Css">
              <img src="/image/css-3.svg" alt="" />
            </a>
            <a className="stackIcon"  aria-label="js">
              <img src="/image/Figma-logo.svg-removebg-preview.png" alt="" />
            </a>
          </div>
        </div>

        {/* K — Theme toggle */}
        <div className="bento2-tile k">
          <div className="kCenter">
            <button
              type="button"
              className={`themePill ${
                document.documentElement.classList.contains("dark") ? "isDark" : ""
              }`}
              onClick={() => document.documentElement.classList.toggle("dark")}
              aria-label="Toggle dark mode"
            >
              <span className="pillKnob" aria-hidden="true">
                <span className="pillIcon moon" aria-hidden="true">☾</span>
                <span className="pillIcon sun" aria-hidden="true">☀</span>
              </span>
            </button>
          </div>
        </div>

      {/* L — CV / Resume download */}
<div className="bento2-tile l cvTile" aria-label="Download CV">
  <div className="cvKicker">RESUME</div>

  <div className="cvTitle">Download my CV</div>

  <div className="cvMeta">
    <span className="cvPill">PDF</span>
    <span className="cvDot" aria-hidden="true">•</span>
    <span className="cvSmall">Updated 2026</span>
  </div>

  <a className="btn2 cvBtn" href="/about/resume.pdf" download>
    Download CV <span aria-hidden="true">↗</span>
  </a>
</div>



      </div>
    
{modalProject ? (
  <ProjectModal
    project={modalProject}
    index={modalShotIndex}
    setIndex={setModalShotIndex}
    onClose={closeProject}
  />
) : null}

</section>
  );
}
