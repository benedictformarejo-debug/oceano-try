import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Waves, Mountain } from 'lucide-react';
import RegisterForm from '../components/forms/RegisterForm';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: CalendarCheck,
    title: 'Easy Booking',
    desc: 'Reserve your stay in just a few clicks.',
  },
  {
    icon: Waves,
    title: 'Pool Access',
    desc: 'Enjoy our stunning infinity pool anytime.',
  },
  {
    icon: Mountain,
    title: 'Breathtaking Views',
    desc: 'Wake up to panoramic ocean scenery.',
  },
];

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
      <div className="hidden lg:flex lg:w-1/2 relative bg-coral-500 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/IMG_4560.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-coral-500/60 to-ocean-600/90" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/images/logo3.png"
              alt="Oceano Con Vista"
              className="w-16 h-16 object-contain brightness-0 invert"
            />
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

            {/* 3 Resort Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 pt-2"
            >
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/80">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
              <img
                src="/images/logo3.png"
                alt="Oceano Con Vista"
                className="w-16 h-16 object-contain"
              />
              <span className="text-3xl font-serif font-bold text-gray-900">
                Oceano Con Vista
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2 text-center lg:text-left">
              Create Account
            </h2>
            <p className="text-gray-600 mb-8 text-center lg:text-left">
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