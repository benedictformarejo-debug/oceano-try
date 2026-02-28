# 📋 Supabase Quick Reference Card

## Setup (One-time)

1. **Create Account**: https://supabase.com
2. **Create Project**: Name it "oceano-convista"
3. **Run SQL**: Copy schema from SUPABASE-SETUP.md
4. **Get Credentials**: Settings → API
5. **Install Package**: `npm install @supabase/supabase-js`
6. **Add to .env**: 
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGc...
   ```

## File Changes Required

```bash
# Backend changes:
server/
├── config/supabase.js                          ✅ NEW
├── server.js                                   🔄 UPDATE
├── controllers/authController.js               🔄 UPDATE
├── controllers/bookingController.js            🔄 UPDATE
└── controllers/roomController.js               🔄 UPDATE
```

## Quick Commands

```bash
# Install Supabase
cd server && npm install @supabase/supabase-js

# Switch to Supabase versions
mv server.supabase.js server.js
mv controllers/authController.supabase.js controllers/authController.js
mv controllers/bookingController.supabase.js controllers/bookingController.js
mv controllers/roomController.supabase.js controllers/roomController.js

# Restart server
npm run dev
```

## Common Supabase Queries

### Insert
```javascript
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: 'value' }])
  .select()
  .single();
```

### Select
```javascript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')
  .single();
```

### Update
```javascript
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', userId);
```

### Delete
```javascript
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', itemId);
```

## Database Tables

### users
- id (UUID, primary key)
- name (text)
- email (text, unique)
- password (text, hashed)
- created_at (timestamp)

### rooms
- id (UUID, primary key)
- name (text)
- description (text)
- price (decimal)
- capacity (integer)
- size (text)
- amenities (text array)
- image (text)
- created_at (timestamp)

### bookings
- id (UUID, primary key)
- user_id (UUID, foreign key)
- room_id (UUID, foreign key)
- room_name (text)
- check_in (date)
- check_out (date)
- guests (integer)
- total_price (decimal)
- status (text)
- created_at (timestamp)

## Testing Checklist

- [ ] Server starts without errors
- [ ] "Supabase connected successfully" message
- [ ] Can register new user
- [ ] Can login existing user
- [ ] Rooms list loads
- [ ] Can create booking
- [ ] Can view user bookings
- [ ] Data visible in Supabase dashboard

## Troubleshooting

| Error | Solution |
|-------|----------|
| Connection failed | Check SUPABASE_URL and keys |
| Table not found | Run SQL schema |
| Auth errors | Use SUPABASE_SERVICE_KEY not ANON_KEY |
| Module not found | Run `npm install @supabase/supabase-js` |
| Data not saving | Check RLS policies or disable temporarily |

## Environment Variables Needed

```env
# Server (.env)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# Client (.env) - Optional for direct client access
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Supabase Dashboard Links

- **Tables**: Project → Table Editor
- **SQL**: Project → SQL Editor  
- **API Docs**: Project → API Docs
- **Auth Users**: Project → Authentication
- **Logs**: Project → Logs

## Key Differences from In-Memory

| Feature | In-Memory | Supabase |
|---------|-----------|----------|
| Data persistence | ❌ Lost on restart | ✅ Permanent |
| IDs | Sequential numbers | UUIDs |
| Queries | Array methods | SQL/Supabase API |
| Real-time | ❌ No | ✅ Yes |
| Scalability | ❌ Limited | ✅ Unlimited |

## Benefits

✅ Data survives server restarts
✅ Real PostgreSQL database
✅ Free tier (500MB)
✅ Automatic backups
✅ Visual dashboard
✅ Real-time capabilities
✅ Row Level Security

---

**Need detailed help?** See SUPABASE-SETUP.md and MIGRATION-GUIDE.md
