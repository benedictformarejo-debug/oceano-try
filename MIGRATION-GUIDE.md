# 🔄 Migration Guide: In-Memory to Supabase

This guide shows you how to switch your Oceano Convista project from in-memory storage to Supabase.

## Before You Start

✅ Complete the setup in `SUPABASE-SETUP.md` first
✅ Have your Supabase credentials ready
✅ Backup any test data you want to keep

## Option 1: Quick Switch (Recommended)

### Step 1: Install Supabase Package

```bash
cd server
npm install @supabase/supabase-js
```

### Step 2: Update Environment Variables

Add to `server/.env`:
```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### Step 3: Replace Files

**Backup originals (optional):**
```bash
cd server
cp server.js server.js.backup
cp controllers/authController.js controllers/authController.js.backup
cp controllers/bookingController.js controllers/bookingController.js.backup
cp controllers/roomController.js controllers/roomController.js.backup
```

**Replace with Supabase versions:**
```bash
# In the server directory:
mv server.supabase.js server.js
mv controllers/authController.supabase.js controllers/authController.js
mv controllers/bookingController.supabase.js controllers/bookingController.js
mv controllers/roomController.supabase.js controllers/roomController.js
```

### Step 4: Create Config Directory

```bash
mkdir -p config
# The supabase.js config file is already in config/
```

### Step 5: Restart Server

```bash
npm run dev
```

You should see:
```
🔄 Testing Supabase connection...
✅ Supabase connected successfully!
🏖️  Oceano Convista server running on port 5000
```

## Option 2: Manual Integration

If you want to keep your existing files and manually integrate:

### 1. Create Supabase Client

Create `server/config/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export { supabase };
```

### 2. Update Each Controller

**Replace array operations with Supabase queries:**

**Before (In-Memory):**
```javascript
const users = [];
const user = users.find(u => u.email === email);
```

**After (Supabase):**
```javascript
import { supabase } from '../config/supabase.js';
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();
```

### 3. Update server.js

Add at the top:
```javascript
import { testConnection } from './config/supabase.js';
```

In your startup:
```javascript
await testConnection();
```

## Testing Your Migration

### 1. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Check Supabase dashboard → Table Editor → users

### 2. Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Get Rooms
```bash
curl http://localhost:5000/api/rooms
```

### 4. Test Booking (needs auth token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "roomId":"room-uuid",
    "roomName":"Ocean View Suite",
    "checkIn":"2024-03-15",
    "checkOut":"2024-03-20",
    "guests":2,
    "totalPrice":1750
  }'
```

## Verification Checklist

After migration, verify these features work:

- [ ] User registration creates entry in Supabase
- [ ] User login works with Supabase data
- [ ] Rooms list loads from Supabase
- [ ] Bookings save to Supabase
- [ ] User can view their bookings
- [ ] Data persists after server restart
- [ ] Protected routes still require auth

## Common Issues After Migration

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:** 
```bash
cd server
npm install @supabase/supabase-js
```

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure your `server/.env` has:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### Issue: "relation does not exist"
**Solution:** Run the SQL schema from SUPABASE-SETUP.md in Supabase SQL Editor

### Issue: Authentication still using old method
**Solution:** Clear browser localStorage and re-login:
```javascript
// In browser console:
localStorage.clear();
```

### Issue: UUIDs not matching
**Solution:** Supabase uses UUIDs, not simple IDs. Update any hardcoded IDs to use actual UUIDs from database

## Rollback Plan

If you need to go back to in-memory:

```bash
cd server
mv server.js.backup server.js
mv controllers/authController.js.backup controllers/authController.js
mv controllers/bookingController.js.backup controllers/bookingController.js
mv controllers/roomController.js.backup controllers/roomController.js
npm run dev
```

## Benefits After Migration

✅ **Data Persistence** - Survives server restarts
✅ **Real Database** - PostgreSQL with ACID compliance
✅ **Scalability** - Handles thousands of users
✅ **Real-time** - Can add live updates
✅ **Backups** - Automatic daily backups
✅ **Security** - Row Level Security (RLS)
✅ **Dashboard** - Visual data management
✅ **Free Tier** - 500MB database, unlimited API requests

## Next Enhancements

Now that you have Supabase, you can add:

1. **Supabase Auth** - Replace JWT with Supabase Auth
2. **Real-time Bookings** - Live updates when rooms are booked
3. **File Storage** - Upload room images directly
4. **Admin Panel** - Manage rooms and bookings
5. **Analytics** - Track booking patterns
6. **Email Notifications** - Booking confirmations

## Need Help?

- Check SUPABASE-SETUP.md for detailed setup
- Visit [Supabase Docs](https://supabase.com/docs)
- Check [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

---

Congratulations! Your resort is now powered by a real database! 🎉
