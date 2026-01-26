import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { useEffect } from 'react';
import App from '../src/App';

export const MainTourMultiStage: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, durationInFrames, fps } = useVideoConfig();

    // Trigger keyboard navigation: "Click faster as it sweeps"
    useEffect(() => {
        // Sweep starts at 1.75s (approx frame 52).
        // Intervals decrease to simulate "faster" clicking.
        const triggerFrames = [
            15,             // RESET FOCUS: Switch to Album 2 at start
            70,             // Start Drifting
            95,             // +25
            115,            // +20
            130,            // +15
            142,            // +12
            152,            // +10
            160,            // +8
            167, 174, 180   // Rapid fire at end
        ];

        if (triggerFrames.includes(frame)) {
            window.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                bubbles: true
            }));
        }
    }, [frame]);

    // Standard Desktop Dimensions
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Target Dimensions (Mobile Portrait)
    const targetHeight = 1920;

    // Base scale to fill height (1.77)
    const fillScale = targetHeight / baseHeight;

    // Zoom Strategy:
    // 0s - 0.5s: Hold
    // 0.5s - 1.75s: Zoom to 1.5x (Fast initial zoom per user request "scales to 1.5")
    // 1.75s - End:  Slight drift or hold? Assuming continuous smooth zoom or hold. 
    // Let's keep a gentle zoom continuing to keeping it alive.
    const startScale = fillScale;
    const midScale = fillScale * 1.5;
    const endScale = fillScale * 1.6; // Slight continued zoom

    const currentScale = interpolate(
        frame,
        [0, Math.round(fps * 0.5), Math.round(fps * 1.75), durationInFrames],
        [startScale, startScale, midScale, endScale],
        { easing: Easing.bezier(0.25, 1, 0.5, 1) } // "Ease effects"
    );

    // Pan (Sweep) Strategy:
    // 0s - 0.5s: Hold
    // 0.5s - 1.75s: "Move to the right slower" (Slow Pan)
    // 1.75s - End: "Sweep... to final position" (Fast Pan)

    // Calculate max sweep based on MAX scale to ensure no black bars
    const maxScaledWidth = baseWidth * endScale;
    const totalSweepDistance = maxScaledWidth - width;

    const slowPanDist = totalSweepDistance * 0.15; // 15% progress in first phase

    const translateX = interpolate(
        frame,
        [0, Math.round(fps * 0.5), Math.round(fps * 1.75), durationInFrames],
        [0, 0, -slowPanDist, -totalSweepDistance],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            // Custom easing for the "Sweep" feel
            easing: Easing.bezier(0.2, 0, 0.2, 1)
        }
    );

    // Lighting Effect: A subtle "shine" moving across
    const shineOpacity = interpolate(
        frame,
        [0, durationInFrames / 2, durationInFrames],
        [0, 0.15, 0], // Subtle flash in the middle
        { easing: Easing.linear }
    );

    // No Vertical Pan (Strictly centered or top-aligned as preferred)
    const translateY = 0;

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
                    <App />
                </div>
            </div>

            {/* 2. The Spotlight Mask (Overlay) */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)`,
                pointerEvents: 'none',
            }} />

            {/* 2b. "Slight Lighting Effect" - Moving Shine */}
            <AbsoluteFill style={{
                background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
                opacity: shineOpacity,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
            }} />

            {/* 3. Optional: A 'Focus Ring' in the center */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 800,
                height: 800,
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
            }} />
        </AbsoluteFill>
    );
};
