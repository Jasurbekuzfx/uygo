import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, Heart, X,
  Sparkles, Building2, TrendingUp, Clock, Plus
} from 'lucide-react';

import HeaderNav from './components/HeaderNav';
import RotatingBanner from './components/RotatingBanner';
import PropertyCard from './components/PropertyCard';
import FilterBottomSheet from './components/FilterBottomSheet';
import PropertyDetailModal from './components/PropertyDetailModal';
import FavoritesScreen from './components/FavoritesScreen';
import CreateListingModal from './components/CreateListingModal';
import MessagesScreen from './components/MessagesScreen';
import ProfileScreen from './components/ProfileScreen';
import MonetizationModal from './components/MonetizationModal';
import AdminPanelModal from './components/AdminPanelModal';
import BottomNavigation from './components/BottomNavigation';

import { 
  INITIAL_PROPERTIES, 
  SAMPLE_TEST_PROPERTIES,
  SAMPLE_TEST_CONVERSATIONS,
  INITIAL_BANNERS, 
  PROPERTY_TYPES, 
  INITIAL_NOTIFICATIONS,
  DEFAULT_BILLING_SETTINGS,
  INITIAL_PAYMENT_REQUESTS,
  formatDateDDMMYYYY,
  addDaysToDateStr,
  isDateExpired
} from './data/mockData';
import { tg } from './utils/telegram';

