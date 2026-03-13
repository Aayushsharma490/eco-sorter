# Simplified OTP Flow - Complete Guide

## Overview
The OTP flow has been simplified to make pickup completion faster and more intuitive. The executive generates the OTP immediately upon accepting a pickup, and the user completes the process by entering the OTP and actual weight.

---

## Complete Flow

### Step 1: User Schedules Pickup
**Location:** User Dashboard

1. User fills out the pickup form:
   - Pickup Date
   - Estimated Weight (minimum 5kg)
   - Optional Notes
2. User clicks "Schedule Pickup"
3. Pickup is created with status: `pending`

**Backend:** `POST /api/pickups`
```json
{
  "scheduledDate": "2026-03-15",
  "estimatedWeight": 10,
  "notes": "Plastic bottles and containers"
}
```

---

### Step 2: Executive Accepts Pickup
**Location:** Executive Dashboard

1. Executive sees pending pickup requests
2. Executive clicks "Accept" button
3. **OTP is generated immediately** (no separate step)
4. Executive sees alert with 6-digit OTP
5. Button changes to "✅ Accepted - OTP Sent"

**Backend Flow:**
1. `PUT /api/pickups/:id/accept` - Sets status to `accepted`
2. `PUT /api/pickups/:id/complete` - Generates OTP immediately

**Alert Message:**
```
Pickup accepted! ✅

Your OTP: 123456

Share this 6-digit OTP with the user to complete pickup.
```

---

### Step 3: User Sees OTP Automatically
**Location:** User Dashboard

**Automatic Detection:**
- User dashboard polls every 5 seconds for OTP
- When OTP is generated, user sees notification
- OTP modal opens automatically (or can be opened manually)

**What User Sees:**
1. Live tracking card shows: "🔔 Executive has generated OTP! Check below to verify."
2. Yellow notification bar with "Enter OTP Now" button
3. OTP modal opens showing:
   - The 6-digit OTP (displayed prominently)
   - Weight input field
   - OTP input field
   - "Complete Pickup" button

---

### Step 4: User Completes Pickup
**Location:** User Dashboard - OTP Modal

1. User sees the OTP displayed on screen
2. User enters actual weight collected (minimum 5kg)
3. User enters the 6-digit OTP
4. User clicks "Complete Pickup"

**Backend:** `PUT /api/pickups/:id/verify-otp`
```json
{
  "otp": "123456",
  "actualWeight": 12
}
```

**Validation:**
- OTP must match exactly
- OTP must not be expired (10 minutes validity)
- Weight must be at least 5kg

---

### Step 5: Credits Added & Logs Updated
**Automatic Actions:**

1. **Pickup Status:** Changed to `completed`
2. **Credits Calculation:** `actualWeight × 10 = credits`
   - Example: 12kg × 10 = 120 credits
3. **User Credits:** Updated in database
4. **Admin Logs:** Activity recorded with timestamp

**Success Message:**
```
✅ Pickup completed successfully!
+120 credits earned
```

---

## Technical Implementation

### Backend Routes

#### 1. Accept Pickup
```javascript
PUT /api/pickups/:id/accept
// Sets status to 'accepted'
// Assigns executive to pickup
```

#### 2. Generate OTP
```javascript
PUT /api/pickups/:id/complete
// Generates 6-digit OTP
// Stores OTP and timestamp
// Weight is optional at this stage
```

#### 3. Verify OTP
```javascript
PUT /api/pickups/:id/verify-otp
Body: { otp: "123456", actualWeight: 12 }
// Validates OTP
// Checks expiry (10 minutes)
// Calculates credits (weight × 10)
// Updates user credits
// Marks pickup as completed
```

### Frontend Components

#### Executive Dashboard
**File:** `src/routes/dashboard/executive/+page.svelte`

**Key Functions:**
- `handleAccept()` - Accepts pickup and generates OTP immediately
- Shows OTP in alert message
- Changes button to "✅ Accepted - OTP Sent"

#### User Dashboard
**File:** `src/routes/dashboard/user/+page.svelte`

**Key Functions:**
- `startOTPPolling()` - Checks for OTP every 5 seconds
- `handleVerifyOTP()` - Verifies OTP and completes pickup
- Shows OTP modal with weight and OTP inputs

**OTP Modal Features:**
- Displays the OTP prominently
- Weight input (minimum 5kg)
- OTP input (6 digits)
- Real-time validation
- Auto-closes on success

---

## User Experience Flow

### Executive View
```
1. See pending pickup request
   ↓
2. Click "Accept"
   ↓
3. See alert with OTP: "123456"
   ↓
4. Share OTP with user verbally/via phone
   ↓
5. Button shows "✅ Accepted - OTP Sent"
   ↓
6. Wait for user to verify
```

