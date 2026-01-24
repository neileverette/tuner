import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { IntroScene } from "./scenes/IntroScene";
import { HeroScene } from "./scenes/HeroScene";
import { CarouselScene } from "./scenes/CarouselScene";
import { StationPickerScene } from "./scenes/StationPickerScene";
import { SourcesScene } from "./scenes/SourcesScene";
import { OutroScene } from "./scenes/OutroScene";

/**
 * Main composition for the Tuner promotional video.
 *
 * Timeline:
 * - 0-90: Intro (logo + tagline)
 * - 90-240: Hero (main UI reveal)
 * - 240-450: Carousel (pan across stations)
 * - 450-600: Station Picker (search/filter UI)
 * - 600-750: Sources (four radio sources)
 * - 750-900: Outro (CTA)
 *
 * Total: 900 frames @ 30fps = 30 seconds
 */
export const TunerPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      {/* Hero - Main UI */}
      <Sequence from={90} durationInFrames={150}>
        <HeroScene />
      </Sequence>

      {/* Carousel - Station browsing */}
      <Sequence from={240} durationInFrames={210}>
        <CarouselScene />
      </Sequence>

      {/* Station Picker */}
      <Sequence from={450} durationInFrames={150}>
        <StationPickerScene />
      </Sequence>

      {/* Sources */}
      <Sequence from={600} durationInFrames={150}>
        <SourcesScene />
      </Sequence>

      {/* Outro */}
      <Sequence from={750} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
