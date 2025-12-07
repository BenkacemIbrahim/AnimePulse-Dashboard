tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        'primary-dark': '#CC0000',
        'primary-light': '#FF3333',
        secondary: '#000000',
        'secondary-light': '#333333',
        accent: '#FF6B6B',
        'accent-dark': '#800000',
        sidebar: {
          DEFAULT: '#0F0F0F',
          foreground: '#FFFFFF',
          primary: '#FF0000',
          'primary-foreground': '#FFFFFF',
          accent: '#1E1E1E',
          'accent-foreground': '#FFFFFF',
          border: 'rgba(255, 0, 0, 0.2)',
          ring: 'rgba(255, 0, 0, 0.4)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }
        }
      },
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'red-glow': '0 0 15px rgba(255, 0, 0, 0.5)',
        'red-glow-lg': '0 0 30px rgba(255, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const avatarImg = document.getElementById('profileImagePreview');
  const saveTop = document.getElementById('saveProfileBtn');
  const saveBottom = document.getElementById('saveProfileBtnBottom');
  async function loadProfile() {
    try {
      const p = await API.apiGet('/profile');
      nameInput && (nameInput.value = p.name || '');
      emailInput && (emailInput.value = p.email || '');
      if (avatarImg && p.avatar_url) avatarImg.src = p.avatar_url;
    } catch {}
  }
  async function saveProfile() {
    try {
      await API.apiPut('/profile', { name: nameInput?.value || '', avatar_url: avatarImg?.src || null });
      alert('Saved');
    } catch { alert('Save failed'); }
  }
  if (saveTop) saveTop.addEventListener('click', saveProfile);
  if (saveBottom) saveBottom.addEventListener('click', saveProfile);
  loadProfile();
});

