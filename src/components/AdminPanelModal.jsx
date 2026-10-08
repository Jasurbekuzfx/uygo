import React, { useState } from 'react';
import { 
  X, Check, Trash2, Crown, Zap, Shield, Image as ImageIcon, 
  BarChart3, Plus, AlertCircle, Eye, DollarSign, ToggleLeft, ToggleRight,
  CreditCard, CheckCircle2, XCircle, Clock, ExternalLink, Calendar,
  Settings, User, Phone, Tag, ZoomIn, Save
} from 'lucide-react';
import { tg } from '../utils/telegram';

export default function AdminPanelModal({
  listings = [],
  banners = [],
  reports = [],
  paymentRequests = [],
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
  onClose,
  onApproveListing,
  onRejectListing,
  onDeleteListing,
  onToggleVipListing,
  onToggleTopListing,
  onSaveBanner,
  onDeleteBanner,
  onToggleBannerStatus,
  onLoadSampleData,
  onClearAllData,
  onApprovePayment,
  onRejectPayment,
  onSaveBillingSettings
}) {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments', 'settings', 'listings', 'banners', 'reports', 'stats'
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [selectedReceiptPreview, setSelectedReceiptPreview] = useState(null);

  // Billing Settings Local Form State
  const [editCardNumber, setEditCardNumber] = useState(billingSettings.cardNumber || '');
  const [editCardHolder, setEditCardHolder] = useState(billingSettings.cardHolder || '');
  const [editTopPrice, setEditTopPrice] = useState(billingSettings.topPrice || 30000);
  const [editTopDays, setEditTopDays] = useState(billingSettings.topDays || 7);
  const [editVipPrice, setEditVipPrice] = useState(billingSettings.vipPrice || 70000);
  const [editVipDays, setEditVipDays] = useState(billingSettings.vipDays || 7);
  const [editBannerPrice, setEditBannerPrice] = useState(billingSettings.bannerPrice || 120000);
  const [editBannerDays, setEditBannerDays] = useState(billingSettings.bannerDays || 7);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // New Banner Form State
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('Yangi');
  const [newBannerButton, setNewBannerButton] = useState('Batafsil');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80');
  const [newBannerPriority, setNewBannerPriority] = useState(1);

  // Pending count for badge
  const pendingPaymentsCount = paymentRequests.filter(p => p.status === 'pending').length;

  // Filtered payments
  const filteredPayments = paymentRequests.filter(p => {
    if (paymentFilter === 'all') return true;
    return p.status === paymentFilter;
  });

  const handleSaveSettingsSubmit = (e) => {
    e.preventDefault();
    tg.haptic('success');

    const updated = {
      cardNumber: editCardNumber.trim(),
      cardHolder: editCardHolder.trim(),
      topPrice: Number(editTopPrice) || 30000,
      topDays: Number(editTopDays) || 7,
      vipPrice: Number(editVipPrice) || 70000,
      vipDays: Number(editVipDays) || 7,
      bannerPrice: Number(editBannerPrice) || 120000,
      bannerDays: Number(editBannerDays) || 7
    };

    if (onSaveBillingSettings) {
      onSaveBillingSettings(updated);
    }

    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2400);
  };

  const handleCreateBannerSubmit = (e) => {
    e.preventDefault();
    if (!newBannerTitle) return;
    tg.haptic('success');

    const newBanner = {
      id: `banner-${Date.now()}`,
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      badge: newBannerBadge,
      button: newBannerButton,
      image: newBannerImage,
      priority: Number(newBannerPriority) || 1,
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    };

    onSaveBanner(newBanner);
    setShowAddBanner(false);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 250 }}>
      <div 
        className="bottom-sheet-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ height: '94vh', maxHeight: '94vh' }}
      >
        <div className="bottom-sheet-drag-handle" />

        <div className="bottom-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="UYGO" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
            <span className="bottom-sheet-title">Admin Boshqaruv</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          padding: '8px 12px',
          background: '#F7F8FA',
          borderBottom: '1px solid #E8ECEF',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'payments', label: 'To‘lovlar', count: pendingPaymentsCount, isAlert: pendingPaymentsCount > 0 },
            { id: 'settings', label: 'Sozlamalar', count: null },
            { id: 'listings', label: 'E’lonlar', count: listings.length },
            { id: 'banners', label: 'Bannerlar', count: banners.length },
            { id: 'reports', label: 'Shikoyatlar', count: reports.length },
            { id: 'stats', label: 'Statistika', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                tg.haptic('selection');
                setActiveTab(tab.id);
              }}
              style={{
                flexShrink: 0,
                border: 'none',
                background: activeTab === tab.id ? '#111315' : 'transparent',
                color: activeTab === tab.id ? '#FFD400' : '#7E858E',
                padding: '8px 10px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span style={{
                  background: tab.isAlert ? '#FA5252' : (activeTab === tab.id ? '#FFD400' : '#E8ECEF'),
                  color: tab.isAlert ? '#FFFFFF' : (activeTab === tab.id ? '#111315' : '#7E858E'),
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '800'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bottom-sheet-body">
          {/* ============================================================== */}
          {/* TAB 1: TO'LOVLAR VA CHEKLAR (MANUAL VERIFICATION) */}
          {/* ============================================================== */}
          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Payment Filter Tabs */}
              <div style={{ display: 'flex', gap: '6px', background: '#F0F2F5', padding: '4px', borderRadius: '12px' }}>
                {[
                  { id: 'all', label: 'Barchasi' },
                  { id: 'pending', label: 'Kutilmoqda ⏳' },
                  { id: 'approved', label: 'Tasdiqlangan ✅' },
                  { id: 'rejected', label: 'Rad etilgan ❌' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      tg.haptic('selection');
                      setPaymentFilter(f.id);
                    }}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: paymentFilter === f.id ? '#FFFFFF' : 'transparent',
                      color: paymentFilter === f.id ? '#111315' : '#7E858E',
                      boxShadow: paymentFilter === f.id ? 'var(--shadow-sm)' : 'none',
                      padding: '6px 4px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredPayments.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: '#F8F9FA',
                  borderRadius: '16px',
                  border: '1px dashed #D0D5DD'
                }}>
                  <CreditCard size={40} color="#A0AEC0" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginBottom: '4px' }}>
                    To‘lovlar topilmadi
                  </div>
                  <div style={{ fontSize: '12px', color: '#7E858E' }}>
                    {paymentFilter === 'pending' ? 'Hozircha tekshirilishi kutilayotgan to‘lov cheklari yo‘q.' : 'Ushbu toifada to‘lovlar mavjud emas.'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredPayments.map(req => {
                    const isPending = req.status === 'pending';
                    const isApproved = req.status === 'approved';
                    const isRejected = req.status === 'rejected';

                    return (
                      <div
                        key={req.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '18px',
                          border: isPending ? '1.5px solid #FFD400' : '1px solid #E8ECEF',
                          padding: '14px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {/* Header: User & Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#111315' }}>
                              {req.userName || 'Foydalanuvchi'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#2481cc', fontWeight: '700' }}>
                              Telegram: {req.userTg || '@tg_user'}
                            </div>
                          </div>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: isPending ? '#FFF9DB' : (isApproved ? '#E6FCF5' : '#FFE3E3'),
                            color: isPending ? '#B28900' : (isApproved ? '#12B886' : '#FA5252')
                          }}>
                            {isPending && 'Kutilmoqda ⏳'}
                            {isApproved && 'Tasdiqlangan ✅'}
                            {isRejected && 'Rad etilgan ❌'}
                          </span>
                        </div>

                        {/* Package and Target Info */}
                        <div style={{
                          background: '#F8F9FA',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          marginBottom: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                            <span style={{ color: '#7E858E', fontWeight: '600' }}>Paket turi:</span>
                            <span style={{ fontWeight: '800', color: '#111315' }}>
                              {req.packageType === 'VIP' && '👑 VIP xizmati'}
                              {req.packageType === 'TOP' && '⚡ TOP xizmati'}
                              {req.packageType === 'BANNER' && '📢 Reklama banneri'}
                              {' '}({req.durationDays} kun)
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                            <span style={{ color: '#7E858E', fontWeight: '600' }}>Summa:</span>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '900', color: '#111315' }}>
                              {req.amountFormatted}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                            <span style={{ color: '#7E858E', fontWeight: '600' }}>Sana:</span>
                            <span style={{ color: '#555', fontWeight: '600' }}>{req.dateFormatted}</span>
                          </div>

                          {req.targetType === 'listing' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderTop: '1px solid #E8ECEF', paddingTop: '6px' }}>
                              <span style={{ color: '#7E858E', fontWeight: '600' }}>E’lon:</span>
                              <span style={{ fontWeight: '700', color: '#111315', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {req.targetListingTitle || req.targetListingId || 'E’lon'}
                              </span>
                            </div>
                          )}

                          {req.targetType === 'banner' && req.bannerDetails && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderTop: '1px solid #E8ECEF', paddingTop: '6px' }}>
                              <span style={{ color: '#7E858E', fontWeight: '600' }}>Banner:</span>
                              <span style={{ fontWeight: '700', color: '#111315', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {req.bannerDetails.title}
                              </span>
                            </div>
                          )}

                          {isApproved && req.startDate && req.endDate && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11.5px',
                              background: '#E6FCF5',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              color: '#12B886',
                              fontWeight: '700',
                              marginTop: '2px'
                            }}>
                              <span>Boshlanish: {req.startDate}</span>
                              <span>Tugash: {req.endDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Receipt Thumbnail Preview */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#7E858E', marginBottom: '6px' }}>
                            To‘lov cheki / Skrinshot:
                          </div>

                          {req.receiptImage ? (
                            <div
                              onClick={() => {
                                tg.haptic('light');
                                setSelectedReceiptPreview(req.receiptImage);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#F8F9FA',
                                border: '1px solid #E8ECEF',
                                borderRadius: '10px',
                                padding: '6px 10px',
                                cursor: 'pointer'
                              }}
                            >
                              <img
                                src={req.receiptImage}
                                alt="Chek"
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#111315', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <ZoomIn size={13} color="#2481cc" /> Chekni kattalashtirib ko‘rish
                                </span>
                                <span style={{ fontSize: '10.5px', color: '#7E858E' }}>
                                  Skrinshotni tekshirish uchun bosing
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: '#FA5252', fontWeight: '600' }}>
                              Chek yuklanmagan
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for Pending Request */}
                        {isPending && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                tg.haptic('success');
                                onApprovePayment(req.id);
                              }}
                              style={{
                                flex: 1,
                                background: '#12B886',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px',
                                fontSize: '13px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle2 size={16} />
                              <span>TASDIQLASH</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                tg.haptic('error');
                                onRejectPayment(req.id);
                              }}
                              style={{
                                flex: 1,
                                background: '#FFE3E3',
                                color: '#FA5252',
                                border: '1px solid #FA5252',
                                borderRadius: '12px',
                                padding: '12px',
                                fontSize: '13px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <XCircle size={16} />
                              <span>RAD ETISH</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: TO'LOV SOZLAMALARI (CARD DETAILS, PRICES, DURATIONS) */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettingsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#FFFDF0',
                border: '1.5px solid #FFD400',
                borderRadius: '16px',
                padding: '14px',
                fontSize: '12.5px',
                color: '#111315',
                lineHeight: 1.5
              }}>
                <strong>💳 To‘lov sozlamalari boshqaruvi:</strong> Karta raqami va narxlar to‘g‘ridan-to‘g‘ri shu yerdan o‘zgartiriladi. Hech qanday kod o‘zgartirish talab qilinmaydi.
              </div>

              {/* Karta ma'lumotlari */}
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#111315' }}>
                  1. Karta ma’lumotlari (Foydalanuvchiga ko‘rinadi)
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#555' }}>Karta raqami</label>
                  <input
                    type="text"
                    className="filter-input-box"
                    placeholder="8600 0000 0000 0000"
                    value={editCardNumber}
                    onChange={(e) => setEditCardNumber(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', fontFamily: 'monospace', fontSize: '15px', fontWeight: '700' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#555' }}>Karta egasining ismi</label>
                  <input
                    type="text"
                    className="filter-input-box"
                    placeholder="UYGO ADMIN"
                    value={editCardHolder}
                    onChange={(e) => setEditCardHolder(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                    required
                  />
                </div>
              </div>

              {/* Narxlar va muddatlar */}
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#111315' }}>
                  2. Xizmat narxlari va muddatlari
                </div>

                {/* TOP Narxi & Muddat */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>TOP narxi (so‘m)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editTopPrice}
                      onChange={(e) => setEditTopPrice(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>Muddati (kun)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editTopDays}
                      onChange={(e) => setEditTopDays(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                </div>

                {/* VIP Narxi & Muddat */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>VIP narxi (so‘m)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editVipPrice}
                      onChange={(e) => setEditVipPrice(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>Muddati (kun)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editVipDays}
                      onChange={(e) => setEditVipDays(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                </div>

                {/* Reklama Banner Narxi & Muddat */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>Banner narxi (so‘m)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editBannerPrice}
                      onChange={(e) => setEditBannerPrice(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#555' }}>Muddati (kun)</label>
                    <input
                      type="number"
                      className="filter-input-box"
                      value={editBannerDays}
                      onChange={(e) => setEditBannerDays(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', fontWeight: '700' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 3. Admin Huquqlari va Xavfsizlik */}
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#111315', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} color="#FFD400" />
                  <span>3. Super Admin Huquqi</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#111315', fontWeight: '700' }}>
                  Asosiy Telegram ID: <code style={{ background: '#FFF9DB', padding: '2px 6px', borderRadius: '4px', color: '#B28900' }}>8225823974</code>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7E858E', lineHeight: 1.4 }}>
                  Faqat ushbu Telegram ID ga ega foydalanuvchiga profilda "Admin Boshqaruv Paneli" ko‘rinadi. Boshqa hech kim (oddiy foydalanuvchilar) admin panelni ko‘ra olmaydi va kira olmaydi.
                </div>
              </div>

              {settingsSavedNotice && (
                <div style={{
                  background: '#E6FCF5',
                  color: '#12B886',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  textAlign: 'center'
                }}>
                  ✅ Sozlamalar muvaffaqiyatli saqlandi!
                </div>
              )}

              <button
                type="submit"
                className="btn-dark"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Save size={16} />
                <span>Sozlamalarni saqlash</span>
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: E'LONLAR MENEJERI */}
          {/* ============================================================== */}
          {activeTab === 'listings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {onClearAllData && listings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Rostdan ham barcha e’lonlarni tozalashni xohlaysizmi?')) {
                        tg.haptic('warning');
                        onClearAllData();
                      }
                    }}
                    style={{
                      background: '#FFE3E3',
                      border: '1px solid #FA5252',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#FA5252',
                      cursor: 'pointer'
                    }}
                  >
                    Barchasini tozalash
                  </button>
                )}
              </div>

              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: '#F7F8FA', borderRadius: '16px', border: '1px dashed #D0D5DD' }}>
                  <Shield size={36} color="#A0AEC0" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#111315', marginBottom: '4px' }}>
                    Hozircha e’lonlar mavjud emas
                  </div>
                </div>
              ) : (
                listings.map(prop => (
                  <div 
                    key={prop.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8ECEF',
                      borderRadius: '16px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80'}
                      alt={prop.title}
                      style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#111315', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prop.title}
                        </div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: prop.status === 'active' ? '#E6FCF5' : '#FFE3E3',
                          color: prop.status === 'active' ? '#12B886' : '#FA5252'
                        }}>
                          {prop.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#111315', marginTop: '2px' }}>
                        {prop.price?.toLocaleString('uz-UZ')} {prop.currency}
                      </div>

                      <div style={{ fontSize: '11px', color: '#7E858E', marginTop: '2px' }}>
                        Egasi: {prop.owner?.name} ({prop.district})
                      </div>

                      {/* Expiration indicators if active */}
                      {(prop.vipEndDate || prop.topEndDate) && (
                        <div style={{ fontSize: '10.5px', color: '#B28900', fontWeight: '700', marginTop: '2px' }}>
                          {prop.isVip && `VIP tugash: ${prop.vipEndDate}`}
                          {prop.isTop && `TOP tugash: ${prop.topEndDate}`}
                        </div>
                      )}

                      {/* Admin Action Buttons */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            tg.haptic('selection');
                            onToggleVipListing(prop.id);
                          }}
                          style={{
                            background: prop.isVip ? '#FFD400' : '#F0F2F5',
                            color: '#111315',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Crown size={12} />
                          <span>VIP: {prop.isVip ? 'ON' : 'OFF'}</span>
                        </button>

                        <button
                          onClick={() => {
                            tg.haptic('selection');
                            onToggleTopListing(prop.id);
                          }}
                          style={{
                            background: prop.isTop ? '#111315' : '#F0F2F5',
                            color: prop.isTop ? '#FFD400' : '#111315',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Zap size={12} />
                          <span>TOP: {prop.isTop ? 'ON' : 'OFF'}</span>
                        </button>

                        {prop.status !== 'active' && (
                          <button
                            onClick={() => {
                              tg.haptic('success');
                              onApproveListing(prop.id);
                            }}
                            style={{
                              background: '#E6FCF5',
                              color: '#12B886',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Tasdiqlash
                          </button>
                        )}

                        <button
                          onClick={() => {
                            tg.haptic('error');
                            onDeleteListing(prop.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FA5252',
                            padding: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: BANNERLAR BOSHQUVRUVI */}
          {/* ============================================================== */}
          {activeTab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={() => setShowAddBanner(!showAddBanner)}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>{showAddBanner ? 'Formani yopish' : 'Yangi banner qo‘shish'}</span>
              </button>

              {showAddBanner && (
                <form onSubmit={handleCreateBannerSubmit} style={{ background: '#F8F9FA', padding: '14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Sarlavha"
                    className="filter-input-box"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Qisqa izoh"
                    className="filter-input-box"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Rasm URL"
                    className="filter-input-box"
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                  />
                  <button type="submit" className="btn-dark" style={{ width: '100%' }}>
                    Bannerni saqlash
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {banners.map(b => (
                  <div 
                    key={b.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E8ECEF',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={b.image}
                      alt={b.title}
                      style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#111315' }}>
                        {b.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E858E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.subtitle}
                      </div>
                      <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                        Holat: {b.active ? '🟢 Faol' : '🔴 O‘chirilgan'} {b.endDate ? `• Tugash: ${b.endDate}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => {
                          tg.haptic('selection');
                          onToggleBannerStatus(b.id);
                        }}
                        style={{
                          background: b.active ? '#E6FCF5' : '#F0F2F5',
                          color: b.active ? '#12B886' : '#7E858E',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {b.active ? 'Faol' : 'O‘chirilgan'}
                      </button>

                      <button
                        onClick={() => {
                          tg.haptic('error');
                          onDeleteBanner(b.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FA5252',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: SHIKOYATLAR */}
          {/* ============================================================== */}
          {activeTab === 'reports' && (
            <div>
              {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#7E858E', fontSize: '14px' }}>
                  Hozircha shikoyatlar kelib tushmagan.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reports.map((rep, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: '#FFF5F5',
                        border: '1px solid #FFE3E3',
                        borderRadius: '14px',
                        padding: '12px'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#FA5252', marginBottom: '4px' }}>
                        Shikoyat: {rep.reason || 'Noto‘g‘ri ma’lumot'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#111315', marginBottom: '6px' }}>
                        E’lon: "{rep.propertyTitle}"
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E858E' }}>
                        Vaqti: {rep.time || 'Bugun'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: STATISTIKA */}
          {/* ============================================================== */}
          {activeTab === 'stats' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF' }}>
                <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '600' }}>Jami e’lonlar</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#111315', marginTop: '4px' }}>
                  {listings.length}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF' }}>
                <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '600' }}>VIP & TOP faol</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#111315', marginTop: '4px' }}>
                  {listings.filter(l => l.isVip || l.isTop).length}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E8ECEF' }}>
                <div style={{ fontSize: '12px', color: '#7E858E', fontWeight: '600' }}>To‘lov so‘rovlari</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#111315', marginTop: '4px' }}>
                  {paymentRequests.length}
                </div>
              </div>

              <div style={{ background: '#FFF9DB', padding: '16px', borderRadius: '16px', border: '1px solid #FFD400' }}>
                <div style={{ fontSize: '12px', color: '#111315', fontWeight: '700' }}>Tasdiqlangan tushum</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#111315', marginTop: '4px' }}>
                  {paymentRequests.filter(p => p.status === 'approved').reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString('uz-UZ')} so‘m
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Receipt Modal Viewer */}
      {selectedReceiptPreview && (
        <div 
          className="modal-backdrop" 
          onClick={() => setSelectedReceiptPreview(null)}
          style={{ zIndex: 300, background: 'rgba(0,0,0,0.85)' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#111315' }}>To‘lov cheki / Skrinshot</span>
              <button 
                onClick={() => setSelectedReceiptPreview(null)}
                style={{ background: '#F0F2F5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>
            <img
              src={selectedReceiptPreview}
              alt="To‘lov cheki to‘liq"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
