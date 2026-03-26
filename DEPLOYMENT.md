# Deployment útmutató

## Backend (Supabase Edge Functions)

A backend már konfigurálva van és fut a Supabase környezetben:

### API Végpontok
- Base URL: `https://qlqzaunqytidqxceirzf.supabase.co/functions/v1/make-server-136f1722`

#### Publikus végpontok:
- `GET /game-state` - Játék állapot lekérése

#### Admin végpontok:
- `POST /admin/login` - Bejelentkezés
- `POST /admin/update-score` - Csapat pontszám frissítése
- `POST /admin/update-round` - Aktuális kör frissítése
- `POST /admin/update-character` - Karakter módosítása
- `POST /admin/add-character` - Új karakter hozzáadása
- `POST /admin/delete-character` - Karakter törlése
- `POST /admin/bulk-update-status` - Tömeges állapot frissítés

### Adattárolás

A játék adatok a Supabase KV Store-ban vannak tárolva:
- `game:state` - Játék állapot (csapatok, pontok, aktuális kör)
- `game:characters` - Karakterek listája
- `admin:password` - Admin jelszó (alapértelmezett: `admin123`)

## Frontend (Statikus oldal)

### Build

```bash
# Production build
pnpm run build
```

Ez létrehozza a `/dist` mappát az optimalizált fájlokkal.

### Deployment opciók

#### Option 1: Vercel
1. Push-old a kódot GitHub-ra
2. Importáld a projektet Vercel-be
3. Automatikus deployment minden commit-nál
4. Environment változók: Nem szükségesek (Supabase info be van égetve)

#### Option 2: Netlify
1. Csatlakoztasd a GitHub repót vagy drag & drop a `/dist` mappát
2. Build command: `pnpm run build`
3. Publish directory: `dist`

#### Option 3: GitHub Pages
```bash
# Build
pnpm run build

# Deploy (GitHub Pages Actions-zel vagy manuálisan)
# A dist mappa tartalmát publikáld a gh-pages branch-re
```

#### Option 4: Bármilyen statikus hosting
Csak másold fel a `/dist` mappa tartalmát bármilyen web server-re.

## Konfiguráció

### Supabase beállítások

A következő értékek már be vannak konfigurálva:
- **Project ID**: `qlqzaunqytidqxceirzf`
- **Anon Key**: Már be van állítva a `/utils/supabase/info.tsx` fájlban

### Admin jelszó módosítása

Ha módosítani szeretnéd az admin jelszót:

1. **Backend módosítás** (ajánlott):
   - Használd a Supabase admin panelt
   - Módosítsd a `admin:password` kulcs értékét a KV Store-ban

2. **Vagy kódból**:
   - Módosítsd a `/supabase/functions/server/index.tsx` fájlban:
   ```typescript
   if (!adminPassword) {
     await kv.set("admin:password", "uj_jelszo_ide"); // <- Itt változtasd meg
   }
   ```

## Környezeti változók

Nincs szükség külön környezeti változókra a frontend számára, mivel:
- A Supabase project ID és anon key publikusan elérhető
- Ezek nem érzékeny adatok (csak publikus API hozzáféréshez)
- A valódi adatvédelem a backend-ben van (service role key soha nem kerül a frontend-be)

## Troubleshooting

### CORS hibák
Ha CORS hibákat tapasztalsz:
- Ellenőrizd, hogy a backend CORS beállításai engedélyezik a frontend domain-t
- A jelenlegi konfiguráció minden origin-t engedélyez (`origin: "*"`)

### Backend nem érhető el
1. Ellenőrizd a Supabase Edge Function státuszát
2. Nézd meg a Supabase logs-ot hibákért
3. Teszteld a health endpoint-ot: `GET /make-server-136f1722/health`

### Karakterek nem jelennek meg
1. Ellenőrizd, hogy a backend inicializálódott-e (első indításkor automatikus)
2. Nézd meg a böngésző konzolt hálózati hibákért
3. Frissítsd az oldalt

## Monitoring

### Frontend
- Böngésző DevTools Console - Hálózati hibák és logok
- Toast üzenetek - Felhasználói visszajelzések

### Backend
- Supabase Dashboard → Functions → Logs
- Minden API hívás naplózva van a `logger` middleware-rel

## Backup

Az adatok a Supabase KV Store-ban vannak. Backup készítése:

1. Exportáld az adatokat az admin panelből
2. Vagy használd a Supabase Admin API-t
3. Mentsd le a `game:state` és `game:characters` kulcsok értékeit

## Scaling

### Aktuális kapacitás
- Supabase KV Store: Korlátlan kulcsok
- Edge Functions: Automatikus scaling
- Frontend: Statikus, végtelen scaling CDN-nel

### Optimalizálási lehetőségek
Ha sok egyidejű felhasználó várható:
1. WebSocket-re váltás a 10s polling helyett (real-time frissítés)
2. Caching réteg hozzáadása (Redis)
3. CDN használata képekhez

## Security Notes

⚠️ **Fontos biztonsági megjegyzések:**

1. **Admin jelszó**: Változtasd meg az alapértelmezett jelszót production-ban
2. **Service Role Key**: SOHA ne add hozzá a frontend kódhoz
3. **Rate limiting**: Fontold meg rate limiter hozzáadását a backend-hez
4. **HTTPS**: Mindig használj HTTPS-t production-ban (automatikus Vercel/Netlify-nél)

---

A deployment után a webapp elérhető lesz és azonnal használható!
