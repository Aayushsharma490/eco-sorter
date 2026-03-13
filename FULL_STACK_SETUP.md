# 🚀 Eco Sorter - Full Stack Setup Guide

Complete guide to run the Eco Sorter platform with backend and frontend.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ MongoDB installed locally OR MongoDB Atlas account
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

## 🎯 Quick Start (5 Minutes)

### Step 1: Install MongoDB (if not installed)

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# For local MongoDB: mongodb://localhost:27017/ecosorter
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecosorter

# Seed database with demo data
npm run seed

# Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
# Open new terminal, navigate to project root
cd ..

# Create environment file
cp .env.example .env

# Edit .env (should already have correct value)
# VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### Step 4: Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Login" in navigation
3. Use demo credentials:
   - User: `user@demo.com` / `demo123`
   - Executive: `executive@demo.com` / `demo123`
   - Admin: `admin@demo.com` / `demo123`

## 🎨 What You Get

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ Role-based access control (User, Executive, Admin)
- ✅ CRUD operations for pickups, dustbins, centers
- ✅ Real-time statistics
- ✅ Credits calculation system
- ✅ Demo data seeding

### Frontend Features
- ✅ SvelteKit application
- ✅ Role-based dashboards
- ✅ Real-time data from API
- ✅ JWT token management
- ✅ Protected routes
- ✅ Responsive design
- ✅ GSAP animations

## 📁 Project Structure

```
eco-sorter-platform/
├── backend/                    # Backend API
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Pickup.js
│   │   ├── Dustbin.js
│   │   └── CollectionCenter.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── pickups.js
│   │   ├── dustbins.js
│   │   ├── centers.js
│   │   └── stats.js
│   ├── middleware/            # Auth middleware
│   ├── utils/                 # Utilities
│   ├── server.js              # Main server
│   ├── seed.js                # Database seeder
│   └── package.json
│
├── src/                       # Frontend
│   ├── routes/               # Pages
│   │   ├── +page.svelte      # Homepage
│   │   ├── login/            # Login page
│   │   ├── dashboard/        # Dashboards
│   │   │   ├── user/
│   │   │   ├── executive/
│   │   │   └── admin/
│   │   ├── centers/          # Centers page
│   │   └── contact/          # Contact page
│   ├── lib/
│   │   ├── api.js            # API service
│   │   ├── components/       # Reusable components
│   │   └── slices/           # Page sections
│   └── app.css               # Global styles
│
└── Documentation
    ├── README.md              # Main readme
    ├── DEPLOYMENT.md          # Deployment guide
    ├── BACKEND_INTEGRATION.md # Integration guide
    └── FULL_STACK_SETUP.md    # This file
```

## 🔐 Authentication System

### How It Works

1. **Login**: User submits credentials
2. **Validation**: Backend validates and returns JWT token
3. **Storage**: Frontend stores token in localStorage
4. **Authorization**: Token sent with every API request
5. **Verification**: Backend verifies token on protected routes

### Token Flow

```
Frontend                Backend
   |                       |
   |-- POST /auth/login -->|
   |                       |-- Validate credentials
   |                       |-- Generate JWT token
   |<-- Return token ------|
   |                       |
   |-- Store in localStorage
   |                       |
   |-- GET /stats/user --->|
   |   (with token)        |-- Verify token
   |                       |-- Return data
   |<-- User stats --------|
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'executive' | 'admin',
  credits: Number,
  phone: String,
  address: Object
}
```

### Pickups Collection
```javascript
{
  user: ObjectId (ref: User),
  executive: ObjectId (ref: User),
  scheduledDate: Date,
  estimatedWeight: Number,
  actualWeight: Number,
  status: 'pending' | 'accepted' | 'completed',
  creditsEarned: Number
}
```

### Dustbins Collection
```javascript
{
  user: ObjectId (ref: User),
  location: String,
  level: Number (0-100),
  status: 'low' | 'moderate' | 'critical'
}
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"demo123"}'

# Copy the token from response, then:
curl http://localhost:5000/api/stats/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Frontend

1. Open `http://localhost:5173`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Login and watch API calls
5. Check Console for any errors

## 🚀 Production Deployment

### Backend (Railway.app)

1. Create account: https://railway.app
2. Create new project
3. Add MongoDB database
4. Deploy from GitHub
5. Set environment variables:
   ```
   MONGODB_URI=<railway-mongodb-uri>
   JWT_SECRET=<random-secret>
   FRONTEND_URL=https://your-site.netlify.app
   ```

### Frontend (Netlify)

1. Update `.env`:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod`

## 🔧 Development Tips

### Hot Reload

Both servers support hot reload:
- Backend: Uses `nodemon` (auto-restarts on file changes)
- Frontend: Uses Vite (instant HMR)

### Database Management

```bash
# Reseed database
cd backend
npm run seed

# Connect to MongoDB shell
mongosh
use ecosorter
db.users.find()  # View users
db.pickups.find()  # View pickups
```

### API Testing Tools

- **Postman**: https://www.postman.com/
- **Thunder Client**: VS Code extension
- **curl**: Command line

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in backend/.env
PORT=5001
```

### MongoDB Connection Error

```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### CORS Errors

- Check `FRONTEND_URL` in backend `.env`
- Ensure it matches your frontend URL exactly
- Include protocol (http:// or https://)

### Token Expired

- Clear localStorage in browser DevTools
- Login again to get new token

## 📚 Additional Resources

- **Backend API Docs**: `backend/README.md`
- **Integration Guide**: `BACKEND_INTEGRATION.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Main README**: `README.md`

## 🎓 Learning Path

1. ✅ Setup and run locally
2. ✅ Test with demo credentials
3. ✅ Explore API endpoints
4. ✅ Modify frontend components
5. ✅ Add new features
6. ✅ Deploy to production

## 📞 Support

Need help?
- Check documentation files
- Review error messages in console
- Check MongoDB connection
- Verify environment variables
- Test API endpoints individually

## 🎉 Next Steps

Now that everything is running:

1. **Explore the dashboards** - Login with different roles
2. **Test the features** - Create pickups, check stats
3. **Customize the design** - Modify components
4. **Add new features** - Extend the API
5. **Deploy to production** - Share with the world!

Happy coding! 🚀
