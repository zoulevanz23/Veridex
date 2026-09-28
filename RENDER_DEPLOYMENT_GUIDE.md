# Render Deployment Guide with GitHub Actions CI/CD

## Overview

This guide will walk you through deploying Veridex to Render (free tier) with automated CI/CD via GitHub Actions.

## Prerequisites

- Render account (free at [render.com](https://render.com))
- GitHub account
- Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

---

## Step 1: Prepare Your Repository

### 1.1 Update server package.json

Ensure your `server/package.json` has the correct scripts:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "nodemon index.js"
  }
}
```

### 1.2 Update root package.json

Ensure your root `package.json` has:

```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Backend Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select your `truthcheck-ai` repository
5. Configure the service:

   **Name:** `veridex-backend`
   
   **Root Directory:** `server`
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Start Command:**
   ```bash
   node dist/server.js
   ```

6. Click **"Advanced"** → **"Add Environment Variable"**

   Add these variables:
   ```
   NODE_ENV = production
   PORT = 5000
   GEMINI_API_KEY = your_gemini_api_key_here
   GEMINI_MODEL = gemini-flash-latest
   FRONTEND_URL = https://veridex-frontend.onrender.com
   ALLOWED_ORIGINS = https://veridex-frontend.onrender.com
   ```

7. Click **"Create Web Service"**

8. Wait for deployment to complete (2-3 minutes)
9. Copy your backend URL (e.g., `https://veridex-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Render

### 3.1 Create Frontend Service

1. Click **"New +"** → **"Static Site"**
2. Select the same repository
3. Configure the service:

   **Name:** `veridex-frontend`
   
   **Root Directory:** `.` (root)
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Publish Directory:** `dist`

4. Click **"Advanced"** → **"Add Environment Variable"**

   Add this variable:
   ```
   VITE_API_BASE_URL = https://veridex-backend.onrender.com
   ```

5. Click **"Create Static Site"**

6. Wait for deployment to complete (1-2 minutes)
7. Copy your frontend URL (e.g., `https://veridex-frontend.onrender.com`)

---

## Step 4: Get Render Service IDs

### 4.1 Get Backend Service ID

1. Go to your backend service on Render
2. Click **"Settings"** tab
3. Scroll to **"Service ID"**
4. Copy the service ID (e.g., `srv-xxxxxxxxxxxx`)

### 4.2 Get Frontend Service ID

1. Go to your frontend service on Render
2. Click **"Settings"** tab
3. Scroll to **"Service ID"**
4. Copy the service ID (e.g., `srv-yyyyyyyyyyyy`)

---

## Step 5: Get Render API Key

### 5.1 Generate API Key

1. On Render, click your avatar → **"Account Settings"**
2. Scroll to **"API Key"** section
3. Click **"Create API Key"**
4. Name it `GitHub Actions Deploy`
5. Copy the API key (you won't see it again!)

---

## Step 6: Configure GitHub Actions

### 6.1 Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

   | Secret Name | Value |
   |-------------|-------|
   | `RENDER_API_KEY` | Your Render API key from Step 5 |
   | `RENDER_BACKEND_SERVICE_ID` | Backend service ID from Step 4.1 |
   | `RENDER_FRONTEND_SERVICE_ID` | Frontend service ID from Step 4.2 |

### 6.2 Verify Workflow File

Ensure `.github/workflows/deploy.yml` exists with the Render configuration (already created).

---

## Step 7: Test CI/CD

### 7.1 Trigger Deployment

Make a small change to any file and commit:

```bash
git add .
git commit -m "test: trigger render deployment"
git push origin main
```

### 7.2 Monitor Deployment

1. Go to GitHub repository → **Actions** tab
2. Click on the running workflow
3. Watch the logs for:
   - Build steps
   - Render deployment triggers
   - Success/failure status

### 7.3 Verify on Render

1. Go to Render dashboard
2. Check both services for new deployments
3. Visit your frontend URL to verify it works

---

## Step 8: Update Environment Variables

### 8.1 Update Backend CORS

After frontend is deployed, update backend CORS:

1. Go to backend service → **Settings**
2. Update `FRONTEND_URL` to your actual frontend URL
3. Update `ALLOWED_ORIGINS` to your actual frontend URL
4. Render will automatically redeploy

### 8.2 Update Frontend API URL

If backend URL changed:

1. Go to frontend service → **Settings**
2. Update `VITE_API_BASE_URL` to your actual backend URL
3. Render will automatically redeploy

---

## Troubleshooting

### Backend Deployment Fails

**Issue:** Build fails with TypeScript errors

**Solution:**
```bash
# Locally test build
cd server
npm run build
```

**Issue:** "Cannot find module" errors

**Solution:** Ensure `package.json` has correct dependencies

### Frontend Deployment Fails

**Issue:** Build fails with Vite errors

**Solution:**
```bash
# Locally test build
npm run build
```

**Issue:** Blank page on deployment

**Solution:** Check `VITE_API_BASE_URL` is set correctly

### GitHub Actions Fails

**Issue:** "Service not found" error

**Solution:** Verify service IDs are correct in GitHub secrets

**Issue:** "Invalid API key" error

**Solution:** Regenerate Render API key and update GitHub secret

### CORS Errors

**Issue:** Frontend can't connect to backend

**Solution:**
1. Check backend `ALLOWED_ORIGINS` includes frontend URL
2. Check backend `FRONTEND_URL` matches frontend URL
3. Verify both services are running

---

## Render Free Tier Limits

| Resource | Limit |
|----------|-------|
| Web Services | Free (with spin-up time) |
| Static Sites | Unlimited free |
| Build Time | 15 minutes per build |
| CPU | 0.1 CPU (shared) |
| RAM | 512 MB |
| Bandwidth | 100 GB/month |

**Note:** Free web services spin down after 15 minutes of inactivity and take ~15 seconds to start up.

---

## Monitoring

### View Logs

1. Go to Render dashboard
2. Click on service
3. Click **"Logs"** tab
4. View real-time logs

### Health Checks

Backend includes health endpoint:
```bash
curl https://veridex-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "operational",
  "timestamp": "2026-09-28T00:00:00.000Z",
  "environment": "production"
}
```

---

## Custom Domain (Optional)

### 1. Add Custom Domain to Frontend

1. Go to frontend service → **Settings**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `veridex.yourdomain.com`)
4. Update DNS records as instructed by Render

### 2. Update Environment Variables

Update `FRONTEND_URL` and `ALLOWED_ORIGINS` in backend to use custom domain.

---

## Summary

**Deployment Architecture:**
- Frontend: Render Static Site (free, always on)
- Backend: Render Web Service (free, spins down when idle)
- CI/CD: GitHub Actions (free, auto-deploy on push)

**Total Cost:** $0/month

**Next Steps:**
1. Follow steps 1-8 above
2. Test the deployed application
3. Set up monitoring and alerts
4. Consider custom domain for production
