# Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v6 or higher
mongod --version # MongoDB should be installed
```

### 2. Clone and Install

```bash
# Clone repository
git clone https://github.com/Mahaboob19/Smart_LMS.git
cd Smart_LMS

# Backend setup
cd backend
npm install
cp .env.example .env  # Copy example file (or create manually)
npm start

# Frontend setup (in new terminal)
cd smart-library-lms
npm install
npm run dev
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: MongoDB should auto-start
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management
   ```

### 4. Verify Installation

1. Backend: http://localhost:5000/api/health
2. Frontend: http://localhost:5173

## Common Issues

### Issue: MongoDB Connection Failed
**Solution:** 
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Try: `mongosh` to test connection

### Issue: Port Already in Use
**Solution:**
- Change PORT in `backend/.env`
- Update `VITE_API_BASE_URL` in `smart-library-lms/.env`

### Issue: Module Not Found
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Error
**Solution:**
- Ensure backend is running
- Check API URL matches backend port
- Verify CORS settings in `backend/index.js`

## Default Credentials

- **Admin Code:** `VVIT_ADMIN_2024`
- **Change in:** `backend/.env` → `ADMIN_AUTH_CODE`

## Need Help?

Check `README.md` for detailed documentation.
