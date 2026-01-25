import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from "remotion";
// Import from the parent src directory - configured via alias in remotion.config.ts
import App from "@/App";
// Import global css from parent to ensure styles are applied
import "../../../src/index.css";
import "../../../src/App.css";

/**
 *LIVE APP ANIMATION
 * 
 * Renders the actual React <App /> component and animates the camera over it.
 * This ensures high-fidelity rendering with working UI components (loaders, skeletal states, etc.)
 */

const keyframes = [
    // 1. Start: Upper Left (Logo/Nav)
    // Scale 1.5 zoom
    // Move Right (+) and Down (+) to see Top-Left corner
    { frame: 0, x: 800, y: 500, scale: 1.5, rotate: 0 },
    { frame: 60, x: 800, y: 500, scale: 1.5, rotate: 0 }, // Pause

    // 2. Pan Down to Station Info
    // Move Up (-) to see Bottom
    { frame: 110, x: 800, y: -400, scale: 1.5, rotate: 0 },
    { frame: 140, x: 800, y: -400, scale: 1.5, rotate: 0 }, // Pause

    // 3. Pan Right to Play Button
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

    const progress = spring({
        frame: frame - from.frame,
        fps,
        config: {
            damping: 50,
            stiffness: 60,
            mass: 1.5,
        },
        durationInFrames: duration,
    });

    return {
        x: interpolate(progress, [0, 1], [from.x, to.x]),
        y: interpolate(progress, [0, 1], [from.y, to.y]),
        scale: interpolate(progress, [0, 1], [from.scale, to.scale]),
    };
}

export const LiveAppAnimation: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const camera = getCameraState(frame, fps);

    // We need to render the App in a container that simulates a 1920x1080 desktop screen,
    // then scale/translate that "screen" within our 9:16 vertical video canvas.

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
            {/* 
        The "Virtual Desktop" Container 
        - Fixed size 1920x1080 (16:9)
        - This acts as the "browser window"
      */}
            <div
                style={{
                    width: 1920,
                    height: 1080,
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    // Apply camera transform to this container
                    transform: `
            translate(-50%, -50%)
            translate(${camera.x}px, ${camera.y}px)
            scale(${camera.scale})
          `,
                    transformOrigin: "center center",
                    backgroundColor: "#111", // App background
                }}
            >
                <App />
            </div>
        </AbsoluteFill>
    );
};
