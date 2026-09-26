import React, { useState } from 'react';
import { FileText, Layers, Sparkles, BookOpen, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export default function AcademicHub() {
  const [activeTab, setActiveTab] = useState('dskp');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">ACADEMIC & NPDL INTEGRATION HUB</h2>
            <p className="text-sand-300 text-xs">MTES6032 Task 2 Pedagogical Alignment & Evidence Documentation</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          This academic documentation hub provides complete transparency on curriculum standards, Deep Learning (KPPB / NPDL 6Cs) mapping, assessment blueprints, micro-teaching plans, AI ethics, and APA 7th Edition references.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { id: 'dskp', label: '1. DSKP Alignment Matrix' },
            { id: 'npdl', label: '2. NPDL / 6Cs Mapping' },
            { id: 'teaching', label: '3. 30-Min Lesson Plan' },
            { id: 'ethics', label: '4. AI Ethics & Integrity' },
            { id: 'apa', label: '5. APA 7 References' },
            { id: 'checklist', label: '6. Self-Evaluation Matrix' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === tab.id
                  ? 'bg-sand-500 text-desertNavy-950 border-sand-400 shadow-md gold-glow'
                  : 'bg-desertNavy-800 text-sand-300 border-sand-500/20 hover:border-sand-500/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: DSKP Alignment Matrix */}
      {activeTab === 'dskp' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-oasis-400" />
            Curriculum Alignment Matrix (SUKATAN DAN GEOMETRI - 6.1 Sudut)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-sand-500/20">
              <thead>
                <tr className="bg-desertNavy-800 text-sand-300 border-b border-sand-500/30">
                  <th className="p-3 border-r border-sand-500/20">Standard Kandungan</th>
                  <th className="p-3 border-r border-sand-500/20">Standard Pembelajaran</th>
                  <th className="p-3 border-r border-sand-500/20">Learning Objective</th>
                  <th className="p-3 border-r border-sand-500/20">Digital Tool & Mission</th>
                  <th className="p-3">Evidence of Learning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-500/10 text-sand-200">
                <tr>
                  <td className="p-3 font-semibold border-r border-sand-500/20">6.1 Sudut</td>
                  <td className="p-3 border-r border-sand-500/20 font-mono">6.1.1 Melukis poligon hingga 8 sisi pada grid & mengukur sudut pedalaman</td>
                  <td className="p-3 border-r border-sand-500/20">Construct 3-8 sided polygons on square/isometric grids and measure interior angles using dynamic tools.</td>
                  <td className="p-3 border-r border-sand-500/20 font-semibold text-oasis-300">PolygonGridCanvas / Mission 4 & 6</td>
                  <td className="p-3">Verified interior sum formula (n-2)×180° calculations and polygon drawings.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border-r border-sand-500/20">6.1 Sudut</td>
                  <td className="p-3 border-r border-sand-500/20 font-mono">6.1.2 Membentuk sudut berdasarkan nilai sudut yang diberi</td>
                  <td className="p-3 border-r border-sand-500/20">Construct exact angles matching specified target degree values with high precision.</td>
                  <td className="p-3 border-r border-sand-500/20 font-semibold text-oasis-300">DynamicAngleCanvas / Mission 2, 3 & 5</td>
                  <td className="p-3">Interactive protractor snapping logs and target angle verification scores.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: NPDL / 6Cs Mapping */}
      {activeTab === 'npdl' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sand-500" />
            NPDL / KPPB Deep Learning 6Cs Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { title: 'Critical Thinking (Pemikiran Kritikal)', desc: 'Students evaluate angle error scenarios, justify interior angle sums, and calculate trajectory turn angles in Mission 5 & 7.' },
              { title: 'Creativity (Kreativiti)', desc: 'Students design open-ended solar panel array structures and tent shelter architecture in Mission 6.' },
              { title: 'Communication (Komunikasi)', desc: 'Students articulate mathematical reasoning in the Reflection Journal and explain WHY an angle has a specific value.' },
              { title: 'Collaboration (Kolaborasi)', desc: 'Micro-teaching design incorporates pair problem-solving during expedition map navigation.' },
              { title: 'Character (Karakter)', desc: 'Students demonstrate persistence and integrity when utilizing the 3-level hint system before seeking direct help.' },
              { title: 'Citizenship (Kewarganegaraan)', desc: 'Students explore sustainable desert architecture, clean solar energy alignment, and digital ethics.' },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-desertNavy-800/80 border border-sand-500/20 space-y-1">
                <div className="font-bold text-sand-100 text-sm">{c.title}</div>
                <p className="text-sand-300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 30-Min Micro-Teaching Plan */}
      {activeTab === 'teaching' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-terracotta-400" />
            30-Minute Micro-Teaching Flow (Task 3 Implementation Preparation)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-desertNavy-800 rounded-lg border border-sand-500/20">
              <span className="font-bold text-sand-500">Phase 1: Set Induction & Narrative Hook (5 Mins)</span>
              <p className="text-sand-300 mt-1">Introduce the "Desert Geometry Expedition". Display Mission 0 and demonstrate dynamic ray manipulation on screen.</p>
            </div>
            <div className="p-3 bg-desertNavy-800 rounded-lg border border-sand-500/20">
              <span className="font-bold text-sand-500">Phase 2: Guided Dynamic Exploration (10 Mins)</span>
              <p className="text-sand-300 mt-1">Students explore Mission 2 & 3 in pairs. Teacher uses DUNE AI helper prompts to guide students in measuring and constructing gate angles.</p>
            </div>
            <div className="p-3 bg-desertNavy-800 rounded-lg border border-sand-500/20">
              <span className="font-bold text-sand-500">Phase 3: Small-Group Inquiry & Polygon Investigation (10 Mins)</span>
              <p className="text-sand-300 mt-1">Students construct 5 and 6-sided polygons on square/isometric grids in Mission 4, calculating interior angle sums.</p>
            </div>
            <div className="p-3 bg-desertNavy-800 rounded-lg border border-sand-500/20">
              <span className="font-bold text-sand-500">Phase 4: Closure & Metacognitive Reflection (5 Mins)</span>
              <p className="text-sand-300 mt-1">Students submit reflection entries in the Reflection Journal. Teacher reviews analytics on Teacher Dashboard.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Ethics */}
      {activeTab === 'ethics' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-oasis-400" />
            AI Ethics, Pedagogical Integrity & Disclosure Statement
          </h3>

          <p className="text-xs text-sand-200 leading-relaxed">
            In accordance with IPGM MTES6032 guidelines, artificial intelligence (specifically DUNE AI Companion) is integrated <strong>ethically and scaffolded pedagogically</strong>. DUNE functions strictly as a questioning guide—prompting critical thinking without providing direct answers. All coding architectures and pedagogical frameworks were human-designed and validated.
          </p>
        </div>
      )}

      {/* Tab 5: APA 7 References */}
      {activeTab === 'apa' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-sand-500" />
            Academic References (APA 7th Edition)
          </h3>

          <div className="space-y-2 text-xs text-sand-200 font-mono bg-desertNavy-950 p-4 rounded-lg border border-sand-500/20">
            <p>Kementerian Pendidikan Malaysia. (2018). <em>Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Matematik Tahun 6</em>. Bahagian Pembangunan Kurikulum.</p>
            <p>Skemp, R. R. (1976). Relational understanding and instrumental understanding. <em>Mathematics Teaching</em>, 77, 20–26.</p>
            <p>Fullan, M., Quinn, J., & McEachen, J. (2018). <em>Deep learning: Engage the world change the world</em>. Corwin Press.</p>
            <p>Hohenwarter, M., & Preiner, J. (2007). Dynamic mathematics with GeoGebra. <em>Journal for Online Mathematics and its Applications</em>, 7, 1–14.</p>
          </div>
        </div>
      )}

      {/* Tab 6: Self-Evaluation Matrix */}
      {activeTab === 'checklist' && (
        <div className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
          <h3 className="font-serif font-bold text-sand-200 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-sand-500" />
            20-Point Task 2 Quality Self-Evaluation Matrix
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              "1. Curriculum Alignment (DSKP 6.1.1 & 6.1.2)",
              "2. Mathematical Accuracy in Angle Physics",
              "3. Relational Understanding via Dynamic Tools",
              "4. Interactive Ray & Polygon Dragging Canvas",
              "5. Dynamic Geometry Software Integration",
              "6. Meaningful AI Companion (DUNE Scaffolding)",
              "7. Cinematic Gamification & Ranking System",
              "8. Diagnostic Formative Feedback Engine",
              "9. Open-Ended Problem Solving & Construction",
              "10. NPDL / 6Cs Competency Integration",
              "11. UX/UI Premium Desert Expedition Aesthetic",
              "12. Accessibility & Responsive Layout",
              "13. 3-Tier Differentiation Scaffolding",
              "14. Ethical AI & Transparent Disclosure",
              "15. Academic Integrity & Rigorous Codebase",
              "16. APA 7th Edition Reference Citations",
              "17. Originality & Academic Defensibility",
              "18. Teacher Usability & Dashboard Analytics",
              "19. Student Engagement & Metacognitive Journal",
              "20. Micro-Teaching Readiness for Task 3"
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded bg-desertNavy-800 border border-sand-500/20 text-oasis-300 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-oasis-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
