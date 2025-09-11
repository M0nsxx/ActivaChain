/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neural-purple': '#9333EA',
        'neural-pink': '#EC4899',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neural-gradient': 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neural-pulse': 'neural-pulse 3s ease-in-out infinite',
        'neural-connect': 'neural-connect 3s ease-in-out infinite',
        'glass-shimmer': 'glass-shimmer 3s linear infinite',
        'neural-pulse-glow': 'neural-pulse-glow 2s ease-in-out infinite',
        'neural-float': 'neural-float 8s ease-in-out infinite',
        'marketplace-glow': 'marketplace-glow 3s ease-in-out infinite',
        'service-card-hover': 'service-card-hover 0.3s ease-out forwards',
        'transaction-pulse': 'transaction-pulse 2s ease-in-out infinite',
        'neural-network': 'neural-network 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'neural-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.6)',
            transform: 'scale(1.02)'
          },
        },
        'neural-connect': {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.1)'
          },
        },
        'glass-shimmer': {
          '0%': { 
            backgroundPosition: '-1000px 0'
          },
          '100%': { 
            backgroundPosition: '1000px 0'
          },
        },
        'neural-pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(236, 72, 153, 0.4)'
          },
        },
        'neural-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)'
          },
          '33%': { 
            transform: 'translateY(-10px) rotate(1deg)'
          },
          '66%': { 
            transform: 'translateY(-20px) rotate(-1deg)'
          },
        },
        'marketplace-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(236, 72, 153, 0.2), 0 0 60px rgba(59, 130, 246, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(236, 72, 153, 0.4), 0 0 120px rgba(59, 130, 246, 0.2)'
          },
        },
        'service-card-hover': {
          '0%': { 
            transform: 'translateY(0px) scale(1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          },
          '100%': { 
            transform: 'translateY(-5px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(147, 51, 234, 0.3)'
          },
        },
        'transaction-pulse': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)'
          },
        },
        'neural-network': {
          '0%, 100%': { 
            strokeDashoffset: '0',
            opacity: '0.3'
          },
          '50%': { 
            strokeDashoffset: '-20',
            opacity: '0.8'
          },
        },
      },
    },
  },
  plugins: [],
}
