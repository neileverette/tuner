import React from "react";
import { Composition } from "remotion";
import { FrameSequence, FrameSequenceDebug, FrameSequenceWithCallouts } from "./FrameSequence";
import { SmoothPan } from "./animations/SmoothPan";
import { CoolMontage } from "./animations/CoolMontage";
import { SlowZoom } from "./animations/SlowZoom";
import { FastPaced } from "./animations/FastPaced";
import { PanAcross } from "./animations/PanAcross";
import { RunwayStyle } from "./animations/RunwayStyle";
import { LiveUI } from "./animations/LiveUI";
import { TikTokAppleReveal } from "./animations/TikTokAppleReveal";
import { LiveAppAnimation } from "./animations/LiveAppAnimation";

// 8 seconds at 30fps = 240 frames
const TOTAL_FRAMES = 240;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* DEFAULT - Live Code Version */}
      <Composition
        id="TunerPromo"
        component={LiveAppAnimation}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* SLOW ZOOM - Dramatic, elegant zoom */}
      <Composition
        id="SlowZoom"
        component={SlowZoom}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* FAST PACED - Quick energy cuts */}
      <Composition
        id="FastPaced"
        component={FastPaced}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* PAN ACROSS - Smooth horizontal pan */}
      <Composition
        id="PanAcross"
        component={PanAcross}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* RUNWAY STYLE - Zoom in, hold, pan, pull back (matches reference) */}
      <Composition
        id="RunwayStyle"
        component={RunwayStyle}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* LIVE UI - Camera over actual running app (no frames needed!) */}
      <Composition
        id="LiveUI"
        component={LiveUI}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* TIKTOK APPLE REVEAL - Premium UI tour over live website */}
      <Composition
        id="TikTokAppleReveal"
        component={TikTokAppleReveal}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ url: "http://localhost:5173" }}
      />

      {/* Debug version with keyframe info overlay (9:16) */}
      <Composition
        id="TunerPromoDebug"
        component={FrameSequenceDebug}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Landscape version - 16:9 horizontal */}
      <Composition
        id="TunerPromoLandscape"
        component={FrameSequence}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
