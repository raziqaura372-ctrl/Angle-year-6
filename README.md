# Angle Quest 🎯
**Interactive Digital Mathematics Micro-Teaching Resource**
Year 6 Mathematics (KSSR Semakan DSKP Space 6.1 Angles)

---

## Overview
**Angle Quest** is a pure, single-page, offline-capable educational web application designed for a Year 6 Primary School Mathematics micro-teaching lesson. Built specifically to be displayed on a classroom TV and played physically in front of a camera by pupils.

It contains two complementary educational games:
1. **Game 1: Angle Escape Room (10 Minutes)** — A collaborative tablet game where a group of 3 pupils rotates roles (Navigator, Reader, Checker) to unlock 3 locks by answering 9 geometry questions.
2. **Game 2: Human Protractor (5 Minutes)** — A whole-class interactive TV activity where pupils stand in front of a giant high-contrast virtual protractor on the screen and form target angles using their arms against camera alignment.

---

## How to Run
Angle Quest requires zero build steps, node modules, or backend servers. It works completely offline!

### Option 1: Open Directly in Browser
- Simply double-click `index.html` or open it directly in any modern browser (Chrome, Edge, Safari, Firefox).

### Option 2: Run via Local HTTP Server
```bash
# Python 3 built-in server
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## How to Deploy on GitHub Pages
1. Push this repository to GitHub.
2. Navigate to your GitHub repository **Settings** -> **Pages**.
3. Under **Build and deployment**, select `Deploy from a branch`.
4. Choose the `main` (or `master`) branch and directory `/ (root)`.
5. Click **Save**. GitHub Pages will deploy the live site automatically within 1-2 minutes.

---

## How to Edit Configuration & Questions

### 1. Game 2 Target Angles & Tolerance
At the top of `app.js`, modify the `ANGLES` array and `TOLERANCE` constant:
```javascript
// app.js
const ANGLES = [90, 45, 120, 150]; // Angles in degrees for rounds 1-4
const TOLERANCE = 10;                // Acceptable margin of error (+/- degrees)
```

### 2. Game 1 Questions
All 9 questions for the Escape Room are defined in the `ESCAPE_QUESTIONS` array in `app.js`:
```javascript
const ESCAPE_QUESTIONS = [
  {
    id: 1,
    level: 1,
    question: "A 40° angle. What type of angle is this?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Acute",
    explanation: "An angle less than 90° is an Acute angle."
  },
  // ...
];
```
You can edit the questions, option text, correct answers, or explanations directly in `app.js`.

---

## Teacher Keyboard Shortcuts (Game 2: Human Protractor)
The teacher can control Game 2 seamlessly via keyboard shortcuts:

| Shortcut Key | Action |
| :--- | :--- |
| `Space` | Start next round / advance angle |
| `R` | Reveal target answer angle immediately |
| `P` | Pause / resume countdown timer |
| `M` | Toggle audio mute |
| `F` | Horizontal mirror/flip (choose baseline arm left/right) |
| `T` | Toggle Light / Dark color theme |
| `H` | Hide / show teacher UI panel for clean video recording |
| `Arrow Up` / `Arrow Down` | Move protractor up/down to align with pupil's shoulder |
| `+` / `-` | Scale protractor size up/down |
| `0` | Reset protractor alignment and size calibration |

---

## AI Use Declaration
This educational application was designed and generated with **Jules AI** under the direct pedagogical direction and supervision of the student group for the Year 6 Mathematics Micro-Teaching project. All source code, SVG geometry engine calculations, audio synthesis models, and UI layouts were thoroughly tested, verified, and reviewed by the student group.
