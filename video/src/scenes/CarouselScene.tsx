import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { Camera, MultiCamera } from "../components/Camera";
import { Screenshot, ScreenshotContainer } from "../components/Screenshot";
import { FadeIn } from "../components/FadeIn";
import { Subtitle } from "../components/TextReveal";

/**
 * Scene highlighting the channel carousel.
 * Pans across the carousel to show station variety.
 */
export const CarouselScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <ScreenshotContainer>
        {/* Multi-point camera pan across carousel */}
        <MultiCamera
          keyframes={[
            { frame: 0, x: -200, y: 0, scale: 1.8 },
            { frame: 60, x: 0, y: 0, scale: 1.6 },
            { frame: 120, x: 200, y: 0, scale: 1.8 },
            { frame: 180, x: 0, y: 0, scale: 1 },
          ]}
          damping={150}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: 60,
            }}
          >
            <Screenshot src="carousel.png" frame="none" shadow="medium" />
          </div>
        </MultiCamera>

        {/* Caption */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 80,
          }}
        >
          <Sequence from={150}>
            <FadeIn startFrame={0} slideFrom="bottom">
              <Subtitle
                text="Browse stations with a swipe"
                fontSize={28}
                color="rgba(255, 255, 255, 0.8)"
              />
            </FadeIn>
          </Sequence>
        </AbsoluteFill>
      </ScreenshotContainer>
    </AbsoluteFill>
  );
};
