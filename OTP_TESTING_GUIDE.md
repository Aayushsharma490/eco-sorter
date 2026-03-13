# OTP Flow Testing Guide

## Quick Test Steps

### 🎯 Complete Flow Test (5 minutes)

#### Step 1: Schedule Pickup as User
1. Open browser: `http://localhost:5173/login`
2. Click "👤 Quick Demo - User"
3. Go to "Schedule Pickup" section
4. Fill form:
   - Date: Today or tomorrow
   - Weight: 10kg
   - Notes: "Test pickup"
5. Click "Schedule Pickup"
6. ✅ Should see success message

#### Step 2: Accept Pickup as Executive
1. Click "Logout"
2. Click "🚚 Quick Demo - Executive"
3. See the pickup request in "Today's Pickup Requests"
4. Click "Accept" button
5. ✅ Should see alert with OTP (e.g., "123456")
6. ✅ Button should change to "✅ Accepted - OTP Sent"
7. **Note down the OTP from the alert**

#### Step 3: Complete Pickup as User
1. Click "Logout"
2. Click "👤 Quick Demo - User"
3. ✅ Should see "Live Tracking Active" card
4. ✅ Should see notification: "Executive has generated OTP!"
5. ✅ OTP modal should open automatically (or click "Enter OTP Now")
6. In the modal:
   - See OTP displayed: "123456"
   - Enter actual weight: 12
   - Enter OTP: 123456
7. Click "Complete Pickup"
8. ✅ Should see success: "+120 credits earned"
9. ✅ Credits should update in dashboard

#### Step 4: Verify Admin Logs
1. Click "Logout"
2. Click "👨‍💼 Quick Demo - Admin"
3. Check "Recent System Activity"
4. ✅ Should see "Pickup Completed" log with 12kg and +120 credits

---

## Expected Behavior

### Executive Dashboard After Accept
```
✅ Accepted - OTP Sent
```
- No "Complete Pickup" button
- Just shows accepted status
- OTP was shown in alert

### User Dashboard After Accept
```
🔔 Executive has generated OTP! Check below to verify.
```
- Live tracking starts
- Yellow notification bar appears
- OTP modal opens automatically
- OTP is displayed prominently

### After Completion
```
User:
- Credits: +120 (12kg × 10)
- Pickup status: Completed
- Live tracking stops

Executive:
- Pickup removed from pending list
- Stats updated: Completed Today +1

Admin:
- New log entry
- Total collected updated
```

---

## Test Scenarios

### ✅ Scenario 1: Happy Path
**Steps:** Follow complete flow above
**Expected:** All steps work smoothly, credits added

### ⏰ Scenario 2: OTP Expiry
**Steps:**
1. Executive accepts pickup
2. Wait 11 minutes
3. User tries to verify OTP
**Expected:** Error message "OTP expired"

### ❌ Scenario 3: Wrong OTP
**Steps:**
1. Executive accepts pickup (OTP: 123456)
2. User enters wrong OTP (654321)
**Expected:** Error message "Invalid OTP"

### ⚖️ Scenario 4: Low Weight
**Steps:**
1. Executive accepts pickup
2. User enters weight: 3kg
**Expected:** Error message "Please enter actual weight (minimum 5kg)"

### 🔄 Scenario 5: Multiple Pickups
**Steps:**
1. Schedule 3 pickups as User
2. Accept all 3 as Executive
3. Complete all 3 as User
**Expected:** All complete successfully, credits accumulate

---

## Troubleshooting

### OTP Modal Not Opening
**Problem:** User doesn't see OTP modal after executive accepts
**Solution:**
- Wait 5 seconds (polling interval)
- Refresh page
- Check if pickup status is "accepted"

### OTP Not Displayed
**Problem:** Modal opens but OTP not shown
**Solution:**
- Check if executive actually accepted (not just clicked)
- Verify backend generated OTP
- Check browser console for errors

### Credits Not Added
**Problem:** Pickup completes but credits don't update
**Solution:**
- Refresh user dashboard
- Check backend logs
- Verify OTP verification was successful

