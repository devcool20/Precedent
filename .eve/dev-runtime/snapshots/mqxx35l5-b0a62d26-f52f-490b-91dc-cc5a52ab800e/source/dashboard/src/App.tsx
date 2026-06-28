import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { DashboardHome } from './components/DashboardHome';
import { initialRepositories, initialRepoData, precedentRepoData, zustandRepoData, valibotRepoData, honoRepoData } from './dataState';
import type { RepoData } from './dataState';
import type { Repository, MemoryConflict, Blocker, PrRun, CddItem, TimelineEvent } from './mockData';

type ScreenState = 'landing' | 'onboarding' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('landing');
  const [selectedRepoForOnboarding, setSelectedRepoForOnboarding] = useState<Repository | undefined>(undefined);

  // Stateful Repositories
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const saved = localStorage.getItem('precedent_repositories');
    return saved ? JSON.parse(saved) : initialRepositories;
  });

  // Stateful Repository Data (CDDs, Checklists, Runs, etc.)
  const [repoData, setRepoData] = useState<Record<string, RepoData>>(() => {
    const saved = localStorage.getItem('precedent_repo_data');
    return saved ? JSON.parse(saved) : initialRepoData;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('precedent_repositories', JSON.stringify(repositories));
  }, [repositories]);

  useEffect(() => {
    localStorage.setItem('precedent_repo_data', JSON.stringify(repoData));
  }, [repoData]);

  const handleStartOnboarding = () => {
    setSelectedRepoForOnboarding(undefined);
    setCurrentScreen('onboarding');
  };

  const handleNavigateOnboardingForRepo = (repo: Repository) => {
    setSelectedRepoForOnboarding(repo);
    setCurrentScreen('onboarding');
  };

  // Helper: evaluate PR check status based on blockers and threshold gate
  const evaluatePrStatus = (blockers: Blocker[], threshold: 'strict' | 'balanced' | 'alert'): 'PASS' | 'FLAG' | 'BLOCK' => {
    if (threshold === 'alert') return 'PASS';
    if (blockers.length === 0) return 'PASS';

    const hasCritical = blockers.some(b => b.severity === 'CRITICAL');
    const hasWarning = blockers.some(b => b.severity === 'WARNING');

    if (threshold === 'strict') {
      return (hasCritical || hasWarning) ? 'BLOCK' : 'PASS';
    }

    // balanced
    if (hasCritical) return 'BLOCK';
    if (hasWarning) return 'FLAG';
    return 'PASS';
  };

  // Helper: compute repository-level active PR check status from run list
  const getActivePRCheckForRuns = (runs: PrRun[]): 'PASS' | 'BLOCK' | 'FLAG' | 'NONE' => {
    if (runs.length === 0) return 'NONE';
    if (runs.some(r => r.status === 'BLOCK')) return 'BLOCK';
    if (runs.some(r => r.status === 'FLAG')) return 'FLAG';
    return 'PASS';
  };

  // Callback when terminal build completes
  const handleBuildComplete = async (repoId: string) => {
    const targetRepo = repositories.find(r => r.id === repoId);
    if (!targetRepo) return;

    // Determine stats and default data based on repoId
    let stats = { auditedPRs: 148, blockersCaught: 12, memoryRecords: 728 };
    let fallbackData = precedentRepoData;
    let checkStatus: 'PASS' | 'BLOCK' | 'FLAG' = 'PASS';

    if (repoId === '1') {
      stats = { auditedPRs: 240, blockersCaught: 14, memoryRecords: 1250 };
      fallbackData = zustandRepoData;
      checkStatus = 'PASS';
    } else if (repoId === '2') {
      stats = { auditedPRs: 98, blockersCaught: 7, memoryRecords: 540 };
      fallbackData = valibotRepoData;
      checkStatus = 'BLOCK';
    } else if (repoId === '3') {
      stats = { auditedPRs: 41, blockersCaught: 3, memoryRecords: 195 };
      fallbackData = honoRepoData;
      checkStatus = 'PASS';
    }

    const updatedRepo: Repository = {
      ...targetRepo,
      status: repoId === '2' ? 'Conflicts' : 'Healthy',
      lastBuild: 'Just now',
      activePRCheck: checkStatus,
      stats
    };

    setRepositories(prev => prev.map(r => r.id === repoId ? updatedRepo : r));
    setSelectedRepoForOnboarding(updatedRepo);

    // Fetch memory files from the API Gateway
    try {
      const repoName = `${targetRepo.owner}/${targetRepo.name}`;
      const res = await fetch(`/api/memory?repo=${encodeURIComponent(repoName)}`);
      if (res.ok) {
        const freshData = await res.json();
        setRepoData(prev => ({
          ...prev,
          [repoId]: {
            ...prev[repoId],
            cdds: freshData.cdds && freshData.cdds.length > 0 ? freshData.cdds : fallbackData.cdds,
            checklists: freshData.checklists && freshData.checklists.length > 0 ? freshData.checklists : fallbackData.checklists,
            timeline: freshData.timeline && freshData.timeline.length > 0 ? freshData.timeline : fallbackData.timeline,
            prRuns: fallbackData.prRuns || [],
            conflicts: fallbackData.conflicts || [],
            threshold: fallbackData.threshold || 'balanced',
            apiKeys: fallbackData.apiKeys || prev[repoId]?.apiKeys
          }
        }));
      } else {
        // Fallback for mock offline testing
        setRepoData(prev => ({
          ...prev,
          [repoId]: { ...fallbackData }
        }));
      }
    } catch (err) {
      console.warn('[App] Gateway offline, falling back to static mock data:', err);
      setRepoData(prev => ({
        ...prev,
        [repoId]: { ...fallbackData }
      }));
    }

    setCurrentScreen('dashboard');
  };

  // Conflict Resolution handler
  const handleResolveConflict = (repoId: string, conflictId: string, choice: 'left' | 'right' | 'merge' | 'ignore') => {
    setRepoData(prev => {
      const currentData = prev[repoId];
      if (!currentData) return prev;

      let updatedCdds = [...currentData.cdds];
      let updatedTimeline = [...currentData.timeline];
      const resolvedConflict = currentData.conflicts.find(c => c.id === conflictId);

      if (resolvedConflict && choice !== 'ignore') {
        const statementText = choice === 'left' ? resolvedConflict.leftStatement.text : 
                              choice === 'right' ? resolvedConflict.rightStatement.text : 
                              `Merged: ${resolvedConflict.leftStatement.text} AND ${resolvedConflict.rightStatement.text}`;

        const sourcePr = choice === 'left' ? resolvedConflict.leftStatement.sourcePr : 
                         choice === 'right' ? resolvedConflict.rightStatement.sourcePr : 
                         resolvedConflict.rightStatement.sourcePr;

        // Add a resolved CDD item
        const newCdd: CddItem = {
          id: `cdd-resolved-${Date.now()}`,
          title: `Resolved preference: ${resolvedConflict.type}`,
          description: statementText,
          context: `This rule was verified and resolved by the maintainer in the Knowledge Doctor, choosing ${choice === 'left' ? 'Statement A' : choice === 'right' ? 'Statement B' : 'Merged'}.`,
          alternatives: [resolvedConflict.leftStatement.text, resolvedConflict.rightStatement.text],
          tradeoffs: `Resolved conflict directly from source PRs.`,
          sourcePR: sourcePr
        };

        updatedCdds.push(newCdd);

        // Add a timeline event
        const newTimeline: TimelineEvent = {
          id: `t-resolved-${Date.now()}`,
          prNumber: sourcePr.split(':')[0],
          title: `Conflict Resolved: ${resolvedConflict.type}`,
          date: 'Just now',
          author: 'devcool20',
          impact: 'Medium',
          description: `Resolved contradiction by applying decision: "${statementText}"`
        };

        updatedTimeline.unshift(newTimeline);
      }

      const updatedConflicts = currentData.conflicts.filter(c => c.id !== conflictId);

      // Update repositories status
      setRepositories(repos => repos.map(r => {
        if (r.id !== repoId) return r;
        const newStatus = updatedConflicts.length === 0 ? 'Healthy' : r.status;
        return {
          ...r,
          status: newStatus,
          stats: {
            ...r.stats,
            memoryRecords: r.stats.memoryRecords + (choice !== 'ignore' ? 1 : 0)
          }
        };
      }));

      return {
        ...prev,
        [repoId]: {
          ...currentData,
          cdds: updatedCdds,
          timeline: updatedTimeline,
          conflicts: updatedConflicts
        }
      };
    });
  };

  // Blocker Resolution handler (Apply recommended fix in PR reviews tab)
  const handleClearBlocker = (repoId: string, prId: string, blockerId: string) => {
    setRepoData(prev => {
      const currentData = prev[repoId];
      if (!currentData) return prev;

      const updatedPrRuns = currentData.prRuns.map(run => {
        if (run.id !== prId) return run;
        const updatedBlockers = run.blockers.filter(b => b.id !== blockerId);
        const status = evaluatePrStatus(updatedBlockers, currentData.threshold);
        return {
          ...run,
          blockers: updatedBlockers,
          status
        };
      });

      const activePRCheck = getActivePRCheckForRuns(updatedPrRuns);

      setRepositories(repos => repos.map(r => r.id === repoId ? {
        ...r,
        activePRCheck
      } : r));

      return {
        ...prev,
        [repoId]: {
          ...currentData,
          prRuns: updatedPrRuns
        }
      };
    });
  };

  // Re-run PR audit check by calling /api/review
  const handleReRunPrCheck = async (repoId: string, prId: string) => {
    const targetRepo = repositories.find(r => r.id === repoId);
    const targetData = repoData[repoId];
    if (!targetRepo || !targetData) return;

    const prRun = targetData.prRuns.find(r => r.id === prId);
    if (!prRun) return;

    try {
      // Simulate/post a diff to the API. For testing, we pass a simulated diff
      const diffText = `diff --git a/src/routes/client.ts b/src/routes/client.ts
index 123456..789101 100644
--- a/src/routes/client.ts
+++ b/src/routes/client.ts
@@ -87,7 +87,8 @@
- const client = new Client();
+ import { pool } from '../db/pool';
+ // Use transaction pool helper
+ pool.query("SELECT * FROM users WHERE id = $1", [userId]);`;

      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: `${targetRepo.owner}/${targetRepo.name}`,
          diff: diffText
        })
      });

      if (res.ok) {
        const report = await res.json();
        
        // Update the run status in state based on the review report
        setRepoData(prev => {
          const currentData = prev[repoId];
          const updatedPrRuns = currentData.prRuns.map(run => {
            if (run.id !== prId) return run;
            
            // Map report back to dashboard PrRun shape
            const blockers = (report.blockers || []).map((b: any, index: number) => ({
              id: `b-api-${index}-${Date.now()}`,
              file: 'src/routes/client.ts',
              line: 87,
              severity: 'CRITICAL' as const,
              message: b.issue,
              fix: 'Import connection pool from src/db/pool and use pool.query().'
            }));

            const score = report.score || 'PASS';

            return {
              ...run,
              blockers,
              status: score
            };
          });

          const activePRCheck = getActivePRCheckForRuns(updatedPrRuns);

          setRepositories(repos => repos.map(r => r.id === repoId ? {
            ...r,
            activePRCheck
          } : r));

          return {
            ...prev,
            [repoId]: {
              ...currentData,
              prRuns: updatedPrRuns
            }
          };
        });
      } else {
        throw new Error('Non-ok response from review api');
      }
    } catch (err) {
      console.warn('Failed to perform API review, executing fallback check:', err);
      // Fallback
      setRepoData(prev => {
        const currentData = prev[repoId];
        const updatedPrRuns = currentData.prRuns.map(run => {
          if (run.id !== prId) return run;
          const status = evaluatePrStatus(run.blockers, currentData.threshold);
          return { ...run, status };
        });
        const activePRCheck = getActivePRCheckForRuns(updatedPrRuns);
        setRepositories(repos => repos.map(r => r.id === repoId ? { ...r, activePRCheck } : r));
        return { ...prev, [repoId]: { ...currentData, prRuns: updatedPrRuns } };
      });
    }
  };

  // Settings Threshold updating handler
  const handleUpdateThreshold = (repoId: string, threshold: 'strict' | 'balanced' | 'alert') => {
    setRepoData(prev => {
      const currentData = prev[repoId];
      if (!currentData) return prev;

      const updatedPrRuns = currentData.prRuns.map(run => {
        const status = evaluatePrStatus(run.blockers, threshold);
        return {
          ...run,
          status
        };
      });

      const activePRCheck = getActivePRCheckForRuns(updatedPrRuns);

      setRepositories(repos => repos.map(r => r.id === repoId ? {
        ...r,
        activePRCheck
      } : r));

      return {
        ...prev,
        [repoId]: {
          ...currentData,
          threshold,
          prRuns: updatedPrRuns
        }
      };
    });
  };

  // Settings API key updates
  const handleUpdateApiKeys = (repoId: string, apiKeys: { openai: string, gemini: string, github: string }) => {
    setRepoData(prev => {
      const currentData = prev[repoId];
      if (!currentData) return prev;
      return {
        ...prev,
        [repoId]: {
          ...currentData,
          apiKeys
        }
      };
    });
  };

  const handleLoadMemory = (repoId: string, memory: { cdds: any[], checklists: any[], timeline: any[] }) => {
    setRepoData(prev => {
      const currentData = prev[repoId];
      if (!currentData) return prev;
      return {
        ...prev,
        [repoId]: {
          ...currentData,
          cdds: memory.cdds || [],
          checklists: memory.checklists || [],
          timeline: memory.timeline || []
        }
      };
    });
  };

  const handleResetData = () => {
    localStorage.removeItem('precedent_repositories');
    localStorage.removeItem('precedent_repo_data');
    setRepositories(initialRepositories);
    setRepoData(initialRepoData);
    setCurrentScreen('landing');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {currentScreen === 'landing' && (
        <LandingPage 
          onStartOnboarding={handleStartOnboarding}
          onDirectDashboard={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'onboarding' && (
        <Onboarding 
          initialRepo={selectedRepoForOnboarding}
          repositories={repositories}
          repoData={repoData}
          onBuildComplete={handleBuildComplete}
          onCancel={() => setCurrentScreen(selectedRepoForOnboarding ? 'dashboard' : 'landing')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <DashboardHome 
          repositories={repositories}
          repoData={repoData}
          initialRepo={selectedRepoForOnboarding}
          onNavigateLanding={() => setCurrentScreen('landing')}
          onNavigateOnboarding={handleNavigateOnboardingForRepo}
          onResolveConflict={handleResolveConflict}
          onClearBlocker={handleClearBlocker}
          onReRunPrCheck={handleReRunPrCheck}
          onUpdateThreshold={handleUpdateThreshold}
          onUpdateApiKeys={handleUpdateApiKeys}
          onResetDemo={handleResetData}
          onLoadMemory={handleLoadMemory}
        />
      )}
    </div>
  );
}

export default App;

