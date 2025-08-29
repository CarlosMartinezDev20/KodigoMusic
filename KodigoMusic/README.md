# Kodigo Music (React + Vite + SWC)

SPA inspirada en el estilo de Spotify. Incluye:
- **Login** y **Registro** con `react-hook-form` + `yup` (validaciones)
- **Rutas** con `react-router-dom` (`/`, `/register`, `/app`)
- **Búsqueda de música** con la **iTunes Search API** (previews de 30s)
- **UI** dark, acentos verde estilo Spotify, responsive

> Nota: Este proyecto guarda el usuario en `localStorage` con fines educativos (no es seguro para producción).

## Requisitos
- Node.js 18+

## Cómo ejecutar
```bash
npm install
npm run dev
```

Abre el enlace que te muestre Vite (por ejemplo http://localhost:5173).

## Construir y previsualizar
```bash
npm run build
npm run preview
```

## Deploy (Hosting gratuito)
- **Netlify**: Importa el repo o usa "Deploy site" y arrastra la carpeta `dist` que genera `npm run build`.
- **Vercel**: Importa el repo; framework Vite. Build: `npm run build`. Output: `dist`.
- **GitHub Pages**: Instala `gh-pages` y publica la carpeta `dist`.

## iTunes Search API
Se usa `https://itunes.apple.com/search?term={query}&media=music&limit=24`.  
Cada resultado incluye `previewUrl` (30s) para poder reproducir el audio en el navegador.

## Estructura
```text
kodigo-music/
├─ public/
│  └─ logo.svg
├─ src/
│  ├─ context/AuthContext.jsx
│  ├─ pages/{Login,Register,Home}.jsx
│  ├─ App.jsx, main.jsx, styles.css
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md
```

---
© 2025 – Proyecto académico.
