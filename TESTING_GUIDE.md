# Luma Now - Cross-Platform Testing Guide

> Comprehensive testing guide for developers to ensure quality across web and mobile platforms.

## 🎯 Testing Philosophy

**Luma Now Testing Principles:**
1. **User-First**: Test real user journeys, not just individual features
2. **Cross-Platform**: Ensure consistent experience on web, iOS, and Android
3. **ADHD-Aware**: Verify calm interactions, no aggressive animations
4. **Accessibility**: Screen readers, keyboard navigation, reduced motion
5. **Performance**: Fast interactions (<100ms feedback), smooth animations

---

## 📱 Platform-Specific Testing

### **Web Application (Next.js)**

#### **Local Development Testing**

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Start development server
pnpm dev

# 4. Open browser
# Navigate to http://localhost:3000
```

#### **Testing Checklist - Web**

**Authentication:**
- [ ] Sign in with Google
  - Click "Continue with Google"
  - Verify redirect to Google login
  - Complete OAuth flow
  - Verify redirect back to dashboard
- [ ] Sign in with Apple
  - Click "Continue with Apple"
  - Verify Apple ID login
  - Complete OAuth flow
  - Verify redirect back to dashboard
- [ ] Magic link email
  - Enter email address
  - Click "Send magic link"
  - Check email inbox
  - Click magic link
  - Verify redirect to dashboard
- [ ] Sign out
  - Click sign out button
  - Verify redirect to sign-in page
  - Verify session cleared

**Brain Dump Feature:**
- [ ] Enter text in brain dump
  - Type at least 50 characters
  - Verify auto-growing textarea
  - Verify character count display
- [ ] Select capacity
  - Click capacity selector
  - Choose "Light" (3 tasks)
  - Choose "Medium" (5 tasks)
  - Choose "Full" (7 tasks)
- [ ] Compress brain dump
  - Click "Compress" button
  - Verify processing state (animated dots)
  - Wait for AI response
  - Verify tasks appear
  - Verify correct number of tasks per capacity
- [ ] Error handling
  - Try empty brain dump (should show error)
  - Try very long text (>2000 chars, should show error)
  - Disconnect internet and try (should show error)

**Timeline View:**
- [ ] View tasks
  - Verify tasks display with correct colors
  - Verify durations shown
  - Verify task order
- [ ] Complete task
  - Click task checkbox
  - Verify task marked complete (not disappeared)
  - Verify fade effect
- [ ] Delete task (if implemented)
  - Swipe or click delete
  - Verify confirmation
  - Verify task removed

**Focus Mode:**
- [ ] Enter focus mode
  - Click task to focus
  - Verify full-screen mode
  - Verify timer starts
- [ ] Timer functionality
  - Verify elapsed time displays
  - Wait 1 minute
  - Verify time updates
- [ ] Complete in focus mode
  - Click "Complete" button
  - Verify task marked done
  - Verify exit to timeline
- [ ] Exit focus mode
  - Click back/exit button
  - Verify return to timeline

**Settings:**
- [ ] Theme switching
  - Toggle Light/Dark/System
  - Verify theme changes immediately
  - Verify persistence across page reloads
- [ ] Reduced motion
  - Enable reduced motion
  - Verify animations disabled
  - Verify static states used
- [ ] Accessibility settings
  - Test font size adjustments
  - Test high contrast mode

**Responsive Design:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

---

### **iOS App (Expo/React Native)**

#### **Local Development Testing**

```bash
# 1. Navigate to mobile directory
cd apps/mobile

# 2. Install dependencies
pnpm install

# 3. Start Expo development server
pnpm start

# 4. Scan QR code with Expo Go app
# Or press 'i' for iOS simulator
```

#### **Testing Checklist - iOS**

**Authentication:**
- [ ] Sign in with Apple (Native)
  - Tap "Continue with Apple"
  - Verify Face ID/Touch ID prompt
  - Complete authentication
  - Verify redirect to app
- [ ] Sign in with Google
  - Tap "Continue with Google"
  - Verify Google OAuth web view
  - Complete authentication
  - Verify redirect to app

**Brain Dump:**
- [ ] Voice input (iOS-specific)
  - Long-press microphone button
  - Speak brain dump
  - Verify speech-to-text
  - Verify text appears in input
- [ ] Haptic feedback
  - Tap buttons
  - Verify haptic feedback on each tap
  - Test with haptics disabled in settings

**Native Features:**
- [ ] Haptics
  - Task completion: Medium haptic
  - Button press: Light haptic
  - Error: Heavy haptic
  - Success: Success haptic pattern
- [ ] Gestures
  - Swipe right on task → Complete
  - Swipe left on task → Delete
  - Pull to refresh (if implemented)
  - Swipe down to dismiss modal
- [ ] Share extension (if implemented)
  - Share text from Notes app
  - Verify opens in brain dump
- [ ] Widget (if implemented)
  - Add widget to home screen
  - Verify displays today's tasks

**Permissions:**
- [ ] Microphone (for voice input)
  - First launch: Verify permission prompt
  - Deny: Verify graceful handling
  - Allow: Verify voice input works
- [ ] Notifications
  - First launch: Verify permission prompt
  - Test gentle nudges

**Device Testing:**
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 (standard)
- [ ] iPhone 14 Pro Max (large screen)
- [ ] iPad (tablet layout)

**iOS Versions:**
- [ ] iOS 15
- [ ] iOS 16
- [ ] iOS 17 (latest)

---

### **Android App (Expo/React Native)**

#### **Local Development Testing**

```bash
# 1. Navigate to mobile directory
cd apps/mobile

