# Backend Integration Guide

This guide explains how to integrate the Eco Sorter frontend with the backend API.

## 🚀 Quick Setup

### 1. Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Seed database with demo data
node seed.js

# Start server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Configure Frontend

```bash
# In project root
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📝 Integration Steps

### Step 1: Update Login Page

The login page needs to call the real API instead of using demo credentials.

**File**: `src/routes/login/+page.svelte`

Replace the `handleLogin` function:

```javascript
import { authAPI } from '$lib/api';

const handleLogin = async () => {
	errorMessage = '';
	isLoading = true;

	try {
		const response = await authAPI.login(email, password);
		
		if (response.success) {
			goto(`/dashboard/${response.data.role}`);
		}
	} catch (error) {
		errorMessage = error.message || 'Invalid credentials';
	} finally {
		isLoading = false;
	}
};
```

### Step 2: Update User Dashboard

**File**: `src/routes/dashboard/user/+page.svelte`

```javascript
import { onMount } from 'svelte';
import { statsAPI, pickupsAPI } from '$lib/api';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

let dustbinLevel = 0;
let credits = 0;
let scheduledPickups = 0;
let recentActivity = [];
let loading = true;

onMount(async () => {
	if (browser) {
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/login');
			return;
		}

		try {
			const response = await statsAPI.getUserStats();
			if (response.success) {
				dustbinLevel = response.data.dustbinLevel;
				credits = response.data.credits;
				scheduledPickups = response.data.scheduledPickups;
				recentActivity = response.data.recentActivity;
			}
		} catch (error) {
			console.error('Error fetching stats:', error);
			goto('/login');
		} finally {
			loading = false;
		}
	}
});

const handleSchedulePickup = async (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	
	try {
		const response = await pickupsAPI.create({
			scheduledDate: formData.get('date'),
			estimatedWeight: parseInt(formData.get('weight')),
			notes: formData.get('notes') || ''
		});

		if (response.success) {
			alert('Pickup scheduled successfully!');
			// Refresh stats
			const statsResponse = await statsAPI.getUserStats();
			scheduledPickups = statsResponse.data.scheduledPickups;
		}
	} catch (error) {
		alert('Error scheduling pickup: ' + error.message);
	}
};
```

### Step 3: Update Executive Dashboard

**File**: `src/routes/dashboard/executive/+page.svelte`

```javascript
import { onMount } from 'svelte';
import { statsAPI, pickupsAPI } from '$lib/api';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

let pendingPickups = 0;
let completedToday = 0;
let totalCollected = 0;
let pickupRequests = [];
let loading = true;

onMount(async () => {
	if (browser) {
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/login');
			return;
		}

		await loadData();
	}
});

const loadData = async () => {
	try {
		const [statsResponse, pickupsResponse] = await Promise.all([
			statsAPI.getExecutiveStats(),
			pickupsAPI.getPending()
		]);

		if (statsResponse.success) {
			pendingPickups = statsResponse.data.pendingPickups;
			completedToday = statsResponse.data.completedToday;
			totalCollected = statsResponse.data.totalCollected;
		}

		if (pickupsResponse.success) {
			pickupRequests = pickupsResponse.data;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		goto('/login');
	} finally {
		loading = false;
	}
};

const handleAccept = async (pickupId) => {
	try {
		const response = await pickupsAPI.accept(pickupId);
		if (response.success) {
			alert('Pickup accepted!');
			await loadData(); // Refresh data
		}
	} catch (error) {
		alert('Error accepting pickup: ' + error.message);
	}
};

const handleSkip = async (pickupId) => {
	// Just remove from list (or implement skip logic)
	pickupRequests = pickupRequests.filter(p => p._id !== pickupId);
};
```

### Step 4: Update Admin Dashboard

**File**: `src/routes/dashboard/admin/+page.svelte`

```javascript
import { onMount } from 'svelte';
import { statsAPI } from '$lib/api';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

let totalUsers = 0;
let totalExecutives = 0;
let totalCenters = 0;
let totalCollections = 0;
let dustbins = [];
let loading = true;

onMount(async () => {
	if (browser) {
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/login');
			return;
		}

		try {
			const response = await statsAPI.getAdminStats();
			if (response.success) {
				totalUsers = response.data.totalUsers;
				totalExecutives = response.data.totalExecutives;
				totalCenters = response.data.totalCenters;
				totalCollections = response.data.totalCollections;
				dustbins = response.data.criticalDustbins;
			}
		} catch (error) {
			console.error('Error fetching stats:', error);
			goto('/login');
		} finally {
			loading = false;
		}
	}
});
```

### Step 5: Update Centers Page

**File**: `src/routes/centers/+page.svelte`

```javascript
import { onMount } from 'svelte';
import { centersAPI } from '$lib/api';

let centers = [];
let loading = true;

onMount(async () => {
	try {
		const response = await centersAPI.getAll();
		if (response.success) {
			centers = response.data;
		}
	} catch (error) {
		console.error('Error fetching centers:', error);
	} finally {
		loading = false;
	}
});
```

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Frontend calls `authAPI.login(email, password)`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent API calls include token in Authorization header
6. Backend validates token on protected routes

## 🌐 API Usage Examples

### Login
```javascript
import { authAPI } from '$lib/api';

const response = await authAPI.login('user@demo.com', 'demo123');
// Token automatically stored in localStorage
```

### Get User Stats
```javascript
import { statsAPI } from '$lib/api';

const response = await statsAPI.getUserStats();
console.log(response.data.credits); // User's credits
```

### Create Pickup
```javascript
import { pickupsAPI } from '$lib/api';

const response = await pickupsAPI.create({
	scheduledDate: '2026-03-15',
	estimatedWeight: 10,
	notes: 'Please collect from main gate'
});
```

### Accept Pickup (Executive)
```javascript
import { pickupsAPI } from '$lib/api';

const response = await pickupsAPI.accept(pickupId);
```

## 🚀 Deployment

### Backend Deployment (Railway)

1. Create account on [Railway.app](https://railway.app)
2. Create new project
3. Add MongoDB database
4. Deploy backend from GitHub
5. Add environment variables:
   - `MONGODB_URI` (from Railway MongoDB)
   - `JWT_SECRET` (random string)
   - `FRONTEND_URL` (your Netlify URL)

### Frontend Deployment (Netlify)

1. Update `.env` with production backend URL:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecosorter
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

## 📝 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"demo123"}'

# Get user stats (replace TOKEN)
curl http://localhost:5000/api/stats/user \
  -H "Authorization: Bearer TOKEN"
```

### Test Frontend Integration

1. Start both backend and frontend
2. Open browser to `http://localhost:5173`
3. Login with demo credentials
4. Check browser console for API calls
5. Verify data loads correctly

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check backend CORS configuration in `server.js`

### 401 Unauthorized
- Token expired or invalid
- Clear localStorage and login again
- Check token is being sent in Authorization header

### Connection Refused
- Ensure backend server is running
- Check `VITE_API_URL` in frontend `.env`
- Verify port numbers match

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are correct
- Ensure user has correct role/permissions

## 📞 Support

For issues or questions:
- Backend: Check `backend/README.md`
- Frontend: Check `README.md`
- Deployment: Check `DEPLOYMENT.md`
