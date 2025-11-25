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

### Step 1: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `Harshm27/logistics-analytics-dashboard`
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variable

**IMPORTANT:** Before deploying, add the environment variable:

1. In the Vercel project setup, scroll to **"Environment Variables"**
2. Click **"Add"** or **"Add Another"**
3. Enter:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (use your actual Render URL from Step 2 above)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your frontend will be live at: `https://your-project.vercel.app`

## 🌐 Alternative: Netlify

1. Go to https://netlify.com
2. **"Add new site"** → **"Import an existing project"**
3. Connect GitHub repository: `Harshm27/logistics-analytics-dashboard`
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **Add environment variable:**
   - Go to **"Site settings"** → **"Environment variables"**
   - Click **"Add a variable"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your Render backend URL)
   - Click **"Save"**
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

