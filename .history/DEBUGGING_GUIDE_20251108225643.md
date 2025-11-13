# 🔍 Login/Signup Debugging Guide

## ✅ Backend Testing Results

Both endpoints work perfectly when tested directly:

### Registration Test ✅
```bash
curl -X POST http://localhost:8000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Test User","email":"test@test.com","phoneNumber":"9876543210","password":"Test@123","role":"student"}'
```
**Result:** `{"message":"Account created successfully.","success":true}`

### Login Test ✅
```bash
curl -X POST http://localhost:8000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","role":"student"}'
```
**Result:** Login successful with user data returned

---

## 🔧 How to Debug Frontend Issues

### Step 1: Open Browser Developer Tools
1. Open your browser at `http://localhost:5173`
2. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Go to the **Console** tab

### Step 2: Try to Login/Signup
1. Fill in the form completely
2. **IMPORTANT:** Make sure to select a role (Job Seeker or Local Head)
3. Click Submit
4. Watch the Console for errors

### Step 3: Check Network Tab
1. Go to **Network** tab in DevTools
2. Try logging in again
3. Look for requests to `http://localhost:8000/api/v1/user/login` or `/register`
4. Click on the request and check:
   - **Status Code:** Should be 200 or 201
   - **Response:** Should show success message
   - **Request Payload:** Check if all fields are sent

---

## 🐛 Common Issues & Solutions

### Issue 1: "Please fill all required fields"
**Cause:** Role not selected
**Solution:** Click on either "Job Seeker" or "Local Head" radio button

### Issue 2: "Incorrect email or password"
**Cause:** Wrong credentials or user doesn't exist
**Solution:** 
- For signup: Use a new email
- For login: Use credentials from a registered account

### Issue 3: "Account doesn't exist with current role"
**Cause:** Trying to login with different role than signup
**Solution:** Use the same role you selected during signup

### Issue 4: CORS Error in Console
**Cause:** Backend not allowing requests from frontend
**Solution:** Check if backend shows:
```javascript
origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
```

### Issue 5: Network Error / Cannot Connect
**Cause:** Backend server not running
**Solution:** 
```bash
cd backend
npm run dev
```

---

## 📝 What to Check in Console

Look for these specific error messages:

### ✅ Good Signs:
- No red errors
- Toast notification appears (green = success, red = error)
- Network request shows status 200/201

### ❌ Bad Signs & What They Mean:

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| `CORS policy: No 'Access-Control-Allow-Origin'` | Backend CORS issue | Restart backend server |
| `Network Error` | Can't reach backend | Check if backend is on port 8000 |
| `404 Not Found` | Wrong API endpoint | Check USER_API_END_POINT in constants |
| `400 Bad Request` | Missing or invalid data | Check all form fields filled |
| `500 Internal Server Error` | Backend crash | Check backend terminal for errors |

---

## 🧪 Test User Credentials

Use these to test login:
```
Email: testuser456@test.com
Password: Test@123
Role: Job Seeker (student)
```

---

## 🔍 Step-by-Step Debugging Process

1. **Open Console** (F12 → Console tab)
2. **Clear Console** (click trash icon)
3. **Try to Signup/Login**
4. **Take Screenshot** of any red errors
5. **Check Network Tab**:
   - Look for the API call
   - Check status code
   - Check response
6. **Report back** with:
   - Screenshot of error
   - Network response
   - Exact steps you took

---

## 💡 Quick Fixes to Try

### Fix 1: Hard Refresh
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Fix 2: Clear Browser Cache
1. DevTools open
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Restart Both Servers
```bash
# Terminal 1 - Backend
cd /Users/ashutoshkumarsingh/Downloads/SkillSathi-main-2/backend
npm run dev

# Terminal 2 - Frontend  
cd /Users/ashutoshkumarsingh/Downloads/SkillSathi-main-2/frontend
npm run dev
```

---

## 📞 What to Report

If still not working, please provide:

1. **Console Errors** (screenshot or copy-paste)
2. **Network Tab** response for the failed request
3. **Which page** (Login or Signup)
4. **Exact steps** you followed
5. **Any toast messages** you saw

---

## ✅ Expected Behavior

### Successful Signup:
1. Fill form → Click "Create Account"
2. See toast: "Account created successfully"
3. Redirect to `/login` page

### Successful Login:
1. Fill form → Click "Sign In"
2. See toast: "Welcome back [Your Name]"
3. Redirect to home page (`/`)
4. See your profile in navbar

---

## 🚨 Emergency Reset

If nothing works:

```bash
# Kill all node processes
pkill -f node

# Restart backend
cd /Users/ashutoshkumarsingh/Downloads/SkillSathi-main-2/backend
npm run dev

# Restart frontend (new terminal)
cd /Users/ashutoshkumarsingh/Downloads/SkillSathi-main-2/frontend
npm run dev
```

Then try again with a fresh browser tab.
