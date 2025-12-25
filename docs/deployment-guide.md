# Enterprise SaaS Platform Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Enterprise SaaS Platform in production environments. The platform is designed for high availability, scalability, and enterprise-grade security.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Security Configuration](#security-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

## Prerequisites

### System Requirements

- **Node.js**: v18.0 or higher
- **Database**: PostgreSQL 15+ with Supabase
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: Minimum 50GB SSD
- **Network**: High-speed internet connection
- **SSL Certificates**: Valid SSL certificates for all domains

### Required Services

1. **Supabase** (Database and Authentication)

   - Supabase Project URL
   - Service Role Key
   - Anon Key

2. **Cloud Infrastructure**

   - Vercel (Primary hosting)
   - CloudFlare (CDN and DNS)
   - AWS S3 (File storage)

3. **Monitoring Services**

   - Sentry (Error tracking)
   - DataDog (Metrics and APM)

4. **Communication**
   - SendGrid (Email service)
   - Slack (Team notifications)

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Encryption
ENCRYPTION_KEY=your_256_bit_encryption_key
JWT_SECRET=your_jwt_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_api_key
DATADOG_APP_KEY=your_datadog_app_key

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
AWS_REGION=us-east-1

# CDN
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_zone_id

# Security
CSP_REPORT_URI=https://yourdomain.com/api/csp-report
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=900000
```

### 2. SSL Certificate Setup

#### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using CloudFlare

1. Enable SSL/TLS in CloudFlare dashboard
2. Set SSL mode to "Full (strict)"
3. Enable "Always Use HTTPS"

## Database Configuration

### 1. Supabase Setup

1. **Create New Project**

   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create new project
   - Note the Project URL and API keys

2. **Database Schema**

   ```bash
   # Run migrations
   npx supabase db push

   # Or manually execute SQL files
   psql -h your-supabase-host -U postgres -d postgres -f database/migrations/001_initial_schema.sql
   ```

3. **Row Level Security (RLS)**

   - Ensure RLS is enabled on all tables
   - Verify policies are correctly configured

4. **Database Backup**

   ```bash
   # Automated daily backups
   supabase db dump --data-only > backup_$(date +%Y%m%d).sql

   # Point-in-time recovery
   supabase db reset --linked
   ```

### 2. Performance Optimization

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Optimize configuration for production
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Apply changes
SELECT pg_reload_conf();
```

## Security Configuration

### 1. Authentication & Authorization

1. **OAuth Providers**

   - Configure Google, GitHub, Microsoft OAuth
   - Set up custom OAuth provider if needed

2. **Multi-Factor Authentication (MFA)**

   - Enable TOTP-based MFA
   - Configure backup codes

3. **Role-Based Access Control (RBAC)**

   ```sql
   -- Verify default roles are created
   SELECT * FROM roles WHERE is_system = true;

   -- Check user role assignments
   SELECT * FROM user_roles WHERE expires_at IS NULL;
   ```

### 2. API Security

1. **Rate Limiting**

   ```typescript
   // Verify rate limiting configuration
   import { apiGateway } from "@/lib/api/api-gateway";

   console.log("Rate limits configured:", apiGateway.getAPIDocumentation());
   ```

2. **Input Validation**

   - All API endpoints validate input
   - SQL injection protection via parameterized queries
   - XSS protection via Content Security Policy

3. **Encryption**

   ```typescript
   // Verify encryption service
   import { encryptionService } from "@/lib/security/encryption-service";

   const encrypted = encryptionService.encrypt("sensitive data");
   console.log("Encryption working:", !!encrypted.encrypted);
   ```

### 3. Network Security

1. **Firewall Rules**

   ```bash
   # UFW (Ubuntu)
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **VPN Access**

   - Configure VPN for administrative access
   - Use WireGuard or OpenVPN

3. **Intrusion Detection**
   - Install fail2ban
   - Configure log monitoring

## Deployment Steps

### 1. Build Application

```bash
# Install dependencies
npm install

# Run tests
npm run test:all

# Build application
npm run build

# Analyze bundle
npm run analyze
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all environment variables
```

#### Option B: GitHub Integration

1. Connect repository to Vercel
2. Configure build settings
3. Set environment variables in dashboard
4. Enable automatic deployments

### 3. Database Migration

```bash
# Run migrations
supabase db push

# Verify migration
supabase db diff
```

### 4. Post-Deployment Verification

```bash
# Check application health
curl -f https://yourdomain.com/api/health

# Verify database connection
curl -f https://yourdomain.com/api/tenant/test

# Test authentication
curl -f https://yourdomain.com/api/auth/user
```

## Monitoring and Logging

### 1. Application Monitoring

1. **Sentry Configuration**

   ```typescript
   // sentry.client.config.ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

2. **DataDog APM**

   ```typescript
   // datadog.ts
   import { tracer } from "dd-trace";

   tracer.init({
     service: "enterprise-saas",
     env: process.env.NODE_ENV,
   });
   ```

### 2. Database Monitoring

