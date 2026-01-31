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
import { useEffect, useState } from "react";
import { AmbientParticles } from "./components/AmbientParticles";
import { Ring3D } from "./components/Ring3D";

const fontUrl = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Inter:wght@400;500&display=swap";

export const tunrRevealSchema = z.object({
  // Ring position (tweens from Start → End during entrance)
  ringXStart: z.number().min(-2000).max(4000).step(1),
  ringYStart: z.number().min(-2000).max(4000).step(1),
  ringXEnd: z.number().min(-500).max(2500).step(1),
  ringYEnd: z.number().min(-500).max(1500).step(1),
  // Ring size (tweens from Start → End during entrance)
  circleSizeStart: z.number().min(0).max(4000).step(1),
  circleSizeEnd: z.number().min(0).max(4000).step(1),
  strokeWidth: z.number().min(1).max(200).step(1),
  // 3D Tilt at entry (tweens to 0 at landing)
  tiltXStart: z.number().min(-90).max(90).step(1),
  tiltYStart: z.number().min(-90).max(90).step(1),
  tiltZStart: z.number().min(-90).max(90).step(1),
  // Title text
  titleText: z.string(),
  titleWeight: z.number().min(100).max(900).step(100),
  titleSize: z.number().min(10).max(500).step(1),
  titleX: z.number().min(-1000).max(2000).step(1),
  titleY: z.number().min(-1000).max(2000).step(1),
  // Glow settings
  glowBlur: z.number().min(0).max(200).step(1),
  glowDistance: z.number().min(0).max(2).step(0.01),
  glowOpacity: z.number().min(0).max(1).step(0.01),
});

type TunrRevealProps = z.infer<typeof tunrRevealSchema>;

