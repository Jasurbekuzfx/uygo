import React, { useState } from 'react';
import { 
  X, Camera, Plus, Trash2, CheckCircle2, ArrowRight, Eye, Sparkles 
} from 'lucide-react';
import { REGIONS, DISTRICTS, PROPERTY_TYPES } from '../data/mockData';
import { tg } from '../utils/telegram';

export default function CreateListingModal({
  currentUser,
  onClose,
  onSubmitListing
}) {
  const [step, setStep] = useState(1); // 1: Info & Photos, 2: Preview & Submit
  const [purpose, setPurpose] = useState('rent');
  const [type, setType] = useState('apartment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('UZS');
  const [region, setRegion] = useState('Toshkent');
  const [district, setDistrict] = useState('Yunusobod');
  const [address, setAddress] = useState('');
  const [rooms, setRooms] = useState('1');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [renovation, setRenovation] = useState('Ta’mirlangan');
  const [furniture, setFurniture] = useState('Mebelli');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [tgUsername, setTgUsername] = useState(currentUser?.username || '');

  // Photos list - clean empty initial state
  const [photos, setPhotos] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Compress images to max 1200px JPEG quality 0.72 (~60-90KB each) to prevent Firestore 1MB doc limits
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    tg.haptic('selection');
    setIsCompressing(true);

    try {
      for (const file of files) {
        if (photos.length >= 12) break;
        const compressed = await compressImage(file);
        if (compressed) {
          setPhotos(prev => {
            if (prev.length >= 12) return prev;
            return [...prev, compressed];
          });
        }
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (idx) => {
    tg.haptic('selection');
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleNextToPreview = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert('Iltimos, sarlavha va narxni to‘ldiring!');
      return;
    }
    if (photos.length === 0) {
      alert('Iltimos, mulkingizning kamida 1 ta rasmini yuklang!');
      return;
    }
    if (!phone.trim()) {
      alert('Iltimos, bog‘lanish uchun telefon raqamingizni kiriting!');
      return;
    }
    tg.haptic('medium');
    setStep(2);
  };

  const handleFinalSubmit = () => {
    tg.haptic('success');
    const newProperty = {
      id: `prop-${Date.now()}`,
      ownerId: currentUser?.id ? `user-${currentUser.id}` : 'user-me',
      title: title.trim(),
      description: description.trim() || 'Hech qanday tavsif kiritilmagan.',
      type,
      purpose,
      price: Number(price),
      priceUsd: currency === 'USD' ? Number(price) : Math.round(Number(price) / 12800),
      currency,
      rooms: Number(rooms) || 1,
      area: Number(area) || 0,
      floor: Number(floor) || 1,
      totalFloors: Number(totalFloors) || 1,
      renovation,
      furniture,
      region,
      district,
      address: address.trim() || `${region}, ${district}`,
      latitude: 41.311086 + (Math.random() - 0.5) * 0.08,
      longitude: 69.240562 + (Math.random() - 0.5) * 0.08,
      images: photos,
      isVip: false,
      isTop: false,
      createdAt: new Date().toISOString(),
      views: 0,
      status: 'active',
      owner: {
        id: currentUser?.id ? String(currentUser.id) : 'user-me',
        name: `${currentUser?.firstName || 'Mulk egasi'} ${currentUser?.lastName || ''}`.trim(),
        role: 'Egasi',
        avatar: currentUser?.photoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser?.firstName || 'User')}`,
        phone: phone.trim(),
        tgUsername: tgUsername.trim(),
        onlineStatus: 'Hozir tarmoqda'
      }
    };

    onSubmitListing(newProperty);
    onClose();
  };

  const currentDistricts = DISTRICTS[region] || ['Markaz'];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200 }}>
      <div 
        className="bottom-sheet-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ height: '94vh', maxHeight: '94vh' }}
      >
        <div className="bottom-sheet-drag-handle" />
        
        <div className="bottom-sheet-header">
          <span className="bottom-sheet-title">
            {step === 1 ? 'Yangi e’lon berish' : 'E’lonni tekshirish (Preview)'}
          </span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="bottom-sheet-body">
          {step === 1 ? (
            <form onSubmit={handleNextToPreview}>
              {/* Maqsad */}
              <div className="filter-group">
                <span className="filter-label">Maqsad</span>
                <div className="filter-chips-grid">
                  {[
                    { id: 'rent', label: 'Ijara (Oylik)' },
                    { id: 'sale', label: 'Sotuv' },
                    { id: 'daily', label: 'Kunlik ijara' }
                  ].map(p => (
                    <button
                      type="button"
                      key={p.id}
                      className={`filter-chip-btn ${purpose === p.id ? 'active' : ''}`}
                      onClick={() => {
                        tg.haptic('selection');
                        setPurpose(p.id);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mulk turi */}
              <div className="filter-group">
                <span className="filter-label">Ko‘chmas mulk turi</span>
                <div className="filter-chips-grid">
                  {PROPERTY_TYPES.filter(t => t.id !== 'all').map(t => (
                    <button
                      type="button"
                      key={t.id}
                      className={`filter-chip-btn ${type === t.id ? 'active' : ''}`}
                      onClick={() => {
                        tg.haptic('selection');
                        setType(t.id);
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rasmlar (12 tagacha) */}
              <div className="filter-group">
                <span className="filter-label">Rasmlar ({photos.length}/12)</span>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {/* Upload button */}
                  <label style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '16px',
                    border: '2px dashed #FFD400',
                    background: '#FFF9DB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}>
                    <Camera size={22} color="#111315" />
                    <span style={{ fontSize: '11px', fontWeight: '700', marginTop: '4px', color: '#111315' }}>Rasm qo‘shish</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>

                  {/* Uploading indicator */}
                  {isCompressing && (
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '16px',
                      border: '1.5px dashed #FFD400',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FFFDF0',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#111315',
                      flexShrink: 0
                    }}>
                      <span>⏳ Rasm...</span>
                    </div>
                  )}

                  {/* Uploaded photos previews */}
                  {photos.map((pUrl, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden' }}>
                      <img src={pUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                {photos.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#7E858E', marginTop: '6px' }}>
                    * Mulkning haqiqiy suratini yuklang (kamida 1 ta, ko‘pi bilan 12 ta)
                  </div>
                )}
              </div>

              {/* Sarlavha */}
              <div className="filter-group">
                <label className="filter-label">Sarlavha *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Yunusobod 2 xona shinam kvartira"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="filter-input-box"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Narx & Valyuta */}
              <div className="filter-group">
                <label className="filter-label">Narx *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    required
                    placeholder="Narxini kiriting"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="filter-input-box"
                    style={{ flex: 1 }}
                  />
                  <div style={{ display: 'flex', background: '#F7F8FA', borderRadius: '12px', padding: '4px', border: '1px solid #E8ECEF' }}>
                    <button
                      type="button"
                      onClick={() => setCurrency('UZS')}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        background: currency === 'UZS' ? '#111315' : 'transparent',
                        color: currency === 'UZS' ? '#FFD400' : '#7E858E',
                        cursor: 'pointer'
                      }}
                    >
                      SO‘M
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        background: currency === 'USD' ? '#111315' : 'transparent',
                        color: currency === 'USD' ? '#FFD400' : '#7E858E',
                        cursor: 'pointer'
                      }}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* Joylashuv */}
              <div className="filter-group">
                <label className="filter-label">Joylashuv</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      const d = DISTRICTS[e.target.value];
                      if (d && d.length > 1) setDistrict(d[1]);
                    }}
                    className="filter-input-box"
                  >
                    {REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="filter-input-box"
                  >
                    {currentDistricts.filter(d => d !== 'Barchasi').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Aniq manzil yoki mo‘ljal"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="filter-input-box"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Parametrlar: Xonalar, Maydon, Qavat */}
              <div className="filter-group">
                <label className="filter-label">Asosiy ko‘rsatkichlar</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#7E858E', display: 'block', marginBottom: '4px' }}>XONALAR</span>
                    <input
                      type="number"
                      placeholder="Xona"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="filter-input-box"
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#7E858E', display: 'block', marginBottom: '4px' }}>MAYDON (M²)</span>
                    <input
                      type="number"
                      placeholder="m²"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="filter-input-box"
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#7E858E', display: 'block', marginBottom: '4px' }}>QAVAT / JAMI</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input
                        type="number"
                        placeholder="Qavat"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className="filter-input-box"
                        style={{ padding: '8px' }}
                      />
                      <input
                        type="number"
                        placeholder="Jami"
                        value={totalFloors}
                        onChange={(e) => setTotalFloors(e.target.value)}
                        className="filter-input-box"
                        style={{ padding: '8px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ta'mirlash & Mebel */}
              <div className="filter-group">
                <span className="filter-label">Ta’mirlash va Mebel</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <select
                    value={renovation}
                    onChange={(e) => setRenovation(e.target.value)}
                    className="filter-input-box"
                  >
                    <option value="Ta’mirlangan">Ta’mirlangan</option>
                    <option value="O‘rtacha">O‘rtacha</option>
                    <option value="Ta’mirsiz">Ta’mirsiz (Qora suvoq)</option>
                  </select>

                  <select
                    value={furniture}
                    onChange={(e) => setFurniture(e.target.value)}
                    className="filter-input-box"
                  >
                    <option value="Mebelli">Mebelli</option>
                    <option value="Mebelsiz">Mebelsiz</option>
                  </select>
                </div>
              </div>

              {/* Tavsif */}
              <div className="filter-group">
                <label className="filter-label">Batafsil tavsif</label>
                <textarea
                  rows={4}
                  placeholder="Mulk haqida to‘liq ma’lumot, qulayliklar, shartlar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="filter-input-box"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Kontaktlar */}
              <div className="filter-group">
                <span className="filter-label">Aloqa ma’lumotlari</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="tel"
                    placeholder="Telefon raqam"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="filter-input-box"
                  />
                  <input
                    type="text"
                    placeholder="Telegram username (@...)"
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    className="filter-input-box"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                <span>Davom etish (Ko‘rib chiqish)</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* STEP 2: PREVIEW */
            <div>
              <div style={{
                background: '#FFF9DB',
                border: '1.5px solid #FFD400',
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Sparkles size={20} color="#111315" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111315' }}>
                  E’loningiz deyarli tayyor! Joylashdan oldin ko‘rib chiqing.
                </span>
              </div>

              {/* Preview Card */}
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid #E8ECEF',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '20px'
              }}>
                <img
                  src={photos[0]}
                  alt="preview"
                  style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#111315', marginBottom: '4px' }}>
                    {currency === 'USD' ? `$${Number(price).toLocaleString('en-US')}` : `${Number(price).toLocaleString('uz-UZ')} so‘m`}
                    {purpose === 'rent' ? '/oy' : purpose === 'daily' ? '/kun' : ''}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#111315', marginBottom: '6px' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#7E858E', marginBottom: '8px' }}>
                    {rooms} xona · {area} m² · {floor}/{totalFloors}-qavat · {renovation}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7E858E' }}>
                    📍 {region}, {district}, {address}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  style={{ flex: 1 }}
                >
                  Tahrirlash
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleFinalSubmit}
                  style={{ flex: 2 }}
                >
                  <CheckCircle2 size={18} />
                  <span>E’lonni joylash</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
