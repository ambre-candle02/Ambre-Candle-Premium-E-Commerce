#!/usr/bin/env node

// Firebase Connection Test Script
console.log("🔥 Firebase Configuration Test\n");
console.log("=" . repeat(50));

// Check environment variables
const firebaseEnv = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log("\n✅ Environment Variables Status:\n");

let allConfigured = true;
firebaseEnv.forEach(env => {
    const value = process.env[env];
    if (value) {
        const masked = value.substring(0, 10) + "...";
        console.log(`✓ ${env}: ${masked}`);
    } else {
        console.log(`✗ ${env}: NOT SET`);
        allConfigured = false;
    }
});

console.log("\n" + "=" . repeat(50));

if (allConfigured) {
    console.log("\n✅ Firebase Credentials: PROPERLY CONFIGURED\n");
    console.log("Status: Firebase should connect successfully!");
    console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    process.exit(0);
} else {
    console.log("\n❌ Firebase Credentials: INCOMPLETE\n");
    console.log("Missing credentials - Firebase won't work!");
    console.log("\nFix: Add missing variables to .env.local");
    process.exit(1);
}