export const TunrReveal: React.FC<TunrRevealProps> = ({
  ringXStart = -400,
  ringYStart = 1280,
  ringXEnd = 960,
  ringYEnd = 540,
  circleSizeStart = 600,
  circleSizeEnd = 280,
  strokeWidth = 20,
  tiltXStart = 65,
  tiltYStart = -45,
  tiltZStart = 25,
  titleText = "tunr",
  titleWeight = 400,
  titleSize = 120,
  titleX = 0,
  titleY = 0,
  glowBlur = 60,
  glowDistance = 1,
  glowOpacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading fonts"));

  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    link.onload = () => {
      document.fonts.ready.then(() => {
        continueRender(handle);
      });
    };

    return () => {
      document.head.removeChild(link);
    };
  }, [handle]);
  const { fps, width, height } = useVideoConfig();

  // === TIMING CONSTANTS ===
  const RING_ENTER_START = 30;
  const RING_ENTER_END = 100;
  const LOGO_SETTLE_START = 100;
  const PAUSE_BARS_START = 115;
  const RING_PUSH_START = 150;
  const TEXT_REVEAL_START = 170;
  const TAGLINE_START = 220;
  const HOLD_START = 300;
  const FADE_TO_BLACK_START = 360;
  const URL_REVEAL_START = 400;
  const URL_HOLD_END = 480;

  // === RING POSITION ===
  const ringFinalX = width * 0.28; // Push to left for text reveal

  // Ring entrance animation (bottom-left to center)
  const entranceProgress = spring({
    frame: frame - RING_ENTER_START,
    fps,
    config: {
      damping: 28,
      stiffness: 40,
      mass: 1.2,
    },
  });

  // Ring push to left animation
  const pushProgress = spring({
    frame: frame - RING_PUSH_START,
    fps,
    config: {
      damping: 25,
      stiffness: 80,
      mass: 0.8,
    },
  });

  // Calculate ring position (tweens from start to end position)
  const ringEntranceX = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [ringXStart, ringXEnd]
  );
  const ringEntranceY = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [ringYStart, ringYEnd]
  );

  // After entrance, push to left for text reveal
  const ringX =
    frame < RING_PUSH_START
      ? ringEntranceX
      : interpolate(pushProgress, [0, 1], [ringXEnd, ringFinalX]);
  const ringY = frame < RING_PUSH_START ? ringEntranceY : ringYEnd;

  // Frisbee spin during entrance (720 degrees = 2 full rotations)
  const frisbeeSpinRaw = interpolate(
    frame,
    [RING_ENTER_START, RING_ENTER_START + 70],
    [720, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const frisbeeSpin = frame < RING_ENTER_START ? 720 : frisbeeSpinRaw;

  // 3D rotation (starts tilted, settles to flat)
  const rotateX = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [tiltXStart, 0],
    { extrapolateRight: "clamp" }
  );
  const rotateY = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [tiltYStart, 0],
    { extrapolateRight: "clamp" }
  );
  const rotateZ = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [tiltZStart, 0],
    { extrapolateRight: "clamp" }
  );

  // Ring size (tweens from start size to end size during entrance)
  const circleSize = interpolate(
    frame < RING_ENTER_START ? 0 : entranceProgress,
    [0, 1],
    [circleSizeStart, circleSizeEnd],
    { extrapolateRight: "clamp" }
  );

  // === PAUSE BARS ===
  const pauseBarsScale = spring({
    frame: frame - PAUSE_BARS_START,
    fps,
    config: {
      damping: 12,
      stiffness: 150,
      mass: 0.6,
    },
  });
  const showPauseBars = frame >= PAUSE_BARS_START;

  // === TEXT ANIMATIONS ===
  // "tunr" title
  const titleOpacity = interpolate(
    frame,
    [TEXT_REVEAL_START, TEXT_REVEAL_START + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const titleSlideX = interpolate(
    frame,
    [TEXT_REVEAL_START, TEXT_REVEAL_START + 40],
    [50, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Tagline lines
  const taglines = [
    "Free, open music player inspired by radio.",
    "tunr is about music discovery.",
    "Designed for the keyboard — because flow matters.",
  ];

  // === FADE TO BLACK ===
  const fadeToBlack = interpolate(
    frame,
    [FADE_TO_BLACK_START, FADE_TO_BLACK_START + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === URL REVEAL ===
  const urlOpacity = interpolate(
    frame,
    [URL_REVEAL_START, URL_REVEAL_START + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const urlScale = spring({
    frame: frame - URL_REVEAL_START,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Final fade out
  const finalFade = interpolate(
    frame,
    [URL_HOLD_END, URL_HOLD_END + 30],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Audio volume with fade in/out
  const audioVolume = (f: number) => {
    const fadeInDuration = 60; // 2 seconds at 30fps
    const fadeOutStart = URL_HOLD_END - 30;
    const fadeOutDuration = 60;

    const fadeIn = interpolate(f, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      f,
      [fadeOutStart, fadeOutStart + fadeOutDuration],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Background audio with fade in/out */}
      <Audio src={staticFile("audio.mp3")} volume={audioVolume} />

      {/* Ambient lighting/particles */}
      <AmbientParticles />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content container - fades with final fade */}
      <div style={{ opacity: frame >= FADE_TO_BLACK_START ? 1 - fadeToBlack : 1 }}>
        {/* 3D Ring */}
        <div
          style={{
            position: "absolute",
            left: ringX - circleSize / 2,
            top: ringY - circleSize / 2,
            width: circleSize,
            height: circleSize,
            transform: `
              perspective(1000px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              rotateZ(${rotateZ + frisbeeSpin}deg)
            `,
            transformStyle: "preserve-3d",
          }}
        >
          <Ring3D
            size={circleSize}
            strokeWidth={strokeWidth}
            glowBlur={glowBlur}
            glowDistance={glowDistance}
            glowOpacity={glowOpacity}
          />

          {/* Pause bars inside ring */}
          {showPauseBars && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${pauseBarsScale})`,
                display: "flex",
                gap: circleSize * 0.06,
              }}
            >
              <div
                style={{
                  width: circleSize * 0.07,
                  height: circleSize * 0.28,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  width: circleSize * 0.07,
                  height: circleSize * 0.28,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 4,
                }}
              />
            </div>
          )}
        </div>

        {/* Text content - appears after ring pushes */}
        {frame >= TEXT_REVEAL_START && (
          <div
            style={{
              position: "absolute",
              left: ringFinalX + circleSize / 2 + 60 + titleX,
              top: `calc(50% + ${titleY}px)`,
              transform: `translateY(-50%) translateX(${titleSlideX}px)`,
              opacity: titleOpacity,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: titleSize,
                fontWeight: titleWeight,
                color: "white",
                letterSpacing: "0.02em",
                marginBottom: 20,
              }}
            >
              {titleText}
            </div>

            {/* Taglines */}
            {taglines.map((line, index) => {
              const lineStart = TAGLINE_START + index * 25;
              const lineOpacity = interpolate(
                frame,
                [lineStart, lineStart + 20],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const lineY = interpolate(
                frame,
                [lineStart, lineStart + 25],
                [15, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                }
              );

              return (
                <div
                  key={index}
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 32,
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: 12,
                    opacity: lineOpacity,
                    transform: `translateY(${lineY}px)`,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        )}
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

      {/* URL reveal after fade to black */}
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
              fontSize: 72,
              fontWeight: 500,
              color: "white",
              letterSpacing: "0.05em",
              transform: `scale(${frame >= URL_REVEAL_START ? urlScale : 0})`,
            }}
          >
            tunr-music.com
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
