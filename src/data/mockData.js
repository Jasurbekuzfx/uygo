// Realistic Mock Data for UYGO Telegram Mini App

export const REGIONS = [
  'Toshkent',
  'Samarqand',
  'Farg‘ona',
  'Andijon',
  'Namangan',
  'Buxoro',
  'Xorazm',
  'Qashqadaryo',
  'Surxondaryo',
  'Jizzax',
  'Sirdaryo',
  'Navoiy'
];

export const DISTRICTS = {
  'Toshkent': [
    'Barchasi',
    'Yunusobod',
    'Chilonzor',
    'Mirzo Ulug‘bek',
    'Yakkasaroy',
    'Mirobod',
    'Yashnobod',
    'Sergeli',
    'Shayxontohur',
    'Olmazor',
    'Uchtepa',
    'Bektemir',
    'Yangihayot'
  ],
  'Samarqand': ['Barchasi', 'Samarqand shahar', 'Pastdarg‘om', 'Toyloq', 'Urgut', 'Oqdaryo'],
  'Farg‘ona': ['Barchasi', 'Farg‘ona shahar', 'Marg‘ilon', 'Qo‘qon', 'Quva', 'Oltiariq'],
  'Andijon': ['Barchasi', 'Andijon shahar', 'Asaka', 'Shahrixon', 'Xo‘jaobod'],
  'Namangan': ['Barchasi', 'Namangan shahar', 'Chortoq', 'Kosonsoy', 'Pop', 'Chust'],
  'Buxoro': ['Barchasi', 'Buxoro shahar', 'Kogon', 'G‘ijduvon', 'Vobkent']
};

export const PROPERTY_TYPES = [
  { id: 'all', name: 'Barchasi' },
  { id: 'apartment', name: 'Kvartira', icon: 'Building2' },
  { id: 'house', name: 'Uy va hovli', icon: 'Home' },
  { id: 'new_building', name: 'Yangi qurilish', icon: 'Building' },
  { id: 'commercial', name: 'Tijorat', icon: 'Store' },
  { id: 'land', name: 'Yer', icon: 'Trees' },
  { id: 'other', name: 'Boshqalar', icon: 'Boxes' }
];

export const PURPOSES = [
  { id: 'sale', label: 'Sotuv' },
  { id: 'rent', label: 'Ijara' },
  { id: 'daily', label: 'Kunlik' }
];

export const INITIAL_BANNERS = [
  {
    id: 'b1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    title: 'Orzuingizdagi uy sizga yaqin',
    subtitle: 'Sotuv, ijara, kunlik — barchasi bir joyda.',
    badge: 'UYGO Tanlovi',
    button: 'Ko‘rib chiqish',
    link: 'search?type=apartment',
    priority: 1,
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'b2',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    title: 'Yangi uylar sizni kutmoqda',
    subtitle: 'Eng yaxshi variantlarni UYGO’dan toping.',
    badge: 'Toshkent markazi',
    button: 'Batafsil',
    link: 'search?purpose=rent',
    priority: 2,
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'b3',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    title: 'E’loningizni ko‘proq odam ko‘rsin',
    subtitle: 'UYGO VIP bilan e’loningizni yuqoriga chiqaring.',
    badge: 'VIP Imkoniyat',
    button: 'VIP faollashtirish',
    link: 'action:vip_info',
    priority: 3,
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'b4',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    title: 'Yangi qurilishlar',
    subtitle: 'Eng so‘nggi loyihalarni bir joyda ko‘ring.',
    badge: '0% Bosh to‘lov',
    button: 'Loyihalar',
    link: 'search?type=new_building',
    priority: 4,
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  }
];

// Clean default: starts with 0 listings in production
export const INITIAL_PROPERTIES = [];

