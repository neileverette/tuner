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
 * SLOW DRAMATIC ZOOM
 * Simple, elegant zoom from full UI to close-up
 */

const keyframes = [
  { frame: 0, x: 0, y: 0, scale: 1, rotate: 0 },
  { frame: 240, x: 0, y: 50, scale: 2.5, rotate: 0 },
];

function getCameraState(frame: number, fps: number) {
  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 30,
      mass: 1.5,
    },
    durationInFrames: 240,
  });

  return {
    x: interpolate(progress, [0, 1], [keyframes[0].x, keyframes[1].x]),
    y: interpolate(progress, [0, 1], [keyframes[0].y, keyframes[1].y]),
    scale: interpolate(progress, [0, 1], [keyframes[0].scale, keyframes[1].scale]),
    rotate: interpolate(progress, [0, 1], [keyframes[0].rotate, keyframes[1].rotate]),
  };
}

export const SlowZoom: React.FC = () => {
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
