# 🤖⚡ Tech City Angle Quest
## Interactive Digital Mathematics Web Game (Malaysian DSKP Year 6 Mathematics • Space 6.1 Angles)

Welcome to **Tech City Angle Quest**, a fun, vibrant, colorful single-page offline web game built specifically for Year 6 primary school pupils (age 12) to master angles and regular polygons!

---

### 📚 Curriculum Mapping (Malaysian DSKP Year 6 Mathematics)
- **Content Standard:** 6.1 Sudut (Angles & Polygons)
- **Learning Standard 6.1.1:** Regular polygons with up to eight sides drawn on a square grid or triangular grid, and measuring their interior angles.
- **Learning Standard 6.1.2:** Constructing angles based on given angle values.
- **Mathematical Rules Applied:**
  - Angles up to **180° ONLY** (no reflex angles used anywhere).
  - Accurate regular polygon interior angle values:
    - Equilateral Triangle (3 sides) = **60°**
    - Square (4 sides) = **90°**
    - Regular Pentagon (5 sides) = **108°**
    - Regular Hexagon (6 sides) = **120°**
    - Regular Heptagon (7 sides) ≈ **128.6°**
    - Regular Octagon (8 sides) = **135°**

---

### 🎮 Game Features & Structure
- **Mascot Guide:** Gizmo the Tech Robot 🤖 accompanies learners on every screen with speech bubbles, hints, and encouraging feedback ("Nice try, let's fix the glitch!").
- **9 Kawaii Tech Characters:** Cute smiling inline SVG characters including Robot, Drone, Smartphone, Rocket, Satellite, Laptop, VR Headset, Electric Car, and Smartwatch.
- **6 Progression Levels + Mega Glitch Boss Battle:**
  1. **Robot Factory (Polygons):** Match regular polygon pictures (3 to 8 sides) to names, side counts, and interior angles.
  2. **Smartphone Screen (Angle Types):** Sort tech angles into Acute (<90°), Right (90°), Obtuse (90°-180°), and Straight (180°).
  3. **Drone Pilot (Measuring Angles):** Interactive virtual protractor with dual scales (inner & outer 0°–180°).
  4. **Code Builder (Constructing Angles):** Drag angle arm to construct target angles within ±3° accuracy.
  5. **Satellite Grid (Polygons on a Grid):** Plot vertices on Square or Isometric Triangular grids and answer interior angle questions.
  6. **Spot the Glitch (Error Detection):** Identify common protractor reading bugs (scale confusion, origin offset) and repair them.
  7. **Boss Battle (Mega Glitch Robot):** Rapid-fire mixed questions from all levels to defeat the boss!
- **Classroom Team Mode:** 1 to 4 teams take turns on 1 device/projector with a live team scoreboard!
- **Teacher Panel:** Toggle game timer on/off, change difficulty, unlock all levels, or reset progress.
- **Web Audio API Synth & Confetti:** Sound effects (clicks, chimes, glitch sounds, victory fanfare) generated dynamically without external sound files. Standalone particle confetti animation on victory.
- **100% Offline Capable:** Pure HTML5, CSS3, and JavaScript (`index.html`, `style.css`, `game.js`). No frameworks or external internet dependencies required.

---

### 🚀 How to Run the Game
1. **Direct Browser Open (Simplest):**
   - Simply double-click `index.html` or drag and drop `index.html` into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. **Local Web Server (Optional):**
   ```bash
   # Using Python 3 HTTP Server
   python3 -m http.server 8000

   # Or using Vite / Node
   npm run dev
   ```
   Then open `http://localhost:8000` in your web browser.

---

### 📁 Codebase Structure
- `index.html` - Single page structure, top header stats bar, mascot guide banner, level screens, SVG symbol defs.
- `style.css` - Kawaii rainbow aesthetics, rounded touch-friendly buttons, keyframe animations, responsive grid layouts.
- `game.js` - Engine state manager, Web Audio API sound synthesizer, virtual protractor, grid engine, levels 1-6 logic, boss battle, and team mode.
