# Angle Quest 🎯
## Space Adventure Candy World — Year 6 Mathematics Micro-Teaching Resource
**Topic:** Space 6.1 Angles (KSSR Semakan DSKP Year 6)
**Target Audience:** Year 6 Primary Pupils (Aged 12), Classroom TV Micro-Teaching Lesson

---

## 🚀 Overview

**Angle Quest** is a bright, cartoon-style interactive web app designed for Year 6 Mathematics micro-teaching lessons. It is designed to be displayed on a classroom TV screen or tablet and played physically in front of a camera.

The application contains two gamified learning activities:

1. **Game 1: Angle Escape Room (10 Minutes)**
   - **Format:** Group activity for 3 pupils sharing one tablet.
   - **Concept:** Pupils work together in 3 rotating team roles (**Navigator 🧭, Reader 📖, Checker ✅**) to solve 9 DSKP-aligned angle and polygon puzzles across 3 cartoon worlds (*Jungle Gate, Space Station, Treasure Vault*).
   - **Rule:** *"No answer is submitted until all 3 pupils agree!"*

2. **Game 2: Human Protractor (5 Minutes)**
   - **Format:** Whole-class activity displayed on classroom TV screen, controlled by the teacher.
   - **Concept:** A giant SVG protractor fills the screen. A pupil stands in front of the TV/camera, uses one arm as the horizontal 0° baseline, and poses their other arm to form the target angle.

---

## 🛠️ Tech Stack & Requirements

- **100% Offline & Pure Web Stack:** Built with pure HTML5, CSS3, and vanilla JavaScript (ES6+).
- **No External Dependencies:** No frameworks, no build steps, no CDN links, no external fonts or audio files.
- **Web Audio API:** All sound effects (ticks, correct tones, wrong buzzers, time-up alerts, fanfare, and gift sparkles) are synthesized programmatically in real-time.
- **Original Vector Graphics:** All character artwork (Prot-Bot mascot with 4 expressions + party hat), locks, chests, badges, stars, planets, and protractors are original inline SVG and CSS artwork.
- **Zero Data Collection:** No `localStorage` or external analytics. All state resides cleanly in memory.

---

## 📖 How to Run & Deploy

### Local Execution
1. Clone or download this repository.
2. Open `index.html` directly in any standard browser (Chrome, Edge, Safari, Firefox).
3. Alternatively, launch a simple HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   and navigate to `http://localhost:8000`.

### Deploying to GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings > Pages**.
3. Select the `main` branch as the source and root `/` as the folder.
4. Save. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

---

## ⚙️ Configuration Options (`app.js`)

You can easily adjust the target angles, acceptable tolerance zone, or question bank at the top of `app.js`:

```javascript
// Target angles for Game 2 (Human Protractor)
const ANGLES = [90, 45, 120, 150];

// Acceptable error zone in degrees for human arm poses (+/- 10°)
const TOLERANCE = 10;
```

To edit Game 1 questions, edit the `GAME1_QUESTIONS` array in `app.js`.

---

## ⌨️ Teacher Keyboard Shortcuts (Game 2)

During **Game 2: Human Protractor**, the teacher can control the TV screen using the following shortcuts:

| Key | Action |
| --- | --- |
| **Space** | Reveal Answer / Advance to Next Angle |
| **R** | Reveal Answer Immediately |
| **P** | Pause / Resume Countdown Timer |
| **M** | Toggle Mute / Unmute Audio |
| **F** | Flip Protractor Horizontally (Left or Right Baseline Arm) |
| **T** | Toggle Light / Dark Background Theme |
| **H** | Hide / Show Teacher Shortcuts Footer Panel (for clean video recording) |
| **↑ / ↓** | Calibrate Protractor Up or Down (align center with pupil shoulder) |
| **+ / -** | Scale Protractor Size Larger or Smaller |
| **0** | Reset Calibration Offset & Scale |

---

## 🤖 AI Use Declaration

This application and all associated artwork, audio synthesizers, stylesheets, and logic were designed and generated with **Jules AI** under the direction and supervision of the student development group. All artwork is original vector code created specifically for this resource. All code has been reviewed, tested, and validated for pedagogical alignment with Year 6 KSSR Semakan DSKP Mathematics standard 6.1.
