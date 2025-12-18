import React, { useState, useEffect } from 'react';
import {
  getUserProfile,
  updateProfile,
  getUserStats,
  getAllAchievements,
  exportData,
  importData,
  clearAllAnalyses,
  UserProfile as UserProfileType,
} from '../services/storageService';
import { OutputLanguage } from '../types';

interface UserProfileProps {
  onClose: () => void;
  language: OutputLanguage;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose, language }) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analyses' | 'achievements'>('overview');

  const isTurkish = language === OutputLanguage.TR;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const userProfile = getUserProfile();
    const userStats = getUserStats();
    const userAchievements = getAllAchievements();

    setProfile(userProfile);
    setStats(userStats);
    setAchievements(userAchievements);
    setUsername(userProfile.username);
  };

  const handleSaveUsername = () => {
    if (username.trim()) {
      updateProfile({ username: username.trim() });
      setIsEditing(false);
      loadData();
    }
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitaura-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importData(content)) {
          loadData();
          alert(isTurkish ? 'Veriler başarıyla içe aktarıldı!' : 'Data imported successfully!');
        } else {
          alert(isTurkish ? 'İçe aktarma başarısız!' : 'Import failed!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm(isTurkish ? 'Tüm analiz geçmişini silmek istediğinizden emin misiniz?' : 'Are you sure you want to clear all analysis history?')) {
      clearAllAnalyses();
      loadData();
    }
  };

  if (!profile || !stats) {
    return null;
  }

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-purple-500/30 rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="px-3 py-1 bg-black/30 border border-purple-500/30 rounded text-white"
                      placeholder={isTurkish ? 'Kullanıcı adı' : 'Username'}
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <p className="text-purple-200 text-sm">
                  {isTurkish ? 'Üye olma' : 'Member since'}: {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600/30 text-white border-b-2 border-purple-400'
                : 'text-purple-300 hover:bg-purple-600/10'
            }`}
          >
            {isTurkish ? '📊 Genel Bakış' : '📊 Overview'}
          </button>
          <button
            onClick={() => setActiveTab('analyses')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'analyses'
                ? 'bg-purple-600/30 text-white border-b-2 border-purple-400'
                : 'text-purple-300 hover:bg-purple-600/10'
            }`}
          >
            {isTurkish ? '📈 Analizler' : '📈 Analyses'}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'achievements'
                ? 'bg-purple-600/30 text-white border-b-2 border-purple-400'
                : 'text-purple-300 hover:bg-purple-600/10'
            }`}
          >
            {isTurkish ? '🏆 Başarılar' : '🏆 Achievements'} ({unlockedAchievements.length}/{achievements.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-white">{profile.totalAnalyses}</div>
                  <div className="text-purple-200 text-sm">{isTurkish ? 'Toplam Analiz' : 'Total Analyses'}</div>
                </div>
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-white">{profile.averageScore}</div>
                  <div className="text-purple-200 text-sm">{isTurkish ? 'Ortalama Puan' : 'Average Score'}</div>
                </div>
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
                  <div className="text-purple-200 text-sm">{isTurkish ? 'Açılan Başarı' : 'Unlocked Achievements'}</div>
                </div>
              </div>

              {/* Score Distribution */}
              <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {isTurkish ? 'Puan Dağılımı' : 'Score Distribution'}
                </h3>
                <div className="space-y-2">
                  {[
                    { label: '🦄 Unicorn (90-100)', count: stats.scoreDistribution.unicorn, color: 'bg-purple-500' },
                    { label: '🌟 Legendary (80-89)', count: stats.scoreDistribution.legendary, color: 'bg-indigo-500' },
                    { label: '💎 Epic (70-79)', count: stats.scoreDistribution.epic, color: 'bg-blue-500' },
                    { label: '⚡ Rare (60-69)', count: stats.scoreDistribution.rare, color: 'bg-green-500' },
                    { label: '🌱 Common (0-59)', count: stats.scoreDistribution.common, color: 'bg-gray-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-purple-200">{item.label}</div>
                      <div className="flex-1 bg-gray-700/30 rounded-full h-6 overflow-hidden">
                        <div
                          className={`${item.color} h-full flex items-center justify-end px-2 text-white text-xs font-semibold transition-all`}
                          style={{ width: `${(item.count / profile.totalAnalyses) * 100}%` }}
                        >
                          {item.count > 0 && item.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Scores */}
              {stats.topScores.length > 0 && (
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isTurkish ? '🏅 En Yüksek Puanlar' : '🏅 Top Scores'}
                  </h3>
                  <div className="space-y-2">
                    {stats.topScores.map((analysis: any, index: number) => (
                      <div key={analysis.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                          <span className="text-white">{analysis.repoInfo.owner}/{analysis.repoInfo.name}</span>
                        </div>
                        <span className="text-purple-300 font-bold">{analysis.result.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analyses' && (
            <div className="space-y-4">
              {stats.recentAnalyses.length === 0 ? (
                <div className="text-center py-12 text-purple-200">
                  {isTurkish ? 'Henüz analiz yok' : 'No analyses yet'}
                </div>
              ) : (
                stats.recentAnalyses.map((analysis: any) => (
                  <div key={analysis.id} className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">
                          {analysis.repoInfo.owner}/{analysis.repoInfo.name}
                        </h4>
                        <p className="text-purple-200 text-sm mt-1">
                          {new Date(analysis.timestamp).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-purple-300">
                            {analysis.mode === 'MARKETING' ? '📢 Marketing' : 
                             analysis.mode === 'CODE_QUALITY' ? '🔧 Code Quality' : 
                             '📚 Documentation'}
                          </span>
                          <span className="text-sm text-purple-300">
                            {analysis.analysisType === 'SINGLE' ? '🎯 Single' :
                             analysis.analysisType === 'VERSUS' ? '⚔️ Versus' :
                             '👥 Squad'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{analysis.result.score}</div>
                        <div className="text-sm text-purple-300">{analysis.result.rank}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Unlocked */}
              {unlockedAchievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    ✅ {isTurkish ? 'Açılan Başarılar' : 'Unlocked Achievements'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unlockedAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{achievement.title}</h4>
                            <p className="text-yellow-200 text-sm">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked */}
              {lockedAchievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    🔒 {isTurkish ? 'Kilitli Başarılar' : 'Locked Achievements'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lockedAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-black/20 border border-gray-600/30 rounded-lg p-4 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl grayscale">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 font-semibold">{achievement.title}</h4>
                            <p className="text-gray-400 text-sm">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-purple-500/30 flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            📥 {isTurkish ? 'Verileri Dışa Aktar' : 'Export Data'}
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors cursor-pointer">
            📤 {isTurkish ? 'Verileri İçe Aktar' : 'Import Data'}
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            🗑️ {isTurkish ? 'Geçmişi Temizle' : 'Clear History'}
          </button>
        </div>
      </div>
    </div>
  );
};
