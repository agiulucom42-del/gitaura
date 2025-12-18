
import React, { useState, useEffect } from 'react';
import { AnalysisMode, AppState, OutputLanguage, HistoryItem, AnalysisType, RepoInfo } from './types';
import { fetchRepoData, parseGithubUrl } from './services/githubService';
import { analyzeRepoWithGemini, compareReposWithGemini } from './services/geminiService';
import { loadApiConfig, isApiConfigReady } from './services/configService';
import { saveAnalysis, getAllAchievements } from './services/storageService';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ScoreCard } from './components/ScoreCard';
import { CritiqueSection } from './components/CritiqueSection';
import { MagicalRewrite } from './components/MagicalRewrite';
import { SocialShare } from './components/SocialShare';
import { BadgeGenerator } from './components/BadgeGenerator';
import { RadarChart } from './components/RadarChart';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';
import { PricingModal } from './components/PricingModal';
import { PremiumLock } from './components/PremiumLock';
import { ComparisonView } from './components/ComparisonView';
import { SquadView } from './components/SquadView';
import { PersonaCard } from './components/PersonaCard';
import { FortuneTeller } from './components/FortuneTeller';
import { Confetti } from './components/Confetti';
import { ApiSetupGuide } from './components/ApiSetupGuide';
import { UserProfile } from './components/UserProfile';
import { AchievementQueue } from './components/AchievementNotification';
import { ProfileBadge } from './components/BadgeSystem';
import { t } from './locales';

