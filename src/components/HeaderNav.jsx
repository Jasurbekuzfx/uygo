import React, { useState } from 'react';
import { MapPin, Bell, Bookmark, ChevronDown, Check } from 'lucide-react';
import { REGIONS } from '../data/mockData';
import { tg } from '../utils/telegram';

export default function HeaderNav({
  selectedRegion,
  onSelectRegion,
  favoritesCount,
  onOpenFavorites,
  onOpenNotifications,
  unreadNotificationsCount
}) {
  const [showRegionModal, setShowRegionModal] = useState(false);

  const handleRegionClick = (region) => {
    tg.haptic('selection');
    onSelectRegion(region);
    setShowRegionModal(false);
  };

  return (
    <>
      <header className="tg-header-bar">
        {/* Official UYGO Brand Logo */}
        <div className="brand-wrap" onClick={() => tg.haptic('light')}>
          <img 
            src="/logo.png" 
            alt="UYGO" 
            className="brand-logo-img" 
          />
        </div>

        {/* Center: Location Pill Selector */}
        <button 
          className="header-location-pill"
          onClick={() => {
            tg.haptic('light');
            setShowRegionModal(true);
          }}
        >
          <MapPin size={14} color="#7E858E" />
          <span>{selectedRegion}</span>
          <ChevronDown size={13} color="#7E858E" />
        </button>

        {/* Right Actions: Bookmark with yellow counter + Bell with red dot */}
        <div className="header-actions">
          {/* Saved / Bookmark Icon */}
          <button 
            className="header-icon-btn"
            onClick={() => {
              tg.haptic('light');
              onOpenFavorites();
            }}
            title="Saqlanganlar"
          >
            <Bookmark size={20} color="#111315" />
            {favoritesCount > 0 && (
              <span className="badge-counter-yellow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Notifications Icon */}
          <button 
            className="header-icon-btn"
            onClick={() => {
              tg.haptic('light');
              onOpenNotifications();
            }}
            title="Bildirishnomalar"
          >
            <Bell size={20} color="#111315" />
            {unreadNotificationsCount > 0 && <span className="badge-dot-red" />}
          </button>
        </div>
      </header>

      {/* Region Selector Modal */}
      {showRegionModal && (
        <div className="modal-backdrop" onClick={() => setShowRegionModal(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-drag-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Viloyatni tanlang</span>
              <button className="close-btn" onClick={() => setShowRegionModal(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REGIONS.map((region) => {
                  const isSelected = region === selectedRegion;
                  return (
                    <button
                      key={region}
                      onClick={() => handleRegionClick(region)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        background: isSelected ? '#FFF9DB' : '#F7F8FA',
                        border: isSelected ? '1.5px solid #FFD400' : '1px solid #E8ECEF',
                        fontSize: '15px',
                        fontWeight: isSelected ? '700' : '500',
                        color: '#111315',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{region}</span>
                      {isSelected && <Check size={18} color="#111315" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
