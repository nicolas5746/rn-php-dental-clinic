module.exports = function async(api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            ["nativewind/babel"],
            ["module:react-native-dotenv"],
            ["react-native-reanimated/plugin"],
            [
                "module-resolver",
                {
                    "root": ["./"],
                    "alias": { "@ui": "./components/ui" }
                }
            ]
        ]
    }
}