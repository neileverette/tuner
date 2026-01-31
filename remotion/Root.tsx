import React from 'react';
import { Composition } from 'remotion';
import { Animation1 } from './tunr-ui-animations/Animation1';
import { Animation2 } from './tunr-ui-animations/Animation2';
import { Animation3 } from './tunr-ui-animations/Animation3';
import { Animation4, Animation4Schema } from './tunr-ui-animations/Animation4';
import '../src/index.css';

// Tunr Logo Animation imports (landscape 1920x1080)
import { MyComposition as TunrTemplate } from './tunr-logo-animations/Animation1';
import { TunrLogo } from './tunr-logo-animations/Animation2';
import { TunrReveal, tunrRevealSchema } from './tunr-logo-animations/Animation3';
import { Animation4 as TunrCosmicConvergence, animation4Schema } from './tunr-logo-animations/Animation4';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="Animation1"
                component={Animation1}
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="Animation2"
                component={Animation2}
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="Animation3"
                component={Animation3}
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="Animation4"
                component={Animation4}
                schema={Animation4Schema}
                defaultProps={{
                    startX: 0,
                    startY: 0,
                    startZoom: 1.7,
                    peakX: -200,
                    peakY: 0,
                    peakZoom: 2.2,
                    endX: -500,
                    endY: -30,
                    endZoom: 1.9,
                    peakFrame: 60,
                    endFrame: 150,
                }}
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* Tunr Animation Project (landscape 1920x1080) */}
            <Composition
                id="Tunr-Template"
                component={TunrTemplate}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="Tunr-Logo"
                component={TunrLogo}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="Tunr-Reveal"
                component={TunrReveal}
                schema={tunrRevealSchema}
                defaultProps={{
                    ringXStart: -521,
                    ringYStart: 1203,
                    ringXEnd: 960,
                    ringYEnd: 540,
                    circleSizeStart: 1262,
                    circleSizeEnd: 280,
                    strokeWidth: 20,
                    tiltXStart: 65,
                    tiltYStart: 0,
                    tiltZStart: 0,
                    titleText: "tunr",
                    titleWeight: 400,
                    titleSize: 120,
                    titleX: 0,
                    titleY: 87,
                    glowBlur: 60,
                    glowDistance: 1,
                    glowOpacity: 0.5,
                }}
                durationInFrames={510}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="Tunr-Reveal-4x3"
                component={TunrReveal}
                schema={tunrRevealSchema}
                defaultProps={{
                    ringXStart: -400,
                    ringYStart: 1203,
                    ringXEnd: 720,
                    ringYEnd: 540,
                    circleSizeStart: 1000,
                    circleSizeEnd: 240,
                    strokeWidth: 18,
                    tiltXStart: 65,
                    tiltYStart: 0,
                    tiltZStart: 0,
                    titleText: "tunr",
                    titleWeight: 400,
                    titleSize: 100,
                    titleX: 0,
                    titleY: 70,
                    glowBlur: 50,
                    glowDistance: 1,
                    glowOpacity: 0.5,
                }}
                durationInFrames={510}
                fps={30}
                width={1440}
                height={1080}
            />
            <Composition
                id="Tunr-CosmicConvergence"
                component={TunrCosmicConvergence}
                schema={animation4Schema}
                defaultProps={{
                    titleText: "tunr",
                    glowIntensity: 1,
                }}
                durationInFrames={264}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