### Live Tracking Not Starting
**Problem:** No map shown after accept
**Solution:**
- Allow location permissions in browser
- Check if pickup status is "accepted"
- Verify navigator.geolocation is available

---

## Demo Credentials

### User
- Email: `user@ecosorter.com`
- Password: `password123`
- Or click: "👤 Quick Demo - User"

### Executive
- Email: `executive@ecosorter.com`
- Password: `password123`
- Or click: "🚚 Quick Demo - Executive"

### Admin
- Email: `admin@ecosorter.com`
- Password: `password123`
- Or click: "👨‍💼 Quick Demo - Admin"

---

## API Testing (Optional)

### Using curl or Postman

#### 1. Login as Executive
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"executive@ecosorter.com","password":"password123"}'
```
**Response:** Get token

#### 2. Accept Pickup
```bash
curl -X PUT http://localhost:5000/api/pickups/PICKUP_ID/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. Generate OTP
```bash
curl -X PUT http://localhost:5000/api/pickups/PICKUP_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"actualWeight":0}'
```
**Response:** Get OTP

#### 4. Verify OTP (as User)
```bash
curl -X PUT http://localhost:5000/api/pickups/PICKUP_ID/verify-otp \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"otp":"123456","actualWeight":12}'
```
**Response:** Credits earned

---

## Success Checklist

- [ ] User can schedule pickup
- [ ] Executive sees pending pickup
- [ ] Executive can accept pickup
- [ ] OTP is generated immediately on accept
- [ ] Executive sees OTP in alert
- [ ] Button changes to "Accepted - OTP Sent"
- [ ] User dashboard detects OTP automatically
- [ ] OTP modal opens with OTP displayed
- [ ] User can enter weight and OTP
- [ ] Pickup completes successfully
- [ ] Credits are added to user wallet
- [ ] Admin logs are updated
- [ ] Live tracking works during pickup
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Performance Metrics

### Expected Timings
- Schedule pickup: < 1 second
- Accept pickup: < 2 seconds (includes OTP generation)
- OTP detection: 0-5 seconds (polling interval)
- OTP verification: < 1 second
- Credits update: Immediate

### Network Requests
- Schedule: 1 request
- Accept: 2 requests (accept + generate OTP)
- OTP polling: 1 request every 5 seconds
- Verify: 1 request
- Total: ~5-6 requests for complete flow

---

## Browser Console Commands

### Check if OTP polling is active
```javascript
// Should see interval ID
console.log('Polling active:', checkOTPInterval !== null);
```

### Check active pickup
```javascript
console.log('Active pickup:', activePickup);
```

### Check OTP
```javascript
console.log('OTP:', activePickup?.otp);
```

### Force OTP modal open
```javascript
showOTPModal = true;
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| OTP not generating | Backend error | Check server logs |
| Modal not opening | Polling not started | Refresh page |
| Credits not added | OTP verification failed | Check OTP and weight |
| Tracking not working | Location permission denied | Allow location in browser |
| Button still shows "Accept" | Accept request failed | Check network tab |

---

## Next Steps After Testing

1. ✅ Verify all test scenarios pass
2. ✅ Check browser console for errors
3. ✅ Check backend logs for errors
4. ✅ Test on different browsers (Chrome, Firefox, Safari)
5. ✅ Test on mobile devices
6. ✅ Deploy to production
7. ✅ Test production deployment

---

## Production Testing

### After Deployment

1. Test with production URLs:
   - Frontend: `https://eco-sorter.netlify.app`
   - Backend: `https://eco-sorter-backend.onrender.com`

2. Verify environment variables:
   - `VITE_API_URL` in frontend
   - `FRONTEND_URL` in backend
   - `NODE_ENV=production` in backend

3. Test complete flow on production

4. Monitor for errors in:
   - Netlify logs
   - Render logs
   - Browser console

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend logs
3. Verify all environment variables
4. Test API endpoints directly
5. Clear browser cache and localStorage
6. Try in incognito mode

Happy testing! 🚀
