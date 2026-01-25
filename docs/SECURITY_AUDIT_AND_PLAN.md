# Security Audit & Implementation Plan

## Executive Summary

**Audit Date:** January 24, 2026  
**Application:** Tuner Radio Streaming Platform  
**Overall Security Status:** 🟢 Good (No critical vulnerabilities)

### Quick Stats
- ✅ **0 npm vulnerabilities** (frontend & backend)
- ⚠️ **5 medium-priority improvements** identified
- 🔒 **SSL/TLS:** Enabled via Let's Encrypt
- 🐳 **Container Security:** Alpine-based images (minimal attack surface)

---

## Security Scan Results

### ✅ Strengths

1. **Dependency Security**
   - Frontend: 0 vulnerabilities across 328 dependencies
   - Backend: 0 vulnerabilities across 76 dependencies
   - Regular updates via npm audit

2. **Infrastructure**
   - SSL/TLS certificates via Let's Encrypt
   - Alpine Linux base images (minimal footprint)
   - Multi-stage Docker builds (reduced attack surface)
   - Secrets managed via GitHub Secrets

3. **Code Quality**
   - `.gitignore` properly excludes sensitive files
   - Environment variables not hardcoded
   - Input validation on API endpoints

4. **Deployment**
   - Automated CI/CD with GitHub Actions
   - Separate staging/production environments
   - Container isolation

---

## ⚠️ Security Issues Identified

### 1. CORS Configuration - MEDIUM PRIORITY
**Location:** `server/production.js:85`  
**Issue:** Wildcard CORS allows any origin
```javascript
app.use(cors()); // Allows all origins
```

**Risk:** 
- Cross-site request forgery potential
- API abuse from unauthorized domains
- Data exfiltration risk

**Impact:** Medium (mitigated by read-only API)

---

### 2. Missing Security Headers - MEDIUM PRIORITY
**Location:** `server/production.js`  
**Issue:** No security headers configured

**Missing Headers:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`

**Risk:** XSS, clickjacking, MIME-type attacks

---

### 3. Rate Limiting - MEDIUM PRIORITY
**Location:** API endpoints  
**Issue:** No rate limiting on public endpoints

**Risk:**
- DDoS attacks
- Resource exhaustion
- API abuse

**Current State:** Only email alerts have rate limiting (1/hour/station)

---

### 4. Docker Image Scanning - LOW PRIORITY
**Location:** CI/CD pipeline  
**Issue:** No automated vulnerability scanning of Docker images

**Risk:** Unknown vulnerabilities in base images or dependencies

---

### 5. Secrets Rotation - LOW PRIORITY
**Location:** GitHub Secrets, Environment Variables  
**Issue:** No documented secrets rotation policy

**Current Secrets:**
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- DO_SSH_KEY
- RESEND_API_KEY

---

## 🔒 Security Implementation Plan

### Phase 1: Immediate Fixes (Week 1)

#### 1.1 Restrict CORS Origins
**Priority:** HIGH  
**Effort:** 15 minutes  
**Files:** `server/production.js`

```javascript
// Replace line 85
const allowedOrigins = [
  'https://tunr-music.com',
  'https://www.tunr-music.com',
  'https://testing.tunr-music.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### 1.2 Add Security Headers
**Priority:** HIGH  
**Effort:** 20 minutes  
**Files:** `server/production.js`

Install helmet:
```bash
cd server && npm install helmet
```

Add to server:
```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.radioparadise.com", "https://api.kexp.org", "https://www.nts.live"],
      mediaSrc: ["'self'", "https:", "http:"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

### Phase 2: Enhanced Protection (Week 2)

#### 2.1 Add Rate Limiting
**Priority:** MEDIUM  
**Effort:** 30 minutes  
**Files:** `server/production.js`

Install express-rate-limit:
```bash
cd server && npm install express-rate-limit
```

Add rate limiting:
```javascript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stream endpoint rate limit (more permissive)
const streamLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many stream requests, please slow down.',
});