# 2. Start Expo development server
pnpm start

# 3. Press 'a' for Android emulator
# Or scan QR code with Expo Go app
```

#### **Testing Checklist - Android**

**Authentication:**
- [ ] Sign in with Google (Native)
  - Tap "Continue with Google"
  - Verify Google account selector
  - Complete authentication
  - Verify redirect to app
- [ ] Sign in with Apple (Web view)
  - Tap "Continue with Apple"
  - Verify Apple ID web view
  - Complete authentication
  - Verify redirect to app

**Android-Specific Features:**
- [ ] Back button handling
  - Press Android back button in each screen
  - Verify proper navigation
  - Verify exit confirmation on main screen
- [ ] Material Design
  - Verify Material You theming (Android 12+)
  - Verify ripple effects on buttons
  - Verify bottom sheet behavior

**Permissions:**
- [ ] Microphone
  - First launch: Verify permission prompt
  - Test voice input
- [ ] Notifications
  - Test notification channels
  - Verify gentle nudges appear

**Device Testing:**
- [ ] Samsung Galaxy (One UI)
- [ ] Google Pixel (stock Android)
- [ ] OnePlus (OxygenOS)
- [ ] Small screen device (< 6 inches)
- [ ] Large screen device (> 6.5 inches)
- [ ] Tablet (ChromeOS/Android tablet)

**Android Versions:**
- [ ] Android 11
- [ ] Android 12
- [ ] Android 13
- [ ] Android 14 (latest)

---

## 🧪 Automated Testing

### **Unit Tests**

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

**Key test files to create:**
```
apps/web/__tests__/
├── components/
│   ├── brain-dump.test.tsx
│   ├── task-card.test.tsx
│   └── capacity-selector.test.tsx
├── utils/
│   ├── ai-compression.test.ts
│   └── task-validation.test.ts
└── api/
    ├── compress.test.ts
    └── schedule.test.ts
```

### **Integration Tests**

```bash
# Run integration tests
pnpm test:integration
```

**Test scenarios:**
- Complete user journey: Sign up → Brain dump → Task creation → Focus mode
- AI provider fallback: Cloudflare fails → Anthropic → OpenAI
- Rate limiting: Multiple rapid requests

### **E2E Tests (Playwright/Cypress)**

```bash
# Install Playwright
pnpm add -D @playwright/test

# Run E2E tests
pnpm test:e2e
```

**Critical E2E flows:**
1. **New user onboarding**
   - Sign up with Google
   - Complete brain dump
   - View compressed tasks
   - Complete first task

2. **Returning user**
   - Sign in
   - View existing tasks
   - Enter focus mode
   - Complete task

3. **Mobile-specific**
   - Voice input → Brain dump → Tasks
   - Swipe gestures on tasks
   - Haptic feedback verification

---

## ♿ Accessibility Testing

### **Screen Reader Testing**

**VoiceOver (iOS/macOS):**
```bash
# Enable VoiceOver
# iOS: Settings → Accessibility → VoiceOver
# macOS: System Settings → Accessibility → VoiceOver
```

**Test checklist:**
- [ ] All buttons have descriptive labels
- [ ] Forms announce input requirements
- [ ] Task list items read correctly
- [ ] Focus mode timer announces time updates
- [ ] Error messages are announced

**NVDA/JAWS (Windows):**
- [ ] Test with NVDA (free)
- [ ] Test with JAWS (if available)
- [ ] Verify semantic HTML structure

### **Keyboard Navigation**

- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists
- [ ] Focus indicators visible (2px outline)

### **Color Contrast**

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

- [ ] Text: 7:1 ratio (WCAG AAA)
- [ ] Large text: 4.5:1 ratio
- [ ] Interactive elements: 3:1 ratio
- [ ] Test with color blindness simulators

### **Reduced Motion**

```javascript
// Test in browser console
window.matchMedia('(prefers-reduced-motion: reduce)').matches // Should respect OS setting
```

- [ ] Enable reduced motion in OS settings
- [ ] Verify all animations disabled
- [ ] Verify instant state transitions
- [ ] Verify processing dots are static

---

## 🚀 Performance Testing

### **Web Performance**

**Lighthouse Audit:**
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000
```

