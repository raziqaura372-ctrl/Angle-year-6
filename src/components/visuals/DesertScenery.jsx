import React from 'react';

export default function DesertScenery() {
  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl mb-6 shadow-2xl border-2 border-amber-400/40">
      <svg
        viewBox="0 0 1000 350"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="40%" stopColor="#1C2541" />
            <stop offset="75%" stopColor="#480CA8" />
            <stop offset="100%" stopColor="#F72585" />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="1" />
            <stop offset="40%" stopColor="#F77F00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E63946" stopOpacity="0" />
          </radialGradient>

          {/* Dune Gradients */}
          <linearGradient id="duneBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7209B7" />
            <stop offset="100%" stopColor="#3A0CA3" />
          </linearGradient>

          <linearGradient id="duneMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F77F00" />
            <stop offset="100%" stopColor="#D62828" />
          </linearGradient>

          <linearGradient id="duneFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB703" />
            <stop offset="100%" stopColor="#FB8500" />
          </linearGradient>

          {/* Pyramid Gold Gradient */}
          <linearGradient id="pyrGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE600" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1000" height="350" fill="url(#skyGrad)" />

        {/* Floating Stars / Constellations */}
        <circle cx="150" cy="40" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="300" cy="70" r="2.5" fill="#FFD166" opacity="0.9" />
        <circle cx="500" cy="30" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="750" cy="60" r="3" fill="#4CC9F0" opacity="0.9" />
        <circle cx="880" cy="40" r="2" fill="#FFFFFF" opacity="0.8" />
        {/* Constellation lines */}
        <line x1="150" y1="40" x2="300" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="750" y1="60" x2="880" y2="40" stroke="rgba(76,201,240,0.3)" strokeWidth="1" />

        {/* Radiant Desert Sun */}
        <circle cx="500" cy="180" r="110" fill="url(#sunGlow)" />
        <circle cx="500" cy="180" r="45" fill="#FFE600" />

        {/* Pyramidal Temple Silhouettes */}
        <polygon points="200,260 270,140 340,260" fill="url(#pyrGold)" opacity="0.8" />
        <polygon points="270,140 340,260 300,260" fill="#B5651D" opacity="0.6" />

        <polygon points="720,270 780,160 840,270" fill="url(#pyrGold)" opacity="0.85" />
        <polygon points="780,160 840,270 800,270" fill="#B5651D" opacity="0.6" />

        {/* Back Dune Layer */}
        <path
          d="M 0 280 Q 250 180 500 250 T 1000 220 L 1000 350 L 0 350 Z"
          fill="url(#duneBack)"
          opacity="0.9"
        />

        {/* Oasis Spring Lagoon */}
        <ellipse cx="500" cy="310" rx="140" ry="25" fill="#06B6D4" opacity="0.85" />
        <ellipse cx="500" cy="310" rx="110" ry="18" fill="#22D3EE" opacity="0.9" />

        {/* Mid Dune Layer */}
        <path
          d="M 0 290 Q 300 220 600 290 T 1000 270 L 1000 350 L 0 350 Z"
          fill="url(#duneMid)"
        />

        {/* Front Dune Layer */}
        <path
          d="M 0 310 Q 200 260 450 320 T 1000 290 L 1000 350 L 0 350 Z"
          fill="url(#duneFront)"
        />

        {/* Palm Tree Visual Accent */}
        <g transform="translate(380, 260) scale(0.6)">
          <path d="M 20 60 Q 15 30 25 0 Q 35 30 30 60 Z" fill="#78350F" />
          <path d="M 25 0 Q -10 -20 -30 0 Q -10 -5 25 0 Z" fill="#10B981" />
          <path d="M 25 0 Q 60 -20 80 0 Q 60 -5 25 0 Z" fill="#059669" />
          <path d="M 25 0 Q 25 -40 30 -60 Q 20 -35 25 0 Z" fill="#34D399" />
        </g>
      </svg>

      {/* Overlay Banner Text */}
      <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end text-white drop-shadow-md">
        <div>
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Interactive Primary Learning
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wide mt-1 text-amber-200">
            DESERT GEOMETRY EXPEDITION
          </h2>
          <p className="text-xs md:text-sm text-cyan-200 font-medium">
            The Quest for the Hidden Oasis • DSKP 6.1 Sudut & Poligon
          </p>
        </div>

        <div className="mt-2 md:mt-0 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs font-bold text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          Expedition Live Dynamic Tools Active
        </div>
      </div>
    </div>
  );
}
