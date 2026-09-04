#!/bin/bash
# Mobile build script for D20 Campaign Companion
# Builds the web assets with mobile storage mode and syncs to Android

set -e

echo "Building web assets (mobile mode)..."
VITE_STORAGE_MODE=mobile npm run build

echo "Syncing to Android..."
npx cap sync android

echo ""
echo "Done! To open in Android Studio:"
echo "  npx cap open android"
echo ""
echo "Then in Android Studio:"
echo "  1. Let Gradle sync finish"
echo "  2. Connect your Android device (USB debugging enabled) or use an emulator"
echo "  3. Click the Run button (green triangle)"
echo ""
echo "To build a release APK:"
echo "  cd android"
echo "  ./gradlew assembleRelease"
echo "  # APK will be at: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "Note: For Play Store submission, you'll need to sign the APK"
echo "  with a keystore. See: https://capacitorjs.com/docs/android/deploying-to-google-play"
