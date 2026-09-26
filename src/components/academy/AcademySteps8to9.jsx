import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import { Hexagon, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Step8Polygons({ onNext }) {
  const [polygonData, setPolygonData] = useState(null);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-purple-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 8: Geometric Polygon Preview
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">8. ANGLES IN POLYGONS</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Angles are the building blocks of 2D shapes! Every vertex of a polygon forms an <strong>interior angle</strong>.
        </p>
      </div>

      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={4}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center font-bold">
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          <div>Where can you see angles?</div>
          <div className="text-slate-300 font-normal">At every corner vertex where two polygon sides meet.</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          <div>How many vertices?</div>
          <div className="text-slate-300 font-normal">{polygonData?.sides || 4} Vertices = {polygonData?.sides || 4} Interior Angles</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          <div>Interior Sum Formula</div>
          <div className="text-slate-300 font-normal">(n - 2) × 180° = {polygonData?.expectedSum || 360}°</div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Continue to Step 9: Look Around the Desert</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step9DesertConnection({ onNext }) {
  const [visitedHotspots, setVisitedHotspots] = useState([]);

  const hotspots = [
    { id: 'tent', name: 'Desert Expedition Tent', deg: '60°', type: 'Sudut Tirus', desc: 'Roof supports form 60° acute angles to shed wind.' },
    { id: 'solar', name: 'Solar Panel Array', deg: '45°', type: 'Sudut Tirus', desc: 'Tilted at 45° toward the desert sun to maximize clean energy.' },
    { id: 'gate', name: 'Sanctuary Archway Gate', deg: '90°', type: 'Sudut Tegak', desc: 'Door lintels meet posts at exact 90° right angles.' },
    { id: 'route', name: 'Caravan Navigation Route', deg: '120°', type: 'Sudut Cakah', desc: 'Wide 120° turn angle to bypass moving dune ridges.' },
  ];

  const handleVisit = (id) => {
    if (!visitedHotspots.includes(id)) {
      setVisitedHotspots(prev => [...prev, id]);
    }
  };

  const isAllVisited = visitedHotspots.length === hotspots.length;

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 9: Real-World Connection
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">9. LOOK AROUND THE DESERT</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Click all 4 desert landmarks below to discover how angles are used in real-world engineering and navigation!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotspots.map((item) => {
          const visited = visitedHotspots.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleVisit(item.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                visited
                  ? 'bg-slate-900 border-emerald-400 shadow-lg'
                  : 'bg-slate-950/80 border-amber-400/30 hover:border-amber-400'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-amber-200 text-sm">{item.name}</span>
                {visited ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <MapPin className="w-5 h-5 text-amber-400 animate-bounce" />
                )}
              </div>

              <div className="text-xs text-cyan-300 font-mono font-bold mb-1">{item.deg} • {item.type}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onNext}
          disabled={!isAllVisited}
          className={`px-6 py-2.5 rounded-xl font-black text-sm inline-flex items-center gap-2 transition-transform ${
            isAllVisited
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 gold-glow hover:scale-105 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>{isAllVisited ? 'Explored All Landmarks! Proceed to Checkpoint' : `Explore All 4 Landmarks (${visitedHotspots.length}/4)`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
