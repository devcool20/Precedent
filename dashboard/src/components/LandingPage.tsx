import React, { useState } from 'react';
import { CapsuleButton } from './CapsuleButton';
import type { OptionItem } from './CapsuleButton';
import { CardBig } from './CardBig';
import { CardSmall } from './CardSmall';
import { DotBanner } from './DotBanner';
import { ArrowRight, Bot, Compass, Cpu, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onDirectDashboard: () => void;
}

const testimonials = [
  {
    text: "Precedent routinely catches off-by-ones, edge cases, and even spec/security slips before they hit production.",
    author: "Kyrylo Buha",
    role: "Member of Technical Staff, Writer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
  },
  {
    text: "Writing code faster was never the issue; the bottleneck was always code review. Precedent is solving that one problem and that was attractive.",
    author: "Kiran Kanagasekar",
    role: "Sr. Engineering Manager, TaskRabbit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    text: "The feedback I get from Precedent is that they like that it shows them errors, null pointers, and static checks. It's the edge scenarios that are difficult to catch.",
    author: "Seref Boyer",
    role: "Chief Architect, Visma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },
  {
    text: "Teaching our AI agent why the codebase evolved has completely removed our review bottlenecks. Recommended for all engineering teams.",
    author: "Alex Rivera",
    role: "Principal Architect, Clerk",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onDirectDashboard
}) => {
  // Config for the Capsule Button in Hero
  const agentOptions: OptionItem[] = [
    { id: 'claude', name: 'Claude Sonnet', icon: <Cpu size={16} /> },
    { id: 'windsurf', name: 'Windsurf Agent', icon: <Compass size={16} /> },
    { id: 'chatgpt', name: 'ChatGPT-o1', icon: <Bot size={16} /> },
    { id: 'copilot', name: 'GitHub Copilot', icon: (
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ) },
    { id: 'eve', name: 'Vercel Eve', icon: <Sparkles size={16} /> }
  ];

  const [selectedAgent, setSelectedAgent] = useState('eve');
  const [toast, setToast] = useState<string | null>(null);

  // States for Prompt Card Interactive Demo Flow
  const [demoInput, setDemoInput] = useState('');
  const [demoResponse, setDemoResponse] = useState<React.ReactNode | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const runDemoFlow = (typeText: string, getResponse: () => React.ReactNode) => {
    if (isTyping || isThinking) return;
    
    setDemoInput('');
    setDemoResponse(null);
    setIsTyping(true);
    
    let currentLength = 0;
    const interval = setInterval(() => {
      if (currentLength < typeText.length) {
        setDemoInput(typeText.substring(0, currentLength + 1));
        currentLength++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsThinking(true);
        
        // Simulate AI thinking for 1s
        setTimeout(() => {
          setIsThinking(false);
          setDemoResponse(getResponse());
        }, 1000);
      }
    }, 30); // typing speed
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 overflow-hidden font-sans mesh-gradient-hero">
      {/* Wrapper for sections that have the grid overlay */}
      <div className="relative w-full">
        {/* Background Grid lines */}
        <div className="grid-overlay"></div>

        {/* Header / Navbar (Fixed with Premium Glassmorphism) */}
        <header className="glassy-navbar">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <span className="font-mono text-xl font-bold tracking-wider uppercase text-slate-100">Precedent</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[14px] text-slate-300 font-medium select-none">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Home</a>
              <a href="#features" onClick={(e) => { e.preventDefault(); const sec = document.getElementById('features'); if (sec) sec.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); const sec = document.getElementById('pricing'); if (sec) sec.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" onClick={(e) => { e.preventDefault(); const sec = document.getElementById('testimonials'); if (sec) sec.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Testimonials</a>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={onDirectDashboard}
                className="text-[13px] font-semibold text-slate-300 hover:text-white px-4 py-2 border border-slate-800 rounded-full hover:border-slate-700 transition-all"
              >
                Demo App
              </button>
              <button 
                onClick={onStartOnboarding}
                className="relative group bg-white text-slate-950 font-bold text-[13px] px-5 py-2 rounded-full overflow-hidden transition-all hover:bg-slate-200 active:scale-95 flex items-center gap-1.5"
              >
                <span>Join Now</span>
                <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section (Padding handled via .hero-section in index.css) */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 text-center hero-section">
          <div 
            onClick={() => triggerToast("Vercel Eve subagent orchestration docs are inside the project repository.")}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111c30] border border-slate-800 text-[12px] text-slate-300 mb-8 hover:bg-[#152542] hover:border-slate-700 transition-all cursor-pointer select-none"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Announcing Precedent v1.0: Built on Vercel Eve</span>
            <span className="text-slate-600">|</span>
            <span className="text-indigo-400 font-semibold">Read details →</span>
          </div>

          {/* Large Textured Headline (Space Grotesk Overhaul) */}
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight max-w-4xl mx-auto mb-6 text-slate-100 leading-[1.15] font-sans">
            The reasoning model <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">built for repo memory.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-[19px] leading-relaxed mb-12">
            Precedent extracts pull requests, historical bugs, and developer guidelines into permanent memory. Teach your AI agent why the codebase evolved before it writes a line of code.
          </p>

          {/* Interactive Handoff & Sign in Buttons (Perfectly Aligned, No labels) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 relative z-10">
            <CapsuleButton 
              label="Handoff to"
              options={agentOptions}
              activeId={selectedAgent}
              onChange={setSelectedAgent}
            />
            
            <button 
              onClick={onStartOnboarding}
              className="h-12 px-6 rounded-full bg-white text-slate-950 font-bold text-[14px] border border-slate-200 hover:bg-slate-100 shadow-[0_10px_25px_rgba(255,255,255,0.08)] transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2.5"
              style={{ height: '48px', minWidth: '220px' }}
            >
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-950">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>Sign In with GitHub</span>
            </button>
          </div>

          {/* Nature Preview Box (Fully Opaque Card Layers, Solid bg to block grid) */}
          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-2xl z-10 opaque-card">
            {/* Nature Image background with dark blur overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter saturate-[0.8] brightness-[0.4]"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1500627869374-13cd993b1115?q=80&w=1200&auto=format&fit=crop')`,
                height: '380px'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent"></div>

            {/* Interactive Search query overlay */}
            <div className="relative z-10 px-8 py-12 flex flex-col items-center justify-center min-h-[300px]">
              {/* Opaque prompt box wrapper */}
              <div className="w-full max-w-xl bg-[#090d16] border border-slate-800 rounded-xl p-6 shadow-2xl text-left relative z-10 opaque-card">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-2 select-none">Precedent AI Prompt</span>
                <div className="text-[15px] text-slate-200 font-medium mb-4 flex items-center gap-2 select-none">
                  <span>Ask anything about memory...</span>
                  <span className="w-[2px] h-4 bg-indigo-500 animate-pulse"></span>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. why did we choose PostgreSQL pooling over client mapping?" 
                    className="flex-grow bg-[#131b2c] border border-slate-800 px-4 py-2 text-[14px] text-slate-200 outline-none"
                    value={demoInput}
                    readOnly
                  />
                  <button 
                    onClick={onDirectDashboard}
                    className="px-5 py-2 bg-white text-slate-950 rounded font-bold text-[13px] hover:bg-slate-200 transition-colors"
                  >
                    Ask
                  </button>
                </div>

                {/* Simulated Loading/Thinking state */}
                {isThinking && (
                  <div className="flex items-center gap-2 mt-4 font-mono text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                    <span>Precedent Agent compiling response...</span>
                  </div>
                )}

                {/* Animated AI Response Content */}
                {demoResponse && (
                  <div className="mt-4 border-t border-slate-900 pt-4">
                    {demoResponse}
                  </div>
                )}
              </div>

              {/* Action tags (Completely opaque & animated hover tags) */}
              <div className="flex flex-wrap gap-2.5 mt-8 justify-center max-w-2xl relative z-10">
                <button 
                  onClick={() => runDemoFlow("Analyze my PR blockers", () => (
                    <div className="bg-[#0f172a] border border-slate-800/80 rounded p-4 space-y-3 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          2 CRITICAL BLOCKERS FOUND
                        </span>
                        <span className="text-slate-500">PR #56</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-[#1e1b4b]/30 border-l-2 border-indigo-500 p-2">
                          <span className="text-indigo-400 font-bold block mb-0.5 uppercase tracking-wide">1. AST MUTATOR GATE FAILURE</span>
                          Potential socket listener memory leak in <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">src/server.ts:L142</code>.
                        </div>
                        <div className="bg-[#1e1b4b]/30 border-l-2 border-indigo-500 p-2">
                          <span className="text-indigo-400 font-bold block mb-0.5 uppercase tracking-wide">2. COVERAGE GAP</span>
                          Newly introduced <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">PgBouncerPool</code> methods lack unit test coverage.
                        </div>
                      </div>
                    </div>
                  ))} 
                  className="px-4 py-1.5 rounded-full bg-[#131b2c] border border-slate-800 text-[12px] text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all transform active:scale-95 font-mono shadow-md hover:scale-105"
                >
                  Analyze my PR blockers
                </button>
                
                <button 
                  onClick={() => runDemoFlow("Summarize PR #45 changes", () => (
                    <div className="bg-[#0f172a] border border-slate-800/80 rounded p-4 space-y-3 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-indigo-400 font-bold">PR #45 SUMMARY</span>
                        <span className="text-slate-500">Author: eve-bot</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Migrated database client instantiation to pooled transaction client in <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">src/db.ts</code>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Added PgBouncer transaction-mode compatibility flags.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Updated <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">pg</code> module dependency to <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">v8.11.3</code> in package.json.</span>
                        </div>
                      </div>
                    </div>
                  ))} 
                  className="px-4 py-1.5 rounded-full bg-[#131b2c] border border-slate-800 text-[12px] text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all transform active:scale-95 font-mono shadow-md hover:scale-105"
                >
                  Summarize PR #45 changes
                </button>
                
                <button 
                  onClick={() => runDemoFlow("Review code styling preferred rules", () => (
                    <div className="bg-[#0f172a] border border-slate-800/80 rounded p-4 space-y-3 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-indigo-400 font-bold">CODE STYLING PREFERENCES</span>
                        <span className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider">Active</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 bg-[#020617]/50 border border-slate-800">
                          <span className="text-slate-500 block text-[8px] font-bold">RULE 01: VERBATIM TYPE IMPORTS</span>
                          Always use <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">import type &#123; ... &#125;</code> for TypeScript types.
                        </div>
                        <div className="p-2 bg-[#020617]/50 border border-slate-800">
                          <span className="text-slate-500 block text-[8px] font-bold">RULE 02: STYLING VARIABLES</span>
                          Do not write raw hex colors in JSX; map color tokens inside <code className="text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded">src/index.css</code>.
                        </div>
                      </div>
                    </div>
                  ))} 
                  className="px-4 py-1.5 rounded-full bg-[#131b2c] border border-slate-800 text-[12px] text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all transform active:scale-95 font-mono shadow-md hover:scale-105"
                >
                  Review code styling preferred rules
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* Grid Border Lines spanning throughout sections */}
      <div className="border-t border-slate-900 w-full relative">
        <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-slate-900/60 pointer-events-none"></div>
        <div className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-slate-900/60 pointer-events-none"></div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="font-mono text-[11px] text-indigo-400 uppercase tracking-widest block mb-2">SYSTEM DEMONSTRATION</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Structured Repository Memory</h2>
          <p className="max-w-xl mx-auto text-slate-400 mt-3">
            How we compile, review, and validate code bases using automated Vercel Eve orchestration.
          </p>
        </div>

        {/* Big Card Showcase */}
        <div className="flex justify-center mb-12">
          <CardBig 
            titleText="One page that compiles repository checks & block patterns."
            tags={["Live compile state", "Incremental logs", "Vercel workflows"]}
            asciiArtType="code"
          />
        </div>

        {/* Small Cards Showcase */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <CardSmall 
            description="Push a live compiler update the moment code is pushed."
            tags={["Posted in seconds", "No backlog queue", "SSE logged"]}
            gradientType="blue"
            shapeType="circle"
          />
          <CardSmall 
            description="Trace every conflicting statement in Knowledge Doctor."
            tags={["Conflict resolver", "Left vs Right comparisons", "Source PRs"]}
            gradientType="purple"
            shapeType="quarter-circle"
          />
        </div>

        {/* Banner Section (Centered, shifted down relative to cards above, keeping pricing in place) */}
        <div className="flex justify-center" style={{ marginTop: '130px', marginBottom: '32px' }}>
          <DotBanner title="Built on how your engineering teams work." />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 select-none text-center font-sans pricing-section">
        <div className="text-center mb-12">
          <span className="font-mono text-[11px] text-indigo-400 uppercase tracking-widest block mb-2">FLEXIBLE PLANS</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">Simple, Transparent Pricing</h2>
          <p className="max-w-md mx-auto text-slate-400 mt-3 text-[14px] font-sans leading-relaxed">
            Free for open source public repositories. Upgrade for automated review checkpoints and Knowledge Doctor diagnostics.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 text-left items-stretch">
          {/* Free Plan */}
          <div className="flex flex-col justify-between p-8 border border-slate-800 rounded bg-[#0b0f19] shadow-2xl relative z-10 opaque-card min-h-[440px] hover:border-slate-700 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold bg-emerald-950/50 px-2 py-0.5 border border-emerald-900 rounded">OPEN SOURCE</span>
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Free</h3>
              <div className="my-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white font-sans tracking-tight">$0</span>
                <span className="text-slate-500 font-mono text-[13px] ml-2">/ month</span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-6 font-mono">
                Great for individuals hosting open source tools and AST checks.
              </p>
              
              <div className="h-[1px] bg-slate-800/60 my-6"></div>
              
              <ul className="space-y-3.5 font-mono text-[12px] text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>1 active repository</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Basic AST code checks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>14-day PR review logs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-slate-600">✓</span>
                  <span className="text-slate-500">Community support</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={onStartOnboarding}
              className="mt-8 w-full rounded-full border border-slate-700 bg-slate-900/60 text-slate-100 font-semibold text-[13px] hover:bg-slate-800 transition-all duration-200 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
              style={{ height: '44px' }}
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="flex flex-col justify-between p-8 border-2 border-indigo-500 rounded bg-[#0e1424] shadow-[0_0_35px_rgba(99,102,241,0.2)] relative z-10 opaque-card min-h-[440px] transform md:scale-[1.03] transition-all duration-300 hover:border-indigo-400">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-wider font-bold bg-indigo-950/50 px-2 py-0.5 border border-indigo-900 rounded">DEVELOPER PRO</span>
                <span className="px-2.5 py-0.5 bg-indigo-500 text-slate-950 rounded-full text-[9px] font-mono font-black uppercase tracking-wider select-none">RECOMMENDED</span>
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Pro</h3>
              <div className="my-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white font-sans tracking-tight">$10</span>
                <span className="text-slate-500 font-mono text-[13px] ml-2">/ month</span>
              </div>
              <p className="text-[13px] text-slate-350 leading-relaxed mb-6 font-mono">
                Enhanced AST logic gating for fast-moving developer workflows.
              </p>
              
              <div className="h-[1px] bg-slate-800/60 my-6"></div>
              
              <ul className="space-y-3.5 font-mono text-[12px] text-slate-200">
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>5 active repositories</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Infinite PR memory logs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Automated AST Gating checks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Credential & Secrets Guard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>24/7 Priority Support</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={onStartOnboarding}
              className="mt-8 w-full rounded-full bg-white text-slate-950 font-bold text-[13px] hover:bg-slate-200 transition-all duration-200 active:scale-95 flex items-center justify-center shadow-2xl cursor-pointer"
              style={{ height: '44px' }}
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between p-8 border border-slate-800 rounded bg-[#0b0f19] shadow-2xl relative z-10 opaque-card min-h-[440px] hover:border-slate-700 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold bg-emerald-950/50 px-2 py-0.5 border border-emerald-900 rounded">ORGANIZATION TEAM</span>
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Enterprise</h3>
              <div className="my-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white font-sans tracking-tight">$25</span>
                <span className="text-slate-500 font-mono text-[13px] ml-2">/ month</span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-6 font-mono">
                Advanced diagnostics and SLA gating for corporate repositories.
              </p>
              
              <div className="h-[1px] bg-slate-800/60 my-6"></div>
              
              <ul className="space-y-3.5 font-mono text-[12px] text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Unlimited repositories</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Dedicated compile runner nodes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Custom AST Policy Engine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Knowledge Doctor Diagnostics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Enterprise SLA & Slack gate</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={onStartOnboarding}
              className="mt-8 w-full rounded-full border border-slate-700 bg-slate-900/60 text-slate-100 font-semibold text-[13px] hover:bg-slate-850 transition-all duration-200 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
              style={{ height: '44px' }}
            >
              Get Enterprise
            </button>
          </div>
        </div>
      </section>
      </div> {/* Close grid-overlay sections wrapper */}

      {/* Testimonials Carousel Section */}
      <section id="testimonials" className="relative z-10 select-none overflow-hidden w-full testimonials-section">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-100">
            Why teams prefer <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent font-sans">Precedent</span>
          </h2>
        </div>

        {/* Carousel marquee track */}
        <div className="marquee-container w-full relative">
          <div className="marquee-track flex gap-6">
            {/* Render items first time */}
            {testimonials.map((item, idx) => (
              <div key={`t1-${idx}`} className="testimonial-card flex flex-col justify-between p-6 rounded border border-slate-800 bg-[#0c1220] shadow-lg relative z-10 opaque-card">
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400 mb-4">
                    <path d="M4.5 12h3c.8 0 1.5-.7 1.5-1.5v-3C9 6.7 8.3 6 7.5 6h-3C3.7 6 3 6.7 3 7.5v3c0 .8.7 1.5 1.5 1.5zm11 0h3c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5h-3c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5zM4 14c2.5 0 4.5 2 4.5 4.5S6.5 23 4 23v-2c1.4 0 2.5-1.1 2.5-2.5S5.4 16 4 16v-2zm11 0c2.5 0 4.5 2 4.5 4.5S17.5 23 15 23v-2c1.4 0 2.5-1.1 2.5-2.5S16.4 16 15 16v-2z" fill="currentColor"/>
                  </svg>
                  <p className="text-slate-350 text-[13.5px] leading-relaxed font-mono" style={{ whiteSpace: 'normal' }}>
                    "{item.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 border-t border-slate-900 pt-4 font-mono">
                  <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full border border-slate-800" />
                  <div>
                    <span className="block text-[12px] font-bold text-white font-mono">{item.author}</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate items for infinite marquee loop */}
            {testimonials.map((item, idx) => (
              <div key={`t2-${idx}`} className="testimonial-card flex flex-col justify-between p-6 rounded border border-slate-800 bg-[#0c1220] shadow-lg relative z-10 opaque-card">
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400 mb-4">
                    <path d="M4.5 12h3c.8 0 1.5-.7 1.5-1.5v-3C9 6.7 8.3 6 7.5 6h-3C3.7 6 3 6.7 3 7.5v3c0 .8.7 1.5 1.5 1.5zm11 0h3c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5h-3c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5zM4 14c2.5 0 4.5 2 4.5 4.5S6.5 23 4 23v-2c1.4 0 2.5-1.1 2.5-2.5S5.4 16 4 16v-2zm11 0c2.5 0 4.5 2 4.5 4.5S17.5 23 15 23v-2c1.4 0 2.5-1.1 2.5-2.5S16.4 16 15 16v-2z" fill="currentColor"/>
                  </svg>
                  <p className="text-slate-350 text-[13.5px] leading-relaxed font-mono" style={{ whiteSpace: 'normal' }}>
                    "{item.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 border-t border-slate-900 pt-4 font-mono">
                  <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full border border-slate-800" />
                  <div>
                    <span className="block text-[12px] font-bold text-white font-mono">{item.author}</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blocked Grid Footer (Replicating footer.png layout & mesh gradient) */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#0e1420] mesh-gradient-footer pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Block Row */}
          <div className="grid lg:grid-cols-4 border-b border-slate-800/80">
            {/* Block 1 (takes 2 columns conceptually or wide grid item on lg, full width on mobile) */}
            <div className="lg:col-span-2 p-8 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-2 mb-4 select-none">
                  <span className="font-mono text-lg font-bold tracking-wider uppercase">Precedent</span>
                </div>
                <p className="text-slate-400 text-[14px] leading-relaxed max-w-md">
                  Precedent was founded with the goal of teaching AI coding agents context. We combine deep structural code extraction, AST mapping, and historical review distillation to build developer memories.
                </p>
              </div>
              <div className="mt-8">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-1">CONTACT US</span>
                <a href="mailto:hello@precedent.dev" onClick={(e) => { e.preventDefault(); triggerToast("Precedent contact: hello@precedent.dev. Drop us a line!"); }} className="text-slate-300 hover:text-white text-[14px] font-medium transition-colors">
                  hello@precedent.dev
                </a>
              </div>
            </div>

            {/* Sub-grid container for Navigation & Support to sit side-by-side on all screens */}
            <div className="lg:col-span-2 grid grid-cols-2">
              {/* Block 2 (Navigation) */}
              <div className="p-8 border-r border-slate-800/80 flex flex-col min-h-[220px]">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-4">NAVIGATION</span>
                <ul className="space-y-3 text-[14px] font-medium text-slate-400">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); triggerToast("Precedent was founded in 2026 to bring AST memory to coding agents."); }} className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#careers" onClick={(e) => { e.preventDefault(); triggerToast("We are hiring agentic systems engineers! Contact hello@precedent.dev"); }} className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#blog" onClick={(e) => { e.preventDefault(); triggerToast("Engineering Blog details coming soon!"); }} className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>

              {/* Block 3 (Support) */}
              <div className="p-8 flex flex-col min-h-[220px]">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-4">SUPPORT</span>
                <ul className="space-y-3 text-[14px] font-medium text-slate-400">
                  <li><a href="#help" onClick={(e) => { e.preventDefault(); triggerToast("Check the project README.md for installation instructions."); }} className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); triggerToast("Contact hello@precedent.dev for queries."); }} className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#faq" onClick={(e) => { e.preventDefault(); triggerToast("FAQ: Yes, Precedent works with all major Git providers."); }} className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#chat" onClick={(e) => { e.preventDefault(); triggerToast("Agent support is offline. Try building the repository memory!"); }} className="hover:text-white transition-colors">Live Chat</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Row divided into 4 blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800/80 text-[12px] font-mono tracking-wider font-semibold text-slate-400">
            <a href="#instagram" onClick={(e) => { e.preventDefault(); triggerToast("Social handles coming soon. Follow Vercel Eve updates!"); }} className="p-4 border-r border-slate-800/80 flex items-center justify-between hover:bg-slate-900/30 hover:text-white transition-all">
              <span>INSTAGRAM</span>
              <span>↗</span>
            </a>
            <a href="#facebook" onClick={(e) => { e.preventDefault(); triggerToast("Social handles coming soon. Follow Vercel Eve updates!"); }} className="p-4 border-r border-slate-800/80 md:border-r border-slate-800/80 flex items-center justify-between hover:bg-slate-900/30 hover:text-white transition-all">
              <span>FACEBOOK</span>
              <span>↗</span>
            </a>
            <a href="#twitter" onClick={(e) => { e.preventDefault(); triggerToast("Social handles coming soon. Follow Vercel Eve updates!"); }} className="p-4 border-r border-slate-800/80 flex items-center justify-between hover:bg-slate-900/30 hover:text-white transition-all">
              <span>TWITTER</span>
              <span>↗</span>
            </a>
            <a href="#behance" onClick={(e) => { e.preventDefault(); triggerToast("Social handles coming soon. Follow Vercel Eve updates!"); }} className="p-4 flex items-center justify-between hover:bg-slate-900/30 hover:text-white transition-all">
              <span>BEHANCE</span>
              <span>↗</span>
            </a>
          </div>

          {/* Giant background cropped typography water mark */}
          <div className="relative pt-12 pb-4 overflow-hidden select-none pointer-events-none text-center">
            <h2 className="text-[110px] md:text-[180px] font-bold font-sans tracking-tight text-slate-950/20 leading-none uppercase">
              Precedent
            </h2>
          </div>
        </div>
      </footer>

      {/* Floating Glassmorphism Toast Component */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 bg-[#0d1527]/90 backdrop-blur-md border border-indigo-500/40 rounded-lg text-[13px] text-indigo-300 font-mono shadow-[0_4px_30px_rgba(99,102,241,0.25)] flex items-center gap-2.5 animate-slideLeft">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
