# 🚀 Quick Start Guide - Oceano Convista Resort

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies

Open two terminal windows in the project root directory.

**Terminal 1 (Server):**
```bash
cd server
npm install
```

**Terminal 2 (Client):**
```bash
cd client
npm install
```

### Step 2: Start the Application

**Terminal 1 (Start Backend):**
```bash
cd server
npm run dev
```
✅ Server running at http://localhost:5000

**Terminal 2 (Start Frontend):**
```bash
cd client
npm run dev
```
✅ Client running at http://localhost:5173

### Step 3: Open in Browser

Navigate to: **http://localhost:5173**

## 🎯 Try These Features

1. **Browse the Site**
   - Click through Home, About, Rooms, Gallery, Contact pages
   - Notice the navbar changing from transparent to white on scroll

2. **Create an Account**
   - Click "Login" in the navbar
   - Then click "Sign up" 
   - Fill in your details and register

3. **Book a Room**
   - Go to "Rooms" page
   - Click "Book Now" on any room
   - Select check-in/check-out dates
   - Choose number of guests
   - Confirm booking!

## 🎨 Key Features to Notice

- **Transparent Navbar**: Scrolls from transparent to white
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Try resizing your browser
- **Split-Screen Auth**: Beautiful login/register pages
- **Booking Modal**: Interactive room booking interface

## 📝 Sample Test Account

You can create any account you like! The app uses in-memory storage, so:
- No database setup required
- Data resets when you restart the server
- Perfect for testing and development

## 🛠️ Troubleshooting

**Port Already in Use?**
- Change the port in `server/.env` (PORT=5000)
- Or in `client/vite.config.js` (port: 5173)

**Dependencies Not Installing?**
- Make sure you have Node.js v18+ installed
- Try clearing npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Images Not Loading?**
- The app uses Unsplash CDN images
- Make sure you have internet connection

## 📂 File Structure Overview

```
oceano-convista/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Hero, Button, Forms
│   │   ├── pages/       # Home, About, Rooms, Gallery, Contact, Login, Register
│   │   ├── context/     # AuthContext for user state
│   │   ├── services/    # API calls
│   │   └── hooks/       # Custom React hooks
│   └── package.json
│
└── server/             # Express Backend
    ├── routes/         # API endpoints
    ├── controllers/    # Business logic
    ├── middleware/     # Auth middleware
    └── package.json
```

## 🎓 Learning Resources

This project demonstrates:
- ✅ React functional components with hooks
- ✅ React Context for state management
- ✅ React Router for navigation
- ✅ Custom hooks (useNavbarScroll)
- ✅ Framer Motion animations
- ✅ TailwindCSS utility classes
- ✅ Express.js REST API
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes

## 🚧 Next Steps

Want to enhance the project? Try adding:
- [ ] Persistent database (MongoDB/PostgreSQL)
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] User profile page
- [ ] Booking history
- [ ] Room reviews

## 💡 Tips for React Beginners

1. **Start with Pages**: Look at `src/pages/Home.jsx` to see how components work together
2. **Check Components**: Explore `src/components/` for reusable parts
3. **Auth Flow**: Follow the login process in `AuthContext.jsx`
4. **API Calls**: See `src/services/api.js` for backend communication
5. **Styling**: Notice how Tailwind classes are used throughout

## 🤝 Need Help?

- Check the main README.md for detailed documentation
- Review the code comments
- Experiment and break things - that's how you learn!

---

Enjoy building with Oceano Convista! 🏖️✨
