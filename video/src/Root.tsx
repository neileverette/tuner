import React from "react";
import { Composition } from "remotion";
import { FrameSequence, FrameSequenceDebug, FrameSequenceWithCallouts } from "./FrameSequence";

// 8 seconds at 30fps = 240 frames
const TOTAL_FRAMES = 240;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main hero video - 8 seconds cinematic camera */}
      <Composition
        id="TunerPromo"
        component={FrameSequence}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Debug version with keyframe info overlay */}
      <Composition
        id="TunerPromoDebug"
        component={FrameSequenceDebug}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* TikTok / Shorts / Reels - 9:16 vertical */}
      <Composition
        id="TunerPromoVertical"
        component={FrameSequence}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
