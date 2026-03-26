# Teamverseny - Hunting Game Tracker

Egy teljes funkcionalitású, mobil-első webhely egy többnapos vadászjáték eredményeinek nyomon követésére.

## 🎯 Funkcionalitás

### Publikus nézet (bejelentkezés nélkül)
- **Élő eredménytábla**: 4 csapat (Fekete, Fehér, Piros, Kék) pontszámainak megjelenítése rangsorolva
- **Karakter rács**: Mind az 49 karakter vizuális megjelenítése 3 állapottal:
  - 🔒 **Zárolva**: Még nem elérhető karakterek (szürkén megjelenítve)
  - 🎯 **Célpont**: Az aktuális napra célba vehető karakterek (kiemelt)
  - ❌ **Kiesett**: Már eliminált karakterek (átlátszó, áthúzott)
- **Aktuális kör**: Az aktuális nap (1-5) prominens megjelenítése
- **Mai célpontok**: A nap során célba vehető karakterek külön megjelenítése
- **Ma kiesett**: Az aktuális napon eliminált karakterek külön megjelenítése
- **Automatikus frissítés**: 10 másodpercenként frissül az állapot

### Admin nézet (jelszóval védett)
- **Bejelentkezés**: Egyszerű jelszavas védelem
  - Alapértelmezett jelszó: `admin123`
- **Pontszámok kezelése**: Csapatonkénti pontszámok manuális módosítása
- **Körök kezelése**: Az aktuális kör (nap) beállítása (1-5)
- **Karakterek kezelése**:
  - Tömeges állapot frissítés (kijelölés után)
  - Karakterek célponttá tétele
  - Karakterek kiesettnek jelölése
  - Karakterek zárolása
  - Karakter hozzáadása (név és opcionális kép URL)
  - Karakter szerkesztése (név, kép URL)
  - Karakter törlése
- **Azonnali szinkronizálás**: Minden változás azonnal megjelenik a publikus nézetben

## 🎨 Design

- **Téma**: Minimalista "vadász" stílus
- **Színek**: Föld tónusok, sötét zöldek, barnák
- **Mobil-első**: Teljesen reszponzív layout
- **Sima átmenetek**: Állapotváltozások animálva
- **Magyar nyelv**: Minden UI szöveg magyarul

## 🚀 Gyors kezdés

### Előfeltételek
A projekt már be van konfigurálva és készen áll a használatra. A backend automatikusan inicializálódik 49 karakterrel.

### Telepítés és futtatás
```bash
# Csomagok telepítése (ha szükséges)
pnpm install

# Fejlesztői szerver indítása
pnpm run dev
```

### Használat

1. **Publikus nézet**: Nyisd meg a főoldalt (`/`) a játék állapotának megtekintéséhez
2. **Admin panel**: Kattints a fogaskerék ikonra a jobb felső sarokban, vagy menj a `/admin` útvonalra
3. **Bejelentkezés**: Használd a `admin123` jelszót (vagy amit később beállítasz)
4. **Karakterek kezelése**: 
   - Válaszd ki a "Karakterek" fület
   - Kattints a karakterekre a kijelöléshez
   - Használd a tömeges művelet gombokat (Célponttá tét, Kiesettnek jelölés, Zárolás)
5. **Pontszámok frissítése**: A "Pontszámok" fülön módosítsd a csapatok pontjait
6. **Új karakter hozzáadása**: A "Kezelés" fülön adj hozzá új karaktereket

## 📁 Projekt struktúra

```
/src/app/
  ├── components/
  │   ├── CharacterCard.tsx      # Karakter kártya komponens
  │   ├── Scoreboard.tsx          # Eredménytábla komponens
  │   └── ui/                     # UI komponensek (shadcn/ui)
  ├── pages/
  │   ├── PublicView.tsx          # Publikus nézet
  │   └── AdminView.tsx           # Admin panel
  ├── api.ts                      # API hívások
  ├── types.ts                    # TypeScript típusok
  ├── routes.ts                   # Routing konfiguráció
  └── App.tsx                     # Fő alkalmazás komponens

/supabase/functions/server/
  └── index.tsx                   # Backend API (Hono + Supabase KV)
```

## 🗄️ Adatstruktúra

### Játék állapot
```typescript
{
  currentRound: number,           // 1-5
  teams: {
    black: { name, score, color },
    white: { name, score, color },
    red: { name, score, color },
    blue: { name, score, color }
  }
}
```

### Karakterek
```typescript
{
  id: string,
  name: string,
  imageUrl: string,
  status: "unavailable" | "targetable" | "eliminated",
  eliminatedDay: number | null
}
```

## 🔧 Testreszabás

### Jelszó módosítása
A backend automatikusan inicializálja az admin jelszót. Ha módosítani szeretnéd, használd a Supabase admin panelt a `admin:password` kulcs módosításához a KV store-ban.

### Karakterek képeinek cseréje
1. Az admin panelben válaszd ki a karaktert
2. Kattints a szerkesztés gombra (ceruza ikon)
3. Adj meg egy új kép URL-t
4. Mentsd el

Vagy programozottan módosíthatod a `/supabase/functions/server/index.tsx` fájlban az inicializálási logikát.

## 🌐 Deployment

A projekt Vite-tal van konfigurálva és könnyen deployolható bármilyen statikus hosting szolgáltatásra:

- **Vercel**: Automatikus deployment GitHub repository csatlakoztatásával
- **Netlify**: Drag & drop vagy Git integráció
- **GitHub Pages**: Build script futtatása és `/dist` mappa publikálása

A backend már a Supabase Edge Functions-on fut, így nincs szükség külön backend hosting-ra.

## 🎮 Játékfolyamat példa

1. **1. nap**: Admin kijelöl 8-10 karaktert "célponttá"
2. Játékosok látják a célpontokat a publikus nézetben
3. Admin jelöli meg, melyik karaktereket sikerült "elkapni" (eliminált)
4. Pontok hozzáadása a csapatokhoz
5. **2. nap**: Új célpontok kijelölése, folyamat ismétlése
6. **5. nap**: Játék vége, végeredmény megtekintése

## 🔒 Biztonsági megjegyzések

- Az admin jelszó egyszerű védelem, nem alkalmas éles, bizalmas adatok védelmére
- Figma Make környezetben fut, nem gyűjt személyes adatokat
- Prototípus és játék célokra tökéletes

## 📱 Reszponzív breakpointok

- **Mobil**: < 640px (2 oszlop)
- **Tablet**: 640px - 1024px (3-4 oszlop)
- **Desktop**: > 1024px (5-7 oszlop)

## 🎨 Szín paletta

- **Fekete csapat**: `#1a1a1a`
- **Fehér csapat**: `#ffffff`
- **Piros csapat**: `#dc2626`
- **Kék csapat**: `#2563eb`
- **Célpont kiemelés**: `#d97706` (amber)
- **Kiesett állapot**: `#dc2626` (red)

## 💡 Tippek

- Használj **Ctrl/Cmd + Click**-et több karakter gyors kijelöléséhez
- A publikus nézet automatikusan frissül, így mindig aktuális adatokat látsz
- Mobil eszközön is teljes funkcionalitás elérhető
- A karakterek képeit automatikusan generáljuk, de saját URL-eket is megadhatsz

---

Készítette: Figma Make AI Assistant
Verzió: 1.0.0
Utolsó frissítés: 2026. március
