# You & Me

Бидний жижигхэн сайт: scrapbook, photoshoot, little notes. Зүрхний тоо, хамт байсан хоног, тэмдэглэлийн самбар Neon (Postgres) database-д хадгалагдана.

## Юугаар хийгдсэн бэ

Next.js 16 (App Router) + TypeScript + Neon (`@neondatabase/serverless`).

| Хэсэг | Файл |
| --- | --- |
| Хуудас (4 хэсэг: home, scrapbook, photoshoot, notes) | `src/app/page.tsx`, `src/components/views/` |
| Товч, тоолуур, тэмдэглэл гэх мэт интерактив хэсгүүд | `src/components/` |
| Загвар | `src/styles/base.css`, `src/styles/pastel.css`, `src/styles/studio.css` |
| API (Route Handlers) | `src/app/api/hearts`, `src/app/api/since`, `src/app/api/notes` |
| Neon холболт, хүснэгт үүсгэх | `src/lib/db.ts` |
| Зураг | `public/images/` |

Database-ийн хүснэгтүүд (`counters`, `settings`, `notes`) сайтыг анх нээхэд автоматаар үүснэ.

## Компьютер дээрээ ажиллуулах

`.env.local` файлд database-ийн холбоосоо бичнэ:

```bash
DATABASE_URL="postgresql://..."
```

Дараа нь:

```bash
npm install
npm run dev
```

| Команд | Юу хийх |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Deploy

Vercel project нь энэ GitHub repo-тэй холбогдсон. `main` руу push хийхэд автоматаар deploy болно. `DATABASE_URL` нь Vercel project-ийн **Settings → Environment Variables** дотор байна.

## Мэдэх хэрэгтэй зүйлс

- Сайт бүрэн нээлттэй. Линктэй хэн ч зураг харж, тэмдэглэл бичиж, зүрх илгээж, огноо сольж чадна.
- Тэмдэглэлийг зөвхөн бичсэн browser нь устгаж чадна. Browser бүр өөрийн нууц token-той.
- Хамгийн сүүлийн 500 тэмдэглэл хадгалагдана.
- Огноо database-д байхгүй үед `src/components/views/Notes.tsx` дахь `fallback="2026-07-28"` харагдана.
