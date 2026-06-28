import React, { useState, useEffect } from 'react';
import type { Repository } from '../mockData';
import { CapsuleButton } from './CapsuleButton';
import type { OptionItem } from './CapsuleButton';
import { TabMemoryExplorer } from './TabMemoryExplorer';
import { TabPrReviews } from './TabPrReviews';
import { TabKnowledgeDoctor } from './TabKnowledgeDoctor';
import { TabSettings } from './TabSettings';
import { FolderGit2, HardDrive, GitCompare, ShieldCheck, Settings, Home, RefreshCw } from 'lucide-react';
import type { RepoData } from '../dataState';

interface DashboardHomeProps {
  repositories: Repository[];
  repoData: Record<string, RepoData>;
  initialRepo?: Repository;
  onNavigateLanding: () => void;
  onNavigateOnboarding: (repo: Repository) => void;
  onResolveConflict: (repoId: string, conflictId: string, choice: 'left' | 'right' | 'merge' | 'ignore') => void;
  onClearBlocker: (repoId: string, prId: string, blockerId: string) => void;
  onReRunPrCheck: (repoId: string, prId: string) => void;
  onUpdateThreshold: (repoId: string, threshold: 'strict' | 'balanced' | 'alert') => void;
  onUpdateApiKeys: (repoId: string, apiKeys: { openai: string, gemini: string, github: string }) => void;
  onResetDemo: () => void;
  onLoadMemory?: (repoId: string, memory: { cdds: any[], checklists: any[], timeline: any[] }) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  repositories,
  repoData,
  initialRepo,
  onNavigateLanding,
  onNavigateOnboarding,
  onResolveConflict,
  onClearBlocker,
  onReRunPrCheck,
  onUpdateThreshold,
  onUpdateApiKeys,
  onResetDemo,
  onLoadMemory
}) => {
  const [activeRepoId, setActiveRepoId] = useState<string>(initialRepo?.id || repositories[0].id);
  const [activeTab, setActiveTab] = useState<'memory' | 'reviews' | 'doctor' | 'settings'>('memory');

  const activeRepo = repositories.find(r => r.id === activeRepoId) || repositories[0];
  const activeRepoData = repoData[activeRepo.id] || repoData[repositories[0].id];

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const repoName = `${activeRepo.owner}/${activeRepo.name}`;
        const res = await fetch(`/api/memory?repo=${encodeURIComponent(repoName)}`);
        if (res.ok) {
          const freshMemory = await res.json();
          if (onLoadMemory) {
            onLoadMemory(activeRepoId, freshMemory);
          }
        }
      } catch (err) {
        console.warn('[DashboardHome] Failed to load memory from API:', err);
      }
    };
    fetchMemory();
  }, [activeRepoId]);

  // Set up repo switcher options for CapsuleButton
  const repoOptions: OptionItem[] = repositories.map(repo => ({
    id: repo.id,
    name: `${repo.owner}/${repo.name}`,
    icon: <FolderGit2 size={16} />
  }));

  const handleRepoChange = (id: string) => {
    const selected = repositories.find(r => r.id === id);
    if (selected) {
      if (selected.status === 'Idle') {
        // Trigger onboarding for idle repositories
        onNavigateOnboarding(selected);
      } else {
        setActiveRepoId(selected.id);
        // Reset tab to memory explorer on repo switch
        setActiveTab('memory');
      }
    }
  };

  const getStatusClass = (status: 'Healthy' | 'Conflicts' | 'Idle') => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-950/20 border-emerald-800 text-emerald-400';
      case 'Conflicts':
        return 'bg-rose-950/20 border-rose-800 text-rose-400';
      case 'Idle':
      default:
        return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  const handleTriggerRebuild = () => {
    onNavigateOnboarding(activeRepo);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col relative">
      
      {/* Background Grid Lines */}
      <div className="grid-overlay"></div>

      {/* Main Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            
            {/* Logo */}
            <div 
              onClick={onNavigateLanding}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="font-mono text-lg font-bold tracking-wider uppercase">Precedent</span>
            </div>

            {/* Vertical line divider */}
            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* Repo Switcher (The Capsule Button!) */}
            <div className="flex items-center">
              <CapsuleButton 
                label="Active repo"
                options={repoOptions}
                activeId={activeRepo.id}
                onChange={handleRepoChange}
              />
            </div>
          </div>

          {/* Profile / Demo navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-900/40 bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 rounded font-mono text-[12px] transition-all"
              title="Reset all states and local storage back to defaults"
            >
              <RefreshCw size={13} className="animate-pulse" />
              <span>Reset State</span>
            </button>
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded font-mono text-[12px] transition-all"
            >
              <Home size={13} />
              <span>Landing Page</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center font-mono font-bold text-[13px] text-indigo-400 select-none" title="User Account">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Repo Stats Banner Row */}
      <section className="relative z-10 border-b border-slate-900 bg-[#0b0f19] select-none">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Active Repo Details */}
          <div className="flex items-center gap-3.5">
            <h2 className="text-xl font-bold font-mono tracking-tight text-slate-200">
              {activeRepo.owner}/{activeRepo.name}
            </h2>
            <span className={`px-2.5 py-0.5 rounded border text-[11px] font-mono font-semibold uppercase ${getStatusClass(activeRepo.status)}`}>
              {activeRepo.status}
            </span>
          </div>

          {/* Micro Stats Grid */}
          <div className="flex gap-4 font-mono text-[12px]">
            <div className="bg-[#0c1220] border border-slate-800/60 px-4 py-2.5 flex flex-col min-w-[120px]">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1 select-none">AUDITED PRS</span>
              <span className="text-slate-200 font-bold text-sm">{activeRepo.stats.auditedPRs}</span>
            </div>
            <div className="bg-[#0c1220] border border-slate-800/60 px-4 py-2.5 flex flex-col min-w-[120px]">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1 select-none">BLOCKERS caught</span>
              <span className="text-rose-400 font-bold text-sm">{activeRepo.stats.blockersCaught}</span>
            </div>
            <div className="bg-[#0c1220] border border-slate-800/60 px-4 py-2.5 flex flex-col min-w-[120px]">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1 select-none">MEMORY RECORDS</span>
              <span className="text-indigo-400 font-bold text-sm">{activeRepo.stats.memoryRecords}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Dashboard Layout Shell */}
      {activeRepo.status === 'Idle' ? (
        <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex-grow w-full flex flex-col items-center justify-center text-center animate-fadeIn select-none">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <HardDrive size={30} />
          </div>
          
          <h3 className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
            Repository Memory Offline
          </h3>
          <p className="max-w-md text-slate-400 mt-3 text-[14.5px] leading-relaxed">
            Historical PR memory and AST constraints have not been compiled for <strong className="text-indigo-400">{activeRepo.owner}/{activeRepo.name}</strong> yet. Initialize the build to run Vercel Eve audit checks.
          </p>

          <button 
            onClick={handleTriggerRebuild}
            className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[13.5px] font-bold transition-all shadow-[0_4px_20px_rgba(99,102,241,0.3)] active:scale-95 flex items-center gap-2"
          >
            <RefreshCw size={14} className="animate-pulse" />
            <span>Initialize Memory Build</span>
          </button>
        </main>
      ) : (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex-grow w-full flex flex-col md:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="md:w-[200px] flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-1 border-b md:border-b-0 border-slate-900/60 select-none">
            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition-all text-left border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${
                activeTab === 'memory' 
                  ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
              }`}
            >
              <HardDrive size={15} />
              <span>Memory Explorer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition-all text-left border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
              }`}
            >
              <GitCompare size={15} />
              <span>PR Runs & Reviews</span>
            </button>
            
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition-all text-left border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${
                activeTab === 'doctor' 
                  ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
              }`}
            >
              <ShieldCheck size={15} />
              <span className="flex items-center gap-2">
                <span>Knowledge Doctor</span>
                {activeRepoData.conflicts.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition-all text-left border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${
                activeTab === 'settings' 
                  ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
              }`}
            >
              <Settings size={15} />
              <span>Configurations</span>
            </button>
          </div>

          {/* Content Render Panel */}
          <div className="flex-grow min-w-0">
            {activeTab === 'memory' && (
              <TabMemoryExplorer 
                cdds={activeRepoData.cdds} 
                checklists={activeRepoData.checklists}
                timeline={activeRepoData.timeline}
                repoName={activeRepo.name}
              />
            )}
            {activeTab === 'reviews' && (
              <TabPrReviews 
                prRuns={activeRepoData.prRuns}
                onClearBlocker={(prId, blockerId) => onClearBlocker(activeRepo.id, prId, blockerId)}
                onReRunPrCheck={(prId) => onReRunPrCheck(activeRepo.id, prId)}
              />
            )}
            {activeTab === 'doctor' && (
              <TabKnowledgeDoctor 
                conflicts={activeRepoData.conflicts}
                onResolve={(conflictId, choice) => onResolveConflict(activeRepo.id, conflictId, choice)}
              />
            )}
            {activeTab === 'settings' && (
              <TabSettings 
                threshold={activeRepoData.threshold}
                apiKeys={activeRepoData.apiKeys}
                onUpdateThreshold={(threshold) => onUpdateThreshold(activeRepo.id, threshold)}
                onUpdateApiKeys={(keys) => onUpdateApiKeys(activeRepo.id, keys)}
                onTriggerRebuild={handleTriggerRebuild}
              />
            )}
          </div>

        </main>
      )}

      {/* Minor Footer copyright */}
      <footer className="relative z-10 border-t border-slate-900/60 bg-[#080c14] py-6 font-mono text-[11px] text-slate-600 select-none">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span>PRECEDENT CONSOLE v1.0.0-EVE</span>
          <span>© 2026 PRECEDENT CORP. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
};;
