import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Purok 6, Barangay Aumbay, Island Garden City of Samal., Samal, Philippines, 8119']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['09261134714']
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['oceanoconvista@gmail.com']
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Sunday', '24/7 Reception & Support']
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 px-4"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
          Oceano Convista
        </p>
        <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900 mb-6">
          Get in Touch
        </h1>
      </motion.div>

      {/* Two-column layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 items-start">
        {/* Left: 2x2 Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-9"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-9 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-200 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-500 text-sm">{detail}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right: contact.jpg image */}
        <motion.div
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="rounded-3xl overflow-hidden h-[600px]"
>
  <img
    src="/images/contact.jpg"
    alt="Contact Oceano Convista"
    className="w-full h-full object-cover"
    style={{ mixBlendMode: 'multiply' }}
  />
</motion.div>

      </div>
    </div>
  );
};

export default Contact;