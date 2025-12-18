/**
 * Storage Service
 * Analiz sonuçlarını ve kullanıcı verilerini yönetir
 */

import { AnalysisResult, RepoInfo, AnalysisMode, AnalysisType } from '../types';

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  analysisType: AnalysisType;
  mode: AnalysisMode;
  repoInfo: RepoInfo;
  result: AnalysisResult;
  // Versus için
  repoInfo2?: RepoInfo;
  comparisonResult?: any;
  // Squad için
  squadResults?: any[];
}

export interface UserProfile {
  username: string;
  totalAnalyses: number;
  totalScore: number;
  averageScore: number;
  favoriteRepos: string[];
  achievements: string[];
  joinDate: number;
  lastActive: number;
}

const STORAGE_KEYS = {
  ANALYSES: 'gitaura_analyses',
  PROFILE: 'gitaura_profile',
  ACHIEVEMENTS: 'gitaura_achievements',
} as const;

// ============ Analiz Yönetimi ============

/**
 * Yeni analizi kaydet
 */
export const saveAnalysis = (
  analysisType: AnalysisType,
  mode: AnalysisMode,
  repoInfo: RepoInfo,
  result: AnalysisResult,
  repoInfo2?: RepoInfo,
  comparisonResult?: any,
  squadResults?: any[]
): SavedAnalysis => {
  const analysis: SavedAnalysis = {
    id: `${repoInfo.owner}-${repoInfo.name}-${Date.now()}`,
    timestamp: Date.now(),
    analysisType,
    mode,
    repoInfo,
    result,
    repoInfo2,
    comparisonResult,
    squadResults,
  };

  const analyses = getAllAnalyses();
  analyses.unshift(analysis);
  
  // Son 50 analizi sakla
  const trimmedAnalyses = analyses.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(trimmedAnalyses));

  // Profili güncelle
  updateProfileAfterAnalysis(repoInfo, result.score);

  return analysis;
};

/**
 * Tüm analizleri getir
 */
export const getAllAnalyses = (): SavedAnalysis[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading analyses:', error);
    return [];
  }
};

/**
 * Belirli bir repo için analizleri getir
 */
export const getAnalysesByRepo = (owner: string, name: string): SavedAnalysis[] => {
  const analyses = getAllAnalyses();
  return analyses.filter(
    (a) => a.repoInfo.owner === owner && a.repoInfo.name === name
  );
};

/**
 * ID'ye göre analiz getir
 */
export const getAnalysisById = (id: string): SavedAnalysis | null => {
  const analyses = getAllAnalyses();
  return analyses.find((a) => a.id === id) || null;
};

/**
 * Analizi sil
 */
export const deleteAnalysis = (id: string): void => {
  const analyses = getAllAnalyses();
  const filtered = analyses.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(filtered));
};

/**
 * Tüm analizleri sil
 */
export const clearAllAnalyses = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ANALYSES);
};

// ============ Profil Yönetimi ============

/**
 * Kullanıcı profilini getir veya oluştur
 */
export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }

  // Varsayılan profil oluştur
  const defaultProfile: UserProfile = {
    username: 'GitAura User',
    totalAnalyses: 0,
    totalScore: 0,
    averageScore: 0,
    favoriteRepos: [],
    achievements: [],
    joinDate: Date.now(),
    lastActive: Date.now(),
  };

  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
  return defaultProfile;
};

/**
 * Profili güncelle
 */
export const updateProfile = (updates: Partial<UserProfile>): UserProfile => {
  const profile = getUserProfile();
  const updated = { ...profile, ...updates, lastActive: Date.now() };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  return updated;
};

/**
 * Analiz sonrası profili otomatik güncelle
 */
const updateProfileAfterAnalysis = (repoInfo: RepoInfo, score: number): void => {
  const profile = getUserProfile();
  
  const totalAnalyses = profile.totalAnalyses + 1;
  const totalScore = profile.totalScore + score;
  const averageScore = Math.round(totalScore / totalAnalyses);

  updateProfile({
    totalAnalyses,
    totalScore,
    averageScore,
  });

  // Başarıları kontrol et
  checkAndUnlockAchievements(totalAnalyses, score);
};

/**
 * Favori repo ekle/çıkar
 */
export const toggleFavoriteRepo = (owner: string, name: string): void => {
  const profile = getUserProfile();
  const repoId = `${owner}/${name}`;
  
  const isFavorite = profile.favoriteRepos.includes(repoId);
  
  const favoriteRepos = isFavorite
    ? profile.favoriteRepos.filter((id) => id !== repoId)
    : [...profile.favoriteRepos, repoId];

  updateProfile({ favoriteRepos });
};

/**
 * Repo favori mi kontrol et
 */
export const isFavoriteRepo = (owner: string, name: string): boolean => {
  const profile = getUserProfile();
  return profile.favoriteRepos.includes(`${owner}/${name}`);
};

