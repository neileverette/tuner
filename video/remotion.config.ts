const { Config } = require("@remotion/cli/config");
const { enableVite } = require("@remotion/vite");
const path = require("path");

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

enableVite();

Config.overrideViteConfig((currentConfiguration) => {
    return {
        ...currentConfiguration,
        resolve: {
            ...currentConfiguration.resolve,
            alias: {
                ...(currentConfiguration.resolve?.alias || {}),
                "@": path.resolve(__dirname, "../src"),
            },
        },
        // Allow imports from parent directory
        server: {
            fs: {
                allow: [".."],
            },
        },
    };
});
