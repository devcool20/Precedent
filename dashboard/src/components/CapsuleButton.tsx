import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface OptionItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CapsuleButtonProps {
  label: string;
  options: OptionItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const CapsuleButton: React.FC<CapsuleButtonProps> = ({
  label,
  options,
  activeId,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeOption = options.find(opt => opt.id === activeId) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} style={{ zIndex: 100 }}>
      {/* Expanded items vertical stack floating backdrop */}
      {isOpen && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          style={{
            bottom: 'calc(100% + 12px)',
            zIndex: 99
          }}
        >
          {options
            .filter(opt => opt.id !== activeId)
            .map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className="pointer-events-auto w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-500 shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                title={opt.name}
                style={{
                  animation: `popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  animationDelay: `${i * 50}ms`,
                  opacity: 0,
                }}
              >
                {opt.icon}
              </button>
            ))}
        </div>
      )}

      {/* Main Capsule Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white text-slate-900 rounded-full pl-6 pr-4 shadow-[0_10px_25px_rgba(255,255,255,0.08)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.12)] cursor-pointer select-none border border-slate-200 transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px]"
        style={{ height: '48px', minWidth: '220px', boxSizing: 'border-box' }}
      >
        <span className="font-semibold text-[15px] tracking-wide mr-3">{label}</span>
        
        {/* Active Icon Bubble */}
        <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-white mr-4 shadow-inner">
          {activeOption.icon}
        </div>
        
        {/* Divider line */}
        <div className="h-6 w-[1px] bg-slate-200 mr-3"></div>
        
        {/* Chevron */}
        <div className="text-slate-500 hover:text-slate-800 transition-colors">
          {isOpen ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.6);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}} />
    </div>
  );
};
