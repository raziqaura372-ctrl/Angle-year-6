# Angle Quest 🎯
**Interactive Mathematics Educational Web Application for Primary School (Year 6)**

Angle Quest is a pure, single-page educational web application designed for a Year 6 Malaysian primary school Mathematics micro-teaching lesson based on **KSSR Semakan DSKP Year 6, Space 6.1 (Angles)**.

The application is tailored for classroom TV projection (via tablet screen share) and camera interaction with pupils.

---

## 🌟 Key Features

1. **Game 1: Angle Escape Room (10 Minutes)**
   - Designed for a group of 3 pupils sharing one tablet.
   - **3 Level Locks** & **9 Questions** aligned with Year 6 DSKP:
     - **Level 1:** Identify angles (Acute, Right, Obtuse, Reflex) with dynamic inline SVG diagrams.
     - **Level 2:** Calculate unknown angle $x$ on a straight line ($180^\circ$), around a point ($360^\circ$), and inside a triangle ($180^\circ$).
     - **Level 3:** Polygons - Quadrilaterals ($360^\circ$), Pentagon interior angle sum ($540^\circ$), and Regular Hexagon interior angles ($120^\circ$).
   - **Automated Role Rotation:** Navigator, Reader, Checker rotate every level.
   - **Agreement Requirement:** "✅ We all agree" confirmation button before submitting.
   - **Verbal Explanation Prompts:** Level 3 prompts Reader to explain reasoning aloud (*"say because..."*).
   - **Evidence Results Table:** Displays full score breakdown, stars, time used, and question-by-question result matrix ($\text{✅} / \text{❌} / \text{🔁}$).

2. **Game 2: Human Protractor (5 Minutes)**
   - Whole-class physical activity controlled by the teacher from the keyboard or mouse.
   - Pupils stand in front of the TV camera and form angles using their arms (horizontal baseline arm & rotated answer arm).
   - **30-second Circular Countdown Timer** with 5-second tick audio cues.
   - **Dynamic Answer Reveal SVG:** Blue baseline arm pointing right, red answer arm, degree arc, degree text, and angle classification text.
   - **Teacher Scoring & Gifts Counter:** Give gift ($\text{🎁}$) triggers happy sound and confetti animation.
   - **Keyboard Shortcuts:** `Space` = Next Angle / Start, `R` = Reveal Early, `P` = Pause / Resume, `M` = Toggle Mute.
   - **Practice Mode Toggle:** Optional angle classification hint during countdown.

3. **Offline & Zero Dependency Architecture**
   - Pure HTML, CSS, and vanilla JavaScript.
   - **No external frameworks, no CDN links, no external fonts, no external images, no localStorage.**
   - All sounds generated live via the native **Web Audio API**.
   - Draws all mathematical diagrams using dynamic inline **SVG**.

---

## 🚀 How to Run Locally

Because Angle Quest has zero external dependencies and zero build steps, you can run it directly:

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. Alternatively, launch a simple local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## 🌐 How to Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4. Select the `main` branch (and `/ (root)` folder) and click **Save**.
5. Your application will be live at `https://<username>.github.io/<repository-name>/`.

---

## 🛠️ Customization Guide

### How to Edit Angles in Game 2 (Human Protractor)
At the very top of `app.js`, modify the `ANGLES` array:
```javascript
// Editable ANGLES array for Game 2 (Human Protractor)
const ANGLES = [90, 45, 120, 150];
```
You can add or change degree values (e.g., `[30, 90, 135, 210]`).

### How to Edit Questions in Game 1 (Angle Escape Room)
Locate the `ESCAPE_QUESTIONS` array in `app.js`:
```javascript
const ESCAPE_QUESTIONS = [
  {
    id: 1,
    level: 1,
    title: "Question 1 of 9",
    question: "What type of angle is this 40° angle?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Acute",
    renderSVG: () => SVGRenderer.renderSingleAngle(40, false),
    explanation: "An acute angle is smaller than 90°."
  },
  ...
];
```
Modify questions, options, answers, or explanations directly in the object structure.

---

## 🤖 AI Use Declaration

This web application code was generated using **Jules AI** under the direct direction, specification, and pedagogical design of the student group for a Year 6 Mathematics micro-teaching lesson. All code, SVG geometry, sound synthesis, and UI interactions were systematically reviewed, tested, and verified by the student group.
