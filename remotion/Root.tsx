import React from 'react';
import { Composition } from 'remotion';
import { Animation1 } from './Animation1';
import { Animation2 } from './Animation2';
import { Animation3 } from './Animation3';
import { Animation4 } from './Animation4';
import { MainTourMultiStage } from './MainTourMultiStage';
import '../src/index.css';

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
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="MainTourMultiStage"
                component={MainTourMultiStage}
                durationInFrames={240}
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
