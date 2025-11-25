# 🔧 Environment Variable Setup

## VITE_API_URL Configuration

The frontend uses `VITE_API_URL` to connect to the backend API.

### For Local Development

Create a `.env.local` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:3001
```

This file is already in `.gitignore` and won't be committed.

### For Production (Vercel)

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to **"Environment Variables"**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your Render backend URL)
   - **Environment**: Production, Preview, Development (select all)
4. Click **"Save"**
5. Redeploy your application

### For Production (Netlify)

1. Go to your site settings in Netlify
2. Navigate to **"Environment variables"**
3. Click **"Add a variable"**
4. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`
5. Click **"Save"**
6. Redeploy your site

### Example Values

**Local Development:**
```
VITE_API_URL=http://localhost:3001
```

**Production (after deploying backend to Render):**
```
VITE_API_URL=https://logistics-dashboard-api.onrender.com
```

### How It Works

The frontend code in `src/utils/api.ts` uses:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

This means:
- If `VITE_API_URL` is set, it uses that value
- If not set, it defaults to `http://localhost:3001` (for local dev)

### Important Notes

- ⚠️ **Vite requires the `VITE_` prefix** for environment variables to be exposed to the client
- 🔒 Never commit `.env.local` files (already in `.gitignore`)
- 🔄 After changing env vars in Vercel/Netlify, you need to **redeploy**