### User View
```
1. Pickup status changes to "Accepted"
   ↓
2. Live tracking starts automatically
   ↓
3. Notification: "Executive has generated OTP!"
   ↓
4. OTP modal opens (auto or manual)
   ↓
5. See OTP displayed: "123456"
   ↓
6. Enter actual weight: "12kg"
   ↓
7. Enter OTP: "123456"
   ↓
8. Click "Complete Pickup"
   ↓
9. Success! +120 credits earned
```

---

## Data Flow

### Database Updates

**Pickup Object:**
```json
{
  "id": "pickup1234567890",
  "userId": "user123",
  "executiveId": "exec456",
  "status": "completed",
  "scheduledDate": "2026-03-15",
  "estimatedWeight": 10,
  "actualWeight": 12,
  "creditsEarned": 120,
  "otp": null,  // Cleared after verification
  "otpGeneratedAt": null,  // Cleared after verification
  "completedAt": "2026-03-14T10:30:00Z"
}
```

**User Object:**
```json
{
  "id": "user123",
  "name": "Demo User",
  "credits": 120,  // Updated
  // ... other fields
}
```

---

## Error Handling

### OTP Expired
- **Condition:** More than 10 minutes since generation
- **Message:** "OTP expired"
- **Solution:** Executive must accept again to generate new OTP

### Invalid OTP
- **Condition:** OTP doesn't match
- **Message:** "Invalid OTP"
- **Solution:** User must enter correct OTP

### Weight Too Low
- **Condition:** Weight < 5kg
- **Message:** "Please enter actual weight (minimum 5kg)"
- **Solution:** User must enter at least 5kg

---

## Key Features

### 1. Automatic OTP Generation
- No separate "Complete Pickup" button for executive
- OTP generated immediately on accept
- Faster workflow

### 2. Automatic OTP Detection
- User dashboard polls every 5 seconds
- No manual refresh needed
- Instant notification when OTP ready

### 3. OTP Display
- OTP shown prominently in user modal
- No need to ask executive for OTP
- User can see and verify easily

### 4. Live Tracking
- Starts automatically when pickup accepted
- Shows both user and executive locations
- Updates every 10 seconds

### 5. Credits Calculation
- Formula: `weight (kg) × 10 = credits`
- Example: 12kg = 120 credits
- Automatically added to user wallet

---

## Testing the Flow

### Test Scenario 1: Happy Path
1. Login as User (demo credentials)
2. Schedule a pickup for today
3. Logout and login as Executive
4. Accept the pickup
5. Note the OTP from alert
6. Logout and login as User
7. See OTP modal open automatically
8. Enter weight: 10kg
9. Enter OTP from step 5
10. Click "Complete Pickup"
11. Verify credits added

### Test Scenario 2: OTP Expiry
1. Accept pickup as Executive
2. Wait 11 minutes
3. Try to verify as User
4. Should see "OTP expired" error

### Test Scenario 3: Invalid OTP
1. Accept pickup as Executive
2. Login as User
3. Enter wrong OTP
4. Should see "Invalid OTP" error

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Role |
|--------|----------|---------|------|
| POST | `/api/pickups` | Create pickup | User |
| GET | `/api/pickups` | Get all pickups | All |
| GET | `/api/pickups/pending` | Get pending pickups | Executive, Admin |
| PUT | `/api/pickups/:id/accept` | Accept pickup | Executive |
| PUT | `/api/pickups/:id/complete` | Generate OTP | Executive |
| PUT | `/api/pickups/:id/verify-otp` | Verify OTP & complete | User |
| DELETE | `/api/pickups/:id` | Cancel pickup | User, Admin |

---

## Files Modified

### Backend
- `backend/routes/pickups.js` - OTP generation and verification logic

### Frontend
- `src/routes/dashboard/executive/+page.svelte` - Accept and generate OTP
- `src/routes/dashboard/user/+page.svelte` - OTP polling and verification
- `src/lib/api.js` - API functions for OTP flow

---

## Credits System

### Calculation
```
Credits = Actual Weight (kg) × 10
```

### Examples
- 5kg = 50 credits
- 10kg = 100 credits
- 15kg = 150 credits
- 20kg = 200 credits

### Usage
Credits can be redeemed on the Benefits page:
- Bronze Tier: 500 credits
- Silver Tier: 1000 credits
- Gold Tier: 2000 credits
- Platinum Tier: 5000 credits
- Diamond Tier: 10000 credits

---

## Summary

The simplified OTP flow makes pickup completion faster and more intuitive:

1. **Executive accepts** → OTP generated immediately
2. **User sees OTP** → Displayed on screen automatically
3. **User enters weight + OTP** → One-step completion
4. **Credits added** → Instant reward

No more back-and-forth, no manual steps, just smooth recycling! ♻️
