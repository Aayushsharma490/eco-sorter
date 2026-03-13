# 🚀 Production Deployment - Step by Step

## ✅ What's Done

### Backend:
- ✅ Code pushed to GitHub
- ✅ Production environment variables set
- ✅ CORS configured for Netlify
- ✅ Ready to deploy on Render

### Frontend:
- ✅ Production build created (`/build` folder)
- ✅ Backend URL updated to production
- ✅ Ready to deploy on Netlify

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Login with your account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect GitHub Repository**
   - Click "Connect account" if not connected
   - Find repository: `Eco--sorter-backend`
   - Click "Connect"

4. **Configure Service**
   ```
   Name: eco-sorter-backend
   Region: Singapore (or closest)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   PORT = 5000
   NODE_ENV = production
   JWT_SECRET = eco-sorter-super-secret-jwt-key-2026-production
   JWT_EXPIRE = 7d
   FRONTEND_URL = https://eco-sorter.netlify.app
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Check logs for: "🚀 Server running on port 5000"

7. **Get Backend URL**
   - Copy your backend URL
   - Example: `https://eco-sorter-backend.onrender.com`
   - **IMPORTANT**: Save this URL!

8. **Test Backend**
   - Open: `https://your-backend-url.onrender.com/api/health`
   - Should see: `{"success":true,"message":"Eco Sorter API is running"}`

---

### Step 2: Update Frontend with Actual Backend URL

**IMPORTANT**: If your Render URL is different from `https://eco-sorter-backend.onrender.com`, update it:

1. **Update `.env` file**:
   ```env
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
   ```

2. **Rebuild Frontend**:
   ```bash
   npm run build
   ```

---

### Step 3: Deploy Frontend to Netlify

**Option A: Drag & Drop (Easiest)**

1. **Go to Netlify**
   - URL: https://app.netlify.com
   - Login with your account

2. **Deploy Site**
   - Click "Add new site" → "Deploy manually"
   - Drag the `/build` folder to upload area
   - Wait 1-2 minutes

3. **Get Site URL**
   - Copy your site URL
   - Example: `https://eco-sorter.netlify.app`

4. **Update Site Name (Optional)**
   - Go to Site Settings → General
   - Change site name to: `eco-sorter`
   - URL becomes: `https://eco-sorter.netlify.app`

**Option B: Netlify CLI**

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=build
```

---

### Step 4: Update Backend CORS (If Needed)

If your Netlify URL is different from `https://eco-sorter.netlify.app`:

1. **Update Backend `.env`**:
   ```env
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   ```

2. **Push to GitHub**:
   ```bash
   cd backend
   git add .
   git commit -m "Update CORS for production frontend"
   git push origin main
   ```

3. **Render Auto-Deploy**
   - Render will automatically redeploy
   - Wait 2-3 minutes

---

## 🧪 Testing Production

### 1. Test Backend Health
```
URL: https://your-backend-url.onrender.com/api/health
Expected: {"success":true,"message":"Eco Sorter API is running"}
```

### 2. Test Frontend
```
URL: https://your-netlify-site.netlify.app
Expected: Homepage loads with Eco Sorter branding
```

### 3. Test Login
```
1. Click "👤 User" quick demo button
2. Should redirect to user dashboard
3. Check if stats load (not "Failed to fetch")
```

### 4. Test Complete Flow
```
1. User: Schedule pickup
2. Executive: Accept pickup
3. Executive: Generate OTP
4. User: Verify OTP
5. Check credits updated
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" Error

**Cause**: Frontend can't connect to backend

**Solutions**:

1. **Check Backend URL**
   - Open `.env` file
   - Verify `VITE_API_URL` is correct
   - Should end with `/api`

2. **Check Backend Status**
   - Go to Render dashboard
   - Check if service is running (green)
   - Check logs for errors

3. **Check CORS**
   - Backend `.env` should have correct `FRONTEND_URL`
   - Should match your Netlify URL exactly

4. **Rebuild Frontend**
   ```bash
   npm run build
   netlify deploy --prod --dir=build
   ```

### Issue: Backend Sleeping (Free Tier)

**Cause**: Render free tier sleeps after 15 minutes of inactivity

**Solution**:
- First request will wake it up (takes 30-60 seconds)
- Subsequent requests will be fast
- Consider upgrading to paid tier ($7/month) for always-on

### Issue: CORS Error

**Symptoms**: Browser console shows CORS error

**Solution**:
1. Check backend logs
2. Verify `FRONTEND_URL` in backend `.env`
3. Ensure it matches Netlify URL exactly
4. Push changes to GitHub
5. Wait for Render to redeploy

---

## 📊 Current Configuration

### Backend (GitHub):
```
Repository: https://github.com/Aayushsharma490/Eco--sorter-backend.git
Branch: main
Latest Commit: "Update production environment variables for deployment"
```

### Backend Environment:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=eco-sorter-super-secret-jwt-key-2026-production
JWT_EXPIRE=7d
FRONTEND_URL=https://eco-sorter.netlify.app
```

### Frontend Environment:
```env
VITE_API_URL=https://eco-sorter-backend.onrender.com/api
```

### Frontend Build:
```
Location: /build folder
Size: ~2.5 MB
Status: Ready to deploy
```

---

## ✅ Deployment Checklist

### Before Deployment:
- [x] Backend code pushed to GitHub
- [x] Backend `.env` configured for production
- [x] Frontend `.env` configured with backend URL
- [x] Frontend build created
- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Frontend deployed to Netlify
- [ ] Frontend loads successfully
- [ ] Login works
- [ ] API calls work (no "Failed to fetch")

### After Deployment:
- [ ] Test user login
- [ ] Test executive login
- [ ] Test admin login
- [ ] Test pickup scheduling
- [ ] Test pickup acceptance
- [ ] Test OTP generation
- [ ] Test OTP verification
- [ ] Test credits update
- [ ] Test location tracking
- [ ] Test benefits page
- [ ] Test all admin pages

---

## 🎯 Quick Deploy Commands

### If Backend URL Changes:
```bash
# Update .env with new URL
# Then rebuild and redeploy
npm run build
netlify deploy --prod --dir=build
```

### If Frontend URL Changes:
```bash
# Update backend/.env with new FRONTEND_URL
cd backend
git add .
git commit -m "Update CORS for new frontend URL"
git push origin main
# Render will auto-deploy
```

---

## 📞 Support

### Check Logs:
- **Backend**: Render Dashboard → Your Service → Logs
- **Frontend**: Browser Console (F12)
- **Network**: Browser Network Tab (F12)

### Common URLs:
- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub Repo**: https://github.com/Aayushsharma490/Eco--sorter-backend

---

## 🎉 Success!

Once deployed, your URLs will be:
- **Frontend**: https://eco-sorter.netlify.app (or your custom URL)
- **Backend**: https://eco-sorter-backend.onrender.com (or your custom URL)

Share these URLs with users and start collecting feedback! 🌍♻️
