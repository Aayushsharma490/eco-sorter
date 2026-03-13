# ✅ Deployment Checklist - Render.com

## 🎯 Quick Commands for Render

### Build Command
```
npm install
```

### Start Command
```
npm start
```

### Root Directory (if backend in subfolder)
```
backend
```

## 📋 Step-by-Step Deployment

### 1️⃣ Prepare Backend

```bash
cd backend

# Test locally first
npm start

# Should see:
# ✅ JSON Database Loaded
# 🚀 Server running on port 5000
```

### 2️⃣ Push to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Backend ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/eco-sorter-backend.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy on Render

**Go to:** https://dashboard.render.com/

**Settings:**
```
Name: eco-sorter-backend
Environment: Node
Region: Singapore (or closest)
Branch: main
Root Directory: backend (if in subfolder, otherwise leave empty)
Build Command: npm install
Start Command: npm start
```

**Environment Variables:**
```
PORT = 5000
NODE_ENV = production
JWT_SECRET = eco-sorter-super-secret-jwt-key-2026-production
JWT_EXPIRE = 7d
FRONTEND_URL = https://your-site.netlify.app
```

### 4️⃣ Wait for Deployment

Render will:
- ✅ Clone your repo
- ✅ Run `npm install`
- ✅ Run `npm start`
- ✅ Give you a URL

Your backend URL will be:
```
https://eco-sorter-backend.onrender.com
```

### 5️⃣ Test Backend

```bash
# Health check
curl https://eco-sorter-backend.onrender.com/api/health

# Should return:
# {"success":true,"message":"Eco Sorter API is running","timestamp":"..."}
```

### 6️⃣ Update Frontend

Update `.env` in frontend:
```env
VITE_API_URL=https://eco-sorter-backend.onrender.com/api
```

Rebuild frontend:
```bash
npm run build
netlify deploy --prod
```

## 🔧 Important Files

### backend/package.json ✅
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

### backend/.env (for local only)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=eco-sorter-super-secret-jwt-key-2026
FRONTEND_URL=http://localhost:5173
```

### backend/server.js ✅
- Uses `process.env.PORT || 5000`
- CORS configured with `process.env.FRONTEND_URL`
- JSON database working

## 🎯 Render Configuration Summary

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Node Version** | 18.x (default) |
| **Port** | 5000 (from env) |
| **Auto Deploy** | Yes (on git push) |

## 🧪 Testing Checklist

After deployment, test:

- [ ] Health endpoint works
- [ ] Login works
- [ ] User stats API works
- [ ] Pickup creation works
- [ ] Executive stats works
- [ ] Admin stats works
- [ ] Centers API works

## 📊 Monitoring

In Render Dashboard:
- View real-time logs
- Check service status
- Monitor resource usage
- See deployment history

## 🚨 Common Issues

### Issue: Service won't start
**Solution:** Check logs in Render dashboard

### Issue: CORS errors
**Solution:** Update FRONTEND_URL in environment variables

### Issue: 404 on API calls
**Solution:** Ensure API URL in frontend includes `/api`

### Issue: Slow first request
**Solution:** Free tier spins down after 15 min inactivity

## 💡 Pro Tips

1. **Keep Service Warm**
   - Add health check ping from frontend
   - Runs every 10 minutes

2. **Monitor Logs**
   - Check logs regularly
   - Set up alerts

3. **Backup Data**
   - Download `db.json` regularly
   - Keep local backups

4. **Test Locally First**
   - Always test before pushing
   - Use same commands as Render

## 🎉 Success Indicators

✅ Build succeeds
✅ Service starts
✅ Health endpoint responds
✅ Login works
✅ All APIs functional
✅ Frontend connects successfully

## 📞 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com/
- Check logs for errors

---

## 🚀 Ready to Deploy!

Follow the steps above and your backend will be live in minutes!

**Your URLs:**
- Backend: `https://eco-sorter-backend.onrender.com`
- API: `https://eco-sorter-backend.onrender.com/api`
- Health: `https://eco-sorter-backend.onrender.com/api/health`
