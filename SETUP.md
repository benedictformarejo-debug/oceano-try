# 🎨 Guest Dashboard - Clean Sidebar Layout

## What's New

✅ **Redesigned Sidebar** matching your reference image:
- Logo + Portal name at top
- User profile section with avatar badge
- Public site navigation (Home, About, Rooms, Gallery, Contact)
- Separator line
- Dashboard navigation (Overview, My Bookings, Payments)
- Sign Out button at bottom

✅ **Removed**:
- Top navbar (all in sidebar now)
- "Make a Booking" from sidebar (kept in Overview content)
- "Edit Profile" from both sidebar and Overview
- "Notifications" completely removed

✅ **Simplified Overview**:
- Welcome message
- 3 stats cards (Upcoming, Completed, Total Spent)
- 3 action cards (Browse Rooms, My Bookings, Make a Booking)
- Upcoming booking card (if exists)

## Files Included

```
dashboards-v2/
├── DashboardLayout.jsx    # Sidebar layout with new structure
├── GuestDashboard.jsx     # Overview page
├── MyBookings.jsx         # Bookings list page
└── Payments.jsx           # Payment history page
```

## Installation

### Step 1: Copy Files

```bash
cp dashboards-v2/DashboardLayout.jsx client/src/components/
cp dashboards-v2/GuestDashboard.jsx client/src/pages/dashboard/
cp dashboards-v2/MyBookings.jsx client/src/pages/dashboard/
cp dashboards-v2/Payments.jsx client/src/pages/dashboard/
```

### Step 2: Update App.jsx Routes

```jsx
import GuestDashboard from './pages/dashboard/GuestDashboard';
import MyBookings from './pages/dashboard/MyBookings';
import Payments from './pages/dashboard/Payments';

// In <Routes>:
<Route path="/dashboard" element={
  <ProtectedRoute requiredRole="guest">
    <GuestDashboard />
  </ProtectedRoute>
} />

<Route path="/dashboard/bookings" element={
  <ProtectedRoute requiredRole="guest">
    <MyBookings />
  </ProtectedRoute>
} />

<Route path="/dashboard/payments" element={
  <ProtectedRoute requiredRole="guest">
    <Payments />
  </ProtectedRoute>
} />
```

### Step 3: Test

```bash
npm run dev
```

Visit `/dashboard` after logging in.

## Layout Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  🌊 Oceano Convista                    │
│     Portal                              │
│                                         │
│  ◉ ben formarejo                       │
│    email@example.com                    │
│    [Guest]                              │
│                                         │
│  🏠 Home                                │
│  ℹ️  About                              │
│  🛏️  Rooms                              │
│  🖼️  Gallery                            │
│  ✉️  Contact                            │
│                                         │
│  ─────────────────────                  │
│                                         │
│  🏠 Overview                            │
│  📖 My Bookings                         │
│  💳 Payments                            │
│                                         │
│  [flexible space]                       │
│                                         │
│  🚪 Sign Out                            │
│                                         │
└─────────────────────────────────────────┘
```

## Features

### Sidebar
- **Fixed width** (288px / 72 in Tailwind)
- **Scrollable middle section** for many menu items
- **Fixed top** (logo + user profile)
- **Fixed bottom** (sign out)
- **Mobile responsive** with slide-in animation

### Overview Page
- **3 stat cards** with colored borders and icons
- **3 action cards** with gradient backgrounds:
  - Browse Rooms (blue gradient)
  - My Bookings (teal gradient)
  - Make a Booking (amber gradient)
- **Upcoming booking card** (conditional, only shows if booking exists)

### My Bookings Page
- **Booking cards** with room image
- Check-in/out dates, guests, price
- Status badges (confirmed, pending, completed, cancelled)
- View Details and Modify buttons

### Payments Page
- **3 stat cards** (Total Paid, Outstanding, Transactions)
- **Payment history table** with all transactions
- Download receipt buttons
- Add Payment Method section

## Customization

### Change Colors
Edit the gradient colors in action cards:
```jsx
// GuestDashboard.jsx
className="bg-gradient-to-br from-blue-50 to-cyan-50"
```

### Add More Menu Items
Add to the arrays in each page:
```jsx
const publicMenuItems = [
  { path: '/your-page', label: 'Your Page', icon: YourIcon },
];

const dashboardMenuItems = [
  { path: '/dashboard/new-page', label: 'New Page', icon: YourIcon },
];
```

### Replace Mock Data
```jsx
// Current (mock):
const bookings = [ ... ];

// Replace with API call:
const { data: bookings } = await supabase
  .from('bookings')
  .select('*')
  .eq('user_id', userId);
```

## Next Steps

1. ✅ Copy files to your project
2. ✅ Update routes in App.jsx
3. ✅ Test the new layout
4. Connect to real Supabase API
5. Add real payment integration
6. Customize colors/content to your brand

---

Clean, modern, and professional! 🎉
