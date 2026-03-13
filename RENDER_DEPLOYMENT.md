# 🚀 Render.com Deployment Guide

Complete guide to deploy Eco Sorter backend on Render.com

## 📋 Prerequisites

1. GitHub account
2. Render.com account (free tier available)
3. Backend code pushed to GitHub

## 🎯 Render.com Deployment Steps

### Step 1: Push Backend to GitHub

```bash
# Initialize git in backend folder (if not already)
cd backend
git init
git add .
git commit -m "Initial backend commit"

# Create new repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/eco-sorter-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**

   **Basic Settings:**
   - Name: `eco-sorter-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend` (if backend is in subfolder)
   - Runtime: `Node`

   **Build & Deploy Settings:**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   
   Add these in Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

5. **Click "Create Web Service"**

   Render will:
   - Install dependencies
   - Start your server
   - Give you a URL like: `https://eco-sorter-backend.onrender.com`

## 📝 Commands for Render

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

### Alternative Start Command (if using nodemon in dev)
```bash
node server.js
```

## 🔧 Backend Configuration

Your `backend/package.json` should have:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🌐 Update Frontend

After backend is deployed, update frontend `.env`:

```env
VITE_API_URL=https://eco-sorter-backend.onrender.com/api
```

Then rebuild and redeploy frontend:
```bash
npm run build
netlify deploy --prod
```

## ⚙️ Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### Keep Service Active
Add this to your frontend to ping backend every 10 minutes:
```javascript
// In +layout.svelte or app.js
setInterval(() => {
  fetch('https://eco-sorter-backend.onrender.com/api/health')
    .catch(() => {});
}, 600000); // 10 minutes
```

### Data Persistence
- JSON file will persist on Render
- But may reset on redeploy
- For production, consider using a database

## 🧪 Test Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://eco-sorter-backend.onrender.com/api/health

# Login
curl -X POST https://eco-sorter-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"demo123"}'
```

## 📊 Monitor Your Service

In Render Dashboard:
- View logs
- Check metrics
- Monitor uptime
- See deployment history

## 🔄 Auto-Deploy

Render automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push

# Render will auto-deploy!
```

## 🐛 Troubleshooting

### Build Fails
- Check Node version (Render uses Node 18 by default)
- Verify package.json is correct
- Check build logs in Render dashboard

### Service Won't Start
- Check start command is correct
- Verify PORT environment variable
- Check server.js for errors

### CORS Errors
- Update FRONTEND_URL in environment variables
- Ensure it matches your Netlify URL exactly
- Include protocol (https://)

## 💡 Pro Tips

1. **Use Environment Variables**
   - Never commit secrets to GitHub
   - Use Render's environment variables

2. **Monitor Logs**
   - Check logs regularly
   - Set up log alerts

3. **Test Before Deploy**
   - Test locally first
   - Use staging environment

4. **Backup Data**
   - Download db.json regularly
   - Keep backups of important data

## 🎉 Success!

Your backend is now live on Render!

- Backend URL: `https://eco-sorter-backend.onrender.com`
- API: `https://eco-sorter-backend.onrender.com/api`
- Health: `https://eco-sorter-backend.onrender.com/api/health`

Update your frontend and you're ready to go! 🚀
