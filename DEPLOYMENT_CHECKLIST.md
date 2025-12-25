# Luma Now - Production Deployment Checklist

> Complete this checklist before deploying to production. Check off each item as you complete it.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Configuration

#### **Required for Web App (Vercel/Railway/etc.)**

```bash
# Supabase Configuration (CRITICAL - App won't work without these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI Provider - Cloudflare Workers AI (Default & Recommended)
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token

# AI Provider - Anthropic Claude (Optional Fallback)
ANTHROPIC_API_KEY=your-anthropic-api-key

# AI Provider - OpenAI (Optional Fallback)
OPENAI_API_KEY=your-openai-api-key

# OAuth Providers (Required for Google/Apple Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

APPLE_CLIENT_ID=com.lumanow.app
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour Apple Private Key Here\n-----END PRIVATE KEY-----

# NextAuth (Required for session management)
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Analytics & Monitoring (Optional but Recommended)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
NEXT_PUBLIC_ENABLE_HAPTICS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

#### **Required for Mobile App (Expo EAS)**

Set these as Expo secrets:
```bash
expo-supabase-url → NEXT_PUBLIC_SUPABASE_URL value
expo-supabase-anon-key → NEXT_PUBLIC_SUPABASE_ANON_KEY value
```

---

### 2. Supabase Setup

- [ ] **Create Supabase Project**
  - Go to [supabase.com](https://supabase.com)
  - Create new project
  - Copy Project URL and Anon Key

- [ ] **Run Database Migrations**
  ```bash
  # Navigate to database/migrations directory
  # Run migrations in order:
  psql $DATABASE_URL -f 001_initial_schema.sql
  psql $DATABASE_URL -f 002_luma_specific_tables.sql
  psql $DATABASE_URL -f 003_oauth_providers.sql
  ```

- [ ] **Configure Authentication**
  - Enable Email provider
  - Enable Google OAuth:
    - Add Google Client ID and Secret
    - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`
  - Enable Apple OAuth:
    - Add Apple configuration
    - Upload Services ID, Team ID, Key ID, Private Key

- [ ] **Enable Row Level Security (RLS)**
  - Verify all tables have RLS enabled
  - Test policies with test user accounts

- [ ] **Storage Buckets** (if using file uploads)
  - Create `avatars` bucket
  - Set RLS policies for bucket access

---

### 3. AI Provider Setup

#### Option A: Cloudflare Workers AI (Recommended - Cheapest)

