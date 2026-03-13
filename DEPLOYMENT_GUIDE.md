# 🚀 Deployment Guide - Eco Sorter

## ✅ Backend Deployment (GitHub → Render)

### Backend Successfully Pushed to GitHub! 
**Repository**: https://github.com/Aayushsharma490/Eco--sorter-backend.git
**Branch**: main
**Latest Commit**: "Add complete features: OTP system, location tracking, user management, live maps, benefits system"

### Files Pushed:
- ✅ `routes/location.js` (NEW) - Location tracking API
- ✅ `routes/users.js` (NEW) - User management API
- ✅ `routes/pickups.js` (UPDATED) - OTP system added
- ✅ `server.js` (UPDATED) - New routes registered
- ✅ `data/db.json` (UPDATED) - Demo data

---

## 🌐 Deploy Backend to Render

### Step 1: Login to Render
1. Go to: https://render.com
2. Login with your account
3. Click "New +" → "Web Service"

### Step 2: Connect GitHub Repository
1. Select "Build and deploy from a Git repository"
2. Click "Connect" next to your GitHub account
3. Find: `Eco--sorter-backend`
4. Click "Connect"

### Step 3: Configure Service
```
Name: eco-sorter-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 4: Environment Variables
Click "Advanced" → Add Environment Variables:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://eco-sorter.netlify.app
```

### Step 5: Select Plan
- Free Plan: ✅ (Sufficient for demo)
- Click "Create Web Service"

### Step 6: Wait for Deployment
- Build will start automatically
- Wait 2-3 minutes
- Check logs for "🚀 Server running on port 5000"

### Step 7: Get Backend URL
- Copy your backend URL (example: `https://eco-sorter-backend.onrender.com`)
- Save it for frontend deployment

---

## 🎨 Frontend Deployment (Netlify)

### ✅ Build Completed Successfully!
**Build Output**: `/build` folder
**Size**: ~2.5 MB
**Status**: Ready to deploy

### Step 1: Login to Netlify
1. Go to: https://app.netlify.com
2. Login with your account
3. Click "Add new site" → "Deploy manually"

### Step 2: Update Environment Variable
Before deploying, update `.env` file:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render URL.

### Step 3: Rebuild (if needed)
If you updated `.env`:
```bash
npm run build
```

### Step 4: Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Open Netlify dashboard
2. Drag the `/build` folder to the upload area
3. Wait for deployment (1-2 minutes)
4. Get your site URL

**Option B: Netlify CLI**
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Step 5: Configure Site Settings
1. Go to Site Settings
2. Build & Deploy → Environment Variables
3. Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

### Step 6: Custom Domain (Optional)
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS
In `backend/server.js`, update CORS origin:
```javascript
app.use(cors({
  origin: 'https://your-netlify-site.netlify.app',
  credentials: true
}));
```

Push to GitHub:
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

## ✅ Verification Checklist

### Backend (Render):
- [ ] Service is running (green status)
- [ ] Health check: `https://your-backend.onrender.com/api/health`
- [ ] Response: `{"success":true,"message":"Eco Sorter API is running"}`
- [ ] Logs show no errors

### Frontend (Netlify):
- [ ] Site is live
- [ ] Homepage loads correctly
- [ ] Login page works
- [ ] Quick demo login buttons work
- [ ] Can schedule pickup
- [ ] Live map loads
- [ ] Benefits page shows tiers

### Integration:
- [ ] User can login
- [ ] Executive can accept pickup
- [ ] OTP generation works
- [ ] OTP verification works
- [ ] Credits update
- [ ] Location tracking works
- [ ] Admin dashboard shows data

---

## 🧪 Testing Production

### Test Flow:
1. **Open Frontend**: `https://your-site.netlify.app`
2. **Quick Login**: Click "👤 User" button
3. **Schedule Pickup**: Fill form and submit
4. **New Tab**: Click "🚚 Executive" button
5. **Accept Pickup**: Click Accept
6. **Generate OTP**: Enter weight, generate OTP
7. **Back to User Tab**: Refresh, enter OTP
8. **Verify**: Check credits updated

---

## 📊 Monitoring

### Backend Logs (Render):
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Monitor real-time logs

### Frontend Analytics (Netlify):
1. Go to Netlify dashboard
2. Click on your site
3. View Analytics tab
4. Monitor traffic and errors

---

## 🐛 Troubleshooting

### Issue: Backend not responding
**Solution**:
- Check Render logs for errors
- Verify environment variables
- Check if service is sleeping (free tier)
- Wake it up by visiting health endpoint

### Issue: Frontend can't connect to backend
**Solution**:
- Check VITE_API_URL in Netlify env vars
- Verify CORS settings in backend
- Check browser console for errors
- Ensure backend URL is correct

### Issue: OTP not working
**Solution**:
- Check backend logs
- Verify JWT_SECRET is set
- Check database file permissions
- Test API endpoints directly

### Issue: Location tracking not working
**Solution**:
- Enable location permissions in browser
- Check HTTPS (required for geolocation)
- Verify location API endpoints
- Check browser console

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS on both frontend and backend
- [ ] Update CORS to specific domain (not *)
- [ ] Add rate limiting (optional)
- [ ] Enable Netlify security headers
- [ ] Set up monitoring alerts

---

## 💰 Cost Estimate

### Free Tier (Current Setup):
- **Render**: Free (with sleep after 15 min inactivity)
- **Netlify**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Paid Tier (Recommended for Production):
- **Render**: $7/month (no sleep, better performance)
- **Netlify**: Free (sufficient)
- **Total**: $7/month

---

## 🚀 Quick Deploy Commands

### Backend (Already Done):
```bash
cd backend
git add .
git commit -m "Production ready"
git push origin main
```

### Frontend:
```bash
# Update .env with production backend URL
npm run build
netlify deploy --prod --dir=build
```

---

## 📝 Important URLs

### Development:
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

### Production:
- Frontend: https://eco-sorter.netlify.app (your actual URL)
- Backend: https://eco-sorter-backend.onrender.com (your actual URL)
- GitHub: https://github.com/Aayushsharma490/Eco--sorter-backend

---

## 🎉 Deployment Complete!

Your Eco Sorter platform is now live! 🌍♻️

### Next Steps:
1. Test all features in production
2. Share the URL with users
3. Monitor logs for any issues
4. Collect feedback
5. Iterate and improve

---

## 📞 Support

If you face any issues:
1. Check logs (Render + Netlify)
2. Review this guide
3. Check browser console
4. Verify environment variables
5. Test API endpoints directly

Happy Deploying! 🚀
