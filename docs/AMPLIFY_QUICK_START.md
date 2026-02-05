# AWS Amplify — Quick Start

Use this after reading the [full migration plan](./AWS_AMPLIFY_MIGRATION_PLAN.md).

## 1. One-time setup

- AWS account with Amplify access
- Repo pushed to GitHub (or supported Git provider)
- Adobe IMS client ID (from [Adobe Developer Console](https://developer.adobe.com/console))

## 2. Create app in Amplify

1. **AWS Console** → **Amplify** → **New app** → **Host web app**.
2. **Connect repository** (GitHub) and select this repo and branch (e.g. `main`).
3. **Build settings:** Amplify will detect `amplify.yml` in the repo root. No need to paste YAML.
4. **Save and deploy.** Wait for the first build to finish.

## 3. Get your Amplify URL

- **App URL:** `https://main.<app-id>.amplifyapp.com`  
  (Find `<app-id>` in Amplify Console → App → General.)

## 4. Adobe IMS redirect URIs

In [Adobe Developer Console](https://developer.adobe.com/console) → your project → **OAuth Web** → **Redirect URI patterns**, add:

```
https://main.<app-id>.amplifyapp.com/
https://main.<app-id>.amplifyapp.com/index.html
https://main.<app-id>.amplifyapp.com/*
```

Replace `<app-id>` with your Amplify app ID.

## 5. Optional: custom domain

- Amplify Console → **Hosting** → **Domain management** → **Add domain**.
- Add the CNAME (or use Route 53) as shown.
- Then add the same patterns with your domain in Adobe (e.g. `https://dashboard.yourdomain.com/` and `https://dashboard.yourdomain.com/*`).

## 6. Test

- Open `https://main.<app-id>.amplifyapp.com/`.
- Trigger Adobe IMS sign-in; confirm redirect back to Amplify and that the app works.

---

**Full details:** [AWS_AMPLIFY_MIGRATION_PLAN.md](./AWS_AMPLIFY_MIGRATION_PLAN.md)
