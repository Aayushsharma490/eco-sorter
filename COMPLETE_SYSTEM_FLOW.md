# Complete Eco Sorter System Flow 🌍

## System Overview
Eco Sorter is a comprehensive plastic waste management platform connecting users, pickup executives, and administrators for efficient recycling with rewards.

---

## 🎯 Complete User Journey Flow

### Step 1: User Registration & Login
**Entry Point**: `/login`

**Quick Demo Login** (NEW):
- Click "👤 User" button for instant demo login
- Or manually enter: user@demo.com / demo123
- System authenticates and redirects to user dashboard

**What Happens**:
- JWT token generated and stored in localStorage
- User role saved for dashboard routing
- Redirects to `/dashboard/user`

---

### Step 2: User Dashboard Overview
**Location**: `/dashboard/user`
**Tagline**: "♻️ Your plastic today, your rewards tomorrow. Keep recycling!"

**User Sees**:
1. **Stats Cards**:
   - 🗑️ Dustbin Level (0-100%)
   - 💰 Total Credits (earned from pickups)
   - 📅 Scheduled Pickups (pending count)

2. **Schedule Pickup Form**:
   - Date picker (minimum: today)
   - Estimated weight (minimum: 5kg)
   - Optional notes
   - Submit button

3. **Recent Activity** (Dynamic from backend):
   - Last 5 pickups with status
   - Completed: Shows weight + credits earned
   - Accepted: Shows "Executive on the way"
   - Pending: Shows scheduled date

---

### Step 3: User Schedules Pickup
**Action**: User fills form and clicks "Schedule Pickup"

**Backend Process**:
```
POST /api/pickups
{
  scheduledDate: "2024-01-15",
  estimatedWeight: 15,
  notes: "Plastic bottles and containers"
}
```

**What Happens**:
1. New pickup created with status: "pending"
2. Pickup ID generated: `pickup1234567890`
3. User address auto-attached from profile
4. Pickup appears in executive's pending list
5. User's scheduled pickups count increases
6. Success message shown

---

### Step 4: Executive Sees Pending Pickup
**Location**: `/dashboard/executive`
**Tagline**: "🚚 Every pickup makes a difference. You're the hero of clean streets!"

**Executive Dashboard Shows**:
1. **Availability Toggle** (NEW):
   - Switch: Available Today YES/NO
   - Saves to localStorage
   - Green when available, gray when not

2. **Stats Cards**:
   - 📦 Pending Pickups
   - ✅ Completed Today
   - ⚖️ Total Collected (kg)

3. **Pickup Requests List**:
   - User name and address
   - Estimated weight
   - Scheduled date/time
   - Notes (if any)
   - Actions: Accept / Skip buttons

---

### Step 5: Executive Accepts Pickup
**Action**: Executive clicks "Accept" button

**Backend Process**:
```
PUT /api/pickups/:id/accept
```

**What Happens**:
1. Pickup status changes: "pending" → "accepted"
2. Executive ID attached to pickup
3. Pickup removed from pending list
4. "Complete Pickup" button appears
5. **Live Tracking Starts Automatically**

---

### Step 6: Live Location Tracking Begins
**Triggers**: Immediately after executive accepts

**User Side** (`/dashboard/user`):
- **Live Tracking Card Appears**:
  - 📍 "Live Tracking Active"
  - Interactive map with Leaflet.js
  - Green marker (📍): User location
  - Blue marker (🚚): Executive location
  - Both locations update every 10 seconds
  - Coordinates displayed in lat/lng
  - "Stop Tracking" button

**Executive Side** (`/dashboard/executive`):
- **Live Navigation Card Appears**:
  - 🚚 "Live Navigation Active"
  - Interactive map with Leaflet.js
  - Blue marker (🚚): Executive location
  - Green marker (📍): User location
  - Both locations update every 10 seconds
  - Coordinates displayed in lat/lng
  - "Stop Tracking" button

**Technical Details**:
- Uses browser Geolocation API
- Updates every 10 seconds via setInterval
- API: `POST /api/location/update`
- API: `GET /api/location/pickup/:id`
- Map library: Leaflet.js (CDN)
- Tiles: OpenStreetMap

---

### Step 7: Executive Arrives & Collects Waste
**Action**: Executive clicks "Complete Pickup" button

**Modal Appears**:
- Title: "Complete Pickup"
- Input: Actual Weight Collected (kg)
- Minimum: 5kg
- Button: "Generate OTP"

**Executive Enters Weight**:
- Example: 15kg
- Clicks "Generate OTP"

**Backend Process**:
```
PUT /api/pickups/:id/complete
{
  actualWeight: 15
}
```

**What Happens**:
1. System generates 6-digit OTP: `123456`
2. OTP expires in 10 minutes
3. OTP displayed in large format on executive screen
4. Executive shares OTP with user verbally

---

### Step 8: User Verifies OTP
**Trigger**: OTP modal auto-opens on user dashboard

