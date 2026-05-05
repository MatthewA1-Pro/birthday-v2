// ============================================================
//  BIRTHDAY PORTAL — CONTENT CONFIGURATION
//  Edit this file to customize the experience.
// ============================================================

const CONTENT = {

  // ── Identity ───────────────────────────────────────────────
  name: "Her Name",

  // ── Access Gate ────────────────────────────────────────────
  // Case-insensitive, spaces / punctuation are stripped before compare
  accessCode: "march 23",

  // Birthday in MM-DD format (month-day only)
  birthday: "03-23",

  // ── Typewriter Messages ────────────────────────────────────
  // Each string plays one after another with a blinking cursor.
  messages: [
    "I didn't plan to meet someone like you…",
    "But somehow, you became my favorite part of everything.",
    "Every moment with you feels like a scene I never want to skip.",
    "Today is about you — and honestly, I'm just lucky to be part of your story.",
    "Happy Birthday. ✨"
  ],

  // ── Gallery Images ─────────────────────────────────────────
  // Drop your images into assets/images/ and list them here.
  images: [
    "assets/images/1.jpg",
    "assets/images/2.jpg"
  ],

  // ── Gallery Videos ─────────────────────────────────────────
  // Drop your videos into assets/videos/ and list them here.
  videos: [
    "assets/videos/1.mp4"
  ],

  // ── Memory Timeline ────────────────────────────────────────
  // Optional moments shown in a vertical timeline.
  timeline: [
    { date: "Day One",       text: "The first time I realized you were different." },
    { date: "A Little Later", text: "Laughing until it hurt — I knew then." },
    { date: "Right Now",     text: "Still the best decision I never planned." }
  ]

};
