// Telegram Mini App WebApp helper utility
export const tg = {
  get isAvailable() {
    return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
  },
  
  get webApp() {
    return typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
  },

  hasVersion(version) {
    if (!this.webApp) return false;
    if (typeof this.webApp.isVersionAtLeast === 'function') {
      return this.webApp.isVersionAtLeast(version);
    }
    return false;
  },

  getUser() {
    if (this.webApp?.initDataUnsafe?.user) {
      const u = this.webApp.initDataUnsafe.user;
      return {
        id: u.id,
        firstName: u.first_name || 'Foydalanuvchi',
        lastName: u.last_name || '',
        username: u.username ? `@${u.username}` : '',
        photoUrl: u.photo_url || null,
        phone: u.phone_number ? (u.phone_number.startsWith('+') ? u.phone_number : `+${u.phone_number}`) : ''
      };
    }
    // Fallback default mock user for web preview
    return {
      id: 998712345,
      firstName: 'Alisher',
      lastName: 'Usmonov',
      username: '@alisher_uygo',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+998 90 912 34 56'
    };
  },

  haptic(style = 'medium') {
    try {
      if (this.hasVersion('6.1') && this.webApp?.HapticFeedback) {
        if (style === 'light' || style === 'medium' || style === 'heavy') {
          this.webApp.HapticFeedback.impactOccurred(style);
        } else if (style === 'success' || style === 'warning' || style === 'error') {
          this.webApp.HapticFeedback.notificationOccurred(style);
        } else if (style === 'selection') {
          this.webApp.HapticFeedback.selectionChanged();
        }
      } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
        // Fallback for mobile browsers
        if (style === 'light' || style === 'selection') navigator.vibrate(10);
        else if (style === 'medium') navigator.vibrate(20);
        else if (style === 'heavy' || style === 'error') navigator.vibrate([25, 50, 25]);
        else if (style === 'success') navigator.vibrate([15, 30, 15]);
      }
    } catch (e) {
      // safe fallback
    }
  },

  init() {
    if (this.webApp) {
      try {
        if (typeof this.webApp.ready === 'function') {
          this.webApp.ready();
        }
        if (typeof this.webApp.expand === 'function') {
          this.webApp.expand();
        }
        // Set header color to UYGO yellow if supported
        if (this.hasVersion('6.1')) {
          if (typeof this.webApp.setHeaderColor === 'function') {
            this.webApp.setHeaderColor('#FFD400');
          }
          if (typeof this.webApp.setBackgroundColor === 'function') {
            this.webApp.setBackgroundColor('#F7F8FA');
          }
        }
      } catch (e) {
        // safe fallback
      }
    }
  }
};
