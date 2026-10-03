# 🔍 Angles Around Us — Angle Detective Town

An interactive "Real-World Link" geometry exploration web application designed for **Year 6 primary school pupils (Age 12)** aligned with **Malaysian DSKP Year 6 Mathematics (Space - 6.1 Angles)**.

---

## 🌟 Features Overview

- **Free Exploration Activity**: No scores, timers, lives, or wrong answers. Pure discovery learning!
- **Malaysian DSKP 6.1 Standard**: Focuses on angles in real life up to **180°** (acute, right, obtuse, straight). Angles always measure the smaller angle between rays (0° to 180°).
- **Embedded Notion Compatibility**: Dark navy theme (`#1B2A41`) designed to seamlessly blend into dark Notion pages. Fully responsive for viewports from `360px` to `1200px`.
- **Kawaii Detective Robot Mascot**: Cute inline SVG robot mascot guiding pupils with friendly speech bubbles.
- **Offline & Framework-Free**: Built entirely with **plain HTML, CSS, and Vanilla JavaScript** (no external libraries or image files).
- **Web Audio API**: Built-in sound effects synthesizer (click, tick, turn, alert, discovery) with mute toggle (muted by default).
- **Touch & Pen Ready**: Big touch-friendly drag handles using Pointer Events (`touch-action: none` prevents page scrolling).

---

## 5 Colourful Exploration Places

1. **⏰ Clock Tower**
   - Draggable analogue clock hour and minute hands linked at realistic ratios (minute = 6°/min, hour = 0.5°/min).
   - Dynamic angle arc display, digital time readout, angle classification (acute, right, obtuse, straight line).
   - Quick jump buttons for 3:00, 6:00, 9:00, and 12:00.

2. **🏠 Roof Builder**
   - Cartoon house with draggable triangular roof peak handle (60° to 150°).
   - Dynamic weather visuals: steep roofs slide rain drops off quickly, while flat roofs form puddles.

3. **🚪 Door Safety**
   - Top-view room layout with a door swinging from 0° to 180°.
   - Draggable person mascot. If the door swing sector touches the person, it glows red with a safety warning.

4. **🤖 Game Turns**
   - Grid game board with a cute character turning on the spot (45°, 90°, 180° left or right) and moving forward.
   - Shows turn angle arcs and logs move history. Star target navigation with no failure state.

5. **🔎 Angle Hunt**
   - Colourful park scene with 7 tappable hotspots (swing, laptop, scissors, pizza, ladder, ramp, signpost).
   - Detailed zoom modal displaying angle arc, degree measure, angle classification, and simple fun facts.
   - Gentle discovery progress meter ("Found 7 of 7 angles").

6. **🤔 Reflection Modules**
   - "Think and Explain" prompts with text boxes and a "Share my idea 💡" button that displays thoughts in speech bubbles without saving or transmitting personal data.

---

## 🚀 How to Run Locally

Because this application relies solely on plain HTML, CSS, and Vanilla JavaScript, running it is effortless:

### Method 1: Direct File Opening
1. Download or clone this repository.
2. Double-click `index.html` (or right-click and select **Open with Browser**) in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Local HTTP Static Server
If you prefer running a local HTTP server (useful for iframe testing):
```bash
# Using Node.js npx
npx serve .

# Using Python
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 🌐 How to Host on GitHub Pages

You can easily host this project for free on GitHub Pages:

1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** ➔ **Pages**.
3. Under **Build and deployment**:
   - Set **Source** to `Deploy from a branch`.
   - Select the `main` (or `master`) branch and `/ (root)` folder.
   - Click **Save**.
4. After a minute, GitHub Pages will provide a live public URL (e.g., `https://your-username.github.io/repository-name/`).
5. You can now embed this URL into any **Notion** page using the `/iframe` or `/embed` block!

---

## 📄 License & Attribution
Designed for Primary Mathematics Education (Year 6 DSKP Space Standard 6.1). Open for educational and classroom use.
