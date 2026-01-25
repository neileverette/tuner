# Security Quick Start Guide

This guide implements the **Phase 1 immediate security fixes** from the Security Audit.

## Prerequisites

- Access to the Tuner repository
- Node.js and npm installed
- Testing environment available

---

## Step 1: Install Security Dependencies

```bash
cd server
npm install helmet express-rate-limit express-validator
```

---

## Step 2: Update server/production.js

### 2.1 Add Imports (after line 8)

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
```

### 2.2 Configure CORS (replace line 85)

```javascript
// CORS configuration - restrict to known origins
const allowedOrigins = [
  'https://tunr-music.com',
  'https://www.tunr-music.com',
  'https://testing.tunr-music.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2.3 Add Security Headers (after CORS, before line 86)

```javascript
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Required for Vite in dev
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://api.radioparadise.com",
        "https://api.kexp.org",
        "https://www.nts.live",
        "https://de1.api.radio-browser.info"
      ],
      mediaSrc: ["'self'", "https:", "http:"], // Required for radio streams
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

### 2.4 Add Rate Limiting (after helmet)

```javascript
// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

const streamLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 stream requests per minute
  message: { error: 'Too many stream requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  }
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/stream/', streamLimiter);
```

---

## Step 3: Update package.json

Add to `server/package.json` dependencies:

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "resend": "^6.8.0",
    "helmet": "^8.0.0",
    "express-rate-limit": "^7.4.1",
    "express-validator": "^7.2.0"
  }
}
```

---

## Step 4: Test Locally

```bash
# Start development server
npm run dev

# Test in browser
open http://localhost:5173

# Verify:
# 1. App loads correctly
# 2. Stations play
# 3. No CORS errors in console
# 4. Security headers present (check Network tab)
```

### Check Security Headers

Open DevTools → Network → Select any request → Headers tab

Look for:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`
- `Content-Security-Policy`

---

## Step 5: Deploy to Testing

```bash
# Commit changes
git add server/package.json server/production.js
git commit -m "security: add CORS restrictions, security headers, and rate limiting"

# Push to testing branch
git push origin testing

# Monitor deployment
# https://github.com/neileverette/tuner/actions
```

---

## Step 6: Verify in Testing Environment

```bash
# Test testing.tunr-music.com
curl -I https://testing.tunr-music.com

# Should see security headers in response
```

### Test Rate Limiting

```bash
# Make rapid requests (should get rate limited after 30)
for i in {1..35}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://testing.tunr-music.com/api/stream/somafm/groovesalad
done

# Should see 429 (Too Many Requests) after limit
```

### Test CORS

```bash
# Test from unauthorized origin (should fail)
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://testing.tunr-music.com/api/channels

# Test from authorized origin (should succeed)
curl -H "Origin: https://testing.tunr-music.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://testing.tunr-music.com/api/channels
```

---

## Step 7: Deploy to Production

Once testing is verified:

```bash
# Merge to main
git checkout main
git merge testing
git push origin main

# Monitor production deployment
```

---

## Rollback Plan

If issues occur:

```bash
# Revert the commit
git revert HEAD

# Push to affected branch
git push origin testing  # or main
```

---

## Expected Impact

### ✅ Benefits
- Protected against CORS attacks
- XSS and clickjacking prevention
- Rate limiting prevents abuse
- Security headers improve overall security posture

### ⚠️ Potential Issues
- Legitimate high-traffic users may hit rate limits
- CORS restrictions may block legitimate origins (add to allowlist if needed)
- CSP may block some third-party resources (adjust directives if needed)

### 📊 Monitoring

Watch for:
- Increased 429 (rate limit) responses
- CORS errors in logs
- CSP violations (check browser console)

---

## Troubleshooting

### Issue: CORS errors in production

**Solution:** Add the origin to `allowedOrigins` array

### Issue: Rate limit too restrictive

**Solution:** Adjust `max` value in rate limiter configuration

### Issue: CSP blocking resources

**Solution:** Add domains to appropriate CSP directive

### Issue: App not loading

**Solution:** Check browser console for CSP violations, adjust directives

---

## Next Steps

After Phase 1 is stable:

1. Implement input validation (Phase 2)
2. Add Docker image scanning (Phase 3)
3. Set up automated security scanning (Phase 3)
4. Establish secrets rotation policy (Phase 4)

See [`SECURITY_AUDIT_AND_PLAN.md`](./SECURITY_AUDIT_AND_PLAN.md) for complete roadmap.

---

**Estimated Time:** 30-45 minutes  
**Risk Level:** Low (easily reversible)  
**Testing Required:** Yes (staging environment)