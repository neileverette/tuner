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
import { Subtitle } from "../components/TextReveal";

/**
 * Scene showcasing the station picker modal.
 * Zooms into the search/filter UI.
 */
export const StationPickerScene: React.FC = () => {
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
      <ScreenshotContainer background="linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)">
        {/* Zoom into the modal */}
        <Camera
          fromScale={1}
          toScale={1.3}
          fromY={0}
          toY={-50}
          startFrame={30}
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
            <Screenshot
              src="station-picker.png"
              frame="none"
              shadow="strong"
              borderRadius={16}
            />
          </div>
        </Camera>

        {/* Caption */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 80,
          }}
        >
          <Sequence from={60}>
            <FadeIn startFrame={0} slideFrom="bottom">
              <Subtitle
                text="Search and filter stations"
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