```sql
-- Monitor slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor connections
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';

-- Monitor disk usage
SELECT pg_size_pretty(pg_database_size('postgres')) as db_size;
```

### 3. Log Aggregation

1. **Structured Logging**

   ```typescript
   import { logger } from "@/lib/monitoring/logger";

   logger.info(
     "User action",
     { user_id: "123", action: "login" },
     {
       tenant_id: "tenant-123",
       user_id: "123",
     }
   );
   ```

2. **Log Retention**
   - Application logs: 30 days
   - Audit logs: 7 years
   - Security logs: 7 years
   - Performance metrics: 1 year

## Backup and Disaster Recovery

### 1. Automated Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# File backup
aws s3 sync /app/uploads s3://your-bucket/backups/files_$DATE

# Configuration backup
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz .env* config/

# Upload to S3
aws s3 cp $BACKUP_DIR/ s3://your-backup-bucket/ --recursive

# Clean local backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

### 2. Disaster Recovery Plan

1. **Recovery Time Objective (RTO)**: 1 hour
2. **Recovery Point Objective (RPO)**: 15 minutes

#### Recovery Steps

```bash
# 1. Restore database
psql $DATABASE_URL < backup_20231223_120000.sql

# 2. Restore files
aws s3 sync s3://your-backup-bucket/files_20231223_120000/ /app/uploads

# 3. Restart services
sudo systemctl restart nginx
sudo systemctl restart enterprise-saas

# 4. Verify system health
npm run health-check
```

### 3. Testing Recovery

```bash
# Run disaster recovery test
npm run test:disaster-recovery

# Expected output:
# ✓ Database backup restoration
# ✓ File backup restoration
# ✓ Configuration restoration
# ✓ Service health checks
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX CONCURRENTLY idx_tasks_session_id ON tasks(session_id);
CREATE INDEX CONCURRENTLY idx_user_profiles_tenant_id ON user_profiles(tenant_id);

-- Analyze query performance
ANALYZE;

-- Update table statistics
VACUUM ANALYZE;
```

### 2. Application Caching

```typescript
// Configure Redis caching
import { cacheService } from "@/lib/performance/cache-service";

// Cache user sessions
cacheService.set(`session:${sessionId}`, userData, 3600);

// Cache tenant configuration
cacheService.set(`tenant:${tenantId}:config`, config, 1800);

// Use cache in API routes
export async function GET(request: NextRequest) {
  const cached = cacheService.get(`data:${cacheKey}`);
  if (cached) {
    return NextResponse.json(cached);
  }

  // ... fetch fresh data
  cacheService.set(`data:${cacheKey}`, freshData, 300);
  return NextResponse.json(freshData);
}
```

### 3. CDN Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["your-cdn-domain.com"],
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   ```bash
   # Check connection
   pg_isready -h your-supabase-host -p 5432

   # Check SSL
   psql "postgresql://user:pass@host:5432/db?sslmode=require"
   ```

2. **Authentication Issues**

   ```typescript
   // Verify JWT secret
   console.log("JWT_SECRET configured:", !!process.env.JWT_SECRET);

   // Check token expiration
   const decoded = jwt.decode(token);
   console.log("Token expires:", decoded?.exp);
   ```

3. **Performance Issues**

   ```sql
   -- Check slow queries
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   WHERE mean_time > 100
   ORDER BY mean_time DESC;

   -- Check index usage
   SELECT schemaname, tablename, indexname, idx_scan
   FROM pg_stat_user_indexes
   WHERE idx_scan = 0;
   ```

### Monitoring Commands

```bash
# System resources
htop
df -h
free -m

# Application logs
tail -f logs/application.log
tail -f logs/error.log

# Database logs
tail -f /var/log/postgresql/postgresql-*.log

# Network monitoring
netstat -tulpn
ss -tulpn
```

## Maintenance

### Regular Tasks

1. **Daily**

   - Monitor application health
   - Check error rates
   - Verify backup completion

2. **Weekly**

   - Review performance metrics
   - Update dependencies
   - Check security logs

3. **Monthly**
   - Security audit
   - Performance optimization
   - Disaster recovery testing
   - Capacity planning review

### Automated Maintenance

```bash
#!/bin/bash
# maintenance.sh

# Database maintenance
supabase db reset --linked

# Security updates
npm audit fix

# Performance analysis
npm run analyze

# Backup verification
aws s3 ls s3://your-backup-bucket/

# Health check
npm run health-check
```

### Update Procedures

1. **Dependencies**

   ```bash
   # Check for updates
   npm outdated

   # Update dependencies
   npm update

   # Test updates
   npm run test:all
   npm run build
   ```

2. **Database Migrations**

   ```bash
   # Create migration
   supabase migration new feature_description

   # Test migration
   supabase db diff

   # Apply to production
   supabase db push
   ```

This deployment guide provides a comprehensive foundation for deploying and maintaining the Enterprise SaaS Platform in production environments. Regular review and updates of these procedures ensure continued reliability and security.
