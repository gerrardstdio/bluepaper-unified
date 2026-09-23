# bluepaper-invitation.co — Satu Server, Multi Template

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Struktur

```
src/
  components/catalogue/     # landing page
  data/templates.js         # registry card → demo URL
  pages/CataloguePage.jsx
  templates/
    template-1/             # undangan #1 (lengkap)
      components/
      data/
      hooks/
      pages/
    template-2/             # wadah kosong siap diisi
public/media/
  template-1/photo/         # ← taruh foto template-1 di sini
  template-1/music/         # ← taruh wedding.mp3 di sini
  template-2/photo/         # ← untuk template berikutnya
  template-2/music/
```

## Alur

1. Buka http://localhost:5173 (catalogue)
2. Klik **View Demo** pada card Ivory Letters
3. Masuk ke `/demo/template-1/andi-sinta`

## Foto & musik

Salin dari `template-1.rar` lama:

```bash
cp template-1/src/assets/photo/*  public/media/template-1/photo/
cp "template-1/src/assets/music/....mp3" public/media/template-1/music/wedding.mp3
```

Daftar nama file ada di `public/media/template-1/photo/README.txt`.

## Tambah template-2

1. `cp -r src/templates/template-1 src/templates/template-2`
2. `cp -r public/media/template-1 public/media/template-2`
3. Edit `src/templates/template-2/data/couple.js`
4. Ganti `/media/template-1/` → `/media/template-2/` di data backgrounds & users
5. Daftarkan di `src/data/templates.js` (isi `slug` + `coupleSlug`)
6. Tambah import + `<Route>` di `src/App.jsx`
