import React from 'react';

interface CardSmallProps {
  description: string;
  tags: string[];
  gradientType?: 'blue' | 'purple' | 'green';
  shapeType?: 'circle' | 'quarter-circle' | 'hexagon';
}

export const CardSmall: React.FC<CardSmallProps> = ({
  description,
  tags,
  gradientType = 'blue'
}) => {
  const getGradientClass = () => {
    switch (gradientType) {
      case 'purple':
        return 'from-[#d8b4fe]/80 to-[#f472b6]/80';
      case 'green':
        return 'from-[#a7f3d0]/80 to-[#047857]/80';
      case 'blue':
      default:
        return 'from-[#93c5fd]/80 to-[#3b82f6]/80';
    }
  };

  const renderVisual = () => {
    if (gradientType === 'blue') {
      // Live Compiler Card
      return (
        <div className="w-full max-w-[280px] bg-[#040711]/95 border border-slate-800 rounded p-3 font-mono text-[11px] shadow-lg text-left select-none text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
            <span className="text-slate-500 font-bold">git push event</span>
            <span className="text-indigo-400">main</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-indigo-400 font-bold">➔</span>
              <span>commit: a3d8f92</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>✓ Eve compiler: PASS</span>
              <span className="text-slate-500 text-[10px]">(0.8s)</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              [compiler] 728 snapshots compiled
            </div>
          </div>
        </div>
      );
    } else {
      // Knowledge Doctor Card (purple)
      return (
        <div className="w-full max-w-[280px] bg-[#040711]/95 border border-slate-800 rounded p-3 font-mono text-[11px] shadow-lg text-left select-none text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
            <span className="text-rose-400 font-bold">contradiction found</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-rose-950/40 border border-rose-900 text-rose-400 uppercase font-bold">Warning</span>
          </div>
          <div className="space-y-2">
            <div className="bg-rose-950/10 border-l-2 border-rose-500 p-1.5 text-[10.5px]">
              <span className="text-slate-500 block text-[8px] uppercase font-bold">Statement A</span>
              "Use pg bouncer transaction pooling"
            </div>
            <div className="bg-rose-950/10 border-l-2 border-rose-500 p-1.5 text-[10.5px]">
              <span className="text-slate-500 block text-[8px] uppercase font-bold">Statement B</span>
              "Connect directly to client database mapping"
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col border border-slate-800 rounded-none overflow-hidden max-w-sm w-full shadow-lg relative z-10 opaque-card">
      {/* Top half: Gradient Background with Feature Visual (No Grid Overlay) */}
      <div className={`h-40 bg-gradient-to-tr ${getGradientClass()} p-4 flex items-center justify-center relative overflow-hidden`}>
        {/* Render feature visual block */}
        <div className="relative z-10 w-full flex justify-center">
          {renderVisual()}
        </div>
      </div>

      {/* Dotted separator divider */}
      <div className="dotted-divider"></div>

      {/* Bottom half: Dark grey background */}
      <div className="p-5 flex-grow flex flex-col justify-between min-h-[180px] opaque-card-secondary">
        {/* Text */}
        <p className="font-pixelated text-slate-100 text-[18px] leading-relaxed mb-4">
          {description}
        </p>

        {/* Tags and mascot logo at bottom */}
        <div className="flex justify-between items-end pt-2">
          <div className="flex flex-col gap-1.5">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-block px-2.5 py-0.5 bg-[#1e293b] text-slate-300 font-mono text-[11px] border border-slate-800 uppercase tracking-wide w-fit"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Small Mascot Stamp */}
          <div className="opacity-40 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="1.5" fill="currentColor" />
              <circle cx="15" cy="9" r="1.5" fill="currentColor" />
              <path d="M8 15h8" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
