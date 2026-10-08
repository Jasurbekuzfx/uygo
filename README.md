# UYGO — Uy topish endi oson 🏡✨

> **O‘zbekiston uchun zamonaviy ko‘chmas mulk Telegram Mini App platformasi**  
> (Apartments, houses, commercial properties, land, new buildings for SALE, RENT and DAILY RENT).

---

## 🌟 Asosiy xususiyatlar

1. **Brend va Dizayn Tizimi (Design System)**:
   - Asosiy rang: **#FFD400 (Warm Yellow)**, qo‘shimcha: **#111315 (Deep Black)**, **#FFFFFF (White)**, **#F7F8FA (Light Gray)**.
   - Zamonaviy fintech va Airbnb uslubidagi toza tipografiya (`Plus Jakarta Sans` va `Outfit`).
   - 16–24px burchak radiusi, nozik zamonaviy soyalar, toza bo‘shliqlar.

2. **Telegram Mini App Integratsiyasi**:
   - `Telegram.WebApp` SDK (`ready()`, `expand()`, `setHeaderColor()`, `HapticFeedback`).
   - Telegram foydalanuvchi ma’lumotlarini avtomatik aniqlash (`initDataUnsafe.user`).
   - Veb brauzerda ham mukammal ishlovchi mobil simulyator.

3. **Aylanma Reklama Banneri (Rotating Banner Carousel)**:
   - 4.5 soniyada avtomatik aylanish (auto-slide).
   - Sensorli ekranlar uchun surish (swipe gestures: touchStart / touchEnd).
   - Sahifalash indikatorlari (pagination dots).
   - Foydalanuvchi ushlab turganda to‘xtatib turish (pause on hover/touch).
   - Banner bosilganda tegishli e’longa yoki VIP sahifaga yo‘naltirish.

4. **Kengaytirilgan Filtr Tizimi (Filter Bottom Sheet)**:
   - **Maqsad**: Sotuv, Ijara, Kunlik.
   - **Mulk turi**: Kvartira, Uy va hovli, Yangi qurilish, Tijorat, Yer, Boshqalar.
   - **Hudud**: O‘zbekistonning barcha 12 ta viloyati va Toshkent tumanlari.
   - **Xonalar**: 1, 2, 3, 4, 5+.
   - **Narx, Maydon (m²), Qavat oralig‘i**.
   - **Ta’mirlash**: Ta’mirlangan, O‘rtacha, Ta’mirsiz.
   - **Mebel**: Mebelli, Mebelsiz.

5. **Saqlanganlar Ekran (Favorites Marketplace Tab)**:
   - Foydalanuvchi yoqtirgan e’lonlarni saqlash va boshqarish.
   - Sevimlilar soni indikatori (badge).
   - E’lonlarni to‘g‘ridan-to‘g‘ri ochish yoki saqlanganlardan chiqarish.
   - Bo‘sh holat (empty state) va asosiy sahifaga qaytish tugmasi.

6. **E’lon tafsilotlari (Property Details)**:
   - Slaydli katta foto galereya va hisoblagich (`1/4`).
   - Barcha parametrlar, tavsif, kadastr holati.
   - Mulk egasi ma’lumotlari va onlayn holati.
   - **Qo‘ng‘iroq qilish**, **Telegram orqali yozish**, **UYGO ichki chatiga yozish**.
   - Sevimlilarga saqlash, ulashish va shikoyat qilish imkoniyati.

7. **E’lon Berish (“E’lon berish” Standout Button)**:
   - 12 tagacha rasm yuklash (preview va o‘chirish bilan).
   - Barcha maydonlar: narx, valyuta (UZS / USD), joylashuv, parametrlar, aloqa.
   - Joylashdan oldin **jonli ko‘rib chiqish (Preview)** bosqichi.
   - Saqlanganda darhol ro‘yxatga qo‘shiladi va `localStorage` ga yoziladi.

8. **To‘lov Tizimi (Karta orqali to‘lov, Chek tekshiruvi va Avto-faollashuv)**:
   - **TOP, VIP va Reklama bannerlari** uchun to‘liq to‘lov jarayoni.
   - Karta ma’lumotlari (karta raqami va egasining ismi) va narxlar to‘g‘ridan-to‘g‘ri Admin paneldan boshqariladi.
   - Foydalanuvchi to‘lovni amalga oshirib, bank kvitansiyasi/chek rasmini yuklaydi.
   - So‘rov "Kutilmoqda ⏳" holatiga o‘tadi va Admin panelga yuboriladi.

9. **Xabarlar (Real-Time Chat)**:
   - Mulk egalari bilan xabarlar ro‘yxati.
   - Chat oynasida e’lon kartochkasi ko‘rinishi.
   - Xabar yuborilganda mulk egasining avtomatik javob berish simulyatsiyasi.

10. **Admin Panel**:
    - **To‘lovlar (Kvitansiyalar)**: Foydalanuvchi, Telegram ID, summa, sana va to‘lov chekini tekshirish.
    - **✅ Tasdiqlash / ❌ Rad etish**: Admin tasdiqlashi bilan TOP/VIP yoki banner avtomatik faollashadi.
    - **Avtomatik muddat nazorati**: Belgilangan muddat (masalan, 7 kun) tugagach, TOP/VIP va bannerlar avtomatik o‘chadi.
    - **To‘lov sozlamalari**: Karta raqami, karta egasi, narxlar va muddatlarni kodsiz o‘zgartirish.
    - E’lonlarni tasdiqlash, rad etish va o‘chirish.
    - Aylanma reklama bannerlarini boshqarish.
    - Shikoyatlar va platforma statistikasi.

---

## 🚀 Qanday ishga tushiriladi?

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Dasturni lokal ishga tushirish (Dev server):
```bash
npm run dev
```
Dastur `http://127.0.0.1:5173/` manzilida ishga tushadi.

### 3. Ishlab chiqarish (Production build):
```bash
npm run build
```

---

## 📱 Telegram Bot bilan ulash (BotFather orqali)

1. Telegramda [@BotFather](https://t.me/BotFather) ga kiring.
2. `/newapp` buyrug‘ini bering.
3. Botni tanlang va Mini App nomini kiriting (`UYGO`).
4. Tavsif va rasmni yuklang.
5. Mini App URL manzilini kiriting (masalan, sizning hosting havolangiz yoki ngrok/Cloudflare Tunnel havolasi).
6. Botingiz menyusida yoki to‘g‘ridan-to‘g‘ri havola bilan UYGO ochiladi!
