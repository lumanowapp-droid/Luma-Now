@echo off
echo Setting up Android development environment...

REM Set Java Home (adjust path if different)
set JAVA_HOME=C:\Program Files\Java\jdk-17
if not exist "%JAVA_HOME%" (
    echo ERROR: Java JDK not found at %JAVA_HOME%
    echo Please install Java JDK 17 and update JAVA_HOME in this script
    pause
    exit /b 1
)

REM Set Android Home
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
if not exist "%ANDROID_HOME%" (
    echo Creating Android SDK directory...
    mkdir "%ANDROID_HOME%"
)

REM Add to PATH
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\bin;%ANDROID_HOME%\platform-tools;%PATH%

REM Set environment variables permanently
setx JAVA_HOME "%JAVA_HOME%" /M
setx ANDROID_HOME "%ANDROID_HOME%" /M

echo Installing Android SDK components...
cd "%ANDROID_HOME%\cmdline-tools\bin"

REM Accept licenses
echo y | sdkmanager.bat --licenses

REM Install required components
sdkmanager.bat "platform-tools"
sdkmanager.bat "platforms;android-34"
sdkmanager.bat "build-tools;34.0.0"
sdkmanager.bat "emulator"
sdkmanager.bat "system-images;android-34;google_apis;x86_64"

echo Creating Android Virtual Device...
avdmanager.bat create avd -n test -k "system-images;android-34;google_apis;x86_64" --device "pixel"

echo Setup complete!
echo Please restart your command prompt and run: pnpm mobile
pause