// Sample template properties for admin testing / reset if needed
export const SAMPLE_TEST_PROPERTIES = [
  {
    id: 'prop-top-1',
    ownerId: 'owner-top-1',
    title: 'Oybek metrosida kunlik shinam uy',
    description: 'Oybek metrosi yaqinida joylashgan premium darajadagi kunlik xonadon. Toza choyshablar, Smart TV, Wi-Fi, konditsioner va barcha sharoitlar muhayyo.',
    type: 'apartment',
    purpose: 'daily',
    price: 450000,
    priceUsd: 35,
    currency: 'UZS',
    rooms: 1,
    area: 42,
    floor: 6,
    totalFloors: 9,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Mirobod',
    address: 'Oybek ko‘chasi, 14-uy',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: true,
    createdAt: '2026-10-06T15:00:00Z',
    views: 890,
    status: 'active',
    owner: {
      id: 'owner-top-1',
      name: 'Bobur',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: '+998 90 111 22 33',
      tgUsername: '@bobur_oybek',
      onlineStatus: 'Hozir tarmoqda'
    }
  },
  {
    id: 'prop-top-2',
    ownerId: 'owner-top-2',
    title: 'Sergeli Yangi Hayotda yangi xonadon',
    description: 'Sergeli Yangi Hayot massivida joylashgan yangi qurilgan zamonaviy xonadon. Kadastr hujjatlari tayyor, keng panoramali derazalar, 24 soat qo‘riqlanadigan hovli.',
    type: 'apartment',
    purpose: 'sale',
    price: 627200000,
    priceUsd: 49000,
    currency: 'USD',
    rooms: 3,
    area: 84,
    floor: 8,
    totalFloors: 12,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelsiz',
    region: 'Toshkent',
    district: 'Sergeli',
    address: 'Yangi Hayot massivi, 5-bino',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: true,
    createdAt: '2026-10-06T14:45:00Z',
    views: 1120,
    status: 'active',
    owner: {
      id: 'owner-top-2',
      name: 'Nilufar',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+998 93 456 78 90',
      tgUsername: '@nilufar_realty',
      onlineStatus: '10 daqiqa oldin'
    }
  },
  {
    id: 'prop-1',
    ownerId: 'owner-101',
    title: 'Yunusobod 2 xona shinam kvartira',
    description: 'Yunusobod 4-mavzeda joylashgan yangi ta’mirdan chiqqan shinam xonadon. Barcha maishiy texnikalar, konditsioner, kir yuvish mashinasi, Smart TV bor. Metro bekatiga piyoda 5 daqiqa. Maktab, bog‘cha, bozor yaqinida. Faqat oila yoki uzoq muddatga yashovchilar uchun beriladi.',
    type: 'apartment',
    purpose: 'rent',
    price: 5000000,
    priceUsd: 390,
    currency: 'UZS',
    rooms: 2,
    area: 60,
    floor: 3,
    totalFloors: 9,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Yunusobod',
    address: '4-mavze, Amir Temur ko‘chasi 45',
    latitude: 41.3625,
    longitude: 69.2882,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: true,
    isTop: true,
    createdAt: '2026-10-05T10:30:00Z',
    views: 1420,
    status: 'active',
    owner: {
      id: 'owner-101',
      name: 'Sardor Rahimiy',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+998 90 910 11 22',
      tgUsername: '@sardor_rahimiy',
      onlineStatus: 'Hozir tarmoqda'
    }
  },
  {
    id: 'prop-2',
    ownerId: 'owner-102',
    title: 'Chilonzor yangi premium uy',
    description: 'Chilonzor 9-mavze, metro Chilonzor yaqinida. Yevro remont qilingan, avtomobil uchun avtoturargoh, 24/7 qo‘riqlash tizimi. Keng yashash xonasi, panoramali derazalar. Barcha qulayliklar mavjud.',
    type: 'apartment',
    purpose: 'sale',
    price: 980000000,
    priceUsd: 76500,
    currency: 'USD',
    rooms: 3,
    area: 84,
    floor: 5,
    totalFloors: 12,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Chilonzor',
    address: 'Chilonzor 9-mavze, Bunyodkor shoh ko‘chasi',
    latitude: 41.2783,
    longitude: 69.2081,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: true,
    isTop: false,
    createdAt: '2026-10-06T09:15:00Z',
    views: 890,
    status: 'active',
    owner: {
      id: 'owner-102',
      name: 'Nodira Karimova',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+998 93 543 21 00',
      tgUsername: '@nodira_realty',
      onlineStatus: '15 daqiqa oldin'
    }
  },
  {
    id: 'prop-3',
    ownerId: 'owner-103',
    title: 'Sergeli 3 xona shinam xonadon',
    description: 'Sergeli 7-bekat ro‘parasida, yangi qurilgan zamonaviy turar-joy majmuasi. Bolalar maydonchasi, keng liftlar, toza havo. Hujjatlari to‘liq, ipotekaga ham beriladi.',
    type: 'apartment',
    purpose: 'sale',
    price: 720000000,
    priceUsd: 56000,
    currency: 'USD',
    rooms: 3,
    area: 72,
    floor: 4,
    totalFloors: 9,
    renovation: 'O‘rtacha',
    furniture: 'Mebelsiz',
    region: 'Toshkent',
    district: 'Sergeli',
    address: 'Yangisergeli ko‘chasi 18',
    latitude: 41.2267,
    longitude: 69.2215,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: true,
    createdAt: '2026-10-06T14:20:00Z',
    views: 654,
    status: 'active',
    owner: {
      id: 'owner-103',
      name: 'Rustam Aliyev',
      role: 'Rieltor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+998 97 777 88 99',
      tgUsername: '@rustam_broker',
      onlineStatus: 'Hozir tarmoqda'
    }
  },
  {
    id: 'prop-4',
    ownerId: 'owner-104',
    title: 'Mirzo Ulug‘bek hovli uy, 6 sotix',
    description: 'Mirzo Ulug‘bek tumani, Qorasuv mavzesida 2 qavatli hashamatli hovli. Hovlida mevali daraxtlar, tapchan, basseyn, yozgi oshxona, 2 ta avtomobil uchun garaj. Barcha xonalar qishki va yozgi isitish tizimiga ega.',
    type: 'house',
    purpose: 'sale',
    price: 2500000000,
    priceUsd: 195000,
    currency: 'USD',
    rooms: 6,
    area: 280,
    floor: 2,
    totalFloors: 2,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Mirzo Ulug‘bek',
    address: 'Buyuk Ipak Yo‘li ko‘chasi 112',
    latitude: 41.3341,
    longitude: 69.3421,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: true,
    isTop: true,
    createdAt: '2026-10-04T08:00:00Z',
    views: 2150,
    status: 'active',
    owner: {
      id: 'owner-104',
      name: 'Botir Zokirov',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      phone: '+998 99 800 12 34',
      tgUsername: '@botir_realestate',
      onlineStatus: '1 soat oldin'
    }
  },
  {
    id: 'prop-5',
    ownerId: 'owner-105',
    title: 'Mirobod markazida kunlik lyuks xonadon',
    description: 'Oybek metrosi yonida, Grand Mir Hotel yaqinida joylashgan premium lyuks kvartira. Sayyohlar, mehmonlar va xizmat safari bilan kelganlar uchun ideal. Tezkor Wi-Fi, toza choyshablar, kofe mashinasi, to‘liq qulaylik.',
    type: 'apartment',
    purpose: 'daily',
    price: 600000,
    priceUsd: 48,
    currency: 'UZS',
    rooms: 2,
    area: 55,
    floor: 6,
    totalFloors: 10,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Mirobod',
    address: 'Shota Rustaveli ko‘chasi 24',
    latitude: 41.2912,
    longitude: 69.2678,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: true,
    createdAt: '2026-10-06T11:45:00Z',
    views: 430,
    status: 'active',
    owner: {
      id: 'owner-105',
      name: 'Dilnoza Axmedova',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+998 94 650 40 30',
      tgUsername: '@dilnoza_daily',
      onlineStatus: 'Hozir tarmoqda'
    }
  },
  {
    id: 'prop-6',
    ownerId: 'owner-106',
    title: 'Samarqand markazida yangi kvartira',
    description: 'Samarqand shahar Registon maydoniga yaqin hududda yangi qurilgan zamonaviy uy. Qulay joylashuv, shaxsiy isitish tizimi, barcha qulayliklar.',
    type: 'apartment',
    purpose: 'sale',
    price: 640000000,
    priceUsd: 50000,
    currency: 'USD',
    rooms: 2,
    area: 65,
    floor: 3,
    totalFloors: 7,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Samarqand',
    district: 'Samarqand shahar',
    address: 'Universitet xiyoboni 12',
    latitude: 39.6542,
    longitude: 66.9597,
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: false,
    createdAt: '2026-10-05T15:10:00Z',
    views: 310,
    status: 'active',
    owner: {
      id: 'owner-106',
      name: 'Akmal Samatov',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      phone: '+998 91 555 44 33',
      tgUsername: '@akmal_sam',
      onlineStatus: '2 soat oldin'
    }
  },
  {
    id: 'prop-7',
    ownerId: 'owner-107',
    title: 'Yakkasaroyda ofis va tijorat maydoni',
    description: 'Birinchi qavatda joylashgan alohida kirish eshigiga ega qulay tijorat maydoni. Bank filiali, IT kompaniya, stomatologiya yoki o‘quv markazi uchun tayyor sharoit. Katta avtoturargoh mavjud.',
    type: 'commercial',
    purpose: 'rent',
    price: 18000000,
    priceUsd: 1400,
    currency: 'UZS',
    rooms: 4,
    area: 120,
    floor: 1,
    totalFloors: 8,
    renovation: 'Ta’mirlangan',
    furniture: 'Mebelli',
    region: 'Toshkent',
    district: 'Yakkasaroy',
    address: 'Shota Rustaveli ko‘chasi 78',
    latitude: 41.2845,
    longitude: 69.2534,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: true,
    isTop: true,
    createdAt: '2026-10-06T16:00:00Z',
    views: 740,
    status: 'active',
    owner: {
      id: 'owner-107',
      name: 'Jasur Shokirov',
      role: 'Rieltor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      phone: '+998 90 321 00 11',
      tgUsername: '@jasur_commercial',
      onlineStatus: 'Hozir tarmoqda'
    }
  },
  {
    id: 'prop-8',
    ownerId: 'owner-108',
    title: 'Farg‘ona markazida uy va hovli',
    description: 'Farg‘ona shahar markazida sokin va yashil mahalla. 4 sotix yer, 5 xona, keng ayvon, gaz, suv, elektr energiyasi uzluksiz. Hujjatlari toza.',
    type: 'house',
    purpose: 'sale',
    price: 780000000,
    priceUsd: 61000,
    currency: 'USD',
    rooms: 5,
    area: 160,
    floor: 1,
    totalFloors: 1,
    renovation: 'O‘rtacha',
    furniture: 'Mebelli',
    region: 'Farg‘ona',
    district: 'Farg‘ona shahar',
    address: 'Al-Farg‘oniy ko‘chasi 32',
    latitude: 40.3842,
    longitude: 71.7843,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    isVip: false,
    isTop: true,
    createdAt: '2026-10-04T12:00:00Z',
    views: 520,
    status: 'active',
    owner: {
      id: 'owner-108',
      name: 'Mahmudjon Oripov',
      role: 'Egasi',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      phone: '+998 93 111 22 33',
      tgUsername: '@mahmud_fergana',
      onlineStatus: 'Kecha'
    }
  }
];

