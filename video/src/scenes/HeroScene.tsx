import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { Camera } from "../components/Camera";
import { Screenshot, ScreenshotContainer } from "../components/Screenshot";
import { FadeIn } from "../components/FadeIn";
import { TextReveal } from "../components/TextReveal";

/**
 * Hero scene showcasing the main app interface.
 * Starts zoomed in, pulls back to reveal full UI.
 */
export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <ScreenshotContainer background="linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)">
        {/* The screenshot with camera movement */}
        <Camera
          fromScale={1.4}
          toScale={1}
          fromY={100}
          toY={0}
          startFrame={0}
          durationInFrames={90}
          damping={200}
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
            <Screenshot src="hero.png" frame="browser" shadow="strong" />
          </div>
        </Camera>

        {/* Caption overlay */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 80,
          }}
        >
          <Sequence from={60}>
            <FadeIn startFrame={0} slideFrom="bottom">
              <TextReveal
                text="Discover internet radio"
                fontSize={36}
                fontWeight={500}
                stagger={1}
              />
            </FadeIn>
          </Sequence>
        </AbsoluteFill>
      </ScreenshotContainer>
    </AbsoluteFill>
  );
};
