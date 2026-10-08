import React, { useState } from 'react';
import { 
  Building2, Heart, MessageSquare, CreditCard, Settings, 
  HelpCircle, ChevronRight, Sparkles, Shield, UserCheck, 
  ShoppingBag, CheckCircle, ExternalLink, Plus, Edit3, X, Check
} from 'lucide-react';
import { tg } from '../utils/telegram';

export default function ProfileScreen({
  currentUser,
  isAdmin = false,
  onUnlockAdminPin,
  myListingsCount = 0,
  favoritesCount = 0,
  totalViews = 0,
  onOpenMyListings,
  onOpenFavorites,
  onOpenMessages,
  onOpenMonetization,
  onOpenAdminPanel,
  onOpenCreateListing,
  onUpdateUser
}) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  // Edit profile state
  const [editFirstName, setEditFirstName] = useState(currentUser?.firstName || '');
  const [editLastName, setEditLastName] = useState(currentUser?.lastName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');

  // Settings state
  const [currencyPref, setCurrencyPref] = useState('UZS');
  const [langPref, setLangPref] = useState('uz');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    tg.haptic('success');
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        firstName: editFirstName.trim() || 'Foydalanuvchi',
        lastName: editLastName.trim(),
        phone: editPhone.trim(),
        username: editUsername.trim().startsWith('@') ? editUsername.trim() : (editUsername.trim() ? `@${editUsername.trim()}` : '')
      });
    }
    setShowEditProfile(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* User Header Profile Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 20px',
        border: '1px solid #E8ECEF',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'relative'
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={currentUser?.photoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser?.firstName || 'User')}`}
            alt="Avatar"
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', background: '#F0F2F5' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            background: '#FFD400',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff'
          }}>
            <UserCheck size={11} color="#111315" />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#111315', marginBottom: '2px' }}>
              {currentUser?.firstName || 'Foydalanuvchi'} {currentUser?.lastName || ''}
            </h2>
            <button
              onClick={() => {
                tg.haptic('light');
                setEditFirstName(currentUser?.firstName || '');
                setEditLastName(currentUser?.lastName || '');
                setEditPhone(currentUser?.phone || '');
                setEditUsername(currentUser?.username || '');
                setShowEditProfile(true);
              }}
              style={{
                background: '#F7F8FA',
                border: '1px solid #E8ECEF',
                borderRadius: '8px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#111315',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={12} />
              <span>Tahrirlash</span>
            </button>
          </div>
          <div style={{ fontSize: '13px', color: '#7E858E', fontWeight: '500', marginBottom: '4px' }}>
            {currentUser?.phone || 'Telefon raqam kiritilmagan'}
          </div>
          <div 
            onClick={() => {
              if (onUnlockAdminPin) onUnlockAdminPin();
            }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: isAdmin ? '#FFF9DB' : '#F0F2F5', 
              border: isAdmin ? '1px solid #FFD400' : 'none',
              padding: '2px 8px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              color: '#111315', 
              fontWeight: '700',
              cursor: 'pointer'
            }}
            title={isAdmin ? "Super Admin" : "Foydalanuvchi"}
          >
            {isAdmin ? '👑 Super Admin: ' : 'Telegram: '}
            {currentUser?.username || (currentUser?.id ? `ID: ${currentUser.id}` : '@foydalanuvchi')}
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '18px'
      }}>
        <div 
          onClick={() => {
            tg.haptic('selection');
            onOpenMyListings();
          }}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 10px',
            textAlign: 'center',
            border: '1px solid #E8ECEF',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#111315' }}>
            {myListingsCount}
          </div>
          <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600', marginTop: '2px' }}>
            Mening e’lonlarim
          </div>
        </div>

        <div 
          onClick={() => {
            tg.haptic('selection');
            onOpenFavorites();
          }}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 10px',
            textAlign: 'center',
            border: '1px solid #E8ECEF',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FA5252' }}>
            {favoritesCount}
          </div>
          <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600', marginTop: '2px' }}>
            Saqlangan
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px 10px',
          textAlign: 'center',
          border: '1px solid #E8ECEF'
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#111315' }}>
            {totalViews}
          </div>
          <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600', marginTop: '2px' }}>
            Ko‘rishlar
          </div>
        </div>
      </div>

      {/* UYGO PRO Promotional Card */}
      <div 
        onClick={() => {
          tg.haptic('medium');
          onOpenMonetization();
        }}
        style={{
          background: 'linear-gradient(135deg, #111315 0%, #2A2F36 100%)',
          borderRadius: '20px',
          padding: '18px 20px',
          color: '#FFFFFF',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,212,0,0.35) 0%, transparent 70%)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#FFD400',
              color: '#111315',
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              VIP & TOP
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800' }}>
              UYGO PRO
            </span>
          </div>
          <Sparkles size={18} color="#FFD400" />
        </div>

        <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: '12px' }}>
          E’lonlaringizni 5 baravar ko‘proq xaridorga yetkazing va tezroq soting yoki ijaraga bering.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FFD400',
          color: '#111315',
          fontSize: '12px',
          fontWeight: '700',
          padding: '6px 14px',
          borderRadius: '999px'
        }}>
          <span>Imtiyozlarni ko‘rish</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Menu List */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E8ECEF',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        {[
          { icon: Building2, label: 'Mening e’lonlarim', action: onOpenMyListings, badge: myListingsCount },
          { icon: Heart, label: 'Saqlangan e’lonlar', action: onOpenFavorites, badge: favoritesCount },
          { icon: MessageSquare, label: 'Xabarlar', action: onOpenMessages, badge: null },
          { icon: CreditCard, label: 'To‘lovlar tarixi (Payme / Click)', action: () => setShowPayments(true), badge: null },
          { icon: Settings, label: 'Sozlamalar (Valyuta, Til)', action: () => setShowSettings(true), badge: null },
          { icon: HelpCircle, label: 'Yordam va qo‘llab-quvvatlash', action: () => window.open('https://t.me/uygo_support', '_blank'), badge: null }
        ].map((item, index, arr) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => {
                tg.haptic('light');
                item.action();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: index < arr.length - 1 ? '1px solid #F0F2F5' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color="#111315" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111315' }}>
                  {item.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.badge !== null && (
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#7E858E', background: '#F0F2F5', padding: '2px 8px', borderRadius: '10px' }}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} color="#7E858E" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Panel Entry Button (ONLY VISIBLE IF USER IS ADMIN: 8225823974) */}
      {isAdmin && (
        <button
          onClick={() => {
            tg.haptic('medium');
            onOpenAdminPanel();
          }}
          style={{
            width: '100%',
            background: '#111315',
            border: '2px solid #FFD400',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: '800',
            color: '#FFD400',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            marginTop: '8px'
          }}
        >
          <Shield size={16} color="#FFD400" />
          <span>Admin Boshqaruv Paneli 👑</span>
        </button>
      )}

      {/* 1. Modal: Edit Profile */}
      {showEditProfile && (
        <div className="modal-backdrop" onClick={() => setShowEditProfile(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-drag-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Profil ma’lumotlarini tahrirlash</span>
              <button className="close-btn" onClick={() => setShowEditProfile(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="filter-label">Ism *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="filter-input-box"
                    placeholder="Ismingiz"
                  />
                </div>
                <div>
                  <label className="filter-label">Familiya</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="filter-input-box"
                    placeholder="Familiyangiz"
                  />
                </div>
                <div>
                  <label className="filter-label">Telefon raqam *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="filter-input-box"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="filter-label">Telegram username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="filter-input-box"
                    placeholder="@username"
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                  <span>Saqlash</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Settings */}
      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-drag-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Sozlamalar</span>
              <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="filter-label">Asosiy valyuta</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    {['UZS', 'USD'].map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => {
                          tg.haptic('selection');
                          setCurrencyPref(cur);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: currencyPref === cur ? '2px solid #FFD400' : '1px solid #E8ECEF',
                          background: currencyPref === cur ? '#FFF9DB' : '#fff',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        {cur === 'UZS' ? 'UZS (So‘m)' : 'USD ($)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="filter-label">Ilova tili</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    {[
                      { id: 'uz', name: 'O‘zbekcha' },
                      { id: 'ru', name: 'Русский' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          tg.haptic('selection');
                          setLangPref(l.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: langPref === l.id ? '2px solid #FFD400' : '1px solid #E8ECEF',
                          background: langPref === l.id ? '#FFF9DB' : '#fff',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    tg.haptic('success');
                    setShowSettings(false);
                  }}
                  style={{ marginTop: '10px' }}
                >
                  Tayyor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Payment History */}
      {showPayments && (
        <div className="modal-backdrop" onClick={() => setShowPayments(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-drag-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">To‘lovlar tarixi</span>
              <button className="close-btn" onClick={() => setShowPayments(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7E858E' }}>
                <CreditCard size={44} color="#D0D5DD" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111315', marginBottom: '6px' }}>
                  Hozircha to‘lovlar mavjud emas
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  VIP yoki TOP xizmatlari xarid qilinganda, barcha rasmiy to‘lov kvitansiyalari shu yerda ko‘rinadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
