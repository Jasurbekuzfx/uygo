import React from 'react';
import { 
  X, Plus, Sparkles, TrendingUp, Eye, Trash2, Building2, 
  MapPin, ArrowRight 
} from 'lucide-react';
import { tg } from '../utils/telegram';

export default function MyListingsModal({
  listings = [],
  onClose,
  onOpenPropertyDetail,
  onOpenCreateListing,
  onPromoteListing,
  onDeleteListing
}) {
  const handleDelete = (e, prop) => {
    e.stopPropagation();
    tg.haptic('warning');
    if (window.confirm(`"${prop.title}" e’lonini rostdan ham o‘chirmoqchimisiz?`)) {
      onDeleteListing(prop.id);
    }
  };

  const handlePromote = (e, prop) => {
    e.stopPropagation();
    tg.haptic('medium');
    onPromoteListing(prop);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 215 }}>
      <div 
        className="bottom-sheet-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        <div className="bottom-sheet-drag-handle" />

        {/* Header */}
        <div className="bottom-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="#111315" />
            <span className="bottom-sheet-title">
              Mening e’lonlarim ({listings.length})
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="bottom-sheet-body" style={{ paddingBottom: '30px' }}>
          {listings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E8ECEF',
              margin: '20px 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FFFDF0',
                border: '1.5px solid #FFD400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Building2 size={30} color="#111315" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111315', marginBottom: '8px' }}>
                Sizda hali e’lonlar yo‘q
              </h3>
              <p style={{ fontSize: '13px', color: '#7E858E', lineHeight: 1.5, marginBottom: '22px', maxWidth: '300px', margin: '0 auto 22px auto' }}>
                O‘z kvartirangiz, hovli yoki noturar joyingizni UYGO platformasiga birinchi bo‘lib bepul joylang!
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  tg.haptic('medium');
                  onOpenCreateListing();
                }}
                style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '800', margin: '0 auto' }}
              >
                <Plus size={16} />
                <span>Yangi e’lon berish</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Action Banner to add more */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#F8F9FA',
                borderRadius: '16px',
                border: '1px solid #E8ECEF'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111315' }}>
                  Yana e’lon qo‘shmoqchimisiz?
                </span>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    tg.haptic('medium');
                    onOpenCreateListing();
                  }}
                  style={{ padding: '8px 14px', fontSize: '12px', fontWeight: '800' }}
                >
                  <Plus size={14} />
                  <span>Qo‘shish</span>
                </button>
              </div>

              {/* Listings Cards */}
              {listings.map(prop => {
                const img = prop.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80';
                const formattedPrice = prop.currency === 'USD' 
                  ? `${(Number(prop.priceUsd || prop.price) || 0).toLocaleString('en-US')} $`
                  : `${(Number(prop.price) || 0).toLocaleString('en-US')} so‘m${prop.purpose === 'rent' ? '/oy' : ''}`;

                return (
                  <div
                    key={prop.id}
                    onClick={() => onOpenPropertyDetail(prop)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: prop.isVip ? '2px solid #FFD400' : '1px solid #E8ECEF',
                      padding: '12px',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    {/* Top Row: Photo + Info */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, borderRadius: '14px', overflow: 'hidden' }}>
                        <img 
                          src={img} 
                          alt={prop.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        {prop.isVip ? (
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: '#FFD400',
                            color: '#111315',
                            fontSize: '9.5px',
                            fontWeight: '800',
                            padding: '2px 5px',
                            borderRadius: '5px'
                          }}>
                            VIP
                          </span>
                        ) : prop.isTop ? (
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: '#111315',
                            color: '#FFD400',
                            fontSize: '9.5px',
                            fontWeight: '800',
                            padding: '2px 5px',
                            borderRadius: '5px'
                          }}>
                            TOP
                          </span>
                        ) : null}
                      </div>

                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: '#111315', fontFamily: 'var(--font-heading)' }}>
                            {formattedPrice}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#111315',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px'
                          }}>
                            {prop.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#7E858E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={11} />
                            <span>{prop.region}, {prop.district}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#7E858E' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Eye size={12} /> {prop.views || 0} marta ko‘rildi
                          </span>
                          <span>•</span>
                          <span>{prop.rooms} xona, {prop.area} m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid #F0F2F5',
                      gap: '8px'
                    }}>
                      <button
                        type="button"
                        onClick={(e) => handlePromote(e, prop)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: prop.isVip || prop.isTop ? '#FFFDF0' : '#FFF9DB',
                          color: '#111315',
                          border: '1px solid #FFD400',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {prop.isVip ? (
                          <>
                            <Sparkles size={14} color="#B28900" />
                            <span>VIP faol ⭐</span>
                          </>
                        ) : prop.isTop ? (
                          <>
                            <TrendingUp size={14} color="#B28900" />
                            <span>TOP faol ⚡</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp size={14} color="#B28900" />
                            <span>TOP / VIP qilish 🚀</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, prop)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#FFF5F5',
                          color: '#FA5252',
                          border: '1px solid #FFE3E3',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        title="E’lonni o‘chirish"
                      >
                        <Trash2 size={14} />
                        <span style={{ marginLeft: '4px' }}>O‘chirish</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
