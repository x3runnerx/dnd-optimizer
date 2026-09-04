# D20 Campaign Companion

A D&D 5e campaign and character management app with an ability optimizer, built as a web app and mobile Android app via Capacitor.

## What It Does

- **Campaign tracking** — Create and manage multiple campaigns
- **Character sheets** — Track race, class, level, ability scores, skills, saving throws, abilities/traits/feats, and notes
- **Ability optimizer** — Get tailored recommendations per class with transparent math (attack bonuses, save DCs, HP estimates, best skills)
- **SRD data engine** — 12 classes, 12 races, 18 skills, all computed client-side
- **Offline mobile** — All data stored locally on device, no internet required

## Web Preview

The web version runs with an Express + SQLite backend. The deployed preview is in the conversation above.

## Building the Android App

### Prerequisites

1. **Android Studio** (latest stable) — [Download here](https://developer.android.com/studio)
2. **Java JDK 17** (bundled with Android Studio)
3. **Node.js 18+** and npm

### Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the mobile web assets and sync to Android:**
   ```bash
   ./build-mobile.sh
   ```
   This builds with `VITE_STORAGE_MODE=mobile` so the app uses on-device localStorage instead of a backend server.

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Run on a device or emulator:**
   - In Android Studio, let Gradle sync finish
   - Connect your Android phone (USB debugging enabled) or start an AVD emulator
   - Click the green Run button

5. **Build a release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

   For a debug APK (faster, no signing needed):
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   The debug APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

### Sideload on Your Phone

1. Transfer the APK to your Android phone
2. Enable "Install unknown apps" in your phone's settings
3. Open the APK file to install

### Play Store Publishing

For Play Store submission, you need to sign the app with a keystore and create an AAB (Android App Bundle):
```bash
# Generate a keystore (one-time)
keytool -genkey -v -keystore release.keystore -alias d20companion -keyalg RSA -keysize 2048 -validity 10000

# Build signed AAB
cd android
./gradlew bundleRelease
```
See [Capacitor's Google Play guide](https://capacitorjs.com/docs/android/deploying-to-google-play) for full details.

## Architecture

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui
- **Web backend:** Express + SQLite (Drizzle ORM)
- **Mobile storage:** localStorage via a local API shim (`client/src/lib/local-api.ts`)
- **Mobile wrapper:** Capacitor (Android)
- **D&D data:** All SRD-compatible, computed client-side in `client/src/lib/dnd-data.ts`

## Development

```bash
# Start dev server (web mode with backend)
npm run dev

# Build for web
npm run build

# Build for mobile + sync to Android
./build-mobile.sh
```

## Notes

- The app is named "D20 Campaign Companion" to avoid D&D trademark issues for public distribution
- All D&D rules data is SRD 5.1 compatible
- Data is stored locally on device — no cloud sync (planned for future)
