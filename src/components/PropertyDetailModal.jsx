import React, { useState } from 'react';
import { 
  Heart, Share2, AlertTriangle, Phone, Send, MessageSquare, 
  MapPin, CheckCircle, ChevronLeft, ChevronRight, X, ShieldCheck
} from 'lucide-react';
import { tg } from '../utils/telegram';

export default function PropertyDetailModal({
  property,
  isFavorite,
  onToggleFavorite,
  onClose,
  onStartChat,
  onReport
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  if (!property) return null;

  const {
    id,
    title,
    description,
    price,
    priceUsd,
    currency,
    purpose,
    type,
    rooms,
    area,
    floor,
    totalFloors,
    renovation,
    furniture,
    region,
    district,
    address,
    images = [],
    isVip,
    isTop,
    owner,
    views
  } = property;

  const formatPrice = () => {
    if (purpose === 'rent') return `${price.toLocaleString('uz-UZ')} so‘m/oy`;
    if (purpose === 'daily') return `${price.toLocaleString('uz-UZ')} so‘m/kun`;
    if (currency === 'USD' && priceUsd) return `$${priceUsd.toLocaleString('en-US')}`;
    return `${price.toLocaleString('uz-UZ')} so‘m`;
  };

  const handleShare = () => {
    tg.haptic('selection');
    if (navigator.share) {
      navigator.share({
        title: `UYGO — ${title}`,
        text: `${title} - ${formatPrice()} | UYGO platformasida ko‘ring:`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const handleNextImage = () => {
    tg.haptic('selection');
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    tg.haptic('selection');
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200 }}>
      <div 
        className="bottom-sheet-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ height: '94vh', maxHeight: '94vh' }}
      >
        <div className="bottom-sheet-drag-handle" />

        {/* Gallery Section */}
        <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#111315' }}>
          <img
            src={images[activeImageIdx] || images[0]}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Navigation Controls over Image */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button 
              className="close-btn" 
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="close-btn" 
                onClick={handleShare}
                style={{ background: 'rgba(255,255,255,0.85)' }}
                title="Ulashish"
              >
                <Share2 size={16} />
              </button>
              <button 
                className="close-btn" 
                onClick={() => {
                  tg.haptic('selection');
                  onToggleFavorite(id);
                }}
                style={{ background: 'rgba(255,255,255,0.85)' }}
                title="Saqlash"
              >
                <Heart 
                  size={16} 
                  fill={isFavorite ? "#FA5252" : "none"} 
                  color={isFavorite ? "#FA5252" : "#111315"} 
                />
              </button>
            </div>
          </div>

          {/* Prev / Next Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={20} />
              </button>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(17,19,21,0.75)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '999px'
              }}>
                {activeImageIdx + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Details Content */}
        <div className="bottom-sheet-body" style={{ padding: '18px 20px' }}>
          {/* Price & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#111315' }}>
              {formatPrice()}
            </div>
            {isVip && (
              <span className="badge-vip" style={{ padding: '5px 10px', fontSize: '12px' }}>
                VIP E’LON
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111315', marginBottom: '8px', lineHeight: 1.3 }}>
            {title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7E858E', marginBottom: '18px' }}>
            <MapPin size={15} color="#FFD400" />
            <span>{region}, {district}, {address}</span>
          </div>

          {/* Quick Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            background: '#F7F8FA',
            padding: '14px',
            borderRadius: '16px',
            marginBottom: '20px',
            border: '1px solid #E8ECEF'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600' }}>XONALAR</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginTop: '2px' }}>{rooms} xona</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid #E8ECEF', borderRight: '1px solid #E8ECEF' }}>
              <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600' }}>MAYDON</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginTop: '2px' }}>{area} m²</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#7E858E', fontWeight: '600' }}>QAVAT</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginTop: '2px' }}>{floor || 1}{totalFloors ? `/${totalFloors}` : ''}</div>
            </div>
          </div>

          {/* Highlights */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ background: '#FFF9DB', border: '1px solid #FFD400', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: '#111315' }}>
              ✓ {renovation || 'Ta’mirlangan'}
            </span>
            <span style={{ background: '#F0F2F5', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', color: '#111315' }}>
              ✓ {furniture || 'Mebelli'}
            </span>
            <span style={{ background: '#F0F2F5', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', color: '#111315' }}>
              ✓ Kadastr mavjud
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#111315', marginBottom: '8px' }}>
              Tavsif
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#3A3F45', whiteSpace: 'pre-line' }}>
              {description}
            </p>
          </div>

          {/* Owner Info Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F7F8FA',
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid #E8ECEF',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={owner?.name}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#111315', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {owner?.name || 'Mulk egasi'}
                  <ShieldCheck size={16} color="#12B886" />
                </div>
                <div style={{ fontSize: '12px', color: '#7E858E' }}>
                  {owner?.role || 'Egasi'} • <span style={{ color: '#12B886', fontWeight: '600' }}>{owner?.onlineStatus || 'Tarmoqda'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                tg.haptic('medium');
                onReport(property);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#FA5252',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '6px 12px'
              }}
            >
              <AlertTriangle size={14} />
              <span>E’lon haqida shikoyat qilish</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="bottom-sheet-footer" style={{ gap: '8px' }}>
          {/* Qo'ng'iroq button */}
          <a
            href={`tel:${owner?.phone || '+998901234567'}`}
            className="btn-secondary"
            onClick={() => tg.haptic('medium')}
            style={{ textDecoration: 'none', flex: 1, padding: '12px 10px', fontSize: '13px' }}
          >
            <Phone size={16} color="#111315" />
            <span>Qo‘ng‘iroq</span>
          </a>

          {/* Telegram button */}
          <button
            className="btn-dark"
            onClick={() => {
              tg.haptic('medium');
              const username = (owner?.tgUsername || '@uygo_support').replace('@', '');
              window.open(`https://t.me/${username}`, '_blank');
            }}
            style={{ flex: 1, padding: '12px 10px', fontSize: '13px', background: '#2481cc' }}
          >
            <Send size={15} color="#fff" />
            <span>Telegram</span>
          </button>

          {/* Xabar yozish button */}
          <button
            className="btn-primary"
            onClick={() => {
              tg.haptic('medium');
              onStartChat(property);
            }}
            style={{ flex: 1.2, padding: '12px 12px', fontSize: '13px' }}
          >
            <MessageSquare size={16} color="#111315" />
            <span>Xabar yozish</span>
          </button>
        </div>

        {showShareToast && (
          <div className="toast-notice">
            <CheckCircle size={16} className="toast-icon" />
            <span>Havola nusxalandi!</span>
          </div>
        )}
      </div>
    </div>
  );
}
