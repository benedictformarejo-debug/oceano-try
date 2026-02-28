# 🔌 Supabase Integration Guide - Oceano Convista

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database** - Powerful relational database
- **Authentication** - Built-in user management
- **Real-time subscriptions** - Live data updates
- **Storage** - File uploads and management
- **Auto-generated APIs** - REST and GraphQL

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: oceano-convista
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll need these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (keep this SECRET!)
```

## Step 3: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  size TEXT,
  amenities TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for rooms table (public read access)
CREATE POLICY "Anyone can view rooms" ON rooms
  FOR SELECT USING (true);

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Insert sample rooms data
INSERT INTO rooms (name, description, price, capacity, size, amenities, image) VALUES
('Ocean View Suite', 'Luxurious suite with panoramic ocean views, king-size bed, and private balcony.', 350.00, 2, '45 sqm', ARRAY['Ocean View', 'King Bed', 'Private Balcony', 'Mini Bar', 'Smart TV', 'WiFi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
('Deluxe Garden Room', 'Spacious room overlooking tropical gardens with modern amenities and comfort.', 250.00, 2, '35 sqm', ARRAY['Garden View', 'Queen Bed', 'Bathtub', 'Coffee Maker', 'Smart TV', 'WiFi'], 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
('Family Beach Villa', 'Perfect for families, featuring two bedrooms, living area, and direct beach access.', 550.00, 4, '80 sqm', ARRAY['Beach Access', '2 Bedrooms', 'Living Room', 'Kitchenette', 'Smart TV', 'WiFi'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
('Premium Pool Villa', 'Ultimate luxury with private infinity pool, outdoor shower, and stunning views.', 750.00, 2, '65 sqm', ARRAY['Private Pool', 'King Bed', 'Outdoor Shower', 'Jacuzzi', 'Butler Service', 'WiFi'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
('Coastal Bungalow', 'Charming bungalow with traditional design and modern comforts near the shore.', 200.00, 2, '30 sqm', ARRAY['Sea View', 'Queen Bed', 'Patio', 'Mini Fridge', 'Ceiling Fan', 'WiFi'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
('Presidential Suite', 'The pinnacle of luxury with panoramic views, separate living areas, and premium service.', 1200.00, 4, '120 sqm', ARRAY['Panoramic Views', '2 Bedrooms', 'Living Room', 'Dining Area', 'Butler Service', 'Private Chef Available'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800');
```

4. Click **"Run"** to execute
5. You should see success messages for each table

## Step 4: Install Supabase Client

**For Server (Backend):**
```bash
cd server
npm install @supabase/supabase-js
```

**For Client (Frontend) - Optional:**
```bash
cd client
npm install @supabase/supabase-js
```

## Step 5: Configure Environment Variables

**Update `server/.env`:**
```env
PORT=5000
JWT_SECRET=oceano-convista-secret-key-change-in-production-2024
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

**Update `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Step 6: Update Backend Files

I'll provide the updated controller files in separate files.

## Step 7: Test the Connection

1. Restart your server: `npm run dev`
2. Try registering a new user
3. Check your Supabase dashboard > Table Editor > users table
4. You should see the new user!

## Common Issues & Solutions

### Issue: "relation does not exist"
- **Solution**: Make sure you ran the SQL schema creation script

### Issue: "JWT expired" or auth errors
- **Solution**: Check your Supabase keys are correct in .env

### Issue: "permission denied for table"
- **Solution**: Review your RLS policies or temporarily disable RLS for testing

### Issue: Cannot insert into users table
- **Solution**: Use the service_role key in backend for admin operations

## Supabase Dashboard Features

### Table Editor
- View and edit data directly
- Add/delete rows manually
- Export data as CSV

### Authentication
- View all registered users
- Manage user sessions
- Configure auth providers (Google, GitHub, etc.)

### SQL Editor
- Run custom queries
- Create functions and triggers
- Backup/restore database

### API Docs
- Auto-generated API documentation
- Test endpoints directly
- View example code

## Next Steps

Once connected, you can:
1. ✅ Store real user data persistently
2. ✅ Keep bookings even after server restart
3. ✅ Add real-time features (live booking updates)
4. ✅ Use Supabase Auth instead of JWT
5. ✅ Add file storage for room images
6. ✅ Create admin dashboard with Supabase

## Benefits of Supabase

✅ **No server setup** - Cloud-hosted PostgreSQL
✅ **Real-time** - Instant updates across clients
✅ **Secure** - Row Level Security built-in
✅ **Scalable** - Handles growth automatically
✅ **Free tier** - 500MB database, 50MB storage
✅ **Auto-backups** - Daily backups included

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or ask me! 🚀