export default function App() {
  // Telegram User & Init
  const [currentUser, setCurrentUser] = useState(null);

  // App Main State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('uygo_properties_live');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SAMPLE_TEST_PROPERTIES; // Active rich mock demo variant
  });

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('uygo_banners_live');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('uygo_favorites_live');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ['prop-top-1', 'prop-1'];
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('uygo_conversations_live');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SAMPLE_TEST_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('uygo_notifications_live');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [reports, setReports] = useState([]);

  // Billing Settings (card number, holder, prices, durations)
  const [billingSettings, setBillingSettings] = useState(() => {
    const saved = localStorage.getItem('uygo_billing_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_BILLING_SETTINGS;
  });

  // Payment Requests (manual verification queue)
  const [paymentRequests, setPaymentRequests] = useState(() => {
    const saved = localStorage.getItem('uygo_payment_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_PAYMENT_REQUESTS;
  });

  // Active Screen / Navigation Tab
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'favorites', 'create', 'messages', 'profile'
  const [activeChatId, setActiveChatId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toshkent');
  const [selectedPurposeTab, setSelectedPurposeTab] = useState('all'); // 'all', 'sale', 'rent', 'daily'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'apartment', etc.

  const [detailedFilters, setDetailedFilters] = useState({
    purpose: 'all',
    type: 'all',
    region: 'Toshkent',
    district: 'Barchasi',
    rooms: 'Barchasi',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    minFloor: '',
    maxFloor: '',
    renovation: 'Barchasi',
    furniture: 'Barchasi'
  });

  // Modals
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMonetizationModal, setShowMonetizationModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  // Telegram Init effect
  useEffect(() => {
    tg.init();
    try {
      const savedProfile = localStorage.getItem('uygo_user_profile');
      if (savedProfile) {
        setCurrentUser(JSON.parse(savedProfile));
        return;
      }
    } catch (e) {}
    const user = tg.getUser();
    setCurrentUser(user);
  }, []);

  // Sync to LocalStorage (Clean Live)
  useEffect(() => {
    localStorage.setItem('uygo_properties_live', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('uygo_banners_live', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('uygo_favorites_live', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('uygo_conversations_live', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('uygo_notifications_live', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('uygo_billing_settings', JSON.stringify(billingSettings));
  }, [billingSettings]);

  useEffect(() => {
    localStorage.setItem('uygo_payment_requests', JSON.stringify(paymentRequests));
  }, [paymentRequests]);

  // Automatic Expiry Check for TOP, VIP and Banners
  useEffect(() => {
    const runExpiryCheck = () => {
      // 1. Check properties TOP and VIP expiration
      setProperties(prev => {
        let changed = false;
        const updated = prev.map(p => {
          let updatedProp = { ...p };
          let itemChanged = false;

          if (p.isTop && p.topEndDate && isDateExpired(p.topEndDate)) {
            updatedProp.isTop = false;
            itemChanged = true;
          }
          if (p.isVip && p.vipEndDate && isDateExpired(p.vipEndDate)) {
            updatedProp.isVip = false;
            itemChanged = true;
          }

          if (itemChanged) {
            changed = true;
            return updatedProp;
          }
          return p;
        });
        return changed ? updated : prev;
      });

      // 2. Check advertising banners expiration
      setBanners(prev => {
        let changed = false;
        const updated = prev.map(b => {
          if (b.active && b.endDate && isDateExpired(b.endDate)) {
            changed = true;
            return { ...b, active: false };
          }
          return b;
        });
        return changed ? updated : prev;
      });
    };

    runExpiryCheck();
    const intervalTimer = setInterval(runExpiryCheck, 30000); // Check every 30s
    return () => clearInterval(intervalTimer);
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = (propId) => {
    setFavorites(prev => {
      const exists = prev.includes(propId);
      if (exists) {
        showToast('Saqlanganlardan olib tashlandi');
        return prev.filter(id => id !== propId);
      } else {
        showToast('Saqlanganlarga qo‘shildi ❤️');
        return [...prev, propId];
      }
    });
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Region filter
      if (selectedRegion && prop.region !== selectedRegion) {
        return false;
      }

      // Purpose tab filter (Sotuv / Ijara / Kunlik)
      if (selectedPurposeTab !== 'all' && prop.purpose !== selectedPurposeTab) {
        return false;
      }

      // Purpose from detailed filter
      if (detailedFilters.purpose !== 'all' && prop.purpose !== detailedFilters.purpose) {
        return false;
      }

      // Category filter
      const activeType = selectedCategory !== 'all' ? selectedCategory : detailedFilters.type;
      if (activeType !== 'all' && prop.type !== activeType) {
        return false;
      }

      // District filter
      if (detailedFilters.district && detailedFilters.district !== 'Barchasi') {
        if (prop.district !== detailedFilters.district) return false;
      }

      // Rooms filter
      if (detailedFilters.rooms && detailedFilters.rooms !== 'Barchasi') {
        if (detailedFilters.rooms === '5+') {
          if (prop.rooms < 5) return false;
        } else {
          if (Number(prop.rooms) !== Number(detailedFilters.rooms)) return false;
        }
      }

      // Price filter
      if (detailedFilters.minPrice && prop.price < Number(detailedFilters.minPrice)) return false;
      if (detailedFilters.maxPrice && prop.price > Number(detailedFilters.maxPrice)) return false;

      // Area filter
      if (detailedFilters.minArea && prop.area < Number(detailedFilters.minArea)) return false;
      if (detailedFilters.maxArea && prop.area > Number(detailedFilters.maxArea)) return false;

      // Floor filter
      if (detailedFilters.minFloor && prop.floor < Number(detailedFilters.minFloor)) return false;
      if (detailedFilters.maxFloor && prop.floor > Number(detailedFilters.maxFloor)) return false;

      // Renovation
      if (detailedFilters.renovation && detailedFilters.renovation !== 'Barchasi') {
        if (prop.renovation !== detailedFilters.renovation) return false;
      }

      // Furniture
      if (detailedFilters.furniture && detailedFilters.furniture !== 'Barchasi') {
        if (prop.furniture !== detailedFilters.furniture) return false;
      }

      // Search query (matches title, district, description, address)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesDistrict = prop.district.toLowerCase().includes(q);
        const matchesDesc = prop.description.toLowerCase().includes(q);
        const matchesRooms = `${prop.rooms} xona`.includes(q);
        if (!matchesTitle && !matchesDistrict && !matchesDesc && !matchesRooms) {
          return false;
        }
      }

      return true;
    });
  }, [properties, selectedRegion, selectedPurposeTab, selectedCategory, detailedFilters, searchQuery]);

  // Split into VIP, TOP, and Recent
  const vipListings = useMemo(() => filteredProperties.filter(p => p.isVip), [filteredProperties]);
  const topListings = useMemo(() => filteredProperties.filter(p => p.isTop && !p.isVip), [filteredProperties]);
  const recentListings = useMemo(() => filteredProperties.filter(p => !p.isVip && !p.isTop), [filteredProperties]);

  // Banner click handler
  const handleBannerClick = (banner) => {
    if (banner.link === 'action:vip_info') {
      setShowMonetizationModal(true);
    } else if (banner.link.includes('purpose=')) {
      const p = banner.link.split('purpose=')[1];
      setSelectedPurposeTab(p);
      showToast(`${p.toUpperCase()} bo‘limi tanlandi`);
    } else if (banner.link.includes('type=')) {
      const t = banner.link.split('type=')[1];
      setSelectedCategory(t);
      showToast(`Kategoriya filtri faollashtirildi`);
    } else {
      setShowMonetizationModal(true);
    }
  };

  // Quick Demo vs Clean mode handlers
  const handleLoadDemo = () => {
    tg.haptic('success');
    setProperties(SAMPLE_TEST_PROPERTIES);
    setFavorites(['prop-top-1', 'prop-1']);
    setConversations(SAMPLE_TEST_CONVERSATIONS);
    showToast('✨ Mock Demo variant yuklandi (15 ta e’lon)!');
  };

  const handleClearAll = () => {
    tg.haptic('warning');
    setProperties([]);
    setFavorites([]);
    setConversations([]);
    showToast('🧹 Barcha e’lonlar tozalandi (toza rejim)');
  };

  // Add listing
  const handleAddListing = (newProp) => {
    setProperties(prev => [newProp, ...prev]);
    showToast('E’loningiz muvaffaqiyatli joylandi! ✨');
  };

  // Start chat with owner
  const handleStartChat = (property) => {
    setSelectedPropertyDetail(null);
    let existingConv = conversations.find(c => c.propertyId === property.id || c.participant.id === property.owner?.id);
    
    if (!existingConv) {
      existingConv = {
        id: `conv-${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.purpose === 'rent' ? `${property.price.toLocaleString('uz-UZ')} so‘m/oy` : `$${property.priceUsd || property.price}`,
        propertyImage: property.images[0],
        participant: {
          id: property.owner?.id || 'owner-new',
          name: property.owner?.name || 'Mulk egasi',
          avatar: property.owner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          onlineStatus: 'Hozir tarmoqda',
          phone: property.owner?.phone || '+998 90 123 45 67'
        },
        lastMessage: 'Suhbat boshlandi',
        lastTime: 'Hozir',
        unreadCount: 0,
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: 'current-user',
            text: `Assalomu alaykum! "${property.title}" e’loningiz bo‘yicha murojaat qilayotgan edim.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true
          }
        ]
      };
      setConversations(prev => [existingConv, ...prev]);
    }

    setActiveChatId(existingConv.id);
    setActiveTab('messages');
  };

  // Send message in chat
  const handleSendMessage = (convId, text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      text,
      time,
      isMine: true
    };

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          lastMessage: text,
          lastTime: time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
    tg.haptic('selection');
  };

  // Report property
  const handleReportProperty = (property) => {
    const reason = prompt('Iltimos, shikoyat sababini yozing (Masalan: Noto‘g‘ri narx, Sotilgan mulk):');
    if (reason) {
      setReports(prev => [
        {
          propertyId: property.id,
          propertyTitle: property.title,
          reason,
          time: new Date().toLocaleDateString()
        },
        ...prev
      ]);
      showToast('Shikoyatingiz qabul qilindi va moderatorga yuborildi.');
    }
  };

  // User submits payment request with receipt
  const handleSubmitPaymentRequest = (newRequest) => {
    setPaymentRequests(prev => [newRequest, ...prev]);
    showToast('To‘lov chekingiz tekshirish uchun yuborildi ⏳');
  };

  // Admin approves payment request
  const handleApprovePayment = (requestId) => {
    const req = paymentRequests.find(p => p.id === requestId);
    if (!req) return;

    const startDate = formatDateDDMMYYYY(new Date());
    const duration = req.durationDays || (req.packageType === 'TOP' ? billingSettings.topDays : req.packageType === 'VIP' ? billingSettings.vipDays : billingSettings.bannerDays);
    const endDate = addDaysToDateStr(duration);

    if (req.targetType === 'listing' && req.targetListingId) {
      setProperties(prev => prev.map(p => {
        if (p.id === req.targetListingId) {
          return {
            ...p,
            isVip: req.packageType === 'VIP' ? true : p.isVip,
            vipStartDate: req.packageType === 'VIP' ? startDate : p.vipStartDate,
            vipEndDate: req.packageType === 'VIP' ? endDate : p.vipEndDate,
            isTop: req.packageType === 'TOP' ? true : p.isTop,
            topStartDate: req.packageType === 'TOP' ? startDate : p.topStartDate,
            topEndDate: req.packageType === 'TOP' ? endDate : p.topEndDate
          };
        }
        return p;
      }));
    } else if (req.targetType === 'banner') {
      const newBanner = {
        id: `banner-${Date.now()}`,
        title: req.bannerDetails?.title || 'Reklama banneri',
        subtitle: req.bannerDetails?.subtitle || '',
        image: req.bannerDetails?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        badge: req.bannerDetails?.badge || 'Reklama',
        button: 'Batafsil',
        link: req.bannerDetails?.link || 'https://t.me/uygo_admin',
        priority: 1,
        active: true,
        startDate,
        endDate
      };
      setBanners(prev => [newBanner, ...prev]);
    }

    setPaymentRequests(prev => prev.map(p => {
      if (p.id === requestId) {
        return {
          ...p,
          status: 'approved',
          startDate,
          endDate
        };
      }
      return p;
    }));

    showToast(`✅ To‘lov tasdiqlandi! ${req.packageType} faollashdi (${startDate} — ${endDate})`);
  };

  // Admin rejects payment request
  const handleRejectPayment = (requestId) => {
    setPaymentRequests(prev => prev.map(p => {
      if (p.id === requestId) {
        return { ...p, status: 'rejected' };
      }
      return p;
    }));
    showToast('❌ To‘lov rad etildi');
  };

  // Admin updates billing settings
  const handleSaveBillingSettings = (newSettings) => {
    setBillingSettings(newSettings);
    showToast('To‘lov sozlamalari yangilandi! 💳');
  };

  // Active filters count indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (detailedFilters.purpose !== 'all') count++;
    if (detailedFilters.type !== 'all') count++;
    if (detailedFilters.district !== 'Barchasi') count++;
    if (detailedFilters.rooms !== 'Barchasi') count++;
    if (detailedFilters.minPrice || detailedFilters.maxPrice) count++;
    if (detailedFilters.minArea || detailedFilters.maxArea) count++;
    if (detailedFilters.renovation !== 'Barchasi') count++;
    if (detailedFilters.furniture !== 'Barchasi') count++;
    return count;
  }, [detailedFilters]);

  // Unread messages count
  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Current user's listings and total view count
  const myListings = useMemo(() => {
    return properties.filter(p => p.owner?.id === currentUser?.id || p.ownerId?.includes('me') || p.ownerId === `user-${currentUser?.id}`);
  }, [properties, currentUser]);

  const totalMyViews = useMemo(() => {
    return myListings.reduce((acc, p) => acc + (p.views || 0), 0);
  }, [myListings]);

  return (
    <div className="tma-app-root">
      <div className="tma-viewport-wrapper">
        {/* Top Header */}
        <HeaderNav
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            setDetailedFilters(prev => ({ ...prev, region: reg, district: 'Barchasi' }));
          }}
          favoritesCount={favorites.length}
          onOpenFavorites={() => setActiveTab('favorites')}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          unreadNotificationsCount={notifications.filter(n => n.unread).length}
        />

        {/* ==========================================================
            SCREEN ROUTING
            ========================================================== */}

        {/* 1. ASOSIY (HOME) SCREEN */}
        {activeTab === 'home' && (
          <div className="main-content-scroll">
            {/* Search Field & Filter Button */}
            <div className="search-container">
              <div className="search-input-wrap">
                <Search size={18} color="#7E858E" />
                <input
                  type="text"
                  placeholder="Tuman, xona yoki kalit so‘z bo‘yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-field"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={16} color="#7E858E" />
                  </button>
                )}
                <button 
                  className="filter-btn-trigger"
                  onClick={() => {
                    tg.haptic('light');
                    setShowFilterSheet(true);
                  }}
                  aria-label="Filtr"
                >
                  <SlidersHorizontal size={18} />
                  {activeFiltersCount > 0 && (
                    <span className="filter-active-pill">{activeFiltersCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Mode Badge & Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0 16px 12px 16px',
              padding: '8px 12px',
              background: properties.length > 0 ? '#FFFDF0' : '#F7F8FA',
              borderRadius: '14px',
              border: properties.length > 0 ? '1px solid #FFD400' : '1px solid #E8ECEF',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: properties.length > 0 ? '#12B886' : '#7E858E'
                }} />
                <span style={{ fontWeight: '700', color: '#111315' }}>
                  {properties.length > 0 ? `Mock Demo Variant (${properties.length} ta e’lon)` : 'Toza rejim (0 ta e’lon)'}
                </span>
              </div>
              {properties.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #FA5252',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#FA5252',
                    cursor: 'pointer'
                  }}
                >
                  Tozalash
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  style={{
                    background: '#111315',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#FFD400',
                    cursor: 'pointer'
                  }}
                >
                  ✨ Demo yuklash
                </button>
              )}
            </div>

            {/* Purpose Tabs (Sotuv / Ijara / Kunlik) */}
            <div className="purpose-tabs-wrapper">
              <div className="purpose-tabs-pill">
                {[
                  { id: 'all', label: 'Barchasi' },
                  { id: 'sale', label: 'Sotuv' },
                  { id: 'rent', label: 'Ijara' },
                  { id: 'daily', label: 'Kunlik' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`purpose-tab-item ${selectedPurposeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      tg.haptic('selection');
                      setSelectedPurposeTab(tab.id);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotating Advertisement Banner */}
            <RotatingBanner
              banners={banners}
              onBannerClick={handleBannerClick}
            />

            {/* Property Categories Chips */}
            <div className="categories-slider-wrap">
              {PROPERTY_TYPES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setSelectedCategory(cat.id);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* 1. Platform Clean Production Empty State */}
            {properties.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '36px 20px',
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E8ECEF',
                margin: '16px 16px 24px 16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <img
                  src="/logo.png"
                  alt="UYGO"
                  style={{
                    height: '54px',
                    width: 'auto',
                    objectFit: 'contain',
                    margin: '0 auto 16px auto',
                    display: 'block'
                  }}
                />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#111315', marginBottom: '8px' }}>
                  UYGO platformasiga xush kelibsiz! 🏡
                </h3>
                <p style={{ fontSize: '13.5px', color: '#7E858E', lineHeight: 1.5, marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px auto' }}>
                  Platforma to‘liq ishlashga tayyor. O‘z kvartirangiz, hovli yoki tijorat mulkingizni birinchi bo‘lib bepul joylang!
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      tg.haptic('medium');
                      setShowCreateModal(true);
                    }}
                    style={{ padding: '11px 18px', fontSize: '13px' }}
                  >
                    <Plus size={16} />
                    <span>Yangi e’lon</span>
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleLoadDemo}
                    style={{ padding: '11px 18px', fontSize: '13px', background: '#FFF9DB', border: '1px solid #FFD400' }}
                  >
                    <Sparkles size={16} color="#B8860B" />
                    <span>Demo variantni yuklash</span>
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F0F2F5',
                  fontSize: '11px',
                  color: '#7E858E',
                  fontWeight: '600'
                }}>
                  <div>⚡ Bepul e’lon</div>
                  <div>🛡️ Xavfsiz tizim</div>
                  <div>📞 To‘g‘ridan-to‘g‘ri aloqa</div>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#7E858E' }}>
                <Building2 size={48} color="#D0D5DD" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#111315', marginBottom: '6px' }}>
                  Hech qanday e’lon topilmadi
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                  Qidiruv so‘zini yoki filtrlarni o‘zgartirib ko‘ring.
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPurposeTab('all');
                    setSelectedCategory('all');
                    setDetailedFilters({
                      purpose: 'all',
                      type: 'all',
                      region: selectedRegion,
                      district: 'Barchasi',
                      rooms: 'Barchasi',
                      minPrice: '',
                      maxPrice: '',
                      minArea: '',
                      maxArea: '',
                      minFloor: '',
                      maxFloor: '',
                      renovation: 'Barchasi',
                      furniture: 'Barchasi'
                    });
                  }}
                  style={{ margin: '0 auto' }}
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : null}

            {/* 1. TOP E'LONLAR SECTION (Matching screenshot) */}
            {topListings.length > 0 && (
              <section className="section-wrapper" style={{ marginTop: '16px' }}>
                <div className="section-header-modern">
                  <div className="section-header-left">
                    <TrendingUp size={20} className="section-icon-trend" strokeWidth={2.4} />
                    <h2 className="section-title-modern">TOP e’lonlar</h2>
                  </div>
                  <span className="section-subtitle-modern">Ommabop variantlar</span>
                </div>
                <div className="property-cards-grid">
                  {topListings.map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(p) => setSelectedPropertyDetail(p)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. VIP E'LONLAR SECTION */}
            {vipListings.length > 0 && (
              <section className="section-wrapper">
                <div className="section-header-modern">
                  <div className="section-header-left">
                    <Sparkles size={19} className="section-icon-vip" />
                    <h2 className="section-title-modern">VIP e’lonlar</h2>
                  </div>
                  <span className="section-subtitle-modern">Premium tanlov</span>
                </div>
                <div className="property-cards-grid">
                  {vipListings.map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(p) => setSelectedPropertyDetail(p)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SO'NGGI E'LONLAR SECTION (Matching screenshot) */}
            {recentListings.length > 0 && (
              <section className="section-wrapper">
                <div className="section-header-modern">
                  <div className="section-header-left">
                    <Clock size={19} className="section-icon-clock" />
                    <h2 className="section-title-modern">So‘nggi e’lonlar</h2>
                  </div>
                  <span className="section-subtitle-modern">{recentListings.length} ta e’lon</span>
                </div>
                <div className="property-cards-grid">
                  {recentListings.map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(p) => setSelectedPropertyDetail(p)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 2. SAQLANGANLAR (FAVORITES) SCREEN */}
        {activeTab === 'favorites' && (
          <FavoritesScreen
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenPropertyDetail={(prop) => setSelectedPropertyDetail(prop)}
            onGoHome={() => setActiveTab('home')}
          />
        )}

        {/* 4. XABARLAR (MESSAGES) SCREEN */}
        {activeTab === 'messages' && (
          <MessagesScreen
            conversations={conversations}
            activeConversationId={activeChatId}
            onSelectConversation={(cId) => setActiveChatId(cId)}
            onSendMessage={handleSendMessage}
            onOpenPropertyDetail={(propId) => {
              const p = properties.find(item => item.id === propId);
              if (p) setSelectedPropertyDetail(p);
            }}
            onBackToList={() => setActiveChatId(null)}
          />
        )}

        {/* 5. PROFIL (PROFILE) SCREEN */}
        {activeTab === 'profile' && (
          <div className="main-content-scroll">
            <ProfileScreen
              currentUser={currentUser}
              myListingsCount={myListings.length}
              favoritesCount={favorites.length}
              totalViews={totalMyViews}
              onOpenMyListings={() => {
                if (myListings.length === 0) {
                  showToast('Siz hali birorta ham e’lon bermagansiz');
                } else {
                  showToast(`Sizda ${myListings.length} ta faol e’lon mavjud`);
                }
              }}
              onOpenFavorites={() => setActiveTab('favorites')}
              onOpenMessages={() => {
                setActiveTab('messages');
                setActiveChatId(null);
              }}
              onOpenMonetization={() => setShowMonetizationModal(true)}
              onOpenAdminPanel={() => setShowAdminModal(true)}
              onOpenCreateListing={() => setShowCreateModal(true)}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                localStorage.setItem('uygo_user_profile', JSON.stringify(updated));
                showToast('Profil ma’lumotlari saqlandi ✨');
              }}
            />
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'create') {
              setShowCreateModal(true);
            } else {
              setActiveTab(tab);
            }
          }}
          unreadMessagesCount={unreadMessagesCount}
          favoritesCount={favorites.length}
        />

        {/* ==========================================================
            MODALS & OVERLAYS
            ========================================================== */}

        {/* Filter Bottom Sheet */}
        {showFilterSheet && (
          <FilterBottomSheet
            filters={detailedFilters}
            onApplyFilters={(newFilters) => {
              setDetailedFilters(newFilters);
              setSelectedRegion(newFilters.region);
            }}
            onClose={() => setShowFilterSheet(false)}
            totalResultsCount={filteredProperties.length}
          />
        )}

        {/* Property Detail Modal */}
        {selectedPropertyDetail && (
          <PropertyDetailModal
            property={selectedPropertyDetail}
            isFavorite={favorites.includes(selectedPropertyDetail.id)}
            onToggleFavorite={handleToggleFavorite}
            onClose={() => setSelectedPropertyDetail(null)}
            onStartChat={handleStartChat}
            onReport={handleReportProperty}
          />
        )}

        {/* Create Listing Modal */}
        {showCreateModal && (
          <CreateListingModal
            currentUser={currentUser}
            onClose={() => setShowCreateModal(false)}
            onSubmitListing={handleAddListing}
          />
        )}

        {/* VIP / TOP Monetization Modal */}
        {showMonetizationModal && (
          <MonetizationModal
            userListings={properties.filter(p => p.owner?.id === currentUser?.id || p.ownerId?.includes('me') || p.ownerId === `user-${currentUser?.id}`)}
            allListings={properties}
            currentUser={currentUser}
            billingSettings={billingSettings}
            onSubmitPaymentRequest={handleSubmitPaymentRequest}
            onClose={() => setShowMonetizationModal(false)}
          />
        )}

        {/* Admin Panel Modal */}
        {showAdminModal && (
          <AdminPanelModal
            listings={properties}
            banners={banners}
            reports={reports}
            paymentRequests={paymentRequests}
            billingSettings={billingSettings}
            onClose={() => setShowAdminModal(false)}
            onApproveListing={(id) => {
              setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
              showToast('E’lon tasdiqlandi');
            }}
            onRejectListing={(id) => {
              setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
              showToast('E’lon rad etildi');
            }}
            onDeleteListing={(id) => {
              setProperties(prev => prev.filter(p => p.id !== id));
              showToast('E’lon o‘chirildi');
            }}
            onToggleVipListing={(id) => {
              setProperties(prev => prev.map(p => p.id === id ? { ...p, isVip: !p.isVip } : p));
            }}
            onToggleTopListing={(id) => {
              setProperties(prev => prev.map(p => p.id === id ? { ...p, isTop: !p.isTop } : p));
            }}
            onSaveBanner={(newBanner) => {
              setBanners(prev => [newBanner, ...prev]);
              showToast('Yangi reklama banneri qo‘shildi!');
            }}
            onDeleteBanner={(bId) => {
              setBanners(prev => prev.filter(b => b.id !== bId));
              showToast('Banner o‘chirildi');
            }}
            onToggleBannerStatus={(bId) => {
              setBanners(prev => prev.map(b => b.id === bId ? { ...b, active: !b.active } : b));
            }}
            onLoadSampleData={() => {
              setProperties(SAMPLE_TEST_PROPERTIES);
              showToast('Test namunaviy e’lonlar yuklandi! (15 ta)');
            }}
            onClearAllData={() => {
              setProperties([]);
              showToast('Barcha e’lonlar tozalandi');
            }}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
            onSaveBillingSettings={handleSaveBillingSettings}
          />
        )}

        {/* Notifications Modal Sheet */}
        {showNotificationsModal && (
          <div className="modal-backdrop" onClick={() => setShowNotificationsModal(false)}>
            <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle" />
              <div className="bottom-sheet-header">
                <span className="bottom-sheet-title">Bildirishnomalar</span>
                <button className="close-btn" onClick={() => setShowNotificationsModal(false)}>✕</button>
              </div>
              <div className="bottom-sheet-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        background: n.unread ? '#FFFDF0' : '#FFFFFF',
                        border: n.unread ? '1.5px solid #FFD400' : '1px solid #E8ECEF'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111315' }}>{n.title}</span>
                        <span style={{ fontSize: '11px', color: '#7E858E' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.4 }}>{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved / Favorites Modal Sheet */}
        {showFavoritesModal && (
          <div className="modal-backdrop" onClick={() => setShowFavoritesModal(false)}>
            <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()} style={{ height: '88vh' }}>
              <div className="bottom-sheet-drag-handle" />
              <div className="bottom-sheet-header">
                <span className="bottom-sheet-title">Saqlangan e’lonlar ({favorites.length})</span>
                <button className="close-btn" onClick={() => setShowFavoritesModal(false)}>✕</button>
              </div>
              <div className="bottom-sheet-body">
                {favorites.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7E858E' }}>
                    <Heart size={44} color="#FA5252" style={{ margin: '0 auto 12px auto' }} />
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#111315' }}>Hozircha saqlangan e’lonlar yo‘q</div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>Yoqqan e’lonlarni yurakchani bosib saqlang.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {properties.filter(p => favorites.includes(p.id)).map(favProp => (
                      <PropertyCard
                        key={favProp.id}
                        property={favProp}
                        isFavorite={true}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={(p) => {
                          setShowFavoritesModal(false);
                          setSelectedPropertyDetail(p);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="toast-notice">
            <Sparkles size={16} className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
