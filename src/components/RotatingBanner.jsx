import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { tg } from '../utils/telegram';

export default function RotatingBanner({ banners = [], onBannerClick }) {
  const activeBanners = banners
    .filter(b => b.active)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto rotation timer (4.5 seconds)
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped left -> next
      tg.haptic('selection');
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      tg.haptic('selection');
      setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    tg.haptic('light');
    setCurrentIndex(index);
  };

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  return (
    <section className="banner-section">
      <div 
        className="banner-carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          tg.haptic('medium');
          if (onBannerClick) onBannerClick(currentBanner);
        }}
      >
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`banner-slide ${isActive ? 'active' : ''}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="banner-image"
                loading="eager"
              />
              <div className="banner-overlay">
                {banner.badge && (
                  <span className="banner-tag-badge">{banner.badge}</span>
                )}
                <h3 className="banner-title">{banner.title}</h3>
                <p className="banner-subtitle">{banner.subtitle}</p>
                <div className="banner-footer-row">
                  <button 
                    className="banner-cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      tg.haptic('medium');
                      if (onBannerClick) onBannerClick(banner);
                    }}
                  >
                    <span>{banner.button || 'Batafsil'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pagination Dots (only when more than 1 banner) */}
        {activeBanners.length > 1 && (
          <div className="banner-pagination">
            {activeBanners.map((_, dotIdx) => (
              <div
                key={dotIdx}
                className={`banner-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                onClick={(e) => handleDotClick(e, dotIdx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