function App() {
  const [url, setUrl] = useState('');
  const [url2, setUrl2] = useState('');
  const [squadUrls, setSquadUrls] = useState<string[]>(['', '', '']);
  
  const [analysisType, setAnalysisType] = useState<AnalysisType>('SINGLE');
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.MARKETING);
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.TR);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Yeni state'ler
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  
  const [state, setState] = useState<AppState>({
    status: 'IDLE',
    error: null,
    analysisType: 'SINGLE',
    repoInfo: null,
    repoInfo2: null,
    analysis: null,
    comparison: null,
    squadResults: undefined,
    rateLimitRemaining: undefined,
    history: []
  });

  const txt = t[language];

  // API yapılandırmasını kontrol et
  useEffect(() => {
    const configCheck = isApiConfigReady();
    if (!configCheck.ready) {
      setShowApiSetup(true);
    }
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('gitaura_history');
    if (savedHistory) {
      try {
        setState(s => ({ ...s, history: JSON.parse(savedHistory) }));
      } catch (e) {
        console.error("History parse error", e);
      }
    }
    const config = loadApiConfig();
    if (config.githubToken) {
      setGithubToken(config.githubToken);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (state.status !== 'ANALYZING' && state.status !== 'FETCHING_REPO') {
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status]);

  const handleSaveToken = (token: string) => {
    setGithubToken(token);
    localStorage.setItem('gitaura_github_token', token);
  };

  const addToHistory = (owner: string, name: string, score: number) => {
    const newItem: HistoryItem = {
      id: `${owner}-${name}-${Date.now()}`,
      owner,
      name,
      score,
      date: Date.now()
    };
    
    setState(prev => {
      const filtered = prev.history.filter(h => h.owner !== owner || h.name !== name);
      const newHistory = [newItem, ...filtered].slice(0, 6);
      localStorage.setItem('gitaura_history', JSON.stringify(newHistory));
      return { ...prev, history: newHistory };
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('gitaura_history');
    setState(s => ({ ...s, history: [] }));
  };

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setAnalysisType('SINGLE');
  };

  const handleSquadUrlChange = (index: number, value: string) => {
    const newUrls = [...squadUrls];
    newUrls[index] = value;
    setSquadUrls(newUrls);
  };

  const addSquadMember = () => {
    if (squadUrls.length < 4) {
      setSquadUrls([...squadUrls, '']);
    }
  };

  const removeSquadMember = (index: number) => {
    if (squadUrls.length > 2) {
      const newUrls = squadUrls.filter((_, i) => i !== index);
      setSquadUrls(newUrls);
    }
  };

  const generateReportMarkdown = () => {
    if (!state.analysis || !state.repoInfo) return '';
    return `# ✦ GitAura ${txt.report.title}

**${txt.results.repo}:** [${state.repoInfo.owner}/${state.repoInfo.name}](https://github.com/${state.repoInfo.owner}/${state.repoInfo.name})
**${txt.report.date}:** ${new Date().toLocaleDateString(language === OutputLanguage.TR ? 'tr-TR' : 'en-US')}

## ${state.analysis.score}/100 • ${state.analysis.rank}
> "${state.analysis.summary}"

---

### ${txt.report.metrics}
| Metric | Score |
|--------|------|
| ${txt.results.radarCode} | ${state.analysis.breakdown.codeQuality}/100 |
| ${txt.results.radarDocs} | ${state.analysis.breakdown.documentation}/100 |
| ${txt.results.radarViral} | ${state.analysis.breakdown.virality}/100 |

### ${txt.report.critique}
${state.analysis.critique.map(c => `- ${c}`).join('\n')}

---
*${txt.report.footer}*
`;
  };

  const handleDownloadReport = () => {
    if (!state.analysis || !state.repoInfo) return;
    const md = generateReportMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gitaura-report-${state.repoInfo.name}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateIssue = () => {
    if (!state.analysis || !state.repoInfo) return;
    const md = generateReportMarkdown();
    const title = `GitAura Report: ${state.analysis.score}/100 (${state.analysis.rank})`;
    navigator.clipboard.writeText(md);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 4000);
    const issueUrl = `https://github.com/${state.repoInfo.owner}/${state.repoInfo.name}/issues/new?title=${encodeURIComponent(title)}`;
    window.open(issueUrl, '_blank');
  };

  const handleCompareThis = () => {
    if (!state.repoInfo) return;
    const currentRepoUrl = `https://github.com/${state.repoInfo.owner}/${state.repoInfo.name}`;
    setUrl(currentRepoUrl);
    setUrl2(''); 
    setAnalysisType('VERSUS');
    setState(s => ({
      ...s,
      status: 'IDLE', 
      analysis: null, 
      repoInfo: null
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // API kontrolü
    const configCheck = isApiConfigReady();
    if (!configCheck.ready) {
      setShowApiSetup(true);
      return;
    }
    
    setState(s => ({ ...s, status: 'FETCHING_REPO', error: null }));

    try {
      if (analysisType === 'SINGLE') {
        const parsed = parseGithubUrl(url);
        if (!parsed) throw new Error(txt.errors.invalidUrl);
        const repoData = await fetchRepoData(parsed.owner, parsed.name, githubToken);
        setState(s => ({ 
          ...s, 
          repoInfo: repoData, 
          status: 'ANALYZING',
          rateLimitRemaining: repoData.rateLimitRemaining 
        }));
        const analysis = await analyzeRepoWithGemini(repoData, mode, language);
        
        // Analizi kaydet
        saveAnalysis('SINGLE', mode, repoData, analysis);
        
        setState(s => ({ ...s, analysis, status: 'SUCCESS' }));
        addToHistory(repoData.owner, repoData.name, analysis.score);
        
        // Yüksek skor için konfeti
        if (analysis.score >= 90) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        
        // Başarı kontrolü
        checkNewAchievements();
        
      } else if (analysisType === 'VERSUS') {
        const parsed1 = parseGithubUrl(url);
        const parsed2 = parseGithubUrl(url2);
        if (!parsed1 || !parsed2) throw new Error(txt.errors.invalidUrl);
        
        const [repo1, repo2] = await Promise.all([
          fetchRepoData(parsed1.owner, parsed1.name, githubToken),
          fetchRepoData(parsed2.owner, parsed2.name, githubToken)
        ]);
        
        setState(s => ({ 
          ...s, 
          repoInfo: repo1, 
          repoInfo2: repo2,
          status: 'ANALYZING' 
        }));
        
        const comparison = await compareReposWithGemini(repo1, repo2, mode, language);
        setState(s => ({ ...s, comparison, status: 'SUCCESS' }));
        
      } else if (analysisType === 'SQUAD') {
        const validUrls = squadUrls.filter(u => u.trim());
        if (validUrls.length < 2) throw new Error(txt.errors.squadMin);
        
        const parsedRepos = validUrls.map(u => parseGithubUrl(u)).filter(Boolean) as { owner: string; name: string }[];
        const repoDataArray = await Promise.all(
          parsedRepos.map(p => fetchRepoData(p.owner, p.name, githubToken))
        );
        
        setState(s => ({ ...s, status: 'ANALYZING' }));
        
        const squadResults = await Promise.all(
          repoDataArray.map(async (repo) => ({
            repo,
            analysis: await analyzeRepoWithGemini(repo, mode, language)
          }))
        );
        
        setState(s => ({ ...s, squadResults, status: 'SUCCESS' }));
      }
      
    } catch (error: any) {
      setState(s => ({ ...s, status: 'ERROR', error: error.message }));
    }
  };

  const checkNewAchievements = () => {
    const achievements = getAllAchievements();
    const recentlyUnlocked = achievements.filter(a => 
      a.unlockedAt && Date.now() - a.unlockedAt < 5000
    );
    if (recentlyUnlocked.length > 0) {
      setNewAchievements(recentlyUnlocked);
    }
  };

  const handleApiSetupComplete = () => {
    setShowApiSetup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Arka plan efektleri */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      {/* API Setup Modal */}
      {showApiSetup && (
        <ApiSetupGuide onComplete={handleApiSetupComplete} language={language} />
      )}
      
      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} language={language} />
      )}
      
      {/* Achievement Notifications */}
      {newAchievements.length > 0 && (
        <AchievementQueue achievements={newAchievements} />
      )}
      
      {/* Konfeti */}
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">✦</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GitAura
                </h1>
                <p className="text-sm text-purple-300">{txt.hero.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Profile Badge */}
              <button
                onClick={() => setShowProfile(true)}
                className="hover:scale-110 transition-transform"
              >
                <ProfileBadge size="md" />
              </button>
              
              {/* Settings */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Devamı bir sonraki dosyada */}
    </div>
  );
}

export default App;
