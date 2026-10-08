import React from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { tg } from '../utils/telegram';

export default function PropertyCard({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}) {
  const {
    id,
    title,
    price,
    priceUsd,
    currency,
    purpose,
    rooms,
    area,
    floor,
    totalFloors,
    region,
    district,
    images = [],
    isVip,
    isTop,
    owner
  } = property;

  // Format price exactly as screenshot:
  // e.g. "450,000 so'm/kun" (split into 2 lines if needed) or "49,000 $"
  const renderPrice = () => {
    if (purpose === 'daily') {
      return (
        <div className="card-price-stack">
          <span className="card-price-number">{price.toLocaleString('en-US')}</span>
          <span className="card-price-unit">so‘m/kun</span>
        </div>
      );
    }
    if (currency === 'USD' && priceUsd) {
      return (
        <div className="card-price-stack">
          <span className="card-price-number">{priceUsd.toLocaleString('en-US')} $</span>
        </div>
      );
    }
    if (purpose === 'rent') {
      return (
        <div className="card-price-stack">
          <span className="card-price-number">{price.toLocaleString('en-US')}</span>
          <span className="card-price-unit">so‘m/oy</span>
        </div>
      );
    }
    // Sale in UZS or other
    return (
      <div className="card-price-stack">
        <span className="card-price-number">{price.toLocaleString('en-US')} so‘m</span>
      </div>
    );
  };

  const purposeLabel = {
    sale: 'Sotuv',
    rent: 'Ijara',
    daily: 'Kunlik'
  }[purpose];

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    tg.haptic('selection');
    onToggleFavorite(id);
  };

  // Extract short owner name (e.g. "Bobur", "Nilufar", "Sardor")
  const shortOwnerName = owner?.name?.split(' ')[0] || 'Egasi';

  return (
    <div 
      className={`property-card-grid-item ${isVip ? 'is-vip' : ''}`}
      onClick={() => {
        tg.haptic('light');
        onClick(property);
      }}
    >
      {/* Card Image Wrap */}
      <div className="grid-card-media-wrap">
        <img 
          src={images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80'} 
          alt={title} 
          className="grid-card-img"
          loading="lazy"
        />

        {/* Top-left Badges */}
        <div className="grid-card-badges-left">
          {isVip ? (
            <span className="badge-pill-vip">
              <Sparkles size={11} fill="#111315" />
              <span>VIP</span>
            </span>
          ) : isTop ? (
            <span className="badge-pill-top">
              TOP
            </span>
          ) : null}

          {purposeLabel && (
            <span className="badge-pill-purpose">
              {purposeLabel}
            </span>
          )}
        </div>

        {/* Floating Heart Button on Top-Right */}
        <button 
          className={`grid-card-fav-btn ${isFavorite ? 'is-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Saqlash"
        >
          <Heart 
            size={16} 
            fill={isFavorite ? "#FA5252" : "none"} 
            color={isFavorite ? "#FA5252" : "#111315"} 
            strokeWidth={2.2}
          />
        </button>
      </div>

      {/* Card Body below image */}
      <div className="grid-card-body">
        {/* Price */}
        <div className="grid-card-price-container">
          {renderPrice()}
        </div>

        {/* Specs: 1 xona · 42 m² · 6-qavat */}
        <div className="grid-card-specs-row">
          <span>{rooms} xona</span>
          <span className="spec-dot">·</span>
          <span>{area} m²</span>
          {floor && (
            <>
              <span className="spec-dot">·</span>
              <span>{floor}-qavat</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="grid-card-title" title={title}>
          {title}
        </h3>

        {/* Subtle Divider */}
        <div className="grid-card-divider" />

        {/* Footer: Location on left, Owner on right */}
        <div className="grid-card-footer">
          <div className="grid-card-location">
            <MapPin size={12} color="#7E858E" />
            <span title={`${region}, ${district}`}>
              {district || region}
            </span>
          </div>

          <span className="grid-card-owner">
            {shortOwnerName}
          </span>
        </div>
      </div>
    </div>
  );
}
