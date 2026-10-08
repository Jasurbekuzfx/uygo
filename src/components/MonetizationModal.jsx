import React, { useState, useRef } from 'react';
import { 
  X, Check, Crown, Zap, ShieldCheck, CheckCircle2, 
  ArrowRight, CreditCard, Sparkles, Copy, Upload, Image as ImageIcon,
  Clock, AlertCircle, ArrowLeft, Trash2, Megaphone
} from 'lucide-react';
import { tg } from '../utils/telegram';
import { formatDateDDMMYYYY } from '../data/mockData';

export default function MonetizationModal({
  userListings = [],
  currentUser = null,
  billingSettings = {
    cardNumber: '8600 4910 2345 6789',
    cardHolder: 'UYGO ADMIN',
    topPrice: 30000,
    topDays: 7,
    vipPrice: 70000,
    vipDays: 7,
    bannerPrice: 120000,
    bannerDays: 7
  },
  onSubmitPaymentRequest,
  onOpenCreateListing,
  onClose
}) {
  // Step 1: 'select_package', Step 2: 'payment_checkout', Step 3: 'pending_status'
  const [step, setStep] = useState('select_package');
  
  // Package Selection
  const [packageType, setPackageType] = useState('TOP'); // 'TOP', 'VIP', 'BANNER'
  const [selectedListingId, setSelectedListingId] = useState(
    userListings[0]?.id || ''
  );

  // Banner details (if packageType === 'BANNER')
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80');
  const [bannerLink, setBannerLink] = useState('https://t.me/uygo_admin');

  // Checkout Receipt state
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptError, setReceiptError] = useState('');
  const [isCompressingReceipt, setIsCompressingReceipt] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState(null);

  const fileInputRef = useRef(null);

  // Determine current active package details dynamically from billingSettings
  const currentPrice = packageType === 'TOP' 
    ? billingSettings.topPrice 
    : packageType === 'VIP' 
      ? billingSettings.vipPrice 
      : billingSettings.bannerPrice;

  const currentDays = packageType === 'TOP'
    ? billingSettings.topDays
    : packageType === 'VIP'
      ? billingSettings.vipDays
      : billingSettings.bannerDays;

  const packageName = packageType === 'TOP'
    ? `TOP e’lon (${currentDays} kun)`
    : packageType === 'VIP'
      ? `VIP e’lon (${currentDays} kun)`
      : `Reklama banneri (${currentDays} kun)`;

  // FAQAT foydalanuvchining o‘z e’lonlari ko‘rsatiladi (boshqalarniki emas!)
  const availableListings = userListings;
  const currentListing = availableListings.find(l => l.id === selectedListingId) || availableListings[0];

  // Copy card number handler
  const handleCopyCard = () => {
    tg.haptic('selection');
    const cleanNumber = (billingSettings.cardNumber || '').replace(/\s+/g, '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanNumber);
    }
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2200);
  };

  // Compress receipt image to stay safely below 1MB Firestore limit (~50-80KB)
  const compressReceipt = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;

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
          resolve(canvas.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Receipt file upload handler with canvas compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setReceiptError('Faqat rasm formatidagi fayl yuklang (PNG, JPG)');
      return;
    }

    setReceiptError('');
    setIsCompressingReceipt(true);
    try {
      const compressed = await compressReceipt(file);
      if (compressed) {
        setReceiptImage(compressed);
        tg.haptic('success');
      }
    } catch (err) {
      setReceiptError('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setIsCompressingReceipt(false);
    }
  };

  // Submit payment for verification
  const handleSubmitReceipt = (e) => {
    e.preventDefault();
    if (!receiptImage) {
      setReceiptError('Iltimos, to‘lov cheki yoki skrinshotini yuklang!');
      tg.haptic('error');
      return;
    }

    tg.haptic('medium');

    const now = new Date();
    const dateFormatted = `${formatDateDDMMYYYY(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPaymentRequest = {
      id: `pay-${Date.now()}`,
      userId: currentUser?.id || 'user-live',
      userName: `${currentUser?.firstName || currentUser?.first_name || 'Foydalanuvchi'} ${currentUser?.lastName || currentUser?.last_name || ''}`.trim(),
      userTg: currentUser?.username ? `@${currentUser.username.replace('@', '')}` : (currentUser?.id ? `ID: ${currentUser.id}` : '@tg_user'),
      packageType,
      packageName,
      amount: currentPrice,
      amountFormatted: `${currentPrice.toLocaleString('uz-UZ')} so‘m`,
      durationDays: currentDays,
      createdAt: now.toISOString(),
      dateFormatted,
      receiptImage,
      status: 'pending', // "Kutilmoqda"
      targetType: packageType === 'BANNER' ? 'banner' : 'listing',
      targetListingId: packageType === 'BANNER' ? null : (selectedListingId || null),
      targetListingTitle: packageType === 'BANNER' ? null : (currentListing?.title || 'Ko‘chmas mulk e’loni'),
      bannerDetails: packageType === 'BANNER' ? {
        title: bannerTitle || 'Reklama banneri',
        subtitle: bannerSubtitle || 'Batafsil ma’lumot',
        image: bannerImage,
        link: bannerLink,
        badge: 'Reklama'
      } : null
    };

    if (onSubmitPaymentRequest) {
      onSubmitPaymentRequest(newPaymentRequest);
    }

    setSubmittedPayment(newPaymentRequest);
    setStep('pending_status');
    tg.haptic('success');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 220 }}>
      <div 
        className="bottom-sheet-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ height: '92vh', maxHeight: '92vh' }}
      >
        <div className="bottom-sheet-drag-handle" />

        {/* Header */}
        <div className="bottom-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step === 'payment_checkout' && (
              <button 
                onClick={() => setStep('select_package')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <ArrowLeft size={20} color="#111315" />
              </button>
            )}
            <img src="/logo.png" alt="UYGO" style={{ height: '22px', width: 'auto', objectFit: 'contain' }} />
            <span className="bottom-sheet-title">
              {step === 'select_package' && 'Xizmatni tanlash'}
              {step === 'payment_checkout' && 'To‘lov sahifasi'}
              {step === 'pending_status' && 'To‘lov holati'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="bottom-sheet-body">
          {/* STEP 1: PAKET VA E'LON / BANNERNI TANLASH */}
          {step === 'select_package' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header Info Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #FFD400 0%, #FFB800 100%)',
                borderRadius: '16px',
                padding: '16px',
                color: '#111315'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
                  E’loningizni eng yuqoriga chiqaring! 🚀
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: '500', opacity: 0.9 }}>
                  TOP va VIP e’lonlar 5 barobar ko‘proq ko‘riladi. Reklama banneri esa barcha foydalanuvchilar ekranida ko‘rinadi.
                </div>
              </div>

              {/* Package Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800', color: '#111315' }}>
                  Kerakli xizmat paketini tanlang:
                </label>

                {/* TOP PACKAGE */}
                <div 
                  onClick={() => {
                    tg.haptic('selection');
                    setPackageType('TOP');
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: packageType === 'TOP' ? '2px solid #FFD400' : '1px solid #E8ECEF',
                    background: packageType === 'TOP' ? '#FFFDF0' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#111315',
                        color: '#FFD400',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        TOP
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#111315' }}>
                        TOP e’lon ({billingSettings.topDays} kun)
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#111315' }}>
                      {billingSettings.topPrice.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
                    • Qidiruv natijalarida yuqori o‘rinda turadi<br />
                    • Sariq TOP nishoni bilan ajralib turadi<br />
                    • Davomiyligi: {billingSettings.topDays} kun
                  </div>
                </div>

                {/* VIP PACKAGE */}
                <div 
                  onClick={() => {
                    tg.haptic('selection');
                    setPackageType('VIP');
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: packageType === 'VIP' ? '2px solid #FFD400' : '1px solid #E8ECEF',
                    background: packageType === 'VIP' ? '#FFFDF0' : '#FFFFFF',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    background: '#111315',
                    color: '#FFD400',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '8px'
                  }}>
                    ENG MASHHUR
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#FFD400',
                        color: '#111315',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        VIP
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#111315' }}>
                        VIP e’lon ({billingSettings.vipDays} kun)
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#111315' }}>
                      {billingSettings.vipPrice.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
                    • Bosh sahifaning maxsus VIP blokida joylashadi<br />
                    • Maxsus oltin ramka va VIP belgisi beriladi<br />
                    • Davomiyligi: {billingSettings.vipDays} kun
                  </div>
                </div>

                {/* AD BANNER PACKAGE */}
                <div 
                  onClick={() => {
                    tg.haptic('selection');
                    setPackageType('BANNER');
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: packageType === 'BANNER' ? '2px solid #FFD400' : '1px solid #E8ECEF',
                    background: packageType === 'BANNER' ? '#FFFDF0' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#2481cc',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        REKLAMA
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#111315' }}>
                        Reklama banneri ({billingSettings.bannerDays} kun)
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#111315' }}>
                      {billingSettings.bannerPrice.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
                    • Bosh sahifaning tepa karuselida aylanuvchi katta banner<br />
                    • To‘g‘ridan-to‘g‘ri saytingizga yoki Telegram profilingizga havola<br />
                    • Davomiyligi: {billingSettings.bannerDays} kun
                  </div>
                </div>
              </div>

              {/* Target Selection: Listing (TOP/VIP) or Banner Form (BANNER) */}
              {packageType !== 'BANNER' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#111315', marginBottom: '8px' }}>
                    Ko‘tariladigan o‘zingizning e’loningiz:
                  </label>
                  {availableListings.length > 0 ? (
                    <select
                      value={selectedListingId}
                      onChange={(e) => setSelectedListingId(e.target.value)}
                      className="filter-input-box"
                      style={{ width: '100%', height: '46px', fontWeight: '600' }}
                    >
                      {availableListings.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.title} ({l.rooms} xona, {l.district})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{
                      padding: '16px',
                      background: '#FFFDF0',
                      borderRadius: '16px',
                      border: '1.5px dashed #FFD400',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#111315', marginBottom: '6px' }}>
                        Sizda hali e’lonlar mavjud emas
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.4, marginBottom: '12px' }}>
                        TOP yoki VIP xizmatidan foydalanish uchun avval o‘z e’loningizni joylang. Har bir foydalanuvchi faqat o‘zining e’lonini yuqoriga chiqara oladi!
                      </p>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          tg.haptic('medium');
                          if (onOpenCreateListing) onOpenCreateListing();
                          else onClose();
                        }}
                        style={{ padding: '8px 16px', fontSize: '12.5px', margin: '0 auto' }}
                      >
                        + Yangi e’lon berish
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#F8F9FA', padding: '14px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#111315' }}>
                    Banner ma’lumotlari:
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', color: '#555', fontWeight: '700' }}>Banner sarlavhasi</label>
                    <input
                      type="text"
                      className="filter-input-box"
                      placeholder="Masalan: Yangi turar-joy majmuasi"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', color: '#555', fontWeight: '700' }}>Qisqa izoh (subtitle)</label>
                    <input
                      type="text"
                      className="filter-input-box"
                      placeholder="Masalan: Boshlang‘ich to‘lov 15% dan boshlanadi"
                      value={bannerSubtitle}
                      onChange={(e) => setBannerSubtitle(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', color: '#555', fontWeight: '700' }}>Banner rasmi (URL)</label>
                    <input
                      type="text"
                      className="filter-input-box"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', color: '#555', fontWeight: '700' }}>Havola (Telegram yoki Sayt)</label>
                    <input
                      type="text"
                      className="filter-input-box"
                      value={bannerLink}
                      onChange={(e) => setBannerLink(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                </div>
              )}

              {/* Proceed to Payment Button */}
              {packageType !== 'BANNER' && availableListings.length === 0 ? null : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    tg.haptic('medium');
                    setStep('payment_checkout');
                  }}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '800', marginTop: '6px' }}
                >
                  To‘lovga o‘tish ({currentPrice.toLocaleString('uz-UZ')} so‘m) →
                </button>
              )}
            </div>
          )}

          {/* STEP 2: FOYDALANUVCHI TO‘LOVI VA CHEKNI YUKLASH */}
          {step === 'payment_checkout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Payment Info Card exactly as requested by user */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #FFD400',
                padding: '18px 20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* To'lov summasi */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '700', textTransform: 'uppercase' }}>
                    To‘lov summasi
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '900', color: '#111315', marginTop: '2px' }}>
                    {currentPrice.toLocaleString('uz-UZ')} so‘m
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '2px', fontWeight: '600' }}>
                    Paket: {packageName}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#F0F2F5', margin: '12px 0' }} />

                {/* Karta raqami */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '700', textTransform: 'uppercase' }}>
                    Karta raqami
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    background: '#F8F9FA',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #E8ECEF'
                  }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      color: '#111315'
                    }}>
                      {billingSettings.cardNumber || '8600 **** **** ****'}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyCard}
                      style={{
                        background: copiedCard ? '#12B886' : '#111315',
                        color: copiedCard ? '#FFFFFF' : '#FFD400',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {copiedCard ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedCard ? 'Nusxalandi' : 'Nusxa olish'}</span>
                    </button>
                  </div>
                </div>

                {/* Karta egasi */}
                <div>
                  <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '700', textTransform: 'uppercase' }}>
                    Karta egasi
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginTop: '2px' }}>
                    {billingSettings.cardHolder || 'UYGO ADMIN'}
                  </div>
                </div>
              </div>

              {/* Ko'rsatma */}
              <div style={{
                background: '#FFF9DB',
                border: '1px solid #FFD400',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <Sparkles size={18} color="#B28900" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: '#111315', fontWeight: '600', lineHeight: 1.4 }}>
                  To‘lovni amalga oshiring va chekni yuklang. Admin tekshirib tasdiqlagach xizmat darhol faollashadi.
                </div>
              </div>

              {/* Chekni yuklash formasi */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {!receiptImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={isCompressingReceipt}
                      onClick={() => {
                        tg.haptic('selection');
                        fileInputRef.current?.click();
                      }}
                      style={{
                        border: '2px dashed #D0D5DD',
                        background: '#FAFAFB',
                        borderRadius: '16px',
                        padding: '24px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: isCompressingReceipt ? 'not-allowed' : 'pointer',
                        width: '100%',
                        opacity: isCompressingReceipt ? 0.7 : 1
                      }}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#FFFDF0',
                        border: '1px solid #FFD400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Upload size={22} color="#111315" />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#111315' }}>
                        {isCompressingReceipt ? '⏳ Chek tayyorlanmoqda...' : 'Chekni yuklash'}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#7E858E' }}>
                        {isCompressingReceipt ? 'Rasm hajmi ixchamlashmoqda...' : 'Bank ilovasi cheki yoki to‘lov skrinshotini tanlang'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div style={{
                    borderRadius: '16px',
                    border: '1px solid #E8ECEF',
                    padding: '12px',
                    background: '#FFFFFF'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#12B886', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Chek yuklandi
                      </span>
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FA5252',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '11.5px',
                          fontWeight: '700'
                        }}
                      >
                        <Trash2 size={13} /> O‘chirish
                      </button>
                    </div>

                    <img
                      src={receiptImage}
                      alt="To‘lov cheki"
                      style={{
                        width: '100%',
                        maxHeight: '180px',
                        borderRadius: '12px',
                        objectFit: 'contain',
                        background: '#111315'
                      }}
                    />
                  </div>
                )}

                {receiptError && (
                  <div style={{ color: '#FA5252', fontSize: '12px', fontWeight: '700', marginTop: '6px' }}>
                    {receiptError}
                  </div>
                )}
              </div>

              {/* Yuborish tugmasi */}
              <button
                type="button"
                className="btn-dark"
                disabled={isCompressingReceipt || !receiptImage}
                onClick={handleSubmitReceipt}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '800',
                  background: isCompressingReceipt || !receiptImage ? '#7E858E' : '#111315',
                  color: isCompressingReceipt || !receiptImage ? '#FFF' : '#FFD400',
                  cursor: isCompressingReceipt || !receiptImage ? 'not-allowed' : 'pointer'
                }}
              >
                {isCompressingReceipt ? '⏳ Rasm ishlanmoqda...' : 'Chekni tekshirishga yuborish'}
              </button>
            </div>
          )}

          {/* STEP 3: TO‘LOV HOLATI (KUTILMOQDA) */}
          {step === 'pending_status' && (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#FFF9DB',
                border: '2px solid #FFD400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Clock size={36} color="#B28900" />
              </div>

              <div style={{
                display: 'inline-block',
                background: '#FFF9DB',
                color: '#B28900',
                fontSize: '12px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                Kutilmoqda ⏳
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: '900',
                color: '#111315',
                marginBottom: '8px'
              }}>
                To‘lov qabul qilindi!
              </h3>

              <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto 18px auto' }}>
                Chekingiz moderatorga muvaffaqiyatli yuborildi. Admin tekshirib tasdiqlagach, <strong>{submittedPayment?.packageName}</strong> avtomatik ravishda faollashadi.
              </p>

              {/* Request Details Box */}
              <div style={{
                background: '#F8F9FA',
                border: '1px solid #E8ECEF',
                borderRadius: '16px',
                padding: '14px 16px',
                textAlign: 'left',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#7E858E' }}>Paket:</span>
                  <span style={{ fontWeight: '800', color: '#111315' }}>{submittedPayment?.packageName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#7E858E' }}>Summa:</span>
                  <span style={{ fontWeight: '800', color: '#111315' }}>{submittedPayment?.amountFormatted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#7E858E' }}>Vaqti:</span>
                  <span style={{ fontWeight: '600', color: '#111315' }}>{submittedPayment?.dateFormatted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#7E858E' }}>Holat:</span>
                  <span style={{ fontWeight: '800', color: '#B28900' }}>Kutilmoqda</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  tg.haptic('selection');
                  onClose();
                }}
                style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: '800' }}
              >
                Tushundim, yopish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
