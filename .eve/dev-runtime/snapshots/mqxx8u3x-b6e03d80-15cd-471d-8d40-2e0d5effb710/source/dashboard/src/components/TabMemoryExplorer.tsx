import React, { useState } from 'react';
import type { CddItem, ChecklistItem, TimelineEvent } from '../mockData';
import { Search, Compass, BookOpen, AlertOctagon, HelpCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface TabMemoryExplorerProps {
  cdds: CddItem[];
  checklists: ChecklistItem[];
  timeline: TimelineEvent[];
  repoName: string;
}

export const TabMemoryExplorer: React.FC<TabMemoryExplorerProps> = ({
  cdds,
  checklists,
  timeline,
  repoName
}) => {
  const [activeCategory, setActiveCategory] = useState<'architecture' | 'checklist' | 'timeline' | 'preferences'>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCddId, setExpandedCddId] = useState<string | null>(null);

  // Filter lists based on search query
  const filteredCdds = cdds.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChecklists = checklists.filter(c => 
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRepoPreferences = (name: string) => {
    switch (name.toLowerCase()) {
      case 'zustand':
        return [
          {
            title: 'Transient State Selectors',
            description: 'Subscribe only to specific primitive keys inside components to prevent unnecessary rendering cycles on global state changes.'
          },
          {
            title: 'State Mutation Safety',
            description: 'State updates must return new state objects. Never mutate the global store state object directly.'
          },
          {
            title: 'Composition Slices Middleware',
            description: 'Keep state slices defined in isolated modules, merging them together in a single centralized global store hook.'
          }
        ];
      case 'valibot':
        return [
          {
            title: 'Functional Schema Tree-Shaking',
            description: 'Import individual functional validators individually instead of using namespaced module imports to maximize bundler tree-shaking.'
          },
          {
            title: 'Pipeline Transformation Order',
            description: 'Place structural schema type checks (e.g., string()) before formatting pipeline operations (e.g., trim()) to prevent runtime exceptions.'
          },
          {
            title: 'Strict Schema Validation',
            description: 'Use strict keys checking schemas for incoming form inputs to prevent raw payload database injection vulnerabilities.'
          }
        ];
      case 'hono':
        return [
          {
            title: 'RegExpRouter Performance',
            description: 'Avoid defining overlapping dynamic wildcard path parameters that break RegExp compilation routing graphs.'
          },
          {
            title: 'Fetch API Standardization',
            description: 'Middleware and controllers must read and return standard Web Fetch Request and Response wrappers for platform-agnostic portability.'
          },
          {
            title: 'Context Lifecycle API',
            description: 'Pass request scoped configurations and database instances strictly via the Hono Context c.set and c.get functions.'
          }
        ];
      case 'precedent':
      default:
        return [
          {
            title: 'Database Pooling Standards',
            description: 'Raw new Client() queries are strictly banned. All db queries must route through PgBouncer central pool connection managers in transaction mode.'
          },
          {
            title: 'Asynchronous Fail-safes',
            description: 'All background orchestrator updates must declare an explicit timeout scope to prevent indefinitely blocking worker tasks.'
          },
          {
            title: 'Structured Memory Compiles',
            description: 'Avoid massive multi-file updates. Distill pull request records iteratively by component boundaries to keep ast compilation buffers clean.'
          }
        ];
    }
  };

  const preferences = getRepoPreferences(repoName);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
      
      {/* Category Sidebar */}
      <div className="md:w-[220px] flex-shrink-0 flex flex-col gap-1">
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-2 block">Categories</span>
        
        <button
          onClick={() => { setActiveCategory('architecture'); setSearchQuery(''); }}
          className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-semibold transition-all text-left border-l-2 ${
            activeCategory === 'architecture' 
              ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
          }`}
        >
          <Compass size={15} />
          <span>CDDs & Architecture</span>
        </button>
 
        <button
          onClick={() => { setActiveCategory('checklist'); setSearchQuery(''); }}
          className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-semibold transition-all text-left border-l-2 ${
            activeCategory === 'checklist' 
              ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
          }`}
        >
          <HelpCircle size={15} />
          <span>Failure Checklists</span>
        </button>
 
        <button
          onClick={() => { setActiveCategory('timeline'); setSearchQuery(''); }}
          className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-semibold transition-all text-left border-l-2 ${
            activeCategory === 'timeline' 
              ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
          }`}
        >
          <BookOpen size={15} />
          <span>Release Timeline</span>
        </button>
 
        <button
          onClick={() => { setActiveCategory('preferences'); setSearchQuery(''); }}
          className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-semibold transition-all text-left border-l-2 ${
            activeCategory === 'preferences' 
              ? 'border-indigo-500 bg-[#121520] text-indigo-400 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121520]/20'
          }`}
        >
          <AlertOctagon size={15} />
          <span>Maintainer Norms</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col bg-[#0c1220] border border-slate-800 p-6 min-w-0">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-900 pb-5 mb-5">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${activeCategory === 'architecture' ? 'design decisions...' : activeCategory === 'checklist' ? 'checklists...' : 'records...'}`}
              className="w-full bg-[#131b2c] border border-slate-800/80 rounded pl-10 pr-4 py-2 text-[14px] outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-[12px] font-mono text-slate-500 whitespace-nowrap">
            {activeCategory === 'architecture' && `${filteredCdds.length} CDDs`}
            {activeCategory === 'checklist' && `${filteredChecklists.length} checks`}
            {activeCategory === 'timeline' && `${timeline.length} events`}
            {activeCategory === 'preferences' && `${preferences.length} preferences`}
          </div>
        </div>

        {/* Dynamic Category Render */}

        {/* 1. CDDs List */}
        {activeCategory === 'architecture' && (
          <div className="space-y-4">
            {filteredCdds.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-[14px]">No compiled architectural decisions found.</div>
            ) : (
              filteredCdds.map(c => {
                const isExpanded = expandedCddId === c.id;
                return (
                  <div 
                    key={c.id}
                    className="border border-slate-800 bg-[#0e1626] rounded transition-all"
                  >
                    <div 
                      onClick={() => setExpandedCddId(isExpanded ? null : c.id)}
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-900/40 select-none"
                    >
                      <div>
                        <h4 className="font-semibold text-[16px] text-slate-200">{c.title}</h4>
                        <p className="text-[13px] text-slate-400 mt-1 line-clamp-1">{c.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-500 px-2 py-0.5 bg-[#172033] border border-slate-900 rounded">
                          {c.sourcePR.split(':')[0]}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-900 bg-[#090e18] space-y-4 text-[14px] leading-relaxed">
                        <div>
                          <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">Context / Motivation</span>
                          <p className="text-slate-300">{c.context}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Alternatives considered</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[13px]">
                              {c.alternatives.map((alt, idx) => <li key={idx}>{alt}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block mb-1">Architectural Trade-offs</span>
                            <p className="text-slate-400 text-[13px]">{c.tradeoffs}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 text-[12px] text-slate-500 font-mono">
                          <span>SOURCE REFERENCED:</span>
                          <a href="#pr" className="text-indigo-400 hover:underline">{c.sourcePR}</a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. Failure Checklists */}
        {activeCategory === 'checklist' && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredChecklists.length === 0 ? (
              <div className="md:col-span-2 text-center py-12 text-slate-500 font-mono text-[14px]">No checks established yet. Connect and build workspace memory.</div>
            ) : (
              filteredChecklists.map(c => (
                <div 
                  key={c.id}
                  className="bg-[#0e1626] border border-slate-800 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-0.5 bg-[#172033] border border-slate-900 font-mono text-[10px] text-indigo-400 uppercase">
                        {c.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        REF: {c.refPR}
                      </span>
                    </div>
                    <h4 className="font-bold text-[14px] text-slate-200 leading-snug">
                      {c.question}
                    </h4>
                    <p className="text-[13px] text-slate-400 mt-2.5">
                      {c.context}
                    </p>
                  </div>
                  <div className="border-t border-slate-900 mt-4 pt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 select-none">
                    <Info size={12} />
                    <span>Compiled from historical reviewers comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Timeline */}
        {activeCategory === 'timeline' && (
          <div className="relative pl-6 border-l border-slate-800 space-y-8 py-3">
            {timeline.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-[14px]">No timeline history compiled.</div>
            ) : (
              timeline.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[31px] w-2.5 h-2.5 rounded-full border border-slate-950 ${
                    item.impact === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                    item.impact === 'Medium' ? 'bg-indigo-400' : 'bg-slate-500'
                  }`}></div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-mono text-[12px] text-slate-500">{item.date}</span>
                      <span className="text-[12px] font-mono font-semibold text-indigo-400">{item.prNumber}</span>
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase border ${
                        item.impact === 'High' ? 'bg-rose-950/20 border-rose-900 text-rose-400' :
                        item.impact === 'Medium' ? 'bg-indigo-950/20 border-indigo-900 text-indigo-400' :
                        'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        {item.impact} impact
                      </span>
                    </div>

                    <h4 className="font-bold text-[16px] text-slate-200 mt-1.5">{item.title}</h4>
                    <p className="text-[13px] text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="text-[11px] font-mono text-slate-500 mt-2 select-none">
                      Author: <span className="text-slate-300 font-semibold">{item.author}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Maintainer preferences */}
        {activeCategory === 'preferences' && (
          <div className="space-y-6">
            {preferences.map((pref, index) => (
              <div key={index} className="p-4 bg-slate-900/30 border border-slate-800/80">
                <h4 className="font-bold text-[15px] text-slate-200 mb-2 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                  <span>{pref.title}</span>
                </h4>
                <p className="text-[13.5px] text-slate-400 leading-relaxed font-sans">
                  {pref.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
