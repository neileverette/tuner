import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  delayRender,
  continueRender,
} from "remotion";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import { Ring3D } from "./components/Ring3D";

const fontUrl =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Inter:wght@400;500&display=swap";

export const animation4Schema = z.object({
  titleText: z.string(),
  glowIntensity: z.number().min(0.3).max(1.5).step(0.1),
});

type Animation4Props = z.infer<typeof animation4Schema>;

export const Animation4: React.FC<Animation4Props> = ({
  titleText = "tunr",
  glowIntensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading fonts"));

  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    link.onload = () => {
      document.fonts.ready.then(() => continueRender(handle));
    };
    return () => {
      document.head.removeChild(link);
    };
  }, [handle]);

  // === TIMING CONSTANTS ===
  // Total duration: ~267 frames (8.9 seconds)
  const LOGO_FORM_START = 0;
  const PAUSE_BARS_START = 20;
  const TEXT_REVEAL_START = 60;
  const TAGLINE_START = 100;
  const FADE_TO_BLACK_START = 200;
  const URL_REVEAL_START = 220;
  const URL_HOLD_END = 250;

  // Audio starts from beginning
  const AUDIO_START_FRAME = 0;

  // === MAIN LOGO RING ===
  const logoRingScale = spring({
    frame: frame - LOGO_FORM_START,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });
  const logoRingSize = 280;

  // === PAUSE BARS ===
  const pauseBarsScale = spring({
    frame: frame - PAUSE_BARS_START,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.6 },
  });

  // === GLITCH TEXT EFFECT ===
  const glitchOffset = useMemo(() => {
    if (frame < TEXT_REVEAL_START || frame > TEXT_REVEAL_START + 30) return { x: 0, y: 0 };
    const intensity = interpolate(
      frame,
      [TEXT_REVEAL_START, TEXT_REVEAL_START + 30],
      [15, 0],
      { extrapolateRight: "clamp" }
    );
    return {
      x: Math.sin(frame * 3) * intensity,
      y: Math.cos(frame * 5) * intensity * 0.5,
    };
  }, [frame]);

  const titleOpacity = interpolate(
    frame,
    [TEXT_REVEAL_START, TEXT_REVEAL_START + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleScale = spring({
    frame: frame - TEXT_REVEAL_START,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.7 },
  });

  // === TAGLINES ===
  const taglines = [
    "Free, open music player inspired by radio.",
    "tunr is about music discovery.",
    "Designed for the keyboard \u2014 because flow matters.",
  ];

  // === FADE TO BLACK ===
  const fadeToBlack = interpolate(
    frame,
    [FADE_TO_BLACK_START, FADE_TO_BLACK_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === URL REVEAL ===
  const urlOpacity = interpolate(
    frame,
    [URL_REVEAL_START, URL_REVEAL_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const urlScale = spring({
    frame: frame - URL_REVEAL_START,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
  });

  const finalFade = interpolate(
    frame,
    [URL_HOLD_END, URL_HOLD_END + 17],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === STAR FIELD ===
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      twinkleSpeed: Math.random() * 0.1 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, [width, height]);

  const centerX = width / 2;
  const centerY = height / 2 - 80; // Shifted up

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* Audio starting at 8.75 seconds */}
      <Audio src={staticFile("audio.mp3")} startFrom={AUDIO_START_FRAME} />

      {/* Star field background */}
      {stars.map((star, i) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + i) * 0.5 + 0.5;
        return (
          <div
            key={`star-${i}`}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              opacity: star.opacity * twinkle,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`,
            }}
          />
        );
      })}

      {/* Deep space nebula glow */}
      <div
        style={{
          position: "absolute",
          left: centerX - 600,
          top: centerY - 400,
          width: 1200,
          height: 800,
          background: `radial-gradient(ellipse, rgba(80,0,120,0.3) 0%, transparent 60%)`,
          filter: "blur(80px)",
          opacity: 0.6 * glowIntensity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: centerX - 400,
          top: centerY - 300,
          width: 800,
          height: 600,
          background: `radial-gradient(ellipse, rgba(0,100,150,0.25) 0%, transparent 50%)`,
          filter: "blur(60px)",
          opacity: 0.5 * glowIntensity,
        }}
      />

      {/* Main content */}
      <div style={{ opacity: frame >= FADE_TO_BLACK_START ? 1 - fadeToBlack : 1 }}>
        {/* Main Logo Ring - colored neon ring only */}
        <div
          style={{
            position: "absolute",
            left: centerX - 140,
            top: centerY - 140,
            width: logoRingSize,
            height: logoRingSize,
            transform: `scale(${logoRingScale})`,
            opacity: logoRingScale,
          }}
        >
          <Ring3D
            size={logoRingSize}
            strokeWidth={20}
            glowBlur={60}
            glowDistance={1}
            glowOpacity={0.6 * glowIntensity}
          />

          {/* Pause bars */}
          {frame >= PAUSE_BARS_START && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${pauseBarsScale})`,
                display: "flex",
                gap: logoRingSize * 0.06,
              }}
            >
              <div
                style={{
                  width: logoRingSize * 0.07,
                  height: logoRingSize * 0.28,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 4,
                  boxShadow: "0 0 20px rgba(255,255,255,0.5)",
                }}
              />
              <div
                style={{
                  width: logoRingSize * 0.07,
                  height: logoRingSize * 0.28,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 4,
                  boxShadow: "0 0 20px rgba(255,255,255,0.5)",
                }}
              />
            </div>
          )}
        </div>

        {/* Title with glitch effect */}
        {frame >= TEXT_REVEAL_START && (
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY + 210,
              transform: `translate(-50%, 0) translate(${glitchOffset.x}px, ${glitchOffset.y}px) scale(${titleScale})`,
              opacity: titleOpacity,
            }}
          >
            {/* Main text with subtle glow */}
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 100,
                fontWeight: 400,
                color: "white",
                letterSpacing: "0.02em",
                textShadow: "0 0 20px rgba(255,255,255,0.4)",
              }}
            >
              {titleText}
            </div>
          </div>
        )}

        {/* Taglines */}
        {taglines.map((line, index) => {
          const lineStart = TAGLINE_START + index * 20;
          const lineOpacity = interpolate(frame, [lineStart, lineStart + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const lineY = interpolate(frame, [lineStart, lineStart + 20], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: centerX,
                top: centerY + 350 + index * 45,
                transform: `translate(-50%, ${lineY}px)`,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 34,
                color: "rgba(255,255,255,0.75)",
                opacity: lineOpacity,
                textAlign: "center",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Black overlay for fade */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          opacity: fadeToBlack,
          pointerEvents: "none",
        }}
      />

      {/* URL reveal */}
      {frame >= URL_REVEAL_START && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: urlOpacity * finalFade,
          }}
        >
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 96,
              fontWeight: 400,
              color: "white",
              letterSpacing: "0.02em",
              transform: `scale(${urlScale})`,
            }}
          >
            tunr-music.com
          </div>
        </AbsoluteFill>
      )}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
