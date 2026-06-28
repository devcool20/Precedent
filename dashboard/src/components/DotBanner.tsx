import React from 'react';
import { Eye, ShieldCheck, Key, Lock, UserCheck, Zap, Landmark } from 'lucide-react';

interface DotBannerProps {
  title?: string;
}

// Generate static list of 36 dots with random positions, delays and durations outside the component
// to ensure stable positions and out-of-sync smooth sparkling white pop effect.
const stableLightningDots = Array.from({ length: 36 }).map((_, i) => {
  const left = `${(i * 11.3 + 5) % 92 + 4}%`;
  const top = `${(i * 14.7 + 9) % 80 + 10}%`;
  const delay = `${((i * 13) % 20) * 0.1}s`; // tighter delays for fast lightning crackles
  const duration = `${0.35 + ((i * 7) % 7) * 0.08}s`; // extremely fast cycle duration (0.35s to 0.9s)
  return { id: i, left, top, delay, duration };
});

export const DotBanner: React.FC<DotBannerProps> = ({
  title = "Built on how your repository grows."
}) => {
  // We place icons with clear semantic descriptions for the custom hover tooltips
  const bannerIcons = [
    { 
      icon: <Eye size={14} className="text-[#a7f3d0]" />, 
      title: "AST Inspector", 
      desc: "Scans file structure for anomalies" 
    },
    { 
      icon: <Key size={14} className="text-[#a7f3d0]" />, 
      title: "Secrets Guard", 
      desc: "Prevents hardcoded token leaks" 
    },
    { 
      icon: <ShieldCheck size={14} className="text-[#a7f3d0]" />, 
      title: "Merge Check Gating", 
      desc: "Blocks failing PR branch reviews" 
    },
    { 
      icon: <Lock size={14} className="text-[#a7f3d0]" />, 
      title: "Vulnerability Auditor", 
      desc: "Scans external package dependencies" 
    },
    { 
      icon: <Landmark size={14} className="text-[#a7f3d0]" />, 
      title: "Compliance Gatekeeper", 
      desc: "Enforces organizational policies" 
    },
    { 
      icon: <UserCheck size={14} className="text-[#a7f3d0]" />, 
      title: "Maintainer Norms", 
      desc: "Automates code review guidelines" 
    },
    { 
      icon: <Zap size={14} className="text-[#a7f3d0]" />, 
      title: "Live Compiler Feedback", 
      desc: "Hot compiles memory checking on push" 
    }
  ];

  return (
    <div className="flex flex-col md:flex-row border border-slate-800 rounded-none max-w-5xl w-full shadow-lg relative z-10 opaque-card min-h-[140px]">
      {/* Left panel - Dark Green background */}
      <div className="md:w-[35%] bg-[#022c22] p-8 flex items-center z-10">
        <h3 className="text-[28px] font-semibold text-[#a7f3d0] leading-[1.25] tracking-tight font-serif">
          {title}
        </h3>
      </div>

      {/* Vertical divider line */}
      <div className="hidden md:block w-[1px] bg-slate-800 self-stretch z-10"></div>

      {/* Right panel - Dotted grid with scattered pulsing lights & stretched icons */}
      <div className="md:w-[65%] bg-[#0f172a] relative p-8 md:px-14 flex items-center min-h-[120px] z-10">
        
        {/* Dot pattern background - CSS radial-gradient ensures it stretches to cover entire container height */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}></div>

        {/* Scattered Animated White Sparkles (Pulsing out-of-sync randomly via CSS transitions) */}
        {stableLightningDots.map(dot => (
          <div 
            key={dot.id}
            className="absolute w-[4px] h-[4px] rounded-full bg-white pointer-events-none"
            style={{
              left: dot.left,
              top: dot.top,
              animation: `lightning-pulse ${dot.duration} infinite ease-in-out`,
              animationDelay: dot.delay
            }}
          />
        ))}

        {/* Scattered Icons stretched until the end of the banner with expanded padding gap */}
        <div className="relative z-10 banner-icons-grid">
          {bannerIcons.map((item, idx) => (
            <div key={idx} className="banner-icon-container">
              {/* Icon Capsule Button (Uses Glassmorphic Banner Button styles) */}
              <div 
                className="rounded flex items-center justify-center banner-glass-btn banner-icon-btn transform hover:scale-110 active:scale-95 transition-all duration-200 cursor-help"
              >
                {item.icon}
              </div>

              {/* Hover Tooltip - Floating Details Card */}
              <div className="banner-tooltip">
                <div className="bg-[#090d16] border border-slate-800 p-2.5 rounded shadow-2xl text-center">
                  <span className="block text-[11px] font-bold text-white font-mono">{item.title}</span>
                  <span className="block text-[9px] text-slate-400 font-mono mt-0.5 leading-snug">{item.desc}</span>
                </div>
                {/* Small indicator arrow */}
                <div className="w-2.5 h-2.5 bg-[#090d16] border-r border-b border-slate-800 rotate-45 -mt-1.5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
