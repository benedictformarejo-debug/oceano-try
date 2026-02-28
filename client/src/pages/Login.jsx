import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
  setError('');
  const result = await login(formData.email, formData.password);
  
  if (result.success) {
    // Redirect based on role
    if (result.user.role === 'admin') {
      navigate('/admin');
    } else if (result.user.role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/dashboard'); // guest
    }
  } else {
    setError(result.error);
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ocean-600 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-600/90 to-ocean-800/90" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center space-x-3">
            <Waves className="w-10 h-10" />
            <span className="text-3xl font-display font-bold">Oceano Con Vista</span>
          </Link>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-display font-bold leading-tight"
            >
              Welcome Back to Paradise
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-ocean-100"
            >
              Sign in to access your bookings and continue your journey to
              ultimate relaxation and luxury.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-ocean-200"
          >
            © {new Date().getFullYear()} Oceano Con Vista Resort. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-3">
              <Waves className="w-8 h-8 text-ocean-600" />
              <span className="text-2xl font-display font-bold text-gray-900">
                Oceano Con Vista
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 mb-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-ocean-600 hover:text-ocean-700 font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>

          <LoginForm onSubmit={handleSubmit} error={error} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
