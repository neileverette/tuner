import { Easing, interpolate, useCurrentFrame, continueRender, delayRender } from "remotion";
import { useEffect, useState } from "react";

const fontFamily = "Orbitron";
const fontUrl = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap";

interface TunrTextProps {
  fontSize: number;
}

export const TunrText: React.FC<TunrTextProps> = ({ fontSize }) => {
  const frame = useCurrentFrame();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [handle] = useState(() => delayRender("Loading Orbitron font"));

  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    link.onload = () => {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
        continueRender(handle);
      });
    };

    return () => {
      document.head.removeChild(link);
    };
  }, [handle]);

  const letters = ["t", "u", "n", "r"];
  const startFrame = 60;
  const staggerDelay = 10; // 10 frames between each letter

  return (
    <div
      style={{
        display: "flex",
        fontFamily: `'${fontFamily}', sans-serif`,
        fontSize,
        fontWeight: 500,
        color: "white",
        letterSpacing: "0.02em",
      }}
    >
      {letters.map((letter, index) => {
        const letterStartFrame = startFrame + index * staggerDelay;

        // Opacity animation
        const opacity = interpolate(
          frame,
          [letterStartFrame, letterStartFrame + 20],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }
        );

        // Slide from right animation
        const translateX = interpolate(
          frame,
          [letterStartFrame, letterStartFrame + 25],
          [30, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }
        );

        return (
          <span
            key={index}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              display: "inline-block",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};
