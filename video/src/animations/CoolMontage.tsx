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
 * COOL MONTAGE CHOREOGRAPHY
 * High energy, snappy transitions, "music video" style camera work.
 *
 * Timeline (8 seconds / 240 frames):
 * [0-60]   The Reveal: Snap zoom in to Header (top left)
 * [60-90]  The Whip: Fast pan to Top Right (Search/Settings)
 * [90-150] The Drop: Rotate & Slide down to Album Art (Center)
 * [150-210] The Vibe: Slow, dramatic push-in on the music
 * [210-240] The Exit: Spring out to full view (tilted perspective)
 */

const keyframes = [
    // 1. Start: Upper Left (Logo/Nav)
    // Scale 1.3
    // Move Right (+) to see Left edge. Move Down (+) to see Top edge.
    { frame: 0, x: 1100, y: 150, scale: 1.3, rotate: 0 },
    { frame: 60, x: 1100, y: 150, scale: 1.3, rotate: 0 }, // Pause

    // 2. Pan Down to Station/Song Info (Bottom Left)
    // Keep X (+), Move Up (-) to see Bottom edge.
    { frame: 110, x: 1100, y: -250, scale: 1.3, rotate: 0 },
    { frame: 140, x: 1100, y: -250, scale: 1.3, rotate: 0 }, // Pause to read

    // 3. Pan Right to Play Button (Center/Right)
    // Move Left (-) to see Right side. Keep Y (-) to stay at bottom.
    // Add slight rotation for inertia
    { frame: 240, x: -500, y: -250, scale: 1.3, rotate: -2 },
];

function getCameraState(frame: number, fps: number) {
    // Find current keyframe segment
    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
        if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
            fromIdx = i;
            break;
        }
        // Clamp to last segment
        if (frame >= keyframes[keyframes.length - 1].frame) {
            fromIdx = keyframes.length - 2;
        }
    }

    const from = keyframes[fromIdx];
    const to = keyframes[Math.min(fromIdx + 1, keyframes.length - 1)];

    // Calculate relative progress in this segment
    // If the segment is instant (0 duration), handled safely by spring? No, avoid 0 duration.
    const duration = Math.max(1, to.frame - from.frame);
    const timeInSegment = Math.max(0, frame - from.frame);

    // Custom spring config for "Snappy" feel using Remotion's spring
    // We drive the interpolation with a spring for that "organic" kinetic feel
    const progress = spring({
        frame: timeInSegment,
        fps,
        config: {
            damping: 14,    // Low damping = bouncy/overshoot
            stiffness: 120, // High stiffness = fast
            mass: 0.6,      // Low mass = quick acceleration
        },
        durationInFrames: duration,
        // Note: providing durationInFrames to spring makes it behave more like an easing 
        // but with physical properties. For "Whip" pans, we want it tight.
    });

    return {
        x: interpolate(progress, [0, 1], [from.x, to.x]),
        y: interpolate(progress, [0, 1], [from.y, to.y]),
        scale: interpolate(progress, [0, 1], [from.scale, to.scale]),
        rotate: interpolate(progress, [0, 1], [from.rotate, to.rotate]),
    };
}

export const CoolMontage: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const camera = getCameraState(frame, fps);

    // Frame capture logic
    const frameNumber = String(frame).padStart(6, "0");
    const framePath = `frames/frame-${frameNumber}.png`;
    const isVertical = height > width;

    return (
        <AbsoluteFill style={{ backgroundColor: "#111", overflow: "hidden" }}>
            {/* Background "Glow" or blur effect to fill empty space when zoomed out */}
            <AbsoluteFill>
                <Img
                    src={staticFile(framePath)}
                    style={{
                        width: "100%",
                        height: "100%",
                        opacity: 0.3,
                        filter: "blur(20px)",
                        transform: "scale(1.5)",
                    }}
                />
            </AbsoluteFill>

            <AbsoluteFill
                style={{
                    transform: `
            translate(${camera.x}px, ${camera.y}px)
            scale(${camera.scale})
            rotate(${camera.rotate}deg)
          `,
                    transformOrigin: "center center",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)", // Add depth shadow
                }}
            >
                <Img
                    src={staticFile(framePath)}
                    style={{
                        // Maintain 16:9 aspect ratio of the captured frame
                        // On a 9:16 vertical canvas (1080x1920), height: "100%" (1920px) means width will be ~3413px
                        height: "100%",
                        width: "auto",
                        maxWidth: "none", // Prevent any auto-constraining

                        // Center the image initially so x=0 is the center
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
