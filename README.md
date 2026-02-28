# 🏖️ Oceano Convista Resort

A modern, luxurious resort booking website built with React, Node.js, Express, TailwindCSS, and Framer Motion. Features a stunning ocean-inspired design with seamless booking functionality.

![Oceano Convista](https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80)

## ✨ Features

- 🏖️ **Beautiful Modern Design** - Ocean-inspired color palette with elegant typography
- 🔐 **Authentication System** - Secure login and registration with JWT tokens
- 🏨 **Room Booking** - Browse luxury accommodations and book with ease
- 📱 **Fully Responsive** - Optimized for all devices from mobile to desktop
- ✨ **Smooth Animations** - Beautiful transitions using Framer Motion
- 🎨 **Custom Navbar** - Transparent navbar that transitions to white on scroll
- 📸 **Image Gallery** - Showcase resort amenities and accommodations
- 📧 **Contact Form** - Easy communication with the resort

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool
- **Custom Hooks** - Reusable React logic

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Supabase** - PostgreSQL database (optional, see setup guide)

## 💾 Database Options

The project supports two modes:

### 1. **In-Memory Mode (Default)**
- ✅ No setup required
- ✅ Quick testing
- ❌ Data lost on restart
- **Perfect for**: Learning, testing, demos

### 2. **Supabase Mode (Production)**
- ✅ Real PostgreSQL database
- ✅ Data persistence
- ✅ Free tier available
- **Perfect for**: Real applications, production

**To use Supabase**: See detailed setup in `SUPABASE-SETUP.md`

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- (Optional) Supabase account for persistent database

### Installation

1. **Clone or download the project**

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd ../client
npm install
```

### Running the Application

You'll need two terminal windows/tabs:

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

**Terminal 2 - Start the Frontend:**
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173`

### Using the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account by clicking "Register"
3. Browse available rooms
4. Log in to book a room
5. Fill in booking details (check-in, check-out, guests)
6. Confirm your booking!

## 📁 Project Structure

```
oceano-convista/
│
├── client/                      # React Frontend
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation with scroll effect
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── Hero.jsx            # Hero section
│   │   │   ├── Button.jsx          # Reusable button
│   │   │   └── forms/
│   │   │       ├── LoginForm.jsx   # Login form component
│   │   │       └── RegisterForm.jsx # Registration form
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Homepage
│   │   │   ├── About.jsx           # About page
│   │   │   ├── Rooms.jsx           # Rooms listing & booking
│   │   │   ├── Gallery.jsx         # Photo gallery
│   │   │   ├── Contact.jsx         # Contact form
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   │
│   │   ├── hooks/
│   │   │   └── useNavbarScroll.js  # Navbar scroll hook
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                      # Node.js Backend
│   ├── routes/
│   │   ├── auth.js                 # Auth routes
│   │   ├── bookings.js             # Booking routes
│   │   └── rooms.js                # Room routes
│   │
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── bookingController.js    # Booking logic
│   │   └── roomController.js       # Room logic
│   │
│   ├── middleware/
│   │   └── auth.js                 # JWT verification
│   │
│   ├── server.js                   # Express server
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🎨 Design Features

### Color Palette
- **Ocean Blue** - Primary brand color (#1289b2)
- **Coral** - Accent color (#f8684a)
- **Sand** - Neutral color (#caa675)
- **White** - Clean background

### Typography
- **Playfair Display** - Elegant serif for headings
- **Outfit** - Modern sans-serif for body text

### Animations
- Smooth page transitions
- Navbar transformation on scroll
- Card hover effects
- Modal animations
- Button interactions

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid tokens
- Tokens expire after 7 days
- Passwords are hashed with bcrypt

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/user` - Get user bookings (protected)
- `GET /api/bookings/all` - Get all bookings

## 📚 Documentation

- **QUICKSTART.md** - Get running in 5 minutes
- **FEATURES.md** - Detailed feature showcase
- **SUPABASE-SETUP.md** - Complete Supabase integration guide
- **SUPABASE-QUICK-REF.md** - Quick reference for Supabase commands
- **MIGRATION-GUIDE.md** - Switch from in-memory to Supabase

## 🌐 Environment Variables

### Server (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Sample Data

The application includes sample room data with:
- 6 different room types
- Pricing from $200 - $1200 per night
- Various amenities and capacities
- High-quality images from Unsplash

## 🚧 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Admin dashboard
- [ ] Review system
- [ ] Availability calendar
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Credits

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide React](https://lucide.dev)
- Fonts from [Google Fonts](https://fonts.google.com)

---

Built with ❤️ using React, Node.js, and modern web technologies