export const DEFAULT_BILLING_SETTINGS = {
  cardNumber: '8600 4910 2345 6789',
  cardHolder: 'UYGO ADMIN',
  topPrice: 30000,
  topDays: 7,
  vipPrice: 70000,
  vipDays: 7,
  bannerPrice: 120000,
  bannerDays: 7
};

export const INITIAL_PAYMENT_REQUESTS = [
  {
    id: 'pay-sample-1',
    userId: 'user-demo-1',
    userName: 'Akmal Raximov',
    userTg: '@akmal_realtor',
    packageType: 'TOP',
    packageName: 'TOP xizmati (7 kun)',
    amount: 30000,
    amountFormatted: '30 000 so‘m',
    durationDays: 7,
    createdAt: '2026-10-08T11:20:00Z',
    dateFormatted: '08.10.2026 11:20',
    receiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    targetType: 'listing',
    targetListingId: 'prop-2',
    targetListingTitle: 'Chilonzor yangi premium uy (3 xona)'
  },
  {
    id: 'pay-sample-2',
    userId: 'user-demo-2',
    userName: 'Sardor Bek',
    userTg: '@sardor_estate',
    packageType: 'VIP',
    packageName: 'VIP xizmati (7 kun)',
    amount: 70000,
    amountFormatted: '70 000 so‘m',
    durationDays: 7,
    createdAt: '2026-10-08T10:15:00Z',
    dateFormatted: '08.10.2026 10:15',
    receiptImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    targetType: 'listing',
    targetListingId: 'prop-top-1',
    targetListingTitle: 'Toshkent Siti Boulevard 3 xona',
    startDate: '08.10.2026',
    endDate: '15.10.2026'
  }
];

