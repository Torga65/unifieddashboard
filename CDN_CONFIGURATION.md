# CDN Configuration Guide

## Origin Server Settings

### **Content Location**

**Local Development**:
```
/Users/tgardner/Documents/unified-dashboard/unifieddashboard
```

**Production Deployment**:
```
/var/www/unified-dashboard
# or wherever you deploy to your web server
```

---

## File Structure for CDN

```
unified-dashboard/
├── *.html                           # HTML pages
│   ├── index.html                   # Home page
│   ├── dashboard.html               # Main dashboard
│   ├── simple-login.html            # Authentication
│   ├── customer-*.html              # Customer views
│   └── engagement-*.html            # Engagement reports
│
├── scripts/                         # JavaScript
│   ├── aem.js
│   ├── scripts.js
│   ├── auth-guard.js
│   ├── ims-auth.js
│   ├── spacecat-auth.js
│   └── *.js
│
├── styles/                          # CSS
│   ├── styles.css                   # Main styles
│   ├── fonts.css                    # Font definitions
│   └── lazy-styles.css              # Lazy loaded styles
│
├── blocks/                          # Component blocks
│   ├── header/
│   │   ├── header.js
│   │   └── header.css
│   ├── footer/
│   ├── customer-overview/
│   └── */
│
├── data/                            # Data files
│   ├── customers.json               # Customer data
│   └── weeks.json                   # Week data
│
├── fonts/                           # Font assets
│   └── *.woff2
│
├── icons/                           # SVG icons
│   └── *.svg
│
└── favicon.ico                      # Site icon
```

---

## CDN Cache Rules

### **Recommended Cache Settings**

#### **HTML Files (Dynamic Content)**
```
Path Pattern: /*.html
Cache Duration: 5 minutes
Cache-Control: public, max-age=300, must-revalidate
```

#### **JavaScript Files**
```
Path Pattern: /scripts/*.js, /blocks/*/*.js
Cache Duration: 1 year
Cache-Control: public, max-age=31536000, immutable
```

#### **CSS Files**
```
Path Pattern: /styles/*.css, /blocks/*/*.css
Cache Duration: 1 year
Cache-Control: public, max-age=31536000, immutable
```

#### **Data Files (JSON)**
```
Path Pattern: /data/*.json
Cache Duration: 5 minutes
Cache-Control: public, max-age=300
```

#### **Font Files**
```
Path Pattern: /fonts/*.woff2
Cache Duration: 1 year
Cache-Control: public, max-age=31536000, immutable
```

#### **Icon/Image Files**
```
Path Pattern: /icons/*.svg, /*.ico
Cache Duration: 1 year
Cache-Control: public, max-age=31536000, immutable
```

#### **Authentication Pages**
```
Path Pattern: /simple-login.html, /auth-callback.html
Cache Duration: No cache
Cache-Control: no-cache, no-store, must-revalidate
```

---

## Origin Configuration

### **For CloudFront (AWS)**

```json
{
  "Origins": [
    {
      "Id": "unified-dashboard-origin",
      "DomainName": "your-server.example.com",
      "OriginPath": "",
      "CustomHeaders": []
    }
  ],
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponsePagePath": "/404.html",
      "ResponseCode": "404"
    },
    {
      "ErrorCode": 403,
      "ResponsePagePath": "/simple-login.html",
      "ResponseCode": "302"
    }
  ]
}
```

### **For Cloudflare**

**Origin Server**: `your-server.example.com`

**Page Rules**:
```
1. *.html
   Cache Level: Standard
   Edge Cache TTL: 5 minutes

2. /scripts/*, /styles/*, /blocks/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 year

3. /data/*
   Cache Level: Standard
   Edge Cache TTL: 5 minutes

4. /simple-login.html, /auth-callback.html
   Cache Level: Bypass
```

### **For Akamai**

**Origin Hostname**: `your-server.example.com`

**Caching Behavior**:
```xml
<match:path value="/scripts/*">
  <caching>
    <behavior>max-age</behavior>
    <ttl>31536000</ttl>
  </caching>
</match:path>

<match:path value="/styles/*">
  <caching>
    <behavior>max-age</behavior>
    <ttl>31536000</ttl>
  </caching>
</match:path>

<match:path value="/data/*">
  <caching>
    <behavior>max-age</behavior>
    <ttl>300</ttl>
  </caching>
</match:path>

<match:path value="*.html">
  <caching>
    <behavior>max-age</behavior>
    <ttl>300</ttl>
  </caching>
</match:path>
```

---

## Content Types (MIME Types)

Make sure these are configured:

```
.html   -> text/html
.js     -> application/javascript
.css    -> text/css
.json   -> application/json
.woff2  -> font/woff2
.svg    -> image/svg+xml
.ico    -> image/x-icon
```

---

## Deployment Process

### **Step 1: Prepare Files**

```bash
# Navigate to project
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard

# Create deployment package (exclude dev files)
tar -czf unified-dashboard.tar.gz \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.token' \
  --exclude='credentials.json' \
  --exclude='*.md' \
  --exclude='__pycache__' \
  *.html scripts/ styles/ blocks/ data/ fonts/ icons/ favicon.ico
```

