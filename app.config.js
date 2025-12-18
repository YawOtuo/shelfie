module.exports = {
    expo: {
        name: "Livestockly",
        slug: "livestockly-mobile-buyer",
        version: "1.0.0",
        scheme: "livestockly",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#11964a"
        },
        ios: {
            bundleIdentifier: "com.livestockly.buyer",
            supportsTablet: true
        },
        android: {
            package: "com.livestockly.buyer",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#11964a"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false
        },
        web: {
            favicon: "./assets/favicon.png",
            bundler: "metro"
        },
        extra: {
            cognitoUserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
            cognitoWebClientId: process.env.EXPO_PUBLIC_COGNITO_WEB_CLIENT_ID,
            cognitoDomain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN,
            cognitoRedirectSignIn: process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNIN || "livestockly://auth/callback",
            cognitoRedirectSignOut: process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNOUT || "livestockly://auth/signout"
        }
    }
};