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
    // Web brauzerda har bir foydalanuvchi/akkaunt uchun alohida unikal ID yaratish
    let guestId = '';
    try {
      guestId = localStorage.getItem('uygo_device_user_id');
      if (!guestId) {
        guestId = String(Math.floor(100000000 + Math.random() * 900000000));
        localStorage.setItem('uygo_device_user_id', guestId);
      }
    } catch (e) {
      guestId = 'guest_' + Date.now();
    }
    return {
      id: guestId,
      firstName: 'Foydalanuvchi',
      lastName: '',
      username: `@user_${String(guestId).slice(-4)}`,
      photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${guestId}`,
      phone: ''
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
