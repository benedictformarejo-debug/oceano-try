import { motion } from 'framer-motion';

const SIZE_MAP = {
  sm: 'px-5 py-1.5 text-xs',
  md: 'px-8 py-2 text-sm',
  lg: 'px-10 py-3 text-base',
  xl: 'px-12 py-4 text-lg',
};

const VARIANTS = {
  primary: {
    wrapper: 'border border-emerald-950 group',
    text:    'text-emerald-950 group-hover:text-white',
    fill:    'bg-emerald-950',
  },
  secondary: {
    wrapper: 'border border-white group',
    text:    'text-white group-hover:text-black',
    fill:    'bg-white',
  },
  solid: {
  wrapper: 'border border-ocean-600 bg-ocean-600 hover:bg-ocean-700 transition-colors duration-300',
  text:    'text-white',
  fill:    '',
},
};

const Button = ({
  children,
  variant   = 'primary',
  size      = 'md',
  onClick,
  type      = 'button',
  disabled  = false,
  className = '',
  ...props
}) => {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZE_MAP[size]    ?? SIZE_MAP.md;

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        cursor-pointer font-semibold overflow-hidden relative rounded
        ${v.wrapper} ${s} ${className}
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
      `}
      {...props}
    >
      {/* Label */}
      <span className={`relative z-10 inline-flex items-center justify-center gap-2 duration-500 ${v.text}`}>
        {children}
      </span>

      {/* Fill spans — only for primary and secondary */}
      {variant !== 'solid' && (
        <>
          <span
            className={`absolute w-full h-full top-0 duration-500 ${v.fill} -left-full -rotate-45 group-hover:rotate-0 group-hover:left-0`}
          />
          <span
            className={`absolute w-full h-full top-0 duration-500 ${v.fill} -right-full -rotate-45 group-hover:rotate-0 group-hover:right-0`}
          />
        </>
      )}
    </motion.button>
  );
};

export default Button;