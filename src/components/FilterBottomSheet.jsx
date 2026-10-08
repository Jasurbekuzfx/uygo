import React, { useState } from 'react';
import { REGIONS, DISTRICTS } from '../data/mockData';
import { tg } from '../utils/telegram';

export default function FilterBottomSheet({
  filters,
  onApplyFilters,
  onClose,
  totalResultsCount
}) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const purposeOptions = [
    { id: 'all', label: 'Barchasi' },
    { id: 'sale', label: 'Sotuv' },
    { id: 'rent', label: 'Ijara' },
    { id: 'daily', label: 'Kunlik' }
  ];

  const typeOptions = [
    { id: 'all', label: 'Barchasi' },
    { id: 'apartment', label: 'Kvartira' },
    { id: 'house', label: 'Uy va hovli' },
    { id: 'new_building', label: 'Yangi qurilish' },
    { id: 'commercial', label: 'Tijorat / Ofis' },
    { id: 'land', label: 'Yer' },
    { id: 'other', label: 'Boshqalar' }
  ];

  const roomsOptions = ['Barchasi', '1', '2', '3', '4', '5+'];
  const renovationOptions = ['Barchasi', 'Ta’mirlangan', 'O‘rtacha', 'Ta’mirsiz'];
  const furnitureOptions = ['Barchasi', 'Mebelli', 'Mebelsiz'];

  const handleSelectRegion = (region) => {
    tg.haptic('selection');
    setLocalFilters(prev => ({
      ...prev,
      region,
      district: 'Barchasi'
    }));
  };

  const handleClear = () => {
    tg.haptic('medium');
    const reset = {
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
    };
    setLocalFilters(reset);
    onApplyFilters(reset);
    onClose();
  };

  const handleApply = () => {
    tg.haptic('success');
    onApplyFilters(localFilters);
    onClose();
  };

  const currentDistricts = DISTRICTS[localFilters.region] || ['Barchasi'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-drag-handle" />
        <div className="bottom-sheet-header">
          <span className="bottom-sheet-title">Filtrlar</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="bottom-sheet-body">
          {/* Maqsad */}
          <div className="filter-group">
            <span className="filter-label">Maqsad</span>
            <div className="filter-chips-grid">
              {purposeOptions.map(p => (
                <button
                  key={p.id}
                  className={`filter-chip-btn ${localFilters.purpose === p.id ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setLocalFilters({ ...localFilters, purpose: p.id });
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ko'chmas mulk turi */}
          <div className="filter-group">
            <span className="filter-label">Ko‘chmas mulk turi</span>
            <div className="filter-chips-grid">
              {typeOptions.map(t => (
                <button
                  key={t.id}
                  className={`filter-chip-btn ${localFilters.type === t.id ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setLocalFilters({ ...localFilters, type: t.id });
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Viloyat */}
          <div className="filter-group">
            <span className="filter-label">Viloyat</span>
            <div className="filter-chips-grid">
              {REGIONS.map(reg => (
                <button
                  key={reg}
                  className={`filter-chip-btn ${localFilters.region === reg ? 'active' : ''}`}
                  onClick={() => handleSelectRegion(reg)}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Tuman / Shahar */}
          {currentDistricts.length > 1 && (
            <div className="filter-group">
              <span className="filter-label">Tuman / Shahar</span>
              <div className="filter-chips-grid">
                {currentDistricts.map(dist => (
                  <button
                    key={dist}
                    className={`filter-chip-btn ${localFilters.district === dist ? 'active' : ''}`}
                    onClick={() => {
                      tg.haptic('selection');
                      setLocalFilters({ ...localFilters, district: dist });
                    }}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Xonalar soni */}
          <div className="filter-group">
            <span className="filter-label">Xonalar soni</span>
            <div className="filter-chips-grid">
              {roomsOptions.map(r => (
                <button
                  key={r}
                  className={`filter-chip-btn ${localFilters.rooms === r ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setLocalFilters({ ...localFilters, rooms: r });
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Narx oralig'i */}
          <div className="filter-group">
            <span className="filter-label">Narx oralig‘i</span>
            <div className="filter-range-inputs">
              <input
                type="number"
                placeholder="Dan (so‘m / $)"
                value={localFilters.minPrice}
                onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                className="filter-input-box"
              />
              <span style={{ color: '#7E858E' }}>—</span>
              <input
                type="number"
                placeholder="Gacha"
                value={localFilters.maxPrice}
                onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                className="filter-input-box"
              />
            </div>
          </div>

          {/* Maydon (m²) */}
          <div className="filter-group">
            <span className="filter-label">Maydon (m²)</span>
            <div className="filter-range-inputs">
              <input
                type="number"
                placeholder="Min m²"
                value={localFilters.minArea}
                onChange={(e) => setLocalFilters({ ...localFilters, minArea: e.target.value })}
                className="filter-input-box"
              />
              <span style={{ color: '#7E858E' }}>—</span>
              <input
                type="number"
                placeholder="Max m²"
                value={localFilters.maxArea}
                onChange={(e) => setLocalFilters({ ...localFilters, maxArea: e.target.value })}
                className="filter-input-box"
              />
            </div>
          </div>

          {/* Qavat oralig'i */}
          <div className="filter-group">
            <span className="filter-label">Qavat</span>
            <div className="filter-range-inputs">
              <input
                type="number"
                placeholder="Qavatdan"
                value={localFilters.minFloor}
                onChange={(e) => setLocalFilters({ ...localFilters, minFloor: e.target.value })}
                className="filter-input-box"
              />
              <span style={{ color: '#7E858E' }}>—</span>
              <input
                type="number"
                placeholder="Qavatgacha"
                value={localFilters.maxFloor}
                onChange={(e) => setLocalFilters({ ...localFilters, maxFloor: e.target.value })}
                className="filter-input-box"
              />
            </div>
          </div>

          {/* Ta'mirlash */}
          <div className="filter-group">
            <span className="filter-label">Ta’mirlash holati</span>
            <div className="filter-chips-grid">
              {renovationOptions.map(ren => (
                <button
                  key={ren}
                  className={`filter-chip-btn ${localFilters.renovation === ren ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setLocalFilters({ ...localFilters, renovation: ren });
                  }}
                >
                  {ren}
                </button>
              ))}
            </div>
          </div>

          {/* Mebel */}
          <div className="filter-group">
            <span className="filter-label">Mebel</span>
            <div className="filter-chips-grid">
              {furnitureOptions.map(m => (
                <button
                  key={m}
                  className={`filter-chip-btn ${localFilters.furniture === m ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selection');
                    setLocalFilters({ ...localFilters, furniture: m });
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-sheet-footer">
          <button className="btn-secondary" onClick={handleClear}>
            Tozalash
          </button>
          <button className="btn-primary" onClick={handleApply}>
            Qo‘llash {totalResultsCount !== undefined ? `(${totalResultsCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
