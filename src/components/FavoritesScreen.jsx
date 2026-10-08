import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { tg } from '../utils/telegram';

export default function FavoritesScreen({
  properties = [],
  favorites = [],
  onToggleFavorite,
  onOpenPropertyDetail,
  onGoHome
}) {
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="main-content-scroll" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#111315', margin: 0 }}>
            Saqlangan e’lonlar
          </h1>
          <p style={{ fontSize: '13px', color: '#7E858E', marginTop: '2px' }}>
            Sizga yoqqan barcha saralangan ko‘chmas mulklar
          </p>
        </div>
        <span style={{
          background: '#FFF9DB',
          color: '#111315',
          fontSize: '12px',
          fontWeight: '800',
          padding: '4px 10px',
          borderRadius: '999px',
          border: '1px solid #FFD400'
        }}>
          {favoriteProperties.length} ta
        </span>
      </div>

      {favoriteProperties.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E8ECEF',
          marginTop: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFE3E3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Heart size={32} color="#FA5252" />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#111315', marginBottom: '6px' }}>
            Hozircha saqlangan e’lonlar yo‘q
          </h2>
          <p style={{ fontSize: '13.5px', color: '#7E858E', lineHeight: 1.5, marginBottom: '20px', maxWidth: '280px', margin: '0 auto 20px auto' }}>
            O‘zingizga ma’qul kelgan uylarni yurakcha belgisini bosish orqali shu yerga jamlab boring.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              tg.haptic('medium');
              onGoHome();
            }}
            style={{ margin: '0 auto', display: 'inline-flex' }}
          >
            <span>E’lonlarni ko‘rish</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="property-cards-grid">
          {favoriteProperties.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onClick={onOpenPropertyDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
