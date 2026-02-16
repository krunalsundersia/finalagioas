# Frontend Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "Invalid options object. Dev Server has been initialized..."

**Error Message:**
```
Invalid options object. Dev Server has been initialized using an options object 
that does not match the API schema.
- options.allowedHosts[0] should be a non-empty string.
```

**Solution:**

#### Quick Fix (Recommended):
```bash
cd frontend

# Create .env.local file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
DANGEROUSLY_DISABLE_HOST_CHECK=true
SKIP_PREFLIGHT_CHECK=true
PORT=3000
EOF

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

#### Alternative Fix 1: Use .env file
The frontend folder already has `.env` and `.env.local` files. Make sure they exist:

```bash
# Check if files exist
ls -la .env*

# If missing, create them:
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env.local
echo "REACT_APP_WS_URL=ws://localhost:8000/ws" >> .env.local
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" >> .env.local
echo "SKIP_PREFLIGHT_CHECK=true" >> .env.local
```

#### Alternative Fix 2: Downgrade react-scripts
```bash
npm install react-scripts@4.0.3 --save
npm start
```

#### Alternative Fix 3: Update to latest react-scripts
```bash
npm install react-scripts@latest --save
npm start
```

---

### Issue 2: "Cannot find module 'react-router-dom'"

**Solution:**
```bash
npm install react-router-dom
```

---

### Issue 3: "Cannot find module '@react-three/fiber'"

**Solution:**
```bash
npm install @react-three/fiber @react-three/drei three
```

---

### Issue 4: Port 3000 already in use

**Solution:**

**On Mac/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm start
```

**On Windows:**
```cmd
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual PID)
taskkill /PID <PID> /F

# Or set different port
set PORT=3001 && npm start
```

---

### Issue 5: "Module not found" errors

**Solution:**
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

---

### Issue 6: Backend not responding

**Check backend is running:**
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Should return: {"status": "healthy"}
```

**If backend not running:**
```bash
cd ../backend

# With Docker
docker-compose up -d

# Without Docker
source venv/bin/activate  # On Windows: venv\Scripts\activate
daphne -b 0.0.0.0 -p 8000 agioas_platform.asgi:application
```

---

### Issue 7: WebSocket connection fails

**Check:**
1. Backend is running
2. Redis is running: `redis-cli ping`
3. Correct WebSocket URL in `.env.local`

**Fix:**
```bash
# Start Redis
redis-server

# Or with Docker
docker-compose up -d redis
```

---

### Issue 8: Blank page / White screen

**Solution:**

1. **Check browser console (F12)**
   - Look for error messages
   - Check Network tab for failed requests

2. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or use Incognito mode

3. **Rebuild:**
   ```bash
   rm -rf build node_modules
   npm install
   npm start
   ```

---

### Issue 9: "Tailwind CSS not working"

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer

# Ensure tailwind.config.js exists
ls tailwind.config.js

# Restart dev server
npm start
```

---

### Issue 10: CORS errors

**Error:** "Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS"

**Solution:**

This should be configured in backend, but if you see this:

1. **Check backend settings.py:**
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```

2. **Restart backend:**
   ```bash
   docker-compose restart web
   ```

---

## Complete Clean Install Process

If nothing works, do a complete clean install:

```bash
# 1. Stop everything
# Press Ctrl+C in terminals running npm start

# 2. Clean frontend
cd frontend
rm -rf node_modules package-lock.json build .cache
npm cache clean --force

# 3. Reinstall
npm install

# 4. Create proper .env.local
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
DANGEROUSLY_DISABLE_HOST_CHECK=true
SKIP_PREFLIGHT_CHECK=true
PORT=3000
EOF

# 5. Start
npm start
```

---

## Verify Installation

After successful start, verify:

1. **Frontend loads:**
   - Open http://localhost:3000
   - Should see AGIOAS dashboard

2. **Backend connection:**
   - Open browser console (F12)
   - Should not see connection errors

3. **Can select simulation:**
   - Click on any simulation card
   - Should navigate to frontpage

---

## Still Having Issues?

### Check Node/npm versions:
```bash
node --version   # Should be 18+
npm --version    # Should be 9+
```

### Update if needed:
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Check all required dependencies installed:
```bash
npm list react react-dom react-router-dom @react-three/fiber three axios
```

---

## Environment Variables Reference

Your `.env.local` should contain:

```bash
# Required
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws

# Fixes
DANGEROUSLY_DISABLE_HOST_CHECK=true
SKIP_PREFLIGHT_CHECK=true

# Optional
PORT=3000
BROWSER=none
```

---

## Getting Help

1. Check browser console for errors
2. Check terminal output for warnings
3. Review this guide
4. Check main SETUP_GUIDE.md
5. Ensure backend is running first

---

**Most Common Fix:** Delete `node_modules`, reinstall, ensure `.env.local` exists with proper values.
