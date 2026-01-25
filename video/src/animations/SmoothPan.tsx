import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
    Img,
    staticFile,
} from "remotion";

/**
 * SMOOTH PAN - SINGLE IMAGE
 * 
 * Instead of playback video, we use one giant high-res screenshot.
 * This guarantees 0 jitter and perfect smoothness.
 * 
 * Sequence:
 * 1. Start: Upper Left (Logo)
 * 2. Pan Down: Station Info
 * 3. Pan Right: Play Button
 */

const keyframes = [
    // 1. Start: Upper Left (Logo/Nav)
    // Image is 1920x1200. Canvas is 1080x1920.
    // We scale image up to cover height? Or zoom in?
    // Let's assume moderate zoom (1.5x) to see details.

    // To see Top-Left: Move Image Right (+) and Down (+)
    { frame: 0, x: 800, y: 500, scale: 1.5, rotate: 0 },
    { frame: 60, x: 800, y: 500, scale: 1.5, rotate: 0 }, // Pause

    // 2. Pan Down to Station/Song Info (Bottom Left)
    // Move Up (-) to see bottom
    { frame: 110, x: 800, y: -400, scale: 1.5, rotate: 0 },
    { frame: 140, x: 800, y: -400, scale: 1.5, rotate: 0 }, // Pause

    // 3. Pan Right to Play Button (Center/Right)
    // Move Left (-) to see Right side
    { frame: 240, x: -400, y: -400, scale: 1.5, rotate: 0 },
];

function getCameraState(frame: number, fps: number) {
    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
        if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
            fromIdx = i;
            break;
        }
        if (frame >= keyframes[keyframes.length - 1].frame) {
            fromIdx = keyframes.length - 2;
        }
    }

    const from = keyframes[fromIdx];
    const to = keyframes[Math.min(fromIdx + 1, keyframes.length - 1)];
    const duration = to.frame - from.frame;

    // Use simple easing for ultra-smooth mechanical feel, 
    // or spring for "organic" feel. User asked for "ease".
    // Spring with high damping is good for "weighty" ease.
    const progress = spring({
        frame: frame - from.frame,
        fps,
        config: {
            damping: 50,    // High damping = no bounce, smooth landing
            stiffness: 60,  // Soft movement
            mass: 1.5,      // Heavy feel
        },
        durationInFrames: duration,
    });

    return {
        x: interpolate(progress, [0, 1], [from.x, to.x]),
        y: interpolate(progress, [0, 1], [from.y, to.y]),
        scale: interpolate(progress, [0, 1], [from.scale, to.scale]),
        rotate: interpolate(progress, [0, 1], [from.rotate, to.rotate]),
    };
}

export const SmoothPan: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const camera = getCameraState(frame, fps);

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
            <AbsoluteFill
                style={{
                    transform: `
            translate(${camera.x}px, ${camera.y}px)
            scale(${camera.scale})
            rotate(${camera.rotate}deg)
          `,
                    transformOrigin: "center center",
                }}
            >
                <Img
                    src={staticFile("full-page-ui.png")}
                    style={{
                        // Reset to natural dimensions so we can pan around it
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "auto",
                        height: "100%", // Fit height initially, but scale will zoom it in
                        minWidth: "1920px", // Force it to obtain size
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
