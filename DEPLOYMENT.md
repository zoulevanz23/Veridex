# Deployment Guide

## Free Deployment Options

### 1. Render + GitHub Actions (Recommended)

**Render** offers free web services and static sites with no time limits. This is the recommended free deployment option.

**Quick Start:** See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for step-by-step instructions.

#### Prerequisites
- Render account (free at [render.com](https://render.com))
- GitHub account
- Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

#### Architecture
- **Frontend:** Render Static Site (always on, unlimited free)
- **Backend:** Render Web Service (free, spins down when idle)
- **CI/CD:** GitHub Actions (free, auto-deploy on push)

#### Setup Steps

1. **Deploy Backend to Render**
   - Go to [render.com](https://render.com)
   - New Web Service → Connect GitHub
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `node dist/server.js`
   - Environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     GEMINI_API_KEY=your_key
     GEMINI_MODEL=gemini-flash-latest
     FRONTEND_URL=https://your-frontend.onrender.com
     ALLOWED_ORIGINS=https://your-frontend.onrender.com
     ```

2. **Deploy Frontend to Render**
   - New Static Site → Connect GitHub
   - Root directory: `.`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend.onrender.com
     ```

3. **Configure GitHub Actions CI/CD**
   - Get Render API key from Account Settings
   - Get service IDs from each service's Settings tab
   - Add secrets to GitHub repo:
     - `RENDER_API_KEY`
     - `RENDER_BACKEND_SERVICE_ID`
     - `RENDER_FRONTEND_SERVICE_ID`
   - Push to main triggers auto-deploy

#### Render Free Tier Limits
| Resource | Limit |
|----------|-------|
| Web Services | Free (15s spin-up on cold start) |
| Static Sites | Unlimited free |
| Build Time | 15 minutes per build |
| CPU | 0.1 CPU (shared) |
| RAM | 512 MB |
| Bandwidth | 100 GB/month |

### 2. Railway + Vercel (Alternative)

**Railway** offers $5/month credit, sufficient for this application.

#### Backend Deployment
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Set root directory to `server`
4. Add environment variables
5. Railway auto-detects Node.js

#### Frontend Deployment
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Add `VITE_API_BASE_URL=https://your-backend.railway.app`
4. Vercel auto-detects Vite

## Local Development with Docker

### Quick Start

```bash
# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY

# Start all services
docker-compose up --build

# Access application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## Environment Variables

### Backend (server/.env)
```bash
GEMINI_API_KEY=required          # Gemini API key
GEMINI_MODEL=gemini-flash-latest # Optional model override
PORT=5000                         # Server port
NODE_ENV=production               # Environment
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app
ENABLE_REPUTATION_CHECKS=1        # Optional: enable phishing DB lookup
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles automated deployment to Render.

### Required Secrets for Render

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `RENDER_API_KEY` - Render API key (from Account Settings)
- `RENDER_BACKEND_SERVICE_ID` - Backend service ID (from service Settings)
- `RENDER_FRONTEND_SERVICE_ID` - Frontend service ID (from service Settings)

### Workflow Features

- Triggers on push to `main` branch
- Builds and tests both frontend and backend
- Deploys to Render automatically
- Waits for deployment success

## Monitoring

### Health Checks

Backend includes a health check endpoint:
```bash
curl https://your-backend.onrender.com/health
```

Response:
```json
{
  "status": "operational",
  "timestamp": "2026-09-28T00:00:00.000Z",
  "environment": "production"
}
```

### Railway Dashboard

- View logs in Railway dashboard
- Monitor CPU/memory usage
- Set up alerts for failures

## Troubleshooting

### Build Failures

1. Check GitHub Actions logs
2. Verify environment variables are set
3. Ensure Docker Hub credentials are valid

### Runtime Errors

1. Check Railway logs
2. Verify API keys are correct
3. Check CORS configuration

### Frontend Not Connecting

1. Verify `VITE_API_BASE_URL` is set
2. Check backend is running
3. Verify CORS allows frontend origin

## Cost Summary

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Railway | $5/month credit | $5+/month |
| Vercel | Unlimited | $20+/month |
| Render | Free web service | $7+/month |
| Docker Hub | Unlimited public | $5+/month private |

**Total Free Cost:** $0 (within free tier limits)
