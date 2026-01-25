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
 * SMOOTH PAN ACROSS
 * Horizontal pan from left to right, showcasing UI width
 */

const keyframes = [
  { frame: 0, x: -400, y: 0, scale: 1.5, rotate: 0 },
  { frame: 120, x: 0, y: 0, scale: 1.5, rotate: 0 },
  { frame: 240, x: 400, y: 0, scale: 1.5, rotate: 0 },
];

function getCameraState(frame: number, fps: number) {
  let fromIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
      fromIdx = i;
      break;
    }
  }

  const from = keyframes[fromIdx];
  const to = keyframes[Math.min(fromIdx + 1, keyframes.length - 1)];
  const duration = to.frame - from.frame;

  const progress = spring({
    frame: frame - from.frame,
    fps,
    config: {
      damping: 150,
      stiffness: 50,
      mass: 1,
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

export const PanAcross: React.FC = () => {
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
