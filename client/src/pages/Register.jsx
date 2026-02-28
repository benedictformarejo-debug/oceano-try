import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';
import RegisterForm from '../components/forms/RegisterForm';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-coral-600 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral-500/90 to-ocean-600/90" />

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
              Begin Your Journey to Paradise
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Create your account and unlock exclusive access to luxury
              accommodations, special offers, and personalized experiences.
            </motion.p>
            
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-3 text-white/80"
            >
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Easy booking and reservation management</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Exclusive member-only rates and promotions</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Personalized recommendations and preferences</span>
              </li>
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-white/70"
          >
            © {new Date().getFullYear()} Oceano Con Vista Resort. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
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
              Create Account
            </h2>
            <p className="text-gray-600 mb-8">
              Already have an account?{' '}
              <Link to="/login" className="text-ocean-600 hover:text-ocean-700 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>

          <RegisterForm onSubmit={handleSubmit} error={error} />

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

export default Register;
