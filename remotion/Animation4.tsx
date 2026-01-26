import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, delayRender, continueRender } from 'remotion';
import { useState, useCallback } from 'react';
import App from '../src/App';

export const Animation4: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, durationInFrames, fps } = useVideoConfig();

    // Pause rendering until app data is ready
    const [handle] = useState(() => delayRender('Animation4DataLoad'));
    const onReady = useCallback(() => {
        continueRender(handle);
    }, [handle]);

    // Animation 4: Reverse Sweep - sweeps RIGHT to LEFT (opposite of Animation3)
    // Uses slightly different timing and easing for variety

    // Standard Desktop Dimensions
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Target Dimensions (Mobile Portrait)
    const targetHeight = 1920;

    // Base scale to fill height (1.77)
    const fillScale = targetHeight / baseHeight;
    const startScale = fillScale;
    const endScale = fillScale * 1.7; // Slightly more zoom than Animation3

    // --- TIMING CONFIGURATION ---
    const tIntroEnd = 40;    // 1.33s: Drift ends, Sweep starts (slightly longer hold)
    const tSweepEnd = 170;   // 5.67s: Main Sweep finishes AND Return starts
    const tEnd = 240;        // 8.0s: End

    // 1. SCALE: Zoom In (0-5.67s) -> Zoom Out (5.67s-8s)
    const currentScale = interpolate(
        frame,
        [0, tSweepEnd, tEnd],
        [startScale, endScale, startScale],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1) // Smoother easing
        }
    );

    // 2. PAN X (Horizontal Sweep): REVERSE DIRECTION
    // Start from RIGHT and sweep LEFT, then return
    const maxScaledWidth = baseWidth * endScale;
    const totalSweepDistance = maxScaledWidth - width;

    const translateX = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd, tEnd],
        [-totalSweepDistance, -totalSweepDistance, 0, -totalSweepDistance * 0.2], // Reverse sweep direction
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1),
        }
    );

    // 3. PAN Y (Vertical): Different drift pattern - drift UP instead of down
    const translateY = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd, tEnd],
        [0, -30, -30, 0], // Negative for upward drift
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1),
        }
    );

    // Lighting Effect: Different timing - peak earlier
    const shineOpacity = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd * 0.6, tSweepEnd, tEnd],
        [0, 0.05, 0.18, 0.12, 0],
        { easing: Easing.bezier(0.33, 1, 0.68, 1) }
    );

    // Pulsing spotlight effect
    const spotlightPulse = interpolate(
        frame,
        [0, tIntroEnd, tSweepEnd, tEnd],
        [0.3, 0.35, 0.42, 0.3],
        { easing: Easing.inOut(Easing.ease) }
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
                    {/* Animation Mode with Welcome Modal */}
                    <App isAnimationMode={true} showWelcomeOverride={true} onReady={onReady} />
                </div>
            </div>

            {/* 2. The Spotlight Mask (Overlay) - with pulse */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at center, transparent ${25 + spotlightPulse * 15}%, rgba(0,0,0,${0.35 + spotlightPulse * 0.1}) 100%)`,
                pointerEvents: 'none',
            }} />

            {/* 2b. "Lighting Effect" - Moving Shine with different angle */}
            <AbsoluteFill style={{
                background: `linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)`,
                opacity: shineOpacity,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
            }} />

            {/* 3. Animated Focus Ring - pulsing */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 700 + Math.sin(frame / 20) * 50,
                height: 700 + Math.sin(frame / 20) * 50,
                border: '2px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                opacity: interpolate(frame, [0, 20, tEnd - 20, tEnd], [0, 0.8, 0.8, 0]),
            }} />

            {/* 4. Secondary ring for depth */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 900 + Math.sin(frame / 15) * 40,
                height: 900 + Math.sin(frame / 15) * 40,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                opacity: interpolate(frame, [0, 25, tEnd - 25, tEnd], [0, 0.5, 0.5, 0]),
            }} />

            {/* 5. Audio Track */}
            <Audio src={staticFile('audio.mp3')} />
        </AbsoluteFill>
    );
};
