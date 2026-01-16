import React, { useEffect, useState } from "react";
import CatAvatar from "../components/CatAvatar.jsx";
import BentoSection from "../components/BentoSection.jsx";

export default function Home() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // First load: restore saved theme, otherwise fall back to system preference.
    const saved = localStorage.getItem("theme");

    if (saved === "dark") setDark(true);
    else if (saved === "light") setDark(false);
    else {
      const prefersDark =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      setDark(!!prefersDark);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark, ready]);

  useEffect(() => {
    // Follow system changes only if user didn't manually choose
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return;

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;

    const onChange = (e) => setDark(!!e.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const scrollToBento = () => {
    document.getElementById("bento")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ===================
          LANDING
          =================== */}
      <section id="top" className="landing">
        {/* editorial fade layer */}
        <div className="landing-fade" aria-hidden="true" />

        <button
          className={`theme-toggle-icon ${dark ? "is-dark" : ""}`}
          type="button"
          onClick={() => setDark((v) => !v)}
          aria-label="Toggle dark mode"
          aria-pressed={dark}
        >
          <span className="icon-sun" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="icon-moon" aria-hidden="true" />
        </button>

        <div className="landing-inner">
          <h1 className="landing-title">
            Hi, I’m <span className="landing-name">Kraven</span>
          </h1>

          <div className="landing-cat">
            {/* Responsive: keeps the same look but scales nicely on small screens */}
            <CatAvatar size="clamp(260px, 55vw, 520px)" trackId="top" />
          </div>

          <p className="landing-sub">
            I build clean, minimal web experiences with <strong>Laravel</strong>{" "}
            + <strong>React</strong>. I like simple layouts, bold type, and playful
            details.
          </p>

          <span className="scroll-cue" role="presentation" onClick={scrollToBento}>
            Scroll
          </span>
        </div>
      </section>

      {/* ===================
          BENTO PORTFOLIO
          =================== */}
      <BentoSection />

     {/* ===================
    FOOTER (full-bleed + peek cat)
    =================== */}
<footer className="footerFull" aria-label="Site footer">
  <div className="footerInner">
    {/* Center peek cat */}
    <img
      className="footerPeekCat"
      src="/image/cat.png"
      alt=""
      aria-hidden="true"
      draggable="false"
    />

    {/* Top row */}
    <div className="footerTop">
      <div className="footerMeta">
        <div className="footerMetaBlock">
          <span className="footerDot" aria-hidden="true" />
          <div className="footerMetaText">
            <div className="footerMetaTime">GMT+8</div>
            <div className="footerMetaCity">MANILA</div>
          </div>
        </div>

        <div className="footerMetaBlock">
          <span className="footerDot" aria-hidden="true" />
          <div className="footerMetaText">
            <div className="footerMetaTime">AVAILABLE</div>
            <div className="footerMetaCity">FOR PROJECTS</div>
          </div>
        </div>
      </div>

      <nav className="footerNav" aria-label="Footer navigation">
        <a href="#top">Top ↑</a>
      </nav>
    </div>

    {/* Bottom row */}
    <div className="footerBottom">
      <div className="footerBrand">
        <div className="footerBrandName">Kraven</div>
        <div className="footerBrandTag">Minimal web dev • Laravel + React</div>
      </div>

      <div className="footerCopy">© {new Date().getFullYear()} Kraven Añonuevo</div>
    </div>
  </div>
</footer>

    </>
  );
}