- [ ] **Sign up for Cloudflare**
  - Go to [cloudflare.com](https://cloudflare.com)
  - Enable Workers AI

- [ ] **Get Credentials**
  - Account ID: Found in Cloudflare dashboard
  - API Token: Create with Workers AI permissions

- [ ] **Test API Access**
  ```bash
  curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/run/@cf/meta/llama-3.1-8b-instruct \
    -H "Authorization: Bearer $API_TOKEN" \
    -d '{"messages":[{"role":"user","content":"test"}]}'
  ```

#### Option B: Anthropic Claude (Optional Fallback)

- [ ] **Get API Key**
  - Sign up at [console.anthropic.com](https://console.anthropic.com)
  - Create API key
  - Add to environment variables

#### Option C: OpenAI (Optional Fallback)

- [ ] **Get API Key**
  - Sign up at [platform.openai.com](https://platform.openai.com)
  - Create API key
  - Add to environment variables

---

### 4. OAuth Provider Setup

#### Google OAuth

- [ ] **Create Google OAuth App**
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create new project or select existing
  3. Enable Google+ API
  4. Create OAuth 2.0 credentials
  5. Add authorized redirect URIs:
     - Web: `https://your-domain.com/auth/callback`
     - Supabase: `https://your-project.supabase.co/auth/v1/callback`

- [ ] **Copy Credentials**
  - Client ID → `GOOGLE_CLIENT_ID`
  - Client Secret → `GOOGLE_CLIENT_SECRET`

#### Apple Sign In

- [ ] **Configure Apple Developer Account**
  1. Go to [developer.apple.com](https://developer.apple.com)
  2. Create App ID with Sign in with Apple capability
  3. Create Services ID
  4. Create Private Key for Sign in with Apple
  5. Configure Return URLs:
     - `https://your-domain.com/auth/callback`
     - `https://your-project.supabase.co/auth/v1/callback`

- [ ] **Copy Credentials**
  - Services ID → `APPLE_CLIENT_ID`
  - Team ID → `APPLE_TEAM_ID`
  - Key ID → `APPLE_KEY_ID`
  - Private Key → `APPLE_PRIVATE_KEY`

---

### 5. Vercel Deployment (Web App)

- [ ] **Install Vercel CLI**
  ```bash
  npm install -g vercel
  ```

- [ ] **Link Project**
  ```bash
  cd apps/web
  vercel link
  ```

- [ ] **Set Environment Variables**
  ```bash
  # One by one or via Vercel dashboard
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
  # ... add all required env vars
  ```

- [ ] **Deploy**
  ```bash
  vercel --prod
  ```

- [ ] **Configure Custom Domain** (Optional)
  - Add domain in Vercel dashboard
  - Update DNS records
  - Update `NEXTAUTH_URL` to custom domain

---

### 6. Mobile App Deployment (Expo EAS)

- [ ] **Install EAS CLI**
  ```bash
  npm install -g eas-cli
  ```

- [ ] **Login to Expo**
  ```bash
  eas login
  ```

- [ ] **Configure Project**
  ```bash
  cd apps/mobile
  eas build:configure
  ```

- [ ] **Set Expo Secrets**
  ```bash
  eas secret:create --name expo-supabase-url --value "your-supabase-url"
  eas secret:create --name expo-supabase-anon-key --value "your-anon-key"
  ```

- [ ] **Build iOS App**
  ```bash
  eas build --platform ios --profile production
  ```

- [ ] **Build Android App**
  ```bash
  eas build --platform android --profile production
  ```

- [ ] **Submit to App Store**
  ```bash
  eas submit --platform ios --latest
  ```

- [ ] **Submit to Play Store**
  ```bash
  eas submit --platform android --latest
  ```

---

### 7. Security & Performance

- [ ] **Security Headers**
  - Verify CSP headers in `vercel.json`
  - Test with [securityheaders.com](https://securityheaders.com)

- [ ] **SSL/TLS**
  - Verify HTTPS is enforced
  - Check certificate validity

- [ ] **Rate Limiting**
  - Verify API rate limits are active
  - Test with multiple rapid requests

- [ ] **Error Tracking**
  - Configure Sentry or alternative
  - Test error reporting

- [ ] **Performance**
  - Run Lighthouse audit (target: >90 all scores)
  - Check Core Web Vitals
  - Test on slow 3G connection

---

### 8. Database Backup & Recovery

- [ ] **Enable Supabase Daily Backups**
  - Configure in Supabase dashboard
  - Verify backup schedule

- [ ] **Test Restore Process**
  - Download backup
  - Test restore to staging environment

---

### 9. Monitoring & Alerts

- [ ] **Set Up Monitoring**
  - Uptime monitoring (e.g., UptimeRobot, Better Stack)
  - Application monitoring (Sentry, LogRocket)
  - Database monitoring (Supabase dashboard)

- [ ] **Configure Alerts**
  - Error rate threshold alerts
  - Downtime alerts
  - Database performance alerts

---

### 10. Final Pre-Launch Checks

- [ ] **Test All User Flows**
  - [ ] Sign up with Google
  - [ ] Sign up with Apple
  - [ ] Brain dump → AI compression → Timeline
  - [ ] Focus mode
  - [ ] Capacity selection
  - [ ] Task completion
  - [ ] Settings modification

- [ ] **Test on Multiple Devices**
  - [ ] Desktop (Chrome, Safari, Firefox)
  - [ ] Mobile web (iOS Safari, Android Chrome)
  - [ ] iOS app (iPhone, iPad)
  - [ ] Android app (Phone, Tablet)

- [ ] **Accessibility**
  - [ ] Screen reader compatibility
  - [ ] Keyboard navigation
  - [ ] Color contrast (WCAG AA minimum)
  - [ ] Reduced motion support

- [ ] **Performance Benchmarks**
  - [ ] API response time < 200ms
  - [ ] Time to Interactive < 3s
  - [ ] First Contentful Paint < 1.5s

---

## 🚀 Launch Day Checklist

- [ ] **Final Environment Variable Review**
  - Double-check all production env vars
  - Verify no development/testing values

- [ ] **Deploy to Production**
  - Web app: `vercel --prod`
  - Mobile apps: Submit to stores

- [ ] **DNS & Domain**
  - Verify DNS propagation
  - Test production domain

- [ ] **Announcement**
  - Prepare launch announcement
  - Social media posts
  - Email to early users

---

## 📞 Support & Rollback Plan

### **If Something Goes Wrong:**

1. **Immediate Rollback (Vercel)**
   ```bash
   vercel rollback
   ```

2. **Check Logs**
   - Vercel logs: `vercel logs`
   - Supabase logs: Dashboard → Logs
   - Sentry errors: Check Sentry dashboard

3. **Database Rollback**
   - Restore from latest Supabase backup
   - Verify data integrity

4. **Communication**
   - Post status update
   - Email users about issue
   - Provide ETA for fix

---

## ✅ Post-Launch Monitoring

### **First 24 Hours:**
- [ ] Monitor error rates every hour
- [ ] Check user sign-up flow completion rate
- [ ] Verify AI API usage and costs
- [ ] Review performance metrics

### **First Week:**
- [ ] Daily user engagement metrics
- [ ] AI model performance and accuracy
- [ ] Database query performance
- [ ] User feedback collection

### **First Month:**
- [ ] Monthly active users (MAU)
- [ ] Retention rate
- [ ] Feature usage analytics
- [ ] Cost analysis (AI, hosting, database)

---

## 🔐 Security Best Practices

✅ **Never commit:**
- API keys
- Private keys
- Service account credentials
- Database passwords

✅ **Always:**
- Use environment variables
- Rotate keys regularly
- Enable MFA on all accounts
- Review access logs monthly

---

## 💰 Cost Optimization

**Expected Monthly Costs (500 users):**

| Service | Cost |
|---------|------|
| Cloudflare Workers AI | $5-10 |
| Supabase (Pro) | $25 |
| Vercel (Pro) | $20 |
| Expo EAS | $29 |
| **Total** | **~$79-84/month** |

**Cost-Saving Tips:**
- Use Cloudflare AI (cheapest option)
- Start with Vercel Hobby plan (free)
- Use Supabase free tier until 10K MAU

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Expo EAS Docs](https://docs.expo.dev/eas)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Need Help?**
- GitHub Issues: [Report an issue](https://github.com/your-repo/issues)
- Email: support@lumanow.com
- Discord: [Join community](https://discord.gg/lumanow)

---

✨ **You're ready to launch Luma Now!** ✨
