import React from 'react';
import type { MemoryConflict } from '../mockData';
import { ShieldAlert, Check, Split, RefreshCw } from 'lucide-react';

interface TabKnowledgeDoctorProps {
  conflicts: MemoryConflict[];
  onResolve: (conflictId: string, choice: 'left' | 'right' | 'merge' | 'ignore') => void;
}

export const TabKnowledgeDoctor: React.FC<TabKnowledgeDoctorProps> = ({
  conflicts,
  onResolve
}) => {
  const getDiagnosticsScore = () => {
    const remainingCount = conflicts.length;
    const confidence = remainingCount === 0 ? 98 : remainingCount === 1 ? 96 : 94;
    const completeness = remainingCount === 0 ? 100 : remainingCount === 1 ? 99 : 98;
    return {
      confidence,
      completeness,
      issuesCount: remainingCount
    };
  };

  const scores = getDiagnosticsScore();

  return (
    <div className="space-y-8 min-h-[500px]">
      
      {/* 1. Validation Diagnostic Header Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card A: Confidence Score */}
        <div className="bg-[#0c1220] border border-slate-800 p-5 flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 select-none font-mono font-extrabold text-[80px]">
            %
          </div>
          <div>
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest block mb-1">CONFIDENCE INDEX</span>
            <h3 className="text-3xl font-extrabold text-indigo-400">{scores.confidence}%</h3>
            <p className="text-[12.5px] text-slate-400 mt-2">Overall semantic logic consistency score.</p>
          </div>
        </div>

        {/* Card B: Completeness Score */}
        <div className="bg-[#0c1220] border border-slate-800 p-5 flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 select-none font-mono font-extrabold text-[80px]">
            C
          </div>
          <div>
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest block mb-1">COMPLETENESS RATE</span>
            <h3 className="text-3xl font-extrabold text-violet-400">{scores.completeness}%</h3>
            <p className="text-[12.5px] text-slate-400 mt-2">Coverage of PR histories distilled into memory.</p>
          </div>
        </div>

        {/* Card C: Diagnostic Conflicts Status */}
        <div className="bg-[#0c1220] border border-slate-800 p-5 flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 select-none font-mono font-extrabold text-[80px]">
            H
          </div>
          <div>
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest block mb-1">CONFLICT RESOLVER</span>
            <h3 className={`text-3xl font-extrabold ${scores.issuesCount === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {scores.issuesCount === 0 ? 'CLEAN' : `${scores.issuesCount} CONFLICTS`}
            </h3>
            <p className="text-[12.5px] text-slate-400 mt-2">Contradictions identified by validation subagents.</p>
          </div>
        </div>

      </div>

      {/* 2. Actionable Conflict Card List */}
      <div className="space-y-6">
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Actionable Conflict Queue</span>

        {scores.issuesCount === 0 ? (
          <div className="p-12 border border-slate-800 bg-[#0c1220]/40 text-center rounded">
            <Check className="mx-auto text-emerald-400 bg-emerald-950/20 p-2 rounded-full border border-emerald-800 mb-4" size={40} />
            <h4 className="text-lg font-bold text-slate-200">All conflicts resolved!</h4>
            <p className="text-[14px] text-slate-400 mt-1 max-w-sm mx-auto">
              The Knowledge Doctor validated this repository's memory. Memory maps are logically cohesive.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {conflicts.map((c) => (
              <div 
                key={c.id}
                className="bg-[#0c1220] border border-slate-800 overflow-hidden shadow-xl"
              >
                {/* Top description */}
                <div className="p-4 bg-[#0e1626] border-b border-slate-900 flex justify-between items-center">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 font-mono text-[10px] text-indigo-400 uppercase">
                      {c.type}
                    </span>
                    <h4 className="text-[14px] font-bold text-slate-200 mt-2">{c.description}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-rose-400 bg-rose-950/20 border border-rose-900/40 px-3 py-1 rounded text-[11.5px] font-mono select-none">
                    <ShieldAlert size={14} />
                    <span>CONTRADICTION</span>
                  </div>
                </div>

                {/* Side-by-Side statements */}
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-900">
                  
                  {/* Left Statement Block */}
                  <div className="p-6 bg-slate-950/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mb-3 select-none">
                        <span>STATEMENT A (LEFT)</span>
                        <span>{c.leftStatement.date}</span>
                      </div>
                      <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                        "{c.leftStatement.text}"
                      </p>
                    </div>
                    
                    <div className="border-t border-slate-900/50 mt-5 pt-3 flex justify-between items-center">
                      <span className="font-mono text-[12px] text-slate-500">
                        PR SOURCE: <span className="text-indigo-400">{c.leftStatement.sourcePr.split(':')[0]}</span>
                      </span>
                      
                      <button 
                        onClick={() => onResolve(c.id, 'left')}
                        className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 hover:border-white text-[12px] font-semibold transition-all"
                      >
                        Keep Left
                      </button>
                    </div>
                  </div>

                  {/* Right Statement Block */}
                  <div className="p-6 bg-slate-950/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mb-3 select-none">
                        <span>STATEMENT B (RIGHT)</span>
                        <span>{c.rightStatement.date}</span>
                      </div>
                      <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                        "{c.rightStatement.text}"
                      </p>
                    </div>

                    <div className="border-t border-slate-900/50 mt-5 pt-3 flex justify-between items-center">
                      <span className="font-mono text-[12px] text-slate-500">
                        PR SOURCE: <span className="text-indigo-400">{c.rightStatement.sourcePr.split(':')[0]}</span>
                      </span>

                      <button 
                        onClick={() => onResolve(c.id, 'right')}
                        className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 hover:border-white text-[12px] font-semibold transition-all"
                      >
                        Keep Right
                      </button>
                    </div>
                  </div>

                </div>

                {/* Actions Bar (Merge / Ignore) */}
                <div className="p-4 bg-[#0e1626] border-t border-slate-900 flex justify-between select-none">
                  <button 
                    onClick={() => onResolve(c.id, 'ignore')}
                    className="px-3.5 py-1.5 rounded border border-slate-800 text-[12.5px] font-medium hover:bg-slate-900 text-slate-400"
                  >
                    Ignore Warning
                  </button>
                  
                  <button 
                    onClick={() => onResolve(c.id, 'merge')}
                    className="px-4 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 text-[12.5px] font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Split size={14} />
                    <span>Merge Statements</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
