# Android SDK Setup Guide for Windows

## Step 1: Install Java JDK 17

1. Download Oracle JDK 17 from:
   https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe
2. Run the installer with default settings
3. Verify installation:
   ```cmd
   java -version
   ```

## Step 2: Download Android SDK Command Line Tools

1. Go to: https://developer.android.com/studio#command-tools
2. Download "Command Line Tools only" for Windows
3. Create directory: `C:\Users\tusha\AppData\Local\Android\Sdk`
4. Extract the downloaded zip into this directory
5. You should have:
   `C:\Users\tusha\AppData\Local\Android\Sdk\cmdline-tools\latest\`

## Step 3: Set Environment Variables

1. Open System Properties → Environment Variables
2. Add these User variables:
   - **ANDROID_HOME**: `C:\Users\tusha\AppData\Local\Android\Sdk`
   - **JAVA_HOME**: `C:\Program Files\Java\jdk-17.0.x` (adjust version number)

3. Edit the **PATH** variable and add:
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`
   - `%ANDROID_HOME%\platform-tools`

## Step 4: Install Required Android SDK Components

Open Command Prompt and run:

```cmd
cd C:\Users\tusha\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
sdkmanager.bat "platform-tools"
sdkmanager.bat "platforms;android-34"
sdkmanager.bat "build-tools;34.0.0"
```

## Step 5: Verify Installation

```cmd
adb --version
sdkmanager.bat --list
```

## Step 6: Test with Expo

```cmd
cd apps/mobile
npx expo install --fix
expo start --android
```

## Alternative: Use Expo Development Build

Instead of local Android SDK, you can use Expo's cloud builds:

```cmd
cd apps/mobile
npx expo build:android -t apk
```

Or use EAS Build for production builds:

```cmd
npx eas build --platform android
```