export function formatDateDDMMYYYY(date = new Date()) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function addDaysToDateStr(days = 7, fromDate = new Date()) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + Number(days));
  return formatDateDDMMYYYY(d);
}

export function isDateExpired(dateStr) {
  if (!dateStr) return false;
  if (dateStr.includes('.')) {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
      return new Date() > expDate;
    }
  }
  return new Date() > new Date(dateStr);
}

export const VIP_PACKAGES = [
  {
    id: 'top-7',
    type: 'TOP',
    name: 'TOP 7 kun',
    days: 7,
    price: 49000,
    priceFormatted: '49 000 so‘m',
    badge: 'TOP',
    features: [
      'Qidiruvda yuqori o‘rinda turadi',
      'Sariq TOP nishoni',
      '3 baravar ko‘proq ko‘rishlar',
      '7 kun davomida faol'
    ],
    popular: false
  },
  {
    id: 'top-14',
    type: 'TOP',
    name: 'TOP 14 kun',
    days: 14,
    price: 89000,
    priceFormatted: '89 000 so‘m',
    badge: 'TOP',
    features: [
      'Qidiruvda barqaror yuqori o‘rin',
      'Sariq TOP nishoni',
      '14 kun davomida doimiy e’tibor',
      'Telegram kanalga avto-post'
    ],
    popular: false
  },
  {
    id: 'vip-7',
    type: 'VIP',
    name: 'VIP 7 kun',
    days: 7,
    price: 119000,
    priceFormatted: '119 000 so‘m',
    badge: 'VIP',
    features: [
      'Bosh sahifaning "VIP e’lonlar" bo‘limida',
      'Oltin VIP maxsus nishoni va ramkasi',
      'Eng yuqori ustuvorlik',
      'Telegram bot orqali bildirishnomalar',
      '5 baravar tezroq xaridor topish'
    ],
    popular: true
  },
  {
    id: 'vip-30',
    type: 'VIP',
    name: 'VIP 30 kun',
    days: 30,
    price: 289000,
    priceFormatted: '289 000 so‘m',
    badge: 'VIP PRO',
    features: [
      'To‘liq 1 oy VIP imtiyoz',
      'Bosh sahifa va qidiruvda doimiy birinchi',
      'Shaxsiy menejer qo‘llab-quvvatlashi',
      'Sotuv kafolati darajasi',
      'Eng katta tejamkorlik (-35%)'
    ],
    popular: false
  }
];