**Target scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

### **Mobile Performance**

**React Native Performance Monitor:**
```javascript
// Enable in development
// Shake device → "Show Perf Monitor"
```

**Targets:**
- JS frame rate: 60 FPS
- UI frame rate: 60 FPS
- Bridge traffic: <100 messages/s

### **API Performance**

```bash
# Load test with Artillery
npx artillery quick --count 100 --num 10 http://localhost:3000/api/compress
```

**Targets:**
- API response time: <200ms (p95)
- AI compression: <3s (p95)
- Database queries: <50ms

---

## 🔍 Manual Testing Scenarios

### **Scenario 1: Overwhelmed User (ADHD Focus)**

**Goal:** Test the core value proposition

1. Sign in with Google
2. Brain dump: "Call dentist, email mom, fix bug in app, grocery shopping, gym, prepare presentation, respond to slack messages, water plants, book vacation"
3. Select capacity: Light (3 tasks)
4. Compress
5. **Expected:** AI returns 3 high-priority tasks
6. **Verify:** Tasks are in calm, manageable order

### **Scenario 2: Daily Planning Routine**

**Goal:** Test consistency and reliability

1. Open app (returning user)
2. View yesterday's completed tasks
3. Brain dump today's thoughts
4. Select capacity based on energy
5. Complete tasks throughout day
6. Use focus mode for deep work
7. **Verify:** Smooth, distraction-free experience

### **Scenario 3: Network Interruption**

**Goal:** Test offline resilience

1. Start brain dump
2. Disconnect from internet
3. Complete brain dump
4. Click "Compress"
5. **Expected:** Clear error message
6. Reconnect to internet
7. Retry compression
8. **Expected:** Works immediately

### **Scenario 4: Accessibility Power User**

**Goal:** Test full accessibility

1. Enable VoiceOver/TalkBack
2. Navigate entirely with screen reader
3. Complete brain dump
4. Navigate to timeline
5. Complete task
6. **Verify:** All interactions accessible

---

## 🐛 Bug Reporting Template

When you find a bug, report using this template:

```markdown
## Bug Report

**Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [...]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Video:**
[Attach visual proof]

**Environment:**
- Platform: [Web/iOS/Android]
- Device: [iPhone 14/Pixel 7/Desktop]
- OS Version: [iOS 17/Android 13/macOS Sonoma]
- App Version: [1.0.0]
- Browser (if web): [Chrome 120]

**Console Logs:**
```
[Paste relevant console errors]
```

**Severity:**
- [ ] Critical (app crashes, data loss)
- [ ] High (feature broken, but workaround exists)
- [ ] Medium (UI bug, minor functionality issue)
- [ ] Low (cosmetic, typo)
```

---

## ✅ Pre-Release Testing Checklist

### **Before Each Release:**

- [ ] All automated tests passing
- [ ] Manual testing on 3+ devices per platform
- [ ] Accessibility audit completed
- [ ] Performance benchmarks met
- [ ] No console errors or warnings
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring/analytics verified
- [ ] User-facing documentation updated

---

## 📚 Testing Tools Reference

| Tool | Purpose | Command |
|------|---------|---------|
| Jest | Unit tests | `pnpm test` |
| Playwright | E2E tests | `pnpm test:e2e` |
| Lighthouse | Performance audit | `lhci autorun` |
| Expo Go | Mobile development | `pnpm mobile` |
| React DevTools | Component debugging | Browser extension |
| Flipper | React Native debugging | Desktop app |

---

## 🎓 Testing Best Practices

1. **Test Early, Test Often**
   - Run tests before every commit
   - Use pre-commit hooks

2. **Test Real Scenarios**
   - Don't just test happy paths
   - Test edge cases and errors

3. **ADHD-Aware Testing**
   - Time yourself completing tasks
   - If something feels stressful, it's a bug
   - Verify calm, peaceful interactions

4. **Cross-Platform Parity**
   - Same feature should feel the same
   - Account for platform differences (haptics, gestures)

5. **Regression Testing**
   - Keep a changelog of bugs
   - Re-test old bugs with each release

---

**Happy Testing! 🧪**

Remember: Every bug you catch before users do is a better experience for someone with ADHD trying to plan their day.
