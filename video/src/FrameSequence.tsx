import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

/**
 * TUNR MUSIC UI - 8 SECOND HERO MOMENTS
 *
 * Timeline (at 30fps = 240 frames):
 * [0:00]     Frame 0    - Full UI establishing shot
 * [0:01.5]   Frame 45   - Aggressive push-in + downward glide to bottom-left player
 * [0:03.5]   Frame 105  - Settle on bottom-left, begin horizontal pan right
 * [0:05.5]   Frame 165  - Continue pan across station cards with right tilt
 * [0:07]     Frame 210  - Rapid pull-back to original centered view
 * [0:08]     Frame 240  - Settle into final position
 *
 * Camera Style: Dynamic with 2-3° inertial tilts following direction of travel
 */

const FPS = 30;

// Keyframe positions (x, y in pixels from center, scale, rotation in degrees)
interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  scale: number;
  rotate: number; // Inertial tilt
}

const keyframes: CameraKeyframe[] = [
  // [0:00] Establishing shot - full UI, centered
  { frame: 0, x: 0, y: 0, scale: 1, rotate: 0 },

  // [0:01.5] Aggressive push-in toward bottom-left player
  // Tilt left 2° following the diagonal movement
  { frame: 45, x: -350, y: 280, scale: 1.8, rotate: -2 },

  // [0:03.5] Settle on bottom-left "Grooving tune unknown" area
  // Slight counter-rotation as momentum settles
  { frame: 105, x: -320, y: 260, scale: 1.75, rotate: -0.5 },

  // [0:05.5] Horizontal pan right across album/station cards
  // Tilt right 3° following rightward momentum
  { frame: 165, x: 350, y: 200, scale: 1.6, rotate: 3 },

  // [0:07] Rapid pull-back begins, straightening rotation
  { frame: 210, x: 50, y: 30, scale: 1.1, rotate: 0.5 },

  // [0:08] Final settle - perfectly centered
  { frame: 240, x: 0, y: 0, scale: 1, rotate: 0 },
];

/**
 * Interpolates between keyframes with spring physics for cinematic inertia.
 */
function getCameraState(frame: number, fps: number) {
  // Find surrounding keyframes
  let fromIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
      fromIdx = i;
      break;
    }
    if (frame >= keyframes[keyframes.length - 1].frame) {
      fromIdx = keyframes.length - 2;
    }
  }

  const from = keyframes[fromIdx];
  const to = keyframes[Math.min(fromIdx + 1, keyframes.length - 1)];
  const duration = to.frame - from.frame;

  // Use different spring configs for different movements
  const isRapidPullback = from.frame >= 165; // The pull-back at end is faster

  const progress = spring({
    frame: frame - from.frame,
    fps,
    config: {
      damping: isRapidPullback ? 100 : 200, // Less damping = snappier for pullback
      stiffness: isRapidPullback ? 80 : 40, // Higher stiffness = faster response
      mass: isRapidPullback ? 0.8 : 1.2, // Lower mass = less inertia
    },
    durationInFrames: duration,
  });

  return {
    x: interpolate(progress, [0, 1], [from.x, to.x]),
    y: interpolate(progress, [0, 1], [from.y, to.y]),
    scale: interpolate(progress, [0, 1], [from.scale, to.scale]),
    rotate: interpolate(progress, [0, 1], [from.rotate, to.rotate]),
  };
}

/**
 * Main composition - cinematic camera over static UI.
 */
export const FrameSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camera = getCameraState(frame, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* The UI image with camera transforms applied */}
      <AbsoluteFill
        style={{
          transform: `
            translate(${camera.x}px, ${camera.y}px)
            scale(${camera.scale})
            rotate(${camera.rotate}deg)
          `,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("frames/hero.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Debug version showing keyframe markers.
 */
export const FrameSequenceDebug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camera = getCameraState(frame, fps);

  // Find current keyframe name
  let currentSection = "Establishing";
  if (frame >= 210) currentSection = "Pull-back";
  else if (frame >= 165) currentSection = "Pan Right (Cards)";
  else if (frame >= 105) currentSection = "Settle (Player)";
  else if (frame >= 45) currentSection = "Push-in";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `
            translate(${camera.x}px, ${camera.y}px)
            scale(${camera.scale})
            rotate(${camera.rotate}deg)
          `,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("frames/hero.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Debug overlay */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "12px 16px",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        <div>Frame: {frame} / 240</div>
        <div>Time: {(frame / fps).toFixed(2)}s</div>
        <div>Section: {currentSection}</div>
        <div>
          Camera: x={camera.x.toFixed(0)} y={camera.y.toFixed(0)}
        </div>
        <div>
          Scale: {camera.scale.toFixed(2)} Rotate: {camera.rotate.toFixed(1)}°
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Keep the callouts version for compatibility
export const FrameSequenceWithCallouts = FrameSequence;
