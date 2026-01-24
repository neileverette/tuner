import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

interface CameraProps {
  children: React.ReactNode;
  /** Starting X position (0 = center) */
  fromX?: number;
  /** Starting Y position (0 = center) */
  fromY?: number;
  /** Ending X position */
  toX?: number;
  /** Ending Y position */
  toY?: number;
  /** Starting scale (1 = 100%) */
  fromScale?: number;
  /** Ending scale */
  toScale?: number;
  /** Frame to start the animation */
  startFrame?: number;
  /** Duration of the animation in frames */
  durationInFrames?: number;
  /** Use spring physics for fluid motion */
  useSpring?: boolean;
  /** Spring damping (higher = less bouncy) */
  damping?: number;
}

/**
 * Apple-style smooth camera pan/zoom component.
 * Wraps content and applies fluid motion effects.
 */
export const Camera: React.FC<CameraProps> = ({
  children,
  fromX = 0,
  fromY = 0,
  toX = 0,
  toY = 0,
  fromScale = 1,
  toScale = 1,
  startFrame = 0,
  durationInFrames = 90,
  useSpring: useSpringAnim = true,
  damping = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate progress
  let progress: number;

  if (useSpringAnim) {
    progress = spring({
      frame: frame - startFrame,
      fps,
      config: {
        damping,
        stiffness: 80,
        mass: 1,
      },
      durationInFrames,
    });
  } else {
    progress = interpolate(
      frame,
      [startFrame, startFrame + durationInFrames],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }
    );
  }

  const x = interpolate(progress, [0, 1], [fromX, toX]);
  const y = interpolate(progress, [0, 1], [fromY, toY]);
  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  scale: number;
}

interface MultiCameraProps {
  children: React.ReactNode;
  keyframes: CameraKeyframe[];
  damping?: number;
}

/**
 * Multi-keyframe camera for complex pan sequences.
 * Smoothly interpolates between multiple positions.
 */
export const MultiCamera: React.FC<MultiCameraProps> = ({
  children,
  keyframes,
  damping = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find current keyframe segment
  let currentIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
      currentIdx = i;
      break;
    }
    if (frame >= keyframes[keyframes.length - 1].frame) {
      currentIdx = keyframes.length - 2;
    }
  }

  const from = keyframes[currentIdx];
  const to = keyframes[Math.min(currentIdx + 1, keyframes.length - 1)];
  const segmentDuration = to.frame - from.frame;

  const progress = spring({
    frame: frame - from.frame,
    fps,
    config: {
      damping,
      stiffness: 60,
      mass: 1.2,
    },
    durationInFrames: segmentDuration,
  });

  const x = interpolate(progress, [0, 1], [from.x, to.x]);
  const y = interpolate(progress, [0, 1], [from.y, to.y]);
  const scale = interpolate(progress, [0, 1], [from.scale, to.scale]);

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
