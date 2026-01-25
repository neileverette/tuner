import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * LIVE UI - Renders actual iframe of running app
 * Camera animates over the LIVE webpage
 */

interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

const keyframes: CameraKeyframe[] = [
  // [0s-8s] Far left, no zoom
  { frame: 0, x: -500, y: 0, scale: 1.0, rotate: 0 },
  { frame: 240, x: -500, y: 0, scale: 1.0, rotate: 0 },
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

export const LiveUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const camera = getCameraState(frame, fps);
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
        <iframe
          src="http://localhost:5173"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#000",
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
