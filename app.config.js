module.exports = {
    expo: {
        name: "Shelfie",
        slug: "shelfie-mobile-buyer",
        version: "1.0.0",
        scheme: "shelfie",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#b49a67"
        },
        ios: {
            bundleIdentifier: "com.shelfie.buyer",
            supportsTablet: true
        },
        android: {
            package: "com.shelfie.buyer",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#b49a67"
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
            cognitoRedirectSignIn: process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNIN || "shelfie://auth/callback",
            cognitoRedirectSignOut: process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNOUT || "shelfie://auth/signout",
            inventoryBackendUrl: process.env.EXPO_PUBLIC_PROD_INVENTORY_BACKEND_URL || process.env.EXPO_PUBLIC_INVENTORY_BACKEND_URL || "http://192.168.8.115:3000"
        },
        plugins: [
            "expo-router"
        ]
    }
};