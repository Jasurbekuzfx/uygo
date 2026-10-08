import React from 'react';
import { Home, Heart, Plus, MessageSquare, User } from 'lucide-react';
import { tg } from '../utils/telegram';

export default function BottomNavigation({
  activeTab,
  onTabChange,
  unreadMessagesCount = 0,
  favoritesCount = 0
}) {
  return (
    <nav className="bottom-nav-container">
      {/* 1. Asosiy */}
      <button
        className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => {
          tg.haptic('light');
          onTabChange('home');
        }}
      >
        <Home className="nav-item-icon" />
        <span className="nav-item-label">Asosiy</span>
      </button>

      {/* 2. Saqlanganlar */}
      <button
        className={`nav-item-btn ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => {
          tg.haptic('light');
          onTabChange('favorites');
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart 
            className="nav-item-icon" 
            fill={activeTab === 'favorites' ? "#FA5252" : "none"}
            color={activeTab === 'favorites' ? "#FA5252" : "currentColor"}
          />
          {favoritesCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-6px',
              background: '#FA5252',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: '800',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="nav-item-label">Saqlanganlar</span>
      </button>

      {/* 3. E'lon berish (Standout Yellow Button) */}
      <button
        className="nav-center-action-btn"
        onClick={() => {
          tg.haptic('medium');
          onTabChange('create');
        }}
        aria-label="E’lon berish"
      >
        <div className="center-btn-bubble">
          <Plus size={26} strokeWidth={2.6} />
        </div>
        <span className="center-btn-label">E’lon berish</span>
      </button>

      {/* 4. Xabarlar */}
      <button
        className={`nav-item-btn ${activeTab === 'messages' ? 'active' : ''}`}
        onClick={() => {
          tg.haptic('light');
          onTabChange('messages');
        }}
      >
        <div style={{ position: 'relative' }}>
          <MessageSquare className="nav-item-icon" />
          {unreadMessagesCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-6px',
              background: '#FA5252',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: '800',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="nav-item-label">Xabarlar</span>
      </button>

      {/* 5. Profil */}
      <button
        className={`nav-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => {
          tg.haptic('light');
          onTabChange('profile');
        }}
      >
        <User className="nav-item-icon" />
        <span className="nav-item-label">Profil</span>
      </button>
    </nav>
  );
}
