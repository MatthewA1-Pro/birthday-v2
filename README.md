# 🎂 Birthday Portal

A cinematic, luxury romantic birthday web experience — pure frontend (HTML + CSS + JS), no backend required.

---

## 📁 File Structure

```
birthday-portal/
├── index.html          ← Main HTML shell
├── styles.css          ← Full luxury design system
├── app.js              ← All logic (validation, animations, gallery, typewriter)
├── content.js          ← ✏️  YOUR CUSTOMIZATION FILE
└── assets/
    ├── images/         ← Drop your .jpg / .png / .webp files here
    └── videos/         ← Drop your .mp4 files here
```

---

## ✏️ How to Customize (content.js)

Open **`content.js`** and edit the `CONTENT` object:

| Field         | What it does                                     |
|---------------|--------------------------------------------------|
| `name`        | Her name — shown in loader greeting & hero title |
| `accessCode`  | The secret passphrase (case-insensitive)         |
| `birthday`    | Date in `MM-DD` format, e.g. `"03-23"`           |
| `messages`    | Typewriter messages shown on the main page       |
| `images`      | Paths to images in `assets/images/`              |
| `videos`      | Paths to videos in `assets/videos/`              |
| `timeline`    | Optional memory moments shown in the timeline    |

---

## 🚀 How to Open

### Option A — Direct file open (simplest)
Just double-click `index.html` and it opens in your browser.
> ⚠️ Videos may not load via `file://` — use Option B for full media support.

### Option B — Local server (recommended)
If you have Python installed:
```bash
cd birthday-portal
python -m http.server 8080
```
Then open: **http://localhost:8080**

Or with Node (if installed):
```bash
npx -y serve .
```

---

## 🔐 Access Code Logic

- Input is normalized: **lowercased**, spaces/punctuation stripped
- `"march 23"` → normalized → `"march23"`
- Matches `CONTENT.accessCode` after the same normalization
- Birthday is validated as `MM-DD` against the picker value

---

## 🎨 Design Highlights

- **Galaxy star canvas** — animated floating stars + glitter particles
- **Lexus-inspired loader** — red & blue streak animation with glitter
- **Glassmorphism gate card** — floating, glowing, blur-backdrop
- **Typewriter engine** — realistic speed variation, multi-message loop
- **Lightbox gallery** — hover + click to expand images/videos
- **Scroll-reveal timeline** — IntersectionObserver-powered fade-in
- **Fully responsive** — mobile, tablet, desktop

---

## 📸 Adding Media

1. Drop your files into `assets/images/` or `assets/videos/`
2. Add the path to `CONTENT.images` or `CONTENT.videos` in `content.js`

```js
images: [
  "assets/images/photo1.jpg",
  "assets/images/photo2.jpg",
],
videos: [
  "assets/videos/clip1.mp4"
]
```

That's it — the gallery renders automatically.

---

*Made with love ✨*
