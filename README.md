# You & Me

Бидний жижигхэн сайт: scrapbook, photoshoot, little notes. Зүрхний тоо, хамт байсан хоног, тэмдэглэлийн самбар Neon (Postgres) database-д хадгалагдана.

## Юугаар хийгдсэн бэ

Framework байхгүй. Энгийн HTML, CSS, JavaScript дээр Vercel Functions болон Neon нэмсэн.

| Хэсэг | Файл |
| --- | --- |
| Хуудас (4 хэсэг: home, scrapbook, photoshoot, notes) | `index.html` |
| Загвар | `css/base.css`, `css/pastel.css`, `css/studio.css` |
| Хуудасны код | `js/main.js` |
| API (Vercel Functions, Node.js) | `api/hearts.js`, `api/since.js`, `api/notes.js` |
| Neon холболт, хүснэгт үүсгэх | `api/_db.js` |
| Зураг | `images/` |

Database-ийн хүснэгтүүд (`counters`, `settings`, `notes`) сайтыг анх нээхэд автоматаар үүснэ.

## Deploy хийх алхам

### 1. GitHub руу push хийх

GitHub дээр шинэ хоосон repo үүсгэнэ (жишээ нь `you-and-me`). Дараа нь энэ хавтас дотор:

```bash
git init
git add .
git commit -m "You & Me site"
git branch -M main
git remote add origin https://github.com/<таны-нэр>/you-and-me.git
git push -u origin main
```

### 2. Vercel дээр import хийх

1. vercel.com → **Add New… → Project** → GitHub repo-гоо **Import**.
2. **Framework Preset**: `Other`. Build Command, Output Directory-г хоосон үлдээнэ.
3. **Deploy** дарна. Энэ үед сайт ажиллана, гэхдээ database холбогдоогүй учир тэмдэглэлийн самбар унтсан байна.

### 3. Neon database холбох

1. Vercel дээрх project → **Storage** таб → **Create Database** → **Neon**.
2. Бүх орчинд (Production, Preview, Development) холбоно. Энэ нь `DATABASE_URL` хувьсагчийг автоматаар нэмнэ.
3. **Deployments** → хамгийн сүүлийн deploy → **⋯ → Redeploy**. Шинэ хувьсагч redeploy хийсний дараа л ажиллана.

Сайтаа нээгээд notes хэсэгт тэмдэглэл бичиж үзээрэй.

## Компьютер дээрээ database-тэй ажиллуулах

```bash
npm install
vercel link
vercel env pull .env.local
vercel dev
```

Database-гүй харах бол `index.html`-ийг шууд нээхэд болно. Тэр үед зүрх, огноо зөвхөн тухайн browser-т хадгалагдаж, тэмдэглэлийн самбар нуугдана.

## Мэдэх хэрэгтэй зүйлс

- Сайт бүрэн нээлттэй. Линктэй хэн ч зураг харж, тэмдэглэл бичиж, зүрх илгээж, огноо сольж чадна.
- Тэмдэглэлийг зөвхөн бичсэн browser нь устгаж чадна. Browser бүр өөрийн нууц token-той.
- Хамгийн сүүлийн 500 тэмдэглэл хадгалагдана.
- Огноо database-д байхгүй үед `index.html` дахь `data-since="2026-07-28"` харагдана.
# Muunuu-3