**User Sees**:
- Modal: "Verify Pickup Completion"
- Input: 6-digit OTP field
- Button: "Verify OTP"

**User Enters OTP**:
- Types: `123456`
- Clicks "Verify OTP"

**Backend Process**:
```
PUT /api/pickups/:id/verify-otp
{
  otp: "123456"
}
```

**What Happens**:
1. System validates OTP
2. Checks expiry (< 10 minutes)
3. **Credits Calculated**: 15kg × 10 = 150 credits
4. Pickup status: "accepted" → "completed"
5. User wallet updated: +150 credits
6. Executive stats updated: +1 completed, +15kg
7. Admin stats updated: +15kg total
8. OTP cleared from database
9. Location tracking stops
10. Success message: "✅ Pickup completed! +150 credits earned"

---

### Step 9: User Checks Benefits
**Location**: `/benefits`
**Tagline**: "Turn your garbage into gold! Recycle plastic, earn credits, unlock VIP perks."

**User Sees**:
- Current credits: 150
- Current tier: None (need 500 for Bronze)
- Progress bar: 150/500 (30%)
- All 5 tiers displayed:
  - 🥉 Bronze (500 credits) - 5 benefits
  - 🥈 Silver (1,000 credits) - 8 benefits
  - 🥇 Gold (2,000 credits) - 10 benefits
  - 💎 Platinum (5,000 credits) - 12 benefits
  - 💠 Diamond (10,000 credits) - 14 benefits

**Benefits Include**:
- Movie tickets (20-60% off)
- Food delivery (15-60% off)
- Grocery (20-50% off)
- Mobile recharge (₹100-₹2000)
- Fuel vouchers (₹150-₹1500)
- Hotels, shopping, travel, OTT, gaming, fitness, etc.

---

## 👨‍💼 Admin Dashboard Flow

### Admin Login
**Quick Demo**: Click "👨‍💼 Admin" button
**Credentials**: admin@demo.com / demo123

### Admin Dashboard Overview
**Location**: `/dashboard/admin`
**Tagline**: "🌍 Managing the future of waste management, one pickup at a time"

**Admin Sees**:

1. **Stats Cards** (Dynamic):
   - 👥 Total Users (active count)
   - 🚚 Pickup Executives (on duty count)
   - 🏢 Collection Centers (points count)
   - ♻️ Total Collections (kg recycled)

2. **Quick Actions** (All Functional):
   - 👤 Manage Users → `/dashboard/admin/users`
   - 🚚 Manage Executives → `/dashboard/admin/executives`
   - 🏢 Manage Centers → `/dashboard/admin/centers`
   - 📊 View Reports → `/dashboard/admin/reports`

3. **Dustbin Level Monitoring** (Dynamic):
   - Shows dustbins with level ≥ 70%
   - Location, user, level percentage
   - Status: Critical/Moderate/Normal
   - Color-coded progress bars

4. **Recent System Activity** (Dynamic):
   - Last 6 pickups across all users
   - Status icons: ✅ Completed, 🚚 In Progress, 📅 Scheduled
   - Shows user/executive names
   - Weight and credits for completed
   - Relative timestamps

---

### Manage Users
**Location**: `/dashboard/admin/users`

**Features**:
- Table view with all users
- Columns: Name, Email, Role, Credits, Phone
- Actions: Edit, Delete
- "+ Add New User" button
- Create/Edit modal with form
- Role dropdown: User/Executive/Admin
- Credits management

---

### Manage Executives
**Location**: `/dashboard/admin/executives`
**Tagline**: "🚚 Our heroes on wheels, making the planet cleaner"

**Features**:
- Card grid view
- Each card shows:
  - Executive name, email, phone
  - Availability status
  - Stats: Total pickups, Completed, In Progress, Total weight
  - "View Details" button

---

### Manage Centers
**Location**: `/dashboard/admin/centers`
**Tagline**: "🏢 Where waste transforms into opportunity"

**Features**:
- Card grid view
- Each card shows:
  - Center name and location
  - Full address
  - Contact: Phone, Email
  - Serviceable areas (tags)
  - Status: Active
  - Areas covered count
  - "View Details" button

---

### View Reports
**Location**: `/dashboard/admin/reports`
**Tagline**: "📊 Data-driven insights for a greener tomorrow"

**Features**:

1. **Key Metrics Cards**:
   - 📦 Total Pickups
   - ✅ Completed Pickups
   - ⚖️ Total Weight (kg)
   - 💰 Total Credits Earned

2. **Top Users Leaderboard**:
   - Top 5 users by credits
   - Ranked #1-#5
   - Shows name, email, credits

3. **Active Executives List**:
   - Top 5 executives
   - Shows name, email, status

4. **Environmental Impact**:
   - ♻️ Plastic Recycled (kg)
   - 🌳 Trees Saved (weight/10)
   - 💧 Water Conserved (weight×5 liters)

---

