import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import RoomDetail from './pages/RoomDetail';
import Rooms from './pages/Rooms';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Booking Pages
import BookingConfirmation from './pages/BookingConfirmation';

// Guest Dashboard
import GuestDashboard from './pages/dashboard/GuestDashboard';
import MyBookings from './pages/dashboard/MyBookings';
import Payments from './pages/dashboard/Payments';

// Staff Dashboard
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffReservations from './pages/staff/StaffReservations';
import StaffCheckInOut from './pages/staff/StaffCheckInOut';
import StaffRoomStatus from './pages/staff/StaffRoomStatus';
import StaffGuestRequests from './pages/staff/StaffGuestRequests';
import StaffPayments from './pages/staff/StaffPayments';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';
import AdminRooms from './pages/admin/AdminRooms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFinance from './pages/admin/AdminFinance';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes - WITH Navbar + Footer */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Home /></main>
            </div>
          } />

          <Route path="/about" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><About /></main>
              <Footer />
            </div>
          } />

          <Route path="/rooms/:roomId" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><RoomDetail /></main>
            </div>
          } />

          <Route path="/rooms" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Rooms /></main>
            </div>
          } />

          

          <Route path="/gallery" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Gallery /></main>
            </div>
          } />

          <Route path="/contact" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Contact /></main>
            </div>
          } />

          {/* Auth Pages - NO Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Guest Dashboard */}
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

          {/* Staff Dashboard */}
          <Route path="/staff" element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/staff/reservations" element={
            <ProtectedRoute requiredRole="staff">
              <StaffReservations />
            </ProtectedRoute>
          } />
          <Route path="/staff/checkinout" element={
            <ProtectedRoute requiredRole="staff">
              <StaffCheckInOut />
            </ProtectedRoute>
          } />
          <Route path="/staff/room-status" element={
            <ProtectedRoute requiredRole="staff">
              <StaffRoomStatus />
            </ProtectedRoute>
          } />
          <Route path="/staff/requests" element={
            <ProtectedRoute requiredRole="staff">
              <StaffGuestRequests />
            </ProtectedRoute>
          } />
          <Route path="/staff/payments" element={
            <ProtectedRoute requiredRole="staff">
              <StaffPayments />
            </ProtectedRoute>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute requiredRole="admin">
              <AdminReservations />
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute requiredRole="admin">
              <AdminRooms />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/finance" element={
            <ProtectedRoute requiredRole="admin">
              <AdminFinance />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;