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
 * RUNWAY-STYLE MOTION
 * Mimics the Runway reference video:
 * - Dramatic zoom into station cards
 * - Hold zoomed in
 * - Pan horizontally across cards
 * - Pull back to full view
 *
 * 8 seconds @ 30fps = 240 frames
 */

interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

const keyframes: CameraKeyframe[] = [
  // [0s] Start - Upper left corner (wide view)
  { frame: 0, x: -450, y: -400, scale: 1.2, rotate: 0 },

  // [2s] Frame 60 - Zoom in from upper left
  { frame: 60, x: -400, y: -350, scale: 2.0, rotate: 0 },

  // [6s] Frame 180 - Move to bottom while zoomed
  { frame: 180, x: 0, y: 400, scale: 2.0, rotate: 0 },

  // [8s] Frame 240 - Stay at bottom zoomed
  { frame: 240, x: 0, y: 400, scale: 2.0, rotate: 0 },
];

function getCameraState(frame: number, fps: number) {
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

  // Smooth spring animation
  const progress = spring({
    frame: frame - from.frame,
    fps,
    config: {
      damping: 200,
      stiffness: 50,
      mass: 1.2,
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

export const RunwayStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const camera = getCameraState(frame, fps);
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
    </AbsoluteFill>
  );
};
