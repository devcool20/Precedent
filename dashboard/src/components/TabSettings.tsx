import React, { useState } from 'react';
import { Sparkles, RefreshCw, Key, Eye, EyeOff } from 'lucide-react';

interface TabSettingsProps {
  threshold: 'strict' | 'balanced' | 'alert';
  apiKeys: {
    openai: string;
    gemini: string;
    github: string;
  };
  onUpdateThreshold: (threshold: 'strict' | 'balanced' | 'alert') => void;
  onUpdateApiKeys: (apiKeys: { openai: string; gemini: string; github: string }) => void;
  onTriggerRebuild: () => void;
}

export const TabSettings: React.FC<TabSettingsProps> = ({
  threshold,
  apiKeys,
  onUpdateThreshold,
  onUpdateApiKeys,
  onTriggerRebuild
}) => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyChange = (keyId: 'openai' | 'gemini' | 'github', value: string) => {
    onUpdateApiKeys({
      ...apiKeys,
      [keyId]: value
    });
  };

  const getThresholdDescription = () => {
    switch (threshold) {
      case 'strict':
        return 'Strict Gate Mode: Pull requests will be BLOCKED if any critical blocker or warning preference check fails. Ideal for strict production compliance.';
      case 'alert':
        return 'Alert-Only Gate Mode: Audits are performed and posted on PR threads, but checks always report PASS. Allows uninterrupted development.';
      case 'balanced':
      default:
        return 'Balanced Gate Mode: Pull requests are BLOCKED on critical architectural failures (e.g. socket leaks), but warnings (e.g. style lint preferences) are only flagged.';
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 min-h-[500px]">
      
      {/* Column A & B: Configuration Fields */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Panel 1: Threshold setting */}
        <div className="bg-[#0c1220] border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="font-bold text-slate-200 text-[15px]">Auditing Threshold gate</h4>
            <p className="text-[12.5px] text-slate-400 mt-1">Configure when Precedent blocks pull requests on GitHub.</p>
          </div>

          {/* Slider buttons */}
          <div className="grid grid-cols-3 gap-2 bg-[#131b2c] p-1 border border-slate-800/80 rounded select-none">
            <button
              onClick={() => onUpdateThreshold('strict')}
              className={`py-2 text-[13px] font-semibold text-center rounded transition-all ${
                threshold === 'strict' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Strict
            </button>
            <button
              onClick={() => onUpdateThreshold('balanced')}
              className={`py-2 text-[13px] font-semibold text-center rounded transition-all ${
                threshold === 'balanced' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => onUpdateThreshold('alert')}
              className={`py-2 text-[13px] font-semibold text-center rounded transition-all ${
                threshold === 'alert' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Alert-Only
            </button>
          </div>

          {/* Descriptive callout */}
          <div className="p-4 bg-[#0a0e18] border-l-2 border-indigo-500/80 text-[13px] text-slate-300 leading-relaxed font-mono">
            {getThresholdDescription()}
          </div>
        </div>

        {/* Panel 2: API Keys Configurations */}
        <div className="bg-[#0c1220] border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-200 text-[15px]">API Keys & Access Tokens</h4>
              <p className="text-[12.5px] text-slate-400 mt-1">Custom API key credentials passed to execution workflows.</p>
            </div>
            <Key size={18} className="text-slate-500" />
          </div>

          <div className="space-y-4">
            {/* Input 1 */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-mono text-slate-400">OPENAI API KEY</label>
              <div className="flex gap-2">
                <input 
                  type={showKeys.openai ? 'text' : 'password'} 
                  value={apiKeys.openai}
                  onChange={e => handleKeyChange('openai', e.target.value)}
                  className="flex-grow bg-[#131b2c] border border-slate-800/80 px-3 py-2 text-[13px] font-mono"
                  placeholder="e.g. sk-proj-..."
                />
                <button 
                  onClick={() => toggleShowKey('openai')}
                  className="px-3 border border-slate-800/80 hover:bg-slate-900 rounded text-slate-400 hover:text-white"
                >
                  {showKeys.openai ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input 2 */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-mono text-slate-400">GEMINI API KEY</label>
              <div className="flex gap-2">
                <input 
                  type={showKeys.gemini ? 'text' : 'password'} 
                  value={apiKeys.gemini}
                  onChange={e => handleKeyChange('gemini', e.target.value)}
                  className="flex-grow bg-[#131b2c] border border-slate-800/80 px-3 py-2 text-[13px] font-mono"
                  placeholder="e.g. AIzaSy-..."
                />
                <button 
                  onClick={() => toggleShowKey('gemini')}
                  className="px-3 border border-slate-800/80 hover:bg-slate-900 rounded text-slate-400 hover:text-white"
                >
                  {showKeys.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input 3 */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-mono text-slate-400">GITHUB ACCESS TOKEN</label>
              <div className="flex gap-2">
                <input 
                  type={showKeys.github ? 'text' : 'password'} 
                  value={apiKeys.github}
                  onChange={e => handleKeyChange('github', e.target.value)}
                  className="flex-grow bg-[#131b2c] border border-slate-800/80 px-3 py-2 text-[13px] font-mono"
                  placeholder="e.g. ghp_..."
                />
                <button 
                  onClick={() => toggleShowKey('github')}
                  className="px-3 border border-slate-800/80 hover:bg-slate-900 rounded text-slate-400 hover:text-white"
                >
                  {showKeys.github ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Column C: Build Actions Sidebar */}
      <div className="space-y-6">
        
        {/* Rebuild Trigger Card */}
        <div className="bg-[#0c1220] border border-slate-800 p-6 flex flex-col justify-between h-[200px]">
          <div>
            <h4 className="font-bold text-slate-200 text-[15px] flex items-center gap-1.5">
              <RefreshCw size={14} className="text-indigo-400" />
              <span>Trigger rebuild</span>
            </h4>
            <p className="text-[12.5px] text-slate-400 mt-2 leading-relaxed">
              Force an immediate rebuild and re-evaluation of the repository memory snapshots. Clears ast indices and re-fetches all merged pull requests.
            </p>
          </div>

          <button 
            onClick={onTriggerRebuild}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded text-[13px] font-bold transition-all shadow-lg text-center"
          >
            Rebuild Repository Memory
          </button>
        </div>

        {/* Informative billing gate mockup */}
        <div className="bg-gradient-to-br from-[#070b16] to-[#0d2218] border border-emerald-950 p-5 rounded space-y-3">
          <h4 className="font-bold text-[14px] text-emerald-400 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Active Subscription</span>
          </h4>
          <p className="text-[12.5px] text-slate-400 leading-relaxed">
            This repository is powered by a Precedent Team tier plan. Status check gates and PR commenters are running.
          </p>
          <div className="text-[11px] font-mono text-emerald-500/80">
            STRIPE LICENSE: ACTIVE
          </div>
        </div>

      </div>

    </div>
  );
};
