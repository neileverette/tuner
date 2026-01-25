import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
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
 *
 * Uses LIVE-CAPTURED frames from Playwright automation (no static PNG)
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
  // [0:00] Start: Upper Left Corner (Zoomed in)
  { frame: 0, x: -350, y: -600, scale: 2.2, rotate: 0 },

  // [0:02.5] Move Down to Station Name (Bottom Left)
  // Tilt up slightly to anticipate the stop
  { frame: 75, x: -350, y: 550, scale: 2.2, rotate: 1 },

  // [0:03.5] Hold briefly on station name
  { frame: 105, x: -350, y: 550, scale: 2.2, rotate: 1 },

  // [0:05.5] Pan Right to Play Button (Center Bottom)
  // Tilt right following movement
  { frame: 165, x: 0, y: 550, scale: 2.2, rotate: 2 },

  // [0:08] Slight pull back to reveal a bit more context
  { frame: 240, x: 0, y: 550, scale: 1.8, rotate: 0 },
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
 * Main composition - cinematic camera over live-captured UI frames.
 * Run `npm run capture` to capture fresh frames from your running app.
 */
export const FrameSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const camera = getCameraState(frame, fps);

  // Use the specific frame image captured from the live UI
  const frameNumber = String(frame).padStart(6, "0");
  const framePath = `frames/frame-${frameNumber}.png`;

  // Detect vertical (9:16) vs horizontal (16:9) format
  const isVertical = height > width;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Live-captured UI frame with camera transforms */}
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
          src={staticFile(framePath)}
          style={{
            width: isVertical ? "auto" : "100%",
            height: isVertical ? "100%" : "auto",
            objectFit: "cover",
            // For vertical, ensure the frame fills the height and crops width
            minWidth: isVertical ? "100%" : "auto",
            minHeight: isVertical ? "100%" : "auto",
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
  const { fps, width, height } = useVideoConfig();

  const camera = getCameraState(frame, fps);

  // Find current keyframe name
  let currentSection = "Establishing";
  if (frame >= 210) currentSection = "Pull-back";
  else if (frame >= 165) currentSection = "Pan Right (Cards)";
  else if (frame >= 105) currentSection = "Settle (Player)";
  else if (frame >= 45) currentSection = "Push-in";

  const frameNumber = String(frame).padStart(6, "0");
  const framePath = `frames/frame-${frameNumber}.png`;

  const isVertical = height > width;

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
          src={staticFile(framePath)}
          style={{
            width: isVertical ? "auto" : "100%",
            height: isVertical ? "100%" : "auto",
            objectFit: "cover",
            minWidth: isVertical ? "100%" : "auto",
            minHeight: isVertical ? "100%" : "auto",
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
          zIndex: 1000,
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
