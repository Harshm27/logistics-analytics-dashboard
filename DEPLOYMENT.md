# 🚀 Deployment Guide

Complete guide to deploy the Logistics Analytics Dashboard.

## 📋 Prerequisites

- GitHub account
- Render account (for backend) - https://render.com
- Vercel/Netlify account (for frontend) - https://vercel.com or https://netlify.com

## 🔧 Backend Deployment (Render)

### Step 1: Push to GitHub

```bash
cd logistics-dashboard-v2
git init
git add .
git commit -m "Initial commit: Clean logistics dashboard"
git remote add origin https://github.com/YOUR-USERNAME/logistics-dashboard-v2.git
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `logistics-dashboard-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click **"Create Web Service"**
6. Copy your backend URL (e.g., `https://logistics-dashboard-api.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update API URL

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
6. Click **"Deploy"**

## 🌐 Alternative: Netlify

1. Go to https://netlify.com
2. **"Add new site"** → **"Import an existing project"**
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy!

## ✅ Verify Deployment

1. **Backend**: Visit `https://your-backend-url.onrender.com/api/health`
2. **Frontend**: Visit your Vercel/Netlify URL
3. Test uploading the sample Excel file
4. Test getting shipping rates

## 🔄 Updating

Simply push to GitHub - both services auto-deploy!

```bash
git add .
git commit -m "Update: description"
git push
```

---

That's it! Your dashboard is live! 🎉

