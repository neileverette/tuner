import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, delayRender, continueRender } from 'remotion';
import { useState, useCallback } from 'react';
import { z } from 'zod/v3';
import App from '../../src/App';

export const Animation4Schema = z.object({
    // Start state
    startX: z.number().min(-3000).max(3000),
    startY: z.number().min(-3000).max(3000),
    startZoom: z.number().min(0.5).max(5).step(0.01),
    // Peak/Middle state (center, scaled up)
    peakX: z.number().min(-3000).max(3000),
    peakY: z.number().min(-3000).max(3000),
    peakZoom: z.number().min(0.5).max(5).step(0.01),
    // End state (far right)
    endX: z.number().min(-3000).max(3000),
    endY: z.number().min(-3000).max(3000),
    endZoom: z.number().min(0.5).max(5).step(0.01),
    // Timing
    peakFrame: z.number().min(10).max(2000),
    endFrame: z.number().min(10).max(2000),
});

export type Animation4Props = z.infer<typeof Animation4Schema>;

export const Animation4: React.FC<Animation4Props> = ({
    startX = 0,
    startY = 0,
    startZoom = 1.7,
    peakX = -200,
    peakY = 0,
    peakZoom = 2.2,
    endX = -500,
    endY = -30,
    endZoom = 1.9,
    peakFrame = 60,
    endFrame = 150,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Pause rendering until app data is ready
    const [handle] = useState(() => delayRender('Animation4DataLoad'));
    const onReady = useCallback(() => {
        continueRender(handle);
    }, [handle]);

    // Standard Desktop Dimensions
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Target Dimensions (Mobile Portrait)
    const targetHeight = 1920;

    // Base scale to fill height
    const fillScale = targetHeight / baseHeight;

    // --- TIMING CONFIGURATION ---
    // Ensure timing values are valid and in order
    const tTotal = durationInFrames;
    const tPeak = Math.max(10, Math.min(peakFrame, tTotal - 20));
    const tEnd = Math.max(tPeak + 10, Math.min(endFrame, tTotal - 10));

    // Calculate scale values
    const scaleStart = fillScale * startZoom;
    const scalePeak = fillScale * peakZoom;
    const scaleEnd = fillScale * endZoom;

    // 4-state interpolation: start -> peak -> end -> back to start
    const currentScale = interpolate(
        frame,
        [0, tPeak, tEnd, tTotal],
        [scaleStart, scalePeak, scaleEnd, scaleStart],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1)
        }
    );

    const translateX = interpolate(
        frame,
        [0, tPeak, tEnd, tTotal],
        [startX, peakX, endX, startX],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1),
        }
    );

    const translateY = interpolate(
        frame,
        [0, tPeak, tEnd, tTotal],
        [startY, peakY, endY, startY],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.42, 0, 0.58, 1),
        }
    );

    // Lighting Effect
    const shineOpacity = interpolate(
        frame,
        [0, tPeak, tEnd, tTotal],
        [0, 0.18, 0.12, 0],
        { easing: Easing.bezier(0.33, 1, 0.68, 1) }
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


            {/* 2b. "Lighting Effect" - Moving Shine with different angle */}
            <AbsoluteFill style={{
                background: `linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)`,
                opacity: shineOpacity,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
            }} />


            {/* 5. Audio Track */}
            <Audio src={staticFile('audio.mp3')} />
        </AbsoluteFill>
    );
};
