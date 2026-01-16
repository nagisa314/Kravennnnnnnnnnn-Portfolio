import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function CatAvatar({
  // size can be a number (px) OR a CSS length string (e.g. "clamp(260px, 55vw, 520px)")
  size = 460,
  trackId = "bento",      // ✅ default bento, but you can change this
  track = "auto",         // "auto" | "window"
}) {
  const ref = useRef(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [pop, setPop] = useState(false);

  const [blink, setBlink] = useState(false);

  // When `size` is a CSS string (clamp/etc), we need the real rendered size in px
  // to keep the eye-tracking offsets feeling correct.
  const [boxSize, setBoxSize] = useState(
    typeof size === "number" ? size : 460
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial read
    const read = () => {
      const r = el.getBoundingClientRect();
      if (r.width) setBoxSize(r.width);
    };
    read();

    // Track resizes (responsive layouts)
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => read());
      ro.observe(el);
    } else {
      window.addEventListener("resize", read);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", read);
    };
  }, [size]);

  const maxOffset = useMemo(() => Math.max(2, boxSize * 0.018), [boxSize]);

  // ✅ mouse follow (works in landing too)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scopeEl =
      track === "window"
        ? window
        : document.getElementById(trackId) || window; // ✅ fallback to window if not found

    let raf = 0;

    const onMove = (e) => {
      // rAF to avoid jitter on high frequency events
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const nx = clamp((e.clientX - cx) / (r.width / 2), -1, 1);
        const ny = clamp((e.clientY - cy) / (r.height / 2), -1, 1);

        setShift((prev) => ({
          x: prev.x + (nx * maxOffset - prev.x) * 0.18,
          y: prev.y + (ny * maxOffset - prev.y) * 0.18,
        }));
      });
    };

    const onLeave = () => setShift({ x: 0, y: 0 });

    // pointer events = nicer across mouse + touchpads
    if (scopeEl === window) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("blur", onLeave);
    } else {
      scopeEl.addEventListener("pointermove", onMove, { passive: true });
      scopeEl.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);

      if (scopeEl === window) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("blur", onLeave);
      } else {
        scopeEl.removeEventListener("pointermove", onMove);
        scopeEl.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [maxOffset, trackId, track]);

  // ✅ Natural random blink every 3–5 seconds
  useEffect(() => {
    let t1, t2;

    const schedule = () => {
      const next = 3000 + Math.random() * 2000;
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => setBlink(false), 120);
        schedule();
      }, next);
    };

    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const onClick = () => {
    setPop(true);
    setTimeout(() => setPop(false), 480);
  };

  const earStroke = 22;
  const whiskerH = 12;
  const whiskerRx = 6;

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        width: typeof size === "number" ? size : size,
        height: typeof size === "number" ? size : size,
        cursor: "pointer",
        userSelect: "none",
        display: "grid",
        placeItems: "center",
        color: "var(--text)",
      }}
      aria-label="Minimal cat"
    >
      <svg
        viewBox="0 0 240 240"
        width={typeof size === "number" ? size : "100%"}
        height={typeof size === "number" ? size : "100%"}
        aria-hidden="true"
      >
        {/* EARS */}
        <path
          d="M40 108 Q72 42 104 92 L136 92 Q168 42 200 108"
          fill="none"
          stroke="currentColor"
          strokeWidth={earStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* WHISKERS */}
        <g fill="currentColor">
          <rect x="18" y="126" width="50" height={whiskerH} rx={whiskerRx} transform="rotate(12 43 132)" />
          <rect x="18" y="152" width="52" height={whiskerH} rx={whiskerRx} transform="rotate(-18 44 158)" />
          <rect x="172" y="126" width="50" height={whiskerH} rx={whiskerRx} transform="rotate(-12 197 132)" />
          <rect x="170" y="152" width="52" height={whiskerH} rx={whiskerRx} transform="rotate(18 196 158)" />
        </g>

        {/* EYES */}
        {!pop ? (
          <g transform={`translate(${shift.x}, ${shift.y})`}>
            <g className={`cat-eyeWrap ${blink ? "is-blinking" : ""}`}>
              <circle cx="100" cy="144" r="10" fill="currentColor" />
            </g>
            <g className={`cat-eyeWrap ${blink ? "is-blinking" : ""}`}>
              <circle cx="140" cy="144" r="10" fill="currentColor" />
            </g>
          </g>
        ) : (
          <g>
            <circle cx="100" cy="144" r="19" fill="currentColor" />
            <circle cx="140" cy="144" r="19" fill="currentColor" />
            <circle cx="93" cy="137" r="4" fill="rgba(255,255,255,.9)" />
            <circle cx="133" cy="137" r="4" fill="rgba(255,255,255,.9)" />
          </g>
        )}
      </svg>
    </div>
  );
}
