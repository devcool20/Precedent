import React, { useState } from 'react';
import type { PrRun, Blocker } from '../mockData';
import { AlertTriangle, CheckCircle, ChevronRight, XCircle, Terminal, User, Calendar, FileCode, CornerDownRight, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface TabPrReviewsProps {
  prRuns: PrRun[];
  onClearBlocker: (prId: string, blockerId: string) => void;
  onReRunPrCheck: (prId: string) => void;
}

export const TabPrReviews: React.FC<TabPrReviewsProps> = ({
  prRuns,
  onClearBlocker,
  onReRunPrCheck
}) => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>('pr_reviewer');
  const [isReRunning, setIsReRunning] = useState(false);

  const selectedRun = prRuns.find(r => r.id === selectedRunId) || null;

  const getStatusBadge = (status: 'PASS' | 'FLAG' | 'BLOCK') => {
    switch (status) {
      case 'PASS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950/20 border border-emerald-800 text-emerald-400 text-[11px] font-mono font-bold">PASS</span>;
      case 'FLAG':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-yellow-950/20 border border-yellow-800 text-yellow-400 text-[11px] font-mono font-bold">FLAG</span>;
      case 'BLOCK':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-950/20 border border-rose-800 text-rose-400 text-[11px] font-mono font-bold">BLOCK</span>;
    }
  };

  const getStatusIcon = (status: 'PASS' | 'FLAG' | 'BLOCK') => {
    switch (status) {
      case 'PASS':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'FLAG':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'BLOCK':
      default:
        return <XCircle size={16} className="text-rose-400" />;
    }
  };

  const handleReRun = (prId: string) => {
    setIsReRunning(true);
    setTimeout(() => {
      onReRunPrCheck(prId);
      setIsReRunning(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-[500px]">
      
      {/* Table of PR runs */}
      <div className="bg-[#0c1220] border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-[#0e1626]">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">PR Runs Audit History</span>
          <span className="text-[12px] text-slate-400 font-medium">{prRuns.length} audits completed</span>
        </div>

        <div className="overflow-x-auto">
          {prRuns.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-mono text-[14px]">No PR reviews run on this repository yet. Connect code to run audits.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 font-mono text-[11px] text-slate-500 bg-[#070c14]/40 select-none">
                  <th className="p-4 font-semibold">PULL REQUEST</th>
                  <th className="p-4 font-semibold">DATE</th>
                  <th className="p-4 font-semibold">SUBMITTER</th>
                  <th className="p-4 font-semibold">GATE CHECK</th>
                  <th className="p-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-[14px]">
                {prRuns.map((run) => (
                  <tr 
                    key={run.id}
                    onClick={() => setSelectedRunId(run.id)}
                    className="hover:bg-slate-900/30 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <span className="text-indigo-400 font-mono">{run.prNumber}</span>
                        <span>{run.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[13px]">{run.date}</td>
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-mono font-bold">
                          {run.author[0].toUpperCase()}
                        </div>
                        <span>{run.author}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(run.status)}</td>
                    <td className="p-4 text-right">
                      <button className="text-[13px] font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5">
                        <span>View report</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MERGEABILITY REPORT MODAL/DRAWER (Right Side drawer overlay) */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          
          {/* Drawer backdrop escape handler */}
          <div className="flex-grow cursor-pointer" onClick={() => setSelectedRunId(null)}></div>

          {/* Drawer Panel */}
          <div className="w-full max-w-2xl bg-[#090e18] border-l border-slate-800 flex flex-col h-full shadow-2xl relative animate-slideLeft">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-900 bg-[#0e1422] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-mono font-bold text-lg">{selectedRun.prNumber}</span>
                  {getStatusBadge(selectedRun.status)}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mt-2">{selectedRun.title}</h3>
                
                <div className="flex flex-wrap gap-4 mt-3 text-[12px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5"><User size={13} /> {selectedRun.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {selectedRun.date}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedRunId(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Report Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Blocker Summary Check */}
              <div className="p-5 border border-slate-800 bg-[#0c1220] flex gap-4 items-start">
                <div className="mt-0.5">{getStatusIcon(selectedRun.status)}</div>
                <div>
                  <h4 className="font-bold text-slate-200">
                    {selectedRun.status === 'PASS' && "Mergeability Pass: All checks validated successfully!"}
                    {selectedRun.status === 'FLAG' && `Mergeability Warning: ${selectedRun.blockers.length} preference flags active.`}
                    {selectedRun.status === 'BLOCK' && `Mergeability Check FAILED: ${selectedRun.blockers.length} blockers blocking merge.`}
                  </h4>
                  <p className="text-[13px] text-slate-400 mt-1">
                    {selectedRun.status === 'PASS' && "No architectural violations or memory conflicts found. Ready to merge."}
                    {selectedRun.status === 'FLAG' && "Code contains style inconsistencies or maintainer warning preference triggers."}
                    {selectedRun.status === 'BLOCK' && "Must resolve the critical blockers below before the status check is cleared on GitHub."}
                  </p>
                </div>
              </div>

              {/* 1. Consolidated Blocker Panel */}
              {selectedRun.blockers.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Consolidated Blockers list</span>
                  
                  {selectedRun.blockers.map((b) => (
                    <div 
                      key={b.id}
                      className={`p-4 border-l-4 bg-[#0d121c] border-slate-800 flex flex-col gap-2 ${
                        b.severity === 'CRITICAL' ? 'border-l-rose-500' : 'border-l-yellow-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[12px] font-mono">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <FileCode size={13} className="text-indigo-400" />
                          <span>{b.file}:{b.line}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${b.severity === 'CRITICAL' ? 'text-rose-400' : 'text-yellow-400'}`}>
                            {b.severity}
                          </span>
                          <button
                            onClick={() => onClearBlocker(selectedRun.id, b.id)}
                            className="ml-2 px-2.5 py-0.5 bg-[#172033] hover:bg-white hover:text-slate-950 text-indigo-400 rounded text-[10.5px] border border-slate-800 font-mono font-semibold transition-all"
                          >
                            Apply Fix
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-[14px] text-slate-200 font-semibold">{b.message}</p>
                      
                      <div className="bg-slate-950 p-3 rounded font-mono text-[12.5px] border border-slate-900 mt-1 text-slate-400">
                        <div className="flex gap-1.5 items-start">
                          <CornerDownRight size={13} className="text-indigo-400 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-indigo-400 font-semibold">Recommended Fix:</span>
                            <div className="mt-1 text-slate-300 font-mono leading-relaxed">{b.fix}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Parallel Agent Insights (collapsible dropdown lists) */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Parallel Agent Diagnostics</span>
                
                {Object.entries(selectedRun.agentInsights).map(([agentId, logText]) => {
                  const isExpanded = expandedAgent === agentId;
                  const getAgentTitle = (id: string) => {
                    switch (id) {
                      case 'assumption_hunter': return '🔍 assumption_hunter agent';
                      case 'test_gap': return '🧪 test_gap coverage auditor';
                      case 'maintainer': return '👤 maintainer profiling reviewer';
                      case 'pr_reviewer':
                      default:
                        return '🤖 root_pr_reviewer insights';
                    }
                  };

                  return (
                    <div key={agentId} className="border border-slate-800 bg-[#0b0f19] rounded overflow-hidden">
                      <button
                        onClick={() => setExpandedAgent(isExpanded ? null : agentId)}
                        className="w-full flex justify-between items-center p-3 text-left font-mono text-[13px] hover:bg-slate-900/30 transition-colors"
                      >
                        <span className="text-slate-300 font-semibold">{getAgentTitle(agentId)}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-900 bg-slate-950/60 font-mono text-[12.5px] leading-relaxed text-slate-400">
                          <div className="flex gap-2">
                            <Terminal size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                            <pre className="whitespace-pre-wrap select-all font-mono">{logText}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-900 bg-[#0e1422] flex justify-end gap-3 select-none">
              <button 
                onClick={() => setSelectedRunId(null)}
                className="px-4 py-2 border border-slate-800 rounded font-semibold text-[13px] hover:bg-slate-900 text-slate-300"
              >
                Close Report
              </button>
              {selectedRun.status !== 'PASS' && (
                <button 
                  onClick={() => handleReRun(selectedRun.id)}
                  disabled={isReRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold text-[13px] flex items-center gap-2 disabled:opacity-50 min-w-[130px] justify-center transition-all"
                >
                  <RefreshCw size={13} className={isReRunning ? "animate-spin" : ""} />
                  <span>{isReRunning ? "Running..." : "Force Re-Run Check"}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};
