@echo off
echo 🧹 Cleaning build artifacts...

REM Clean Next.js build artifacts
if exist "apps\web\.next" (
  echo Removing .next directory...
  rmdir /s /q "apps\web\.next"
)

REM Clean Turbo cache
if exist ".turbo" (
  echo Removing .turbo cache...
  rmdir /s /q ".turbo"
)

REM Clean node_modules cache
if exist "apps\web\node_modules\.cache" (
  echo Removing node_modules cache...
  rmdir /s /q "apps\web\node_modules\.cache"
)

echo ✅ Cleanup complete!

REM Now run the build
echo 🚀 Starting build...
cd apps\web
call npm run build