// ============ Başarı Sistemi ============

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_analysis',
    title: 'İlk Adım',
    description: 'İlk analizi tamamla',
    icon: '🎯',
  },
  {
    id: 'analysis_5',
    title: 'Analiz Meraklısı',
    description: '5 analiz tamamla',
    icon: '🔍',
  },
  {
    id: 'analysis_10',
    title: 'Analiz Uzmanı',
    description: '10 analiz tamamla',
    icon: '⭐',
  },
  {
    id: 'analysis_25',
    title: 'Analiz Gurusu',
    description: '25 analiz tamamla',
    icon: '🏆',
  },
  {
    id: 'analysis_50',
    title: 'Analiz Efsanesi',
    description: '50 analiz tamamla',
    icon: '👑',
  },
  {
    id: 'perfect_score',
    title: 'Mükemmellik',
    description: '100 puan al',
    icon: '💎',
  },
  {
    id: 'high_score',
    title: 'Yüksek Performans',
    description: '90+ puan al',
    icon: '🌟',
  },
  {
    id: 'unicorn_hunter',
    title: 'Unicorn Avcısı',
    description: 'Unicorn rütbesi kazan',
    icon: '🦄',
  },
];

/**
 * Tüm başarıları getir
 */
export const getAllAchievements = (): Achievement[] => {
  const profile = getUserProfile();
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlockedAt: profile.achievements.includes(achievement.id)
      ? profile.lastActive
      : undefined,
  }));
};

/**
 * Başarı kilidi aç
 */
export const unlockAchievement = (achievementId: string): boolean => {
  const profile = getUserProfile();
  
  if (profile.achievements.includes(achievementId)) {
    return false; // Zaten açılmış
  }

  const achievements = [...profile.achievements, achievementId];
  updateProfile({ achievements });
  return true; // Yeni açıldı
};

/**
 * Başarıları kontrol et ve aç
 */
const checkAndUnlockAchievements = (totalAnalyses: number, score: number): string[] => {
  const newlyUnlocked: string[] = [];

  // Analiz sayısına göre
  if (totalAnalyses === 1 && unlockAchievement('first_analysis')) {
    newlyUnlocked.push('first_analysis');
  }
  if (totalAnalyses === 5 && unlockAchievement('analysis_5')) {
    newlyUnlocked.push('analysis_5');
  }
  if (totalAnalyses === 10 && unlockAchievement('analysis_10')) {
    newlyUnlocked.push('analysis_10');
  }
  if (totalAnalyses === 25 && unlockAchievement('analysis_25')) {
    newlyUnlocked.push('analysis_25');
  }
  if (totalAnalyses === 50 && unlockAchievement('analysis_50')) {
    newlyUnlocked.push('analysis_50');
  }

  // Puana göre
  if (score === 100 && unlockAchievement('perfect_score')) {
    newlyUnlocked.push('perfect_score');
  }
  if (score >= 90 && unlockAchievement('high_score')) {
    newlyUnlocked.push('high_score');
  }
  if (score >= 90 && unlockAchievement('unicorn_hunter')) {
    newlyUnlocked.push('unicorn_hunter');
  }

  return newlyUnlocked;
};

// ============ İstatistikler ============

/**
 * Kullanıcı istatistiklerini hesapla
 */
export const getUserStats = () => {
  const profile = getUserProfile();
  const analyses = getAllAnalyses();

  const scoreDistribution = {
    unicorn: analyses.filter((a) => a.result.score >= 90).length,
    legendary: analyses.filter((a) => a.result.score >= 80 && a.result.score < 90).length,
    epic: analyses.filter((a) => a.result.score >= 70 && a.result.score < 80).length,
    rare: analyses.filter((a) => a.result.score >= 60 && a.result.score < 70).length,
    common: analyses.filter((a) => a.result.score < 60).length,
  };

  const modeDistribution = {
    marketing: analyses.filter((a) => a.mode === 'MARKETING').length,
    codeQuality: analyses.filter((a) => a.mode === 'CODE_QUALITY').length,
    documentation: analyses.filter((a) => a.mode === 'DOCUMENTATION').length,
  };

  return {
    profile,
    totalAnalyses: analyses.length,
    scoreDistribution,
    modeDistribution,
    recentAnalyses: analyses.slice(0, 10),
    topScores: analyses
      .sort((a, b) => b.result.score - a.result.score)
      .slice(0, 5),
  };
};

/**
 * Verileri dışa aktar (JSON)
 */
export const exportData = (): string => {
  const profile = getUserProfile();
  const analyses = getAllAnalyses();
  
  const data = {
    profile,
    analyses,
    exportedAt: Date.now(),
    version: '1.0',
  };

  return JSON.stringify(data, null, 2);
};

/**
 * Verileri içe aktar
 */
export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
    }
    
    if (data.analyses) {
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(data.analyses));
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