export const INITIAL_CONVERSATIONS = [];

export const SAMPLE_TEST_CONVERSATIONS = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    propertyTitle: 'Yunusobod 2 xona shinam kvartira',
    propertyPrice: '5 000 000 so‘m/oy',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=80',
    participant: {
      id: 'owner-101',
      name: 'Sardor Rahimiy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'Hozir tarmoqda',
      phone: '+998 90 910 11 22'
    },
    lastMessage: 'Assalomu alaykum, ertaga soat 15:00 da ko‘rsatishim mumkin.',
    lastTime: '15:42',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'current-user',
        text: 'Assalomu alaykum, Sardor aka! Kvartira hali ijaraga berilmadimi?',
        time: '15:30',
        isMine: true
      },
      {
        id: 'm2',
        senderId: 'owner-101',
        text: 'Va alaykum assalom! Yo‘q, hali bo‘sh. Qachon ko‘rmoqchisiz?',
        time: '15:35',
        isMine: false
      },
      {
        id: 'm3',
        senderId: 'current-user',
        text: 'Ertaga tushdan keyin vaqtingiz bormi?',
        time: '15:38',
        isMine: true
      },
      {
        id: 'm4',
        senderId: 'owner-101',
        text: 'Assalomu alaykum, ertaga soat 15:00 da ko‘rsatishim mumkin.',
        time: '15:42',
        isMine: false
      }
    ]
  },
  {
    id: 'conv-2',
    propertyId: 'prop-2',
    propertyTitle: 'Chilonzor yangi premium uy',
    propertyPrice: '$76 500',
    propertyImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&auto=format&fit=crop&q=80',
    participant: {
      id: 'owner-102',
      name: 'Nodira Karimova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      onlineStatus: '15 daqiqa oldin',
      phone: '+998 93 543 21 00'
    },
    lastMessage: 'Ipotekaga beriladi, hujjatlari kadastr bilan joyida.',
    lastTime: 'Kecha',
    unreadCount: 0,
    messages: [
      {
        id: 'm201',
        senderId: 'current-user',
        text: 'Assalomu alaykum! Narxini yana ozgina kelishtirib berasizmi?',
        time: 'Kecha 18:10',
        isMine: true
      },
      {
        id: 'm202',
        senderId: 'owner-102',
        text: 'Ipotekaga beriladi, hujjatlari kadastr bilan joyida. Real xaridor bilan joyida gaplashamiz.',
        time: 'Kecha 18:25',
        isMine: false
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'UYGO ga xush kelibsiz! 🏡',
    body: 'O‘zbekiston bo‘ylab eng qulay ko‘chmas mulk platformasi. E’lon bering yoki o‘zingizga mos uyni toping.',
    time: 'Bugun',
    unread: true,
    type: 'system'
  }
];
