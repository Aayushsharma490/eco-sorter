# MongoDB Setup Guide

## ❌ Current Issue
MongoDB is not running on your system. The backend needs MongoDB to store data.

## ✅ Solution Options

### Option 1: Use MongoDB Atlas (Cloud - Easiest, No Installation)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

6. **Update Backend .env**
   - Open `backend/.env`
   - Replace MONGODB_URI with your connection string
   - Replace `<password>` with your actual password
   - Add database name at the end: `/ecosorter`
   
   Example:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ecosorter
   ```

7. **Restart Backend**
   - Stop the backend (Ctrl+C in terminal)
   - Run: `npm run dev`
   - You should see: ✅ MongoDB Connected

---

### Option 2: Install MongoDB Locally (Windows)

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows" and "MSI" package
   - Download and run installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # If not running, start it
   Start-Service MongoDB
   ```

4. **Test Connection**
   ```powershell
   # Open MongoDB shell
   mongosh
   
   # You should see connection successful
   # Type 'exit' to quit
   ```

5. **Backend Should Now Connect**
   - Your backend/.env already has: `MONGODB_URI=mongodb://localhost:27017/ecosorter`
   - Restart backend: `npm run dev`
   - You should see: ✅ MongoDB Connected

---

### Option 3: Use Docker (If you have Docker installed)

```powershell
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if running
docker ps
```

---

## 🧪 Test Your Setup

Once MongoDB is connected, seed the database:

```bash
cd backend
npm run seed
```

You should see:
```
✅ MongoDB Connected
🗑️  Cleared existing data
👥 Created demo users
🗑️  Created dustbin
🏢 Created collection centers
✅ Seed completed successfully!
```

## 🚀 Quick Start After Setup

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

## 📝 Demo Credentials

After seeding, you can login with:
- User: user@demo.com / demo123
- Executive: executive@demo.com / demo123
- Admin: admin@demo.com / demo123

## 🐛 Troubleshooting

### MongoDB Atlas Connection Issues
- Check username/password are correct
- Ensure IP address is whitelisted
- Check connection string format
- Make sure you replaced `<password>` with actual password

### Local MongoDB Issues
- Check if MongoDB service is running: `Get-Service MongoDB`
- Start service: `Start-Service MongoDB`
- Check port 27017 is not blocked by firewall

### Still Having Issues?
- Check backend terminal for error messages
- Verify .env file has correct MONGODB_URI
- Try restarting both backend and MongoDB

## 💡 Recommendation

For quick setup and no installation hassle, I recommend **Option 1: MongoDB Atlas**.
It's free, reliable, and works immediately without any local installation.
