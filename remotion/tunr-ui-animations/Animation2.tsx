import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, delayRender, continueRender } from 'remotion';
import { useState, useCallback } from 'react';
import App from '../../src/App';

export const Animation2: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, durationInFrames, fps } = useVideoConfig();

    // Pause rendering until app data is ready
    const [handle] = useState(() => delayRender('Animation2DataLoad'));
    const onReady = useCallback(() => {
        continueRender(handle);
    }, [handle]);

    // Trigger keyboard navigation: "Click faster as it sweeps"
    // Keyboard navigation (album changes) removed per user request for Animation 2

    // Standard Desktop Dimensions
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Target Dimensions (Mobile Portrait)
    const targetHeight = 1920;

    // Base scale to fill height (1.77)
    const fillScale = targetHeight / baseHeight;
    // Zoom defined below
    const startScale = fillScale;
    const endScale = fillScale * 1.6; // Slight continued zoom

    // --- TIMING CONFIGURATION ---
    const tIntroEnd = 30;    // 1.0s: Drift ends, Sweep starts
    const tSweepEnd = 165;   // 5.5s: Main Sweep finishes AND Return starts immediately
    const tEnd = 240;        // 8.0s: End

    // 1. SCALE: Zoom In (0-5.5s) -> Zoom Out (5.5s-8s)
    const currentScale = interpolate(
        frame,
        [0, tSweepEnd, tEnd],
        [startScale, endScale, startScale],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.sin)
        }
    );

    // 2. PAN X (Horizontal Sweep): Hold (0-1s) -> Sweep Out (1-5.5s) -> Return (5.5-8s)
    // Calculate max sweep based on MAX scale (at tSweepEnd)
    const maxScaledWidth = baseWidth * endScale;
    const totalSweepDistance = maxScaledWidth - width;

    const translateX = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd, tEnd],
        [0, 0, -totalSweepDistance, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.sin),
        }
    );

    // 3. PAN Y (Vertical): Drift Down (0-1s) -> Hold (1-5.5s) -> Return Up (5.5-8s)
    const translateY = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd, tEnd],
        [0, 40, 40, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.sin),
        }
    );

    // Lighting Effect: Peak at max sweep
    const shineOpacity = interpolate(
        frame,
        [0, tSweepEnd, tEnd],
        [0, 0.15, 0],
        { easing: Easing.linear }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#161616' }}>
            {/* Force .tuner to match our virtual desktop dimensions */}
            <style>
                {`
                    .tuner {
                        width: ${baseWidth}px !important;
                        height: ${baseHeight}px !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        transform-origin: top left !important;
                    }
                    /* Override viewport units to strictly fill the container */
                    .hero-artwork {
                        width: 100% !important;
                        height: 100% !important;
                    }
                    /* Ensure the gradient overlay also fills correctly */
                    .hero-artwork::after {
                         width: 100% !important;
                         height: 70% !important; /* Retaining relative visual height */
                    }
                `}
            </style>

            {/* 1. The UI Canvas - Wrapper handles the pan */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `translateX(${translateX}px) translateY(${translateY}px)`,
                overflow: 'visible' // Explicitly allow content to go out of bounds
            }}>
                {/* Inner container handles the Scale */}
                <div style={{
                    width: baseWidth,
                    height: baseHeight,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    transform: `scale(${currentScale})`,
                    transformOrigin: 'bottom left',
                }}>
                    <App isAnimationMode={true} onReady={onReady} />
                </div>
            </div>

            {/* 2b. "Slight Lighting Effect" - Moving Shine */}
            <AbsoluteFill style={{
                background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
                opacity: shineOpacity,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
            }} />

            {/* 4. Audio Track */}
            <Audio src={staticFile('audio.mp3')} />
        </AbsoluteFill>
    );
};
