import React from 'react';

interface CardBigProps {
  titleText: string;
  tags: string[];
  asciiArtType?: 'mascot' | 'network' | 'code';
}

export const CardBig: React.FC<CardBigProps> = ({
  titleText,
  tags
}) => {
  return (
    <div className="flex flex-col md:flex-row border border-slate-800 rounded-none overflow-hidden max-w-4xl w-full shadow-2xl relative z-10 opaque-card">
      {/* Left panel - Mac Terminal Emulator */}
      <div className="md:w-1/2 p-6 flex flex-col justify-center items-center min-h-[240px] relative overflow-hidden select-none border-b md:border-b-0 md:border-r border-slate-900 opaque-card-terminal">
        
        {/* Terminal Window Box */}
        <div className="w-full max-w-sm bg-[#040711] border border-slate-800 rounded-lg shadow-2xl overflow-hidden font-mono text-[12px]">
          {/* Header bar */}
          <div className="bg-[#0b0f19] px-4 py-2 border-b border-slate-800 flex justify-between items-center text-slate-500 text-[11px] select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold font-mono">terminal — precedent preview</span>
            <div className="w-8"></div> {/* spacer */}
          </div>
          
          {/* Terminal content screen */}
          <div className="p-4 space-y-2 text-slate-300 text-left font-mono leading-relaxed">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-bold">$</span>
              <span className="text-white font-semibold">precedent preview</span>
            </div>
            <div className="text-slate-500 font-mono">[precedent] Scanning repository...</div>
            <div className="text-slate-400 font-mono">[precedent] Found 14 pull requests, 3 active blockers</div>
            <div className="text-slate-400 font-mono">[precedent] Distilling intelligence logs...</div>
            <div className="text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
              <span>✓ Checks compiled successfully!</span>
            </div>
            <div className="text-slate-300 font-mono pt-1">
              [precedent] Local preview active at:
              <span className="text-indigo-400 block mt-0.5 font-bold">http://localhost:5173</span>
            </div>
          </div>
        </div>
        
      </div>

      {/* Right panel - Dark grey background */}
      <div className="md:w-1/2 flex flex-col justify-between p-6 opaque-card-secondary">
        {/* Top half: Description */}
        <div className="pb-6 border-b border-dashed border-slate-800 text-center flex items-center justify-center min-h-[140px] px-4">
          <p className="font-pixelated text-slate-100 leading-relaxed text-[22px] md:text-[24px] text-center w-full">
            {titleText}
          </p>
        </div>

        {/* Bottom half: Tags & Mascot Icon */}
        <div className="pt-6 flex justify-between items-end">
          <div className="flex flex-col gap-2">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-block px-3 py-1 bg-[#1e293b] text-slate-300 font-mono text-[13px] border border-slate-800 uppercase tracking-wide w-fit"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Small Mascot stamp on bottom-right (inspired by card-big.png logo) */}
          <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a13.92 13.92 0 00-3.44-9.041m3.44 9.042a13.92 13.92 0 01-3.44 9.041m12.302-9.042c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 0015 11a13.92 13.92 0 00-3.44-9.041m3.44 9.042a13.92 13.92 0 01-3.44 9.041m-6.42 3.42c-.04.08-.08.16-.12.24m6.54-9.28a13.91 13.91 0 013.44-9.04m-6.42 3.42c.04.08.08.16.12.24m-10.25 2.13a17.9 17.9 0 00-1.8 9.04m12.05-11.17a17.9 17.9 0 011.8 9.04m-12.05-11.17A17.9 17.9 0 004.5 12" />
            </svg>
            <span className="font-mono text-[9px] text-slate-500 uppercase mt-1">SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