app.use('/api/', apiLimiter);
app.use('/api/stream/', streamLimiter);
```

#### 2.2 Add Request Validation
**Priority:** MEDIUM  
**Effort:** 45 minutes  
**Files:** `server/production.js`

Add input sanitization:
```javascript
import { body, param, validationResult } from 'express-validator';

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply to endpoints
app.get('/api/rp/nowplaying/:chan',
  param('chan').isInt({ min: 0, max: 3 }),
  validate,
  (req, res) => { /* handler */ }
);
```

---

### Phase 3: CI/CD Security (Week 3)

#### 3.1 Add Docker Image Scanning
**Priority:** MEDIUM  
**Effort:** 1 hour  
**Files:** `.github/workflows/deploy.yml`

Add Trivy scanner:
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.DOCKER_TAG }}
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'

- name: Upload Trivy results to GitHub Security
  uses: github/codeql-action/upload-sarif@v2
  if: always()
  with:
    sarif_file: 'trivy-results.sarif'
```

#### 3.2 Add Dependency Scanning
**Priority:** MEDIUM  
**Effort:** 30 minutes  
**Files:** `.github/workflows/security-scan.yml` (new)

Create automated security scanning workflow:
```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: |
          npm audit --audit-level=moderate
          cd server && npm audit --audit-level=moderate
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

#### 3.3 Add SAST (Static Analysis)
**Priority:** LOW  
**Effort:** 1 hour  
**Files:** `.github/workflows/security-scan.yml`

Add CodeQL analysis:
```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: javascript, typescript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

---

### Phase 4: Operational Security (Ongoing)

#### 4.1 Secrets Rotation Policy
**Priority:** LOW  
**Effort:** 2 hours (setup) + quarterly rotation

**Schedule:**
- AWS credentials: Every 90 days
- SSH keys: Every 180 days
- API keys: Every 90 days

**Process:**
1. Generate new credentials
2. Update GitHub Secrets
3. Update production environment
4. Verify deployment
5. Revoke old credentials
6. Document in security log

#### 4.2 Security Monitoring
**Priority:** MEDIUM  
**Effort:** 3 hours (setup)

**Implement:**
1. **Log aggregation** (optional: Datadog, Sentry)
2. **Uptime monitoring** (UptimeRobot, Pingdom)
3. **SSL certificate monitoring** (Let's Encrypt auto-renewal alerts)
4. **GitHub Security Alerts** (already enabled)

#### 4.3 Incident Response Plan
**Priority:** LOW  
**Effort:** 2 hours (documentation)

Create `docs/INCIDENT_RESPONSE.md`:
1. Detection procedures
2. Escalation contacts
3. Containment steps
4. Recovery procedures
5. Post-incident review

---

## 📋 Implementation Checklist

### Immediate (This Week)
- [ ] Restrict CORS to known origins
- [ ] Add helmet security headers
- [ ] Update server dependencies
- [ ] Test security changes in staging

### Short-term (Next 2 Weeks)
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Add Docker image scanning to CI/CD
- [ ] Create security scanning workflow

### Medium-term (Next Month)
- [ ] Set up automated dependency scanning
- [ ] Implement SAST with CodeQL
- [ ] Document secrets rotation policy
- [ ] Set up security monitoring

### Long-term (Quarterly)
- [ ] Rotate all secrets
- [ ] Review and update security policies
- [ ] Conduct security audit
- [ ] Update incident response plan

---

## 🎯 Priority Matrix

| Issue | Priority | Effort | Impact | Timeline |
|-------|----------|--------|--------|----------|
| CORS Configuration | HIGH | Low | Medium | Week 1 |
| Security Headers | HIGH | Low | Medium | Week 1 |
| Rate Limiting | MEDIUM | Medium | Medium | Week 2 |
| Input Validation | MEDIUM | Medium | Low | Week 2 |
| Docker Scanning | MEDIUM | Medium | Medium | Week 3 |
| Dependency Scanning | MEDIUM | Low | Medium | Week 3 |
| SAST | LOW | High | Low | Week 4 |
| Secrets Rotation | LOW | Medium | Low | Ongoing |

---

## 📊 Security Metrics

Track these metrics monthly:
- Number of vulnerabilities detected
- Time to patch vulnerabilities
- Failed authentication attempts
- Rate limit triggers
- SSL certificate expiry dates
- Dependency update frequency

---

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [GitHub Security Features](https://docs.github.com/en/code-security)

---

## 📝 Notes

- Current setup is solid for a solo developer project
- No critical vulnerabilities found
- Focus on preventive measures and monitoring
- Implement changes incrementally to avoid breaking changes
- Test all security changes in staging first

---

**Last Updated:** January 24, 2026  
**Next Review:** April 24, 2026