# Angle Explorer Lab 🧪✨
## Interactive Digital Mathematics Exploration Activity for Year 6 Pupils (Age 12)

### Overview
**Angle Explorer Lab** is an offline, interactive single-page web app designed for Year 6 primary school pupils based on the Malaysian DSKP Mathematics curriculum (Space: 6.1 Angles).

It focuses purely on free exploration—no scores, no lives, no timers, and no right/wrong penalties. Pupils drag handles, observe angle transformations, and explain what changes alongside Professor Beep, a friendly cartoon robot scientist mascot.

---

### Key Features

1. **Dark Navy Theme (`#1B2A41`)**: Designed specifically for seamless embedding inside dark Notion pages via `<iframe>`.
2. **Fully Responsive Layout**: Fits smoothly from 360px wide smartphones to 1200px desktop displays with touch-friendly controls.
3. **Kawaii Visual Style**: Vibrant rainbow accents, soft card shadows, sparkles, pulse animations, and cartoon mascot speech bubbles.
4. **Web Audio API Synthesizer**: Custom sound effects (pops, snaps, celebrations) with a dedicated sound toggle button (muted by default).
5. **Three Interactive Exploration Zones**:
   - 📐 **Zone 1: Angle Playground**:
     - Interactive 0°–180° angle dragging with pointer events.
     - Auto angle classification: Acute (green), Right angle (blue with 90° square mark), Obtuse (orange), Straight line (purple).
     - Gentle snapping at 30°, 45°, 60°, 90°, 120°, 180° with sparkle particle effects.
     - Virtual dual-scale protractor overlay toggle.
     - "Estimate first" mode to guess angle sizes with difference display.
   - 🛑 **Zone 2: Polygon Lab**:
     - Regular polygons with 3 to 8 sides (triangle, square, pentagon, hexagon, heptagon, octagon).
     - Interior angle measurement arcs (60°, 90°, 108°, 120°, ~129°, 135°).
     - Toggle to show all interior angle arcs at once.
     - Toggle background between Square Grid and Isometric Triangular Grid.
   - 🎯 **Zone 3: Construct Studio**:
     - Target angle builder (35°, 60°, 110°, 150° presets + custom input).
     - Drag ray baseline construction with virtual ruler overlay.
     - Live proximity bar ("You are X° away") and confetti celebration when within 2°.
6. **Reflection Prompts ("Think & Explain")**:
   - Rotating prompt cards asking open-ended questions in every zone.
   - Student idea text box with "Share my idea" speech bubble display (no data sent or saved).

---

### How to Run Locally

Because the application is built using plain HTML5, CSS3, and Vanilla JavaScript with **zero external image or library dependencies**, running it is instant and offline-ready:

1. Double-click `index.html` or open it in any web browser (Chrome, Safari, Firefox, Edge).
2. Alternatively, run a simple local web server:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```

---

### Hosting on GitHub Pages

To publish the app online for free using GitHub Pages:

1. Push this repository to GitHub.
2. In your repository settings, go to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.
5. Your app will be published live at `https://<username>.github.io/<repository-name>/`.

---

### How to Embed in Notion

1. In Notion, type `/iframe` or `/embed` on any page.
2. Paste your GitHub Pages live web URL (or hosted URL).
3. Resize the iframe box as needed. The dark navy background (`#1B2A41`) will blend seamlessly into Notion's dark mode.