## 🔄 Complete Data Flow

### Pickup Lifecycle:
```
1. User creates pickup → Status: "pending"
2. Executive accepts → Status: "accepted" + Location tracking starts
3. Executive generates OTP → OTP stored (10 min expiry)
4. User verifies OTP → Status: "completed" + Credits added
5. Data updates:
   - User: credits += (weight × 10)
   - Executive: completed++, totalWeight += weight
   - Admin: totalCollections += weight
   - Recent activity updated across all dashboards
```

### Location Tracking Flow:
```
1. Pickup accepted → Tracking starts
2. Every 10 seconds:
   - User: POST /api/location/update (lat, lng, pickupId)
   - Executive: POST /api/location/update (lat, lng, pickupId)
3. Every 10 seconds:
   - User: GET /api/location/pickup/:id → Gets executive location
   - Executive: GET /api/location/pickup/:id → Gets user location
4. Map updates markers in real-time
5. Pickup completed → Tracking stops
```

### Credits & Rewards Flow:
```
1. Pickup completed → Credits calculated (weight × 10)
2. User wallet updated
3. User checks /benefits page
4. System checks credits against tiers:
   - < 500: No tier
   - 500-999: Bronze
   - 1000-1999: Silver
   - 2000-4999: Gold
   - 5000-9999: Platinum
   - 10000+: Diamond
5. Unlocked benefits displayed
6. User can redeem rewards (future feature)
```

---

## 🎨 UI/UX Highlights

### Taglines Throughout:
- **Benefits**: "Turn your garbage into gold!"
- **User Dashboard**: "Your plastic today, your rewards tomorrow"
- **Executive Dashboard**: "Every pickup makes a difference"
- **Admin Dashboard**: "Managing the future of waste management"
- **Executives Page**: "Our heroes on wheels"
- **Centers Page**: "Where waste transforms into opportunity"
- **Reports Page**: "Data-driven insights for a greener tomorrow"

### Visual Elements:
- Gradient backgrounds
- Glassmorphism effects
- Animated cards with hover effects
- Color-coded status indicators
- Interactive maps with custom markers
- Progress bars and charts
- Emoji icons throughout
- Responsive grid layouts

### User Experience:
- Quick demo login (1-click)
- Real-time updates (no refresh needed)
- Live location tracking with maps
- OTP-based secure completion
- Dynamic activity feeds
- Instant feedback messages
- Mobile-responsive design

---

## 📊 Database Structure

### Users Collection:
```json
{
  "id": "user1234567890",
  "name": "Demo User",
  "email": "user@demo.com",
  "password": "hashed_password",
  "role": "user|executive|admin",
  "credits": 150,
  "phone": "+91 1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Pickups Collection:
```json
{
  "id": "pickup1234567890",
  "userId": "user1234567890",
  "executiveId": "exec1234567890",
  "scheduledDate": "2024-01-15T10:00:00.000Z",
  "estimatedWeight": 15,
  "actualWeight": 15,
  "address": {...},
  "status": "pending|accepted|completed",
  "creditsEarned": 150,
  "notes": "Plastic bottles",
  "otp": "123456",
  "otpGeneratedAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-14T12:00:00.000Z",
  "completedAt": "2024-01-15T10:35:00.000Z"
}
```

### Location Tracking:
```json
{
  "pickupId": "pickup1234567890",
  "userLocation": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  },
  "executiveLocation": {
    "latitude": 28.6150,
    "longitude": 77.2100,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🚀 Key Features Summary

✅ Quick demo login (1-click for all roles)
✅ Real-time location tracking with interactive maps
✅ OTP-based secure pickup completion
✅ Dynamic dashboards (all data from backend)
✅ Credits system (1kg = 10 credits)
✅ 5-tier rewards program (500-10,000 credits)
✅ Executive availability toggle
✅ Admin management (users, executives, centers, reports)
✅ Live activity feeds
✅ Environmental impact tracking
✅ Responsive design
✅ Engaging taglines throughout
✅ Glassmorphism UI
✅ Animated components

---

## 🎯 User Goals Achieved

1. **Easy Onboarding**: Quick demo login, no signup needed
2. **Simple Scheduling**: 3-field form, instant confirmation
3. **Real-time Tracking**: See executive approaching on map
4. **Secure Completion**: OTP verification prevents fraud
5. **Instant Rewards**: Credits added immediately
6. **Clear Benefits**: Visual tier system with progress
7. **Engaging Experience**: Taglines, animations, feedback

---

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Role-based access control
- OTP expiry (10 minutes)
- One-time OTP usage
- HTTPS in production
- Input validation
- XSS protection

---

## 📱 Mobile Responsiveness

- Responsive grid layouts
- Touch-friendly buttons
- Mobile-optimized maps
- Collapsible navigation
- Readable font sizes
- Proper spacing
- Swipe gestures supported

---

This is the complete flow of the Eco Sorter system! 🌍♻️
