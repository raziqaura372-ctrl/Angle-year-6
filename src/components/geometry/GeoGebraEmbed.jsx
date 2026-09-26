import React, { useState } from 'react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';

export default function GeoGebraEmbed({
  ggbAppletId = "mhy8823g",
  title = "GeoGebra Dynamic Angle Explorer",
  description = "Dynamic construction and angle investigation tool."
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="bg-desertNavy-900/90 rounded-xl p-4 border border-sand-500/30 shadow-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-3">
        <div>
          <h3 className="font-serif font-bold text-sand-200 text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-oasis-400" />
            {title}
          </h3>
          <p className="text-xs text-sand-400">{description}</p>
        </div>
        <a
          href={`https://www.geogebra.org/m/${ggbAppletId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-oasis-300 hover:text-oasis-100 font-semibold underline"
        >
          Open in GeoGebra <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="relative w-full h-[400px] border border-sand-500/20 rounded-lg overflow-hidden bg-desertNavy-950">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-desertNavy-950/90 z-10">
            <Sparkles className="w-8 h-8 text-sand-500 animate-spin" />
            <p className="text-sm font-semibold text-sand-300">Loading GeoGebra Dynamic Engine...</p>
          </div>
        )}

        <iframe
          title={title}
          src={`https://www.geogebra.org/material/iframe/id/${ggbAppletId}/width/700/height/400/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/true/rc/false/ld/false/sdz/false/ctl/true`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          onLoad={() => setIframeLoaded(true)}
          allowFullScreen
        />
      </div>

      <div className="w-full mt-3 p-2.5 bg-desertNavy-800/80 rounded-lg border border-sand-500/20 text-xs text-sand-300 flex items-center justify-between">
        <span className="text-sand-400">Pedagogical Value:</span>
        <span className="font-medium text-oasis-300">Allows direct manipulation of geometric objects to construct relational understanding.</span>
      </div>
    </div>
  );
}
