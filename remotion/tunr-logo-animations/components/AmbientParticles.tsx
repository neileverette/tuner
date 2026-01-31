import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  color: string;
}

export const AmbientParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate particles once
  const particles = useMemo(() => {
    const colors = [
      "rgba(255, 180, 100, 0.6)", // warm orange
      "rgba(255, 220, 150, 0.5)", // warm yellow
      "rgba(200, 150, 255, 0.4)", // soft purple
      "rgba(100, 200, 255, 0.3)", // soft blue
      "rgba(255, 255, 255, 0.4)", // white
    ];

    const particleList: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particleList.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.6 + 0.2,
        delay: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return particleList;
  }, [width, height]);

  // Ambient glow positions
  const glowPositions = useMemo(
    () => [
      { x: width * 0.2, y: height * 0.7, color: "rgba(255, 100, 50, 0.15)", size: 600 },
      { x: width * 0.8, y: height * 0.3, color: "rgba(100, 50, 255, 0.12)", size: 500 },
      { x: width * 0.5, y: height * 0.5, color: "rgba(50, 150, 255, 0.08)", size: 700 },
    ],
    [width, height]
  );

  return (
    <>
      {/* Ambient glow spots */}
      {glowPositions.map((glow, index) => {
        const pulse = Math.sin((frame + index * 30) * 0.02) * 0.3 + 1;
        const drift = Math.sin((frame + index * 50) * 0.01) * 20;

        return (
          <div
            key={`glow-${index}`}
            style={{
              position: "absolute",
              left: glow.x + drift - glow.size / 2,
              top: glow.y - glow.size / 2,
              width: glow.size * pulse,
              height: glow.size * pulse,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Floating particles */}
      {particles.map((particle) => {
        const adjustedFrame = frame - particle.delay;
        if (adjustedFrame < 0) return null;

        // Gentle floating motion
        const floatY = Math.sin(adjustedFrame * particle.speed * 0.05) * 30;
        const floatX = Math.cos(adjustedFrame * particle.speed * 0.03) * 20;

        // Twinkle effect
        const twinkle =
          Math.sin(adjustedFrame * particle.speed * 0.1 + particle.id) * 0.4 + 0.6;

        // Fade in
        const fadeIn = interpolate(adjustedFrame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x + floatX,
              top: particle.y + floatY,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: particle.color,
              opacity: particle.opacity * twinkle * fadeIn,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Subtle light rays from bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120%",
          height: "60%",
          background: `
            linear-gradient(
              to top,
              rgba(255, 150, 50, 0.05) 0%,
              transparent 100%
            )
          `,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
