# Luma Now - Quick Start Guide

> Get Luma Now running locally in 10 minutes

## 🚀 Prerequisites

- **Node.js** 18+ (check: `node --version`)
- **pnpm** 8+ (install: `npm install -g pnpm`)
- **Git** (check: `git --version`)
- **Supabase Account** (free tier: [supabase.com](https://supabase.com))
- **AI Provider** (choose one):
  - Cloudflare Workers AI (recommended, cheapest)
  - Anthropic Claude
  - OpenAI GPT

---

## ⚡ 5-Minute Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/luma-now.git
cd luma-now

# Install dependencies
pnpm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy **Project URL** and **Anon Key** from Settings → API

### 3. Configure Environment Variables

```bash
# Copy example to .env.local
cp .env.example .env.local

# Edit .env.local with your credentials
# Minimum required:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Add at least ONE AI provider:
CLOUDFLARE_ACCOUNT_ID=your-id       # Recommended
CLOUDFLARE_API_TOKEN=your-token
# OR
ANTHROPIC_API_KEY=your-key
# OR
OPENAI_API_KEY=your-key

# NextAuth (generate secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 4. Run Database Migrations

```bash
# Option A: Using Supabase CLI (recommended)
supabase db push

# Option B: Manual (copy SQL from database/migrations/)
# 1. Open Supabase SQL Editor
# 2. Paste contents of 001_initial_schema.sql
# 3. Execute
# 4. Repeat for 002 and 003
```

### 5. Start Development Server

```bash
# Start web app
pnpm dev

# Open http://localhost:3000
```

🎉 **You're running Luma Now!**

---

## 📱 Mobile App Setup (Optional)

### Prerequisites
- **Expo CLI**: `npm install -g eas-cli`
- **iOS**: macOS with Xcode (for iOS simulator)
- **Android**: Android Studio with emulator

### Quick Start

```bash
# Navigate to mobile directory
cd apps/mobile

# Install dependencies
pnpm install

# Start Expo development server
pnpm start

# Options:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on physical device
```

---

## 🧪 Test Everything Works

### 1. Test Web App

```bash
# Open http://localhost:3000
# You should see the sign-in page
```

**Test Sign-In:**
1. Click "Send magic link to email"
2. Enter your email
3. Check inbox for magic link
4. Click link
5. You should be redirected to dashboard

**Test Brain Dump:**
1. In dashboard, find brain dump textarea
2. Type: "Buy groceries, call mom, finish report, go to gym, read book"
3. Select capacity: "Medium"
4. Click "Compress"
5. Wait for AI to process
6. Verify 5 tasks appear with colors and durations

### 2. Test Mobile App (if set up)

```bash
# Make sure Expo dev server is running
pnpm start

# Open Expo Go app on phone
# Scan QR code
# App should load
```

**Test Native Features:**
- Tap buttons → Verify haptic feedback
- Long-press microphone → Test voice input
- Swipe tasks → Test gestures

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot find module '@multi-platform-app/...'"

**Fix:**
```bash
# Rebuild workspace
pnpm install
pnpm build
```

### Issue: "Supabase connection failed"

**Fix:**
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is not paused (free tier pauses after inactivity)
3. Test connection:
```bash
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"
```

### Issue: "AI compression returns error"

**Fix:**
1. Verify at least ONE AI provider is configured
2. Test Cloudflare AI:
```bash
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/meta/llama-3.1-8b-instruct \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```
3. Check API key is valid and has credits

### Issue: "Port 3000 already in use"

**Fix:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 pnpm dev
```

### Issue: "Module not found: Can't resolve 'react-native-web'"

**Fix:**
```bash
# In apps/web directory
cd apps/web
pnpm add react-native-web
```

---

## 📚 Next Steps

### For Development:

1. **Read the Implementation Plan**
   - See [claude.md](./claude.md) for full architecture

2. **Understand the Codebase**
   ```
   luma-now/
   ├── apps/
   │   ├── web/          # Next.js web app
   │   └── mobile/       # Expo mobile app
   ├── packages/
   │   ├── ai/           # AI providers (Cloudflare, Anthropic, OpenAI)
   │   ├── ui/           # Shared UI components
   │   ├── store/        # Zustand state management
   │   └── types/        # TypeScript types
   └── database/
       └── migrations/   # SQL schema migrations
   ```

3. **Run Tests**
   ```bash
   # Unit tests
   pnpm test

   # Type check
   pnpm type-check

   # Lint
   pnpm lint
   ```

### For Production Deployment:

1. **Review Deployment Checklist**
   - See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - Set up OAuth providers (Google, Apple)
   - Configure monitoring (Sentry, PostHog)

2. **Test Thoroughly**
   - See [TESTING_GUIDE.md](./TESTING_GUIDE.md)
   - Test on multiple devices and browsers
   - Run accessibility audit

3. **Deploy**
   ```bash
   # Web (Vercel)
   vercel --prod

   # Mobile (Expo EAS)
   eas build --platform all --profile production
   eas submit --platform all --latest
   ```

---

## 🎯 Core Features to Explore

### 1. Brain Dump → AI Compression
- **Location:** [apps/web/components/brain-dump.tsx](apps/web/components/brain-dump.tsx)
- **How it works:** User types overwhelming thoughts → AI compresses to manageable tasks
- **AI Provider:** Defaults to Cloudflare, falls back to Anthropic/OpenAI

### 2. Capacity Selection
- **Location:** [packages/ui/src/screens/CapacityModal/](packages/ui/src/screens/CapacityModal/)
- **How it works:** User selects daily energy (Light/Medium/Full) → AI returns appropriate number of tasks
- **ADHD-Friendly:** Prevents overcommitment

### 3. Timeline View
- **Location:** [packages/ui/src/screens/Timeline/](packages/ui/src/screens/Timeline/)
- **How it works:** Tasks displayed in calm, ordered list with color coding
- **Features:** Swipe to complete, tap to focus

### 4. Focus Mode
- **Location:** [packages/ui/src/screens/FocusMode/](packages/ui/src/screens/FocusMode/)
- **How it works:** Full-screen, single-task view with elapsed timer
- **ADHD-Friendly:** No countdown pressure, calm environment

---

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev              # Web app (port 3000)
pnpm mobile           # Mobile app (Expo)

# Build
pnpm build            # Build all packages and apps
pnpm build:web        # Build web app only
pnpm build:mobile     # Build mobile app only

# Test
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report

# Lint & Format
pnpm lint             # Lint all files
pnpm format           # Format all files with Prettier

# Type Check
pnpm type-check       # Check TypeScript types

# Clean
pnpm clean            # Remove all build artifacts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Getting Help

- **Issues:** [GitHub Issues](https://github.com/your-org/luma-now/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/luma-now/discussions)
- **Email:** support@lumanow.com
- **Discord:** [Join Community](https://discord.gg/lumanow)

---

## 📖 Documentation

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide
- **[FINAL_IMPLEMENTATION_SUMMARY.md](./FINAL_IMPLEMENTATION_SUMMARY.md)** - Complete technical overview
- **[claude.md](./claude.md)** - Full epic implementation plan

---

**Built with ❤️ for ADHD minds everywhere**

Luma Now: A calm system that happens to run everywhere.
