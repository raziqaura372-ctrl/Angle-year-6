import React, { useRef, useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import confetti from 'canvas-confetti';
import {
  Pencil,
  PenTool,
  Paintbrush,
  Eraser,
  PaintBucket,
  Minus,
  MoveRight,
  Square,
  Circle as CircleIcon,
  Container,
  Type,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Send,
  HelpCircle,
  Users,
  Activity,
  Plus,
  Info,
  Droplets,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CanvasWorkspace() {
  const {
    currentPupil,
    currentGroup,
    currentGroupMembers,
    saveGroupCanvas,
    submitGroupCanvas,
    logActivity,
    activities
  } = useStudio();

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  // Canvas State & History
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Tools State
  const [activeTool, setActiveTool] = useState('pencil'); // 'pencil', 'pen', 'brush', 'eraser', 'fill', 'line', 'arrow', 'rectangle', 'circle', 'beaker', 'text'
  const [strokeColor, setStrokeColor] = useState('#3b82f6'); // default water blue
  const [lineWidth, setLineWidth] = useState(4);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [saveNotification, setSaveNotification] = useState(null);

  // Preset Colors for Volume Math Representation
  const COLOR_PALETTE = [
    { name: 'Air / Cecair (Blue)', hex: '#3b82f6', tag: 'Air' },
    { name: 'Isipadu Ditambah (Green)', hex: '#22c55e', tag: '+ Isipadu' },
    { name: 'Isipadu Ditolak (Orange)', hex: '#f97316', tag: '- Isipadu' },
    { name: 'Garisan Bekas (Dark)', hex: '#1e293b', tag: 'Bekas' },
    { name: 'Garisan Bekas Putih', hex: '#ffffff', tag: 'Garisan' },
    { name: 'Cecair Merah', hex: '#ef4444', tag: 'Merah' },
    { name: 'Cecair Kuning', hex: '#eab308', tag: 'Kuning' },
    { name: 'Cecair Ungu', hex: '#a855f7', tag: 'Ungu' },
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal resolution
    canvas.width = 1000;
    canvas.height = 600;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.lineCap = 'round';
    context.lineJoin = 'round';
    setCtx(context);

    // Load existing canvas data if available, else draw white/grid background
    if (currentGroup.canvasData) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        saveState(context);
      };
      img.src = currentGroup.canvasData;
    } else {
      drawDefaultBackground(context);
      saveState(context);
    }
  }, [currentGroup.id]);

  const drawDefaultBackground = (context) => {
    const c = context || ctx;
    if (!c) return;
    // White clean canvas with subtle grid
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, 1000, 600);

    // Light grid lines for math measurement alignment
    c.strokeStyle = '#f1f5f9';
    c.lineWidth = 1;

    for (let x = 0; x < 1000; x += 25) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 600);
      c.stroke();
    }
    for (let y = 0; y < 600; y += 25) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(1000, y);
      c.stroke();
    }
  };

  const saveState = (context) => {
    const c = context || ctx;
    if (!c) return;
    const canvas = canvasRef.current;
    const imgData = c.getImageData(0, 0, canvas.width, canvas.height);

    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imgData);

    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
      logActivity(currentPupil.name, currentGroup.id, 'menekan Undo pada kanvas');
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
      logActivity(currentPupil.name, currentGroup.id, 'menekan Redo pada kanvas');
    }
  };

  const handleClear = () => {
    if (window.confirm('Adakah anda pasti untuk memadamkan seluruh kanvas lukisan?')) {
      drawDefaultBackground(ctx);
      saveState(ctx);
      logActivity(currentPupil.name, currentGroup.id, 'memadam seluruh kanvas lukisan');
    }
  };

  // Canvas Mouse Coordinates Helper
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Drawing Event Handlers
  const startDrawing = (e) => {
    if (!ctx) return;
    const pos = getCanvasCoords(e);
    setStartPos(pos);

    if (activeTool === 'fill') {
      floodFill(Math.round(pos.x), Math.round(pos.y), strokeColor);
      saveState(ctx);
      logActivity(currentPupil.name, currentGroup.id, `mewarna kawasan dengan warna ${strokeColor}`);
      return;
    }

    if (activeTool === 'text') {
      setTextPosition(pos);
      setShowTextModal(true);
      return;
    }

    if (activeTool === 'beaker') {
      drawBeakerTemplate(pos.x, pos.y);
      saveState(ctx);
      logActivity(currentPupil.name, currentGroup.id, 'melukis silinder/beker isipadu');
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    let actionLabel = 'melukis';
    if (activeTool === 'eraser') actionLabel = 'memadam';
    if (activeTool === 'brush') actionLabel = 'mewarna dengan berus';
    logActivity(currentPupil.name, currentGroup.id, `${actionLabel} di kanvas`);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const pos = getCanvasCoords(e);

    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : strokeColor;
    ctx.lineWidth = activeTool === 'eraser' ? lineWidth * 3 : (activeTool === 'brush' ? lineWidth * 2.5 : lineWidth);

    if (activeTool === 'pencil' || activeTool === 'pen' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // For shapes, restore current step image then draw preview
      ctx.putImageData(history[historyStep], 0, 0);
      ctx.beginPath();

      if (activeTool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (activeTool === 'arrow') {
        drawArrow(startPos.x, startPos.y, pos.x, pos.y);
      } else if (activeTool === 'rectangle') {
        ctx.rect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        ctx.stroke();
      } else if (activeTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing && ctx) {
      ctx.closePath();
      setIsDrawing(false);
      saveState(ctx);
    }
  };

  // Arrow Helper
  const drawArrow = (fromX, fromY, toX, toY) => {
    const headlen = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  // Beaker Visual Stamp Template
  const drawBeakerTemplate = (x, y) => {
    if (!ctx) return;
    const width = 120;
    const height = 180;

    ctx.strokeStyle = strokeColor === '#ffffff' ? '#1e293b' : strokeColor;
    ctx.lineWidth = 3;

    // Outer Container Outline
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y - height / 2);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x + width / 2, y - height / 2);
    ctx.stroke();

    // Lip/Spout at top
    ctx.beginPath();
    ctx.moveTo(x - width / 2 - 10, y - height / 2);
    ctx.lineTo(x + width / 2 + 10, y - height / 2);
    ctx.stroke();

    // Measurement Graduations
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px sans-serif';

    const marks = ['0 L', '1 L', '2 L', '3 L', '4 L', '5 L'];
    const step = height / 5;

    for (let i = 0; i <= 5; i++) {
      const markY = y + height / 2 - i * step;
      ctx.beginPath();
      ctx.moveTo(x - width / 2, markY);
      ctx.lineTo(x - width / 2 + 15, markY);
      ctx.stroke();

      ctx.fillText(marks[i], x - width / 2 + 20, markY + 3);
    }
  };

  // Text Tool Handling
  const handleAddText = () => {
    if (!textInput.trim() || !textPosition || !ctx) return;

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = strokeColor === '#ffffff' ? '#0f172a' : strokeColor;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    saveState(ctx);
    logActivity(currentPupil.name, currentGroup.id, `menambah teks label "${textInput}"`);

    setTextInput('');
    setShowTextModal(false);
    setTextPosition(null);
  };

  // Flood Fill (Paint Bucket) Algorithm
  const floodFill = (startX, startY, fillHex) => {
    const canvas = canvasRef.current;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert hex to RGBA
    const tempElem = document.createElement('div');
    tempElem.style.color = fillHex;
    document.body.appendChild(tempElem);
    const rgbStr = window.getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);

    const rgbMatch = rgbStr.match(/\d+/g);
    if (!rgbMatch) return;

    const fillR = parseInt(rgbMatch[0], 10);
    const fillG = parseInt(rgbMatch[1], 10);
    const fillB = parseInt(rgbMatch[2], 10);
    const fillA = 255;

    const targetIndex = (startY * canvas.width + startX) * 4;
    const startR = data[targetIndex];
    const startG = data[targetIndex + 1];
    const startB = data[targetIndex + 2];
    const startA = data[targetIndex + 3];

    if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) {
      return;
    }

    const colorMatch = (idx) => {
      return (
        Math.abs(data[idx] - startR) < 30 &&
        Math.abs(data[idx + 1] - startG) < 30 &&
        Math.abs(data[idx + 2] - startB) < 30 &&
        Math.abs(data[idx + 3] - startA) < 30
      );
    };

    const pixelStack = [[startX, startY]];

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * canvas.width + x) * 4;

      while (y >= 0 && colorMatch(pixelPos)) {
        y--;
        pixelPos -= canvas.width * 4;
      }

      pixelPos += canvas.width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;

      while (y < canvas.height && colorMatch(pixelPos)) {
        data[pixelPos] = fillR;
        data[pixelPos + 1] = fillG;
        data[pixelPos + 2] = fillB;
        data[pixelPos + 3] = fillA;

        if (x > 0) {
          if (colorMatch(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvas.width - 1) {
          if (colorMatch(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        y++;
        pixelPos += canvas.width * 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  // Save & Submit Actions
  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL();
    saveGroupCanvas(currentGroup.id, dataUrl);
    setSaveNotification('Hasil kerja disimpan!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleSubmit = () => {
    const dataUrl = canvasRef.current.toDataURL();
    submitGroupCanvas(currentGroup.id, dataUrl);

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSaveNotification('BERHASIL! Hasil kumpulan telah dihantar ke Galeri Kelas! 🎉');
    setTimeout(() => setSaveNotification(null), 4000);
  };

  // Quick Math Operation Label Preset Inserters
  const insertMathPresetText = (text) => {
    if (!ctx) return;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = strokeColor;
    ctx.fillText(text, 100, 100);
    saveState(ctx);
    logActivity(currentPupil.name, currentGroup.id, `menambah teks formula "${text}"`);
  };

  return (
    <div className="space-y-4 py-2 max-w-7xl mx-auto">
      {/* Top Question & Task Banner */}
      <div className={`p-4 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${currentGroup.bgClass}`}>
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-2xl ${currentGroup.badgeClass} shadow-md`}>
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-black ${currentGroup.badgeClass}`}>
                {currentGroup.name}
              </span>
              <span className="text-xs font-bold text-cyan-300">
                • Status: {currentGroup.status}
              </span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-white mt-1">
              {currentGroup.question}
            </h2>
          </div>
        </div>

        {/* Action Save/Submit Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs md:text-sm border border-cyan-500/40 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>SIMPAN HASIL</span>
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs md:text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all ring-2 ring-emerald-300/40"
          >
            <Send className="w-4 h-4" />
            <span>HANTAR HASIL KUMPULAN</span>
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-200 rounded-2xl text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Workspace Layout (Toolbar + Canvas + Live Activity Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Drawing Toolbar */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-5">
          {/* Main Drawing Tools */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider block">
              ✏️ Alat Melukis
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'pencil', name: 'Pencil', icon: Pencil },
                { id: 'pen', name: 'Pen', icon: PenTool },
                { id: 'brush', name: 'Brush', icon: Paintbrush },
                { id: 'eraser', name: 'Eraser', icon: Eraser },
                { id: 'fill', name: 'Fill Colour', icon: PaintBucket },
                { id: 'beaker', name: 'Bekas Isipadu', icon: Container },
                { id: 'text', name: 'Text Label', icon: Type },
                { id: 'line', name: 'Garisan', icon: Minus }
              ].map((tool) => {
                const IconComp = tool.icon;
                const active = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.name}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      active
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300/50 scale-105'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[9px] font-bold truncate max-w-[50px]">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shapes */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider block">
              📐 Shape & Anak Panah
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'arrow', name: 'Anak Panah', icon: MoveRight },
                { id: 'rectangle', name: 'Petak', icon: Square },
                { id: 'circle', name: 'Bulatan', icon: CircleIcon }
              ].map((tool) => {
                const IconComp = tool.icon;
                const active = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
                      active
                        ? 'bg-cyan-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[10px]">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette (Liquid Volume Representation) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                🎨 Warna Isipadu Cecair
              </span>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                title="Pilih Warna Khas"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {COLOR_PALETTE.map((c) => {
                const isSelected = strokeColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex + c.tag}
                    onClick={() => setStrokeColor(c.hex)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800 ring-2 ring-cyan-400/50 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Saiz Ketebalan:</span>
              <span className="text-cyan-400 font-mono">{lineWidth}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Quick Volume Math Insert Shortcuts */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
              ⚡ Tampal Label Operasi Cecair
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                '2 L 500 mL',
                '1 L 250 mL',
                '+ (Tambah)',
                '- (Tolak)',
                '= (Sama Dengan)',
                '3 L 750 mL'
              ].map((txt) => (
                <button
                  key={txt}
                  onClick={() => insertMathPresetText(txt)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 truncate"
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col items-center justify-between space-y-3">
          {/* Top Canvas Controls (Undo, Redo, Zoom, Clear) */}
          <div className="w-full flex items-center justify-between bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            {/* Undo / Redo / Clear */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                title="Clear Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Active User Indicator Tag */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-300">
              <span>{currentPupil.avatar}</span>
              <span>
                {currentPupil.name} ({currentPupil.role})
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-400 px-1">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HTML5 Canvas Element Container */}
          <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out'
              }}
              className="touch-none select-none rounded-xl overflow-hidden shadow-2xl border border-slate-700"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair bg-white block"
              />
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 text-center">
            💡 Tekan & seret pada kanvas untuk melukis. Gunakan <strong className="text-cyan-300">Fill Colour</strong> untuk mewarnai isipadu cecair.
          </div>
        </div>

        {/* Right Collaboration & Live Activity Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Team Roles & Collaboration Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Peranan Ahli {currentGroup.name}</span>
            </div>

            <div className="space-y-2">
              {currentGroupMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-2 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    member.id === currentPupil.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{member.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-100">{member.name}</div>
                      <div className="text-[10px] text-cyan-400">{member.role}</div>
                    </div>
                  </div>
                  {member.id === currentPupil.id && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-cyan-500 text-slate-950">
                      Anda
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Stream (Section 8 Indicator requirement) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Aktiviti Kolaboratif Masa Nyata</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activities
                .filter((act) => act.groupId === currentGroup.id)
                .slice(0, 8)
                .map((act) => (
                  <div
                    key={act.id}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] leading-relaxed"
                  >
                    <span className="font-bold text-cyan-300">{act.studentName}</span>{' '}
                    <span className="text-slate-300">{act.action}</span>
                    <div className="text-[9px] text-slate-500 text-right font-mono mt-0.5">
                      {act.timestamp}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Text Tool */}
      {showTextModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-cyan-400" />
              <span>Tambah Teks / Label Isipadu</span>
            </h3>

            <p className="text-xs text-slate-300">
              Masukkan label isipadu (cth: 2 L 500 mL + 1 L 250 mL = 3 L 750 mL):
            </p>

            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Cth: 2 L 500 mL..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowTextModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddText}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md"
              >
                Tampal Teks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
