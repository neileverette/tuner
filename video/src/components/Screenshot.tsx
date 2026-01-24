import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

interface ScreenshotProps {
  /** Filename in public/screenshots folder */
  src: string;
  /** Optional shadow depth */
  shadow?: "none" | "subtle" | "medium" | "strong";
  /** Border radius */
  borderRadius?: number;
  /** Optional device frame style */
  frame?: "none" | "browser" | "phone";
}

/**
 * Displays a screenshot with optional styling.
 */
export const Screenshot: React.FC<ScreenshotProps> = ({
  src,
  shadow = "medium",
  borderRadius = 12,
  frame = "none",
}) => {
  const shadowStyles = {
    none: "none",
    subtle: "0 4px 20px rgba(0, 0, 0, 0.2)",
    medium: "0 8px 40px rgba(0, 0, 0, 0.4)",
    strong: "0 20px 80px rgba(0, 0, 0, 0.6)",
  };

  if (frame === "browser") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: borderRadius + 4,
          overflow: "hidden",
          boxShadow: shadowStyles[shadow],
          background: "#1a1a1a",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 36,
            background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#febc2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#28c840",
            }}
          />
        </div>
        <Img
          src={staticFile(`screenshots/${src}`)}
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <Img
      src={staticFile(`screenshots/${src}`)}
      style={{
        borderRadius,
        boxShadow: shadowStyles[shadow],
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
      }}
    />
  );
};

interface ScreenshotContainerProps {
  children: React.ReactNode;
  background?: string;
}

/**
 * Container for screenshots with gradient background.
 */
export const ScreenshotContainer: React.FC<ScreenshotContainerProps> = ({
  children,
  background = "linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)",
}) => {
  return (
    <AbsoluteFill
      style={{
        background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