### **Step 2: Upload to Origin Server**

```bash
# Example: Upload to web server
scp unified-dashboard.tar.gz user@your-server.com:/var/www/

# Extract on server
ssh user@your-server.com
cd /var/www/
tar -xzf unified-dashboard.tar.gz
```

### **Step 3: Configure CDN**

Tell CDN to point to:
```
Origin: https://your-server.com
Root Path: /var/www/unified-dashboard
```

---

## Security Headers

Configure these headers at CDN level:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Authentication Considerations

Since you have authentication, configure:

### **Public Paths (No Auth)**
```
/simple-login.html
/auth-callback.html
/login.html
/auth.html
/favicon.ico
/icons/*
/fonts/*
```

### **Protected Paths (Require Auth)**
```
/index.html
/dashboard.html
/customer-*.html
/engagement-*.html
/scripts/
/data/
```

**Note**: Authentication is handled client-side via `auth-guard.js`, so all files are technically public but the JavaScript enforces authentication.

---

## Performance Optimization

### **Compression**

Enable at CDN:
```
Gzip: Enabled
Brotli: Enabled

File Types:
- text/html
- application/javascript
- text/css
- application/json
- image/svg+xml
```

### **HTTP/2**

Enable HTTP/2 or HTTP/3 for better performance.

### **Preload Key Resources**

Add to HTML `<head>`:
```html
<link rel="preload" href="/scripts/aem.js" as="script">
<link rel="preload" href="/styles/styles.css" as="style">
<link rel="preload" href="/fonts/roboto-regular.woff2" as="font" crossorigin>
```

---

## CDN Provider Quick Setup

### **AWS CloudFront**

1. **Create Distribution**
   - Origin Domain: `your-server.example.com`
   - Origin Path: Leave blank
   - Default Root Object: `index.html`

2. **Behaviors**:
   - Path: `Default (*)`
   - Viewer Protocol: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized

3. **Custom Error Responses**:
   - 404 → `/404.html` (404)
   - 403 → `/simple-login.html` (302)

### **Cloudflare**

1. **Add Site**: `your-domain.com`
2. **Update DNS**: Point to Cloudflare nameservers
3. **SSL**: Full (strict)
4. **Page Rules**: (see above)
5. **Caching**: Standard

### **Fastly**

1. **Create Service**
2. **Origin**: `your-server.example.com`
3. **VCL Configuration**:
```vcl
sub vcl_recv {
  if (req.url ~ "^/(scripts|styles|blocks|fonts|icons)/") {
    return(hash);
  }
}

sub vcl_backend_response {
  if (bereq.url ~ "^/(scripts|styles|blocks|fonts|icons)/") {
    set beresp.ttl = 365d;
  }
  if (bereq.url ~ "\.html$") {
    set beresp.ttl = 5m;
  }
}
```

---

## Testing CDN Setup

### **1. Check Cache Headers**
```bash
curl -I https://your-cdn-domain.com/scripts/aem.js
# Should see: Cache-Control: public, max-age=31536000
```

### **2. Verify Cache HIT**
```bash
curl -I https://your-cdn-domain.com/index.html
# Should see: X-Cache: HIT (or similar header)
```

### **3. Test Authentication**
```bash
# Should redirect to login
curl -L https://your-cdn-domain.com/dashboard.html
```

---

## Monitoring

### **Key Metrics to Track**

- Cache Hit Ratio (target: >90%)
- Origin Requests (should be low)
- Response Time (target: <100ms)
- Bandwidth Usage
- 404 Errors

### **CDN Analytics**

Most CDN providers offer:
- Geographic distribution
- Most requested files
- Cache performance
- Error rates

---

## Troubleshooting

### **Content Not Updating**

```bash
# Purge CDN cache
# CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"

# Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE/purge_cache" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"purge_everything":true}'
```

### **CORS Issues**

Add to origin server:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### **Authentication Loops**

Make sure these are NOT cached:
- `/simple-login.html`
- `/auth-callback.html`

---

## Quick Reference

**Tell CDN**:
- **Origin**: Your web server address
- **Root**: `/var/www/unified-dashboard` (or deployment path)
- **Index**: `index.html`
- **Cache TTL**: 
  - HTML: 5 minutes
  - JS/CSS: 1 year
  - Data: 5 minutes
- **HTTPS**: Required
- **Compression**: Enabled

---

## Summary for CDN Support

When talking to CDN support, say:

> "I have a static web application with:
> - HTML files in root directory
> - JavaScript in /scripts/
> - CSS in /styles/
> - Static assets in /fonts/ and /icons/
> - JSON data in /data/
> 
> I need:
> - Short cache (5 min) for HTML and JSON
> - Long cache (1 year) for JS/CSS/fonts/icons
> - HTTPS with redirect from HTTP
> - Gzip/Brotli compression
> - Default document: index.html"

They'll know exactly what to configure!
