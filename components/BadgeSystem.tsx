import React from 'react';
import { getUserProfile } from '../services/storageService';

interface BadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<BadgeProps> = ({ score, size = 'md', showLabel = true }) => {
  const getRankInfo = (score: number) => {
    if (score >= 90) return { rank: 'Unicorn', emoji: '🦄', color: 'from-purple-500 to-pink-500', border: 'border-purple-400' };
    if (score >= 80) return { rank: 'Legendary', emoji: '🌟', color: 'from-yellow-500 to-orange-500', border: 'border-yellow-400' };
    if (score >= 70) return { rank: 'Epic', emoji: '💎', color: 'from-blue-500 to-cyan-500', border: 'border-blue-400' };
    if (score >= 60) return { rank: 'Rare', emoji: '⚡', color: 'from-green-500 to-emerald-500', border: 'border-green-400' };
    return { rank: 'Common', emoji: '🌱', color: 'from-gray-500 to-gray-600', border: 'border-gray-400' };
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const info = getRankInfo(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${info.color} ${info.border} border-2 rounded-full flex items-center justify-center shadow-lg relative`}
      >
        <span className="absolute">{info.emoji}</span>
        <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
      </div>
      {showLabel && (
        <div className="text-center">
          <div className="text-white font-bold">{score}</div>
          <div className="text-xs text-purple-300">{info.rank}</div>
        </div>
      )}
    </div>
  );
};

interface ProfileBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({ size = 'md' }) => {
  const profile = getUserProfile();

  const getLevelInfo = (totalAnalyses: number) => {
    if (totalAnalyses >= 50) return { level: 'Master', emoji: '👑', color: 'from-yellow-500 to-orange-500' };
    if (totalAnalyses >= 25) return { level: 'Expert', emoji: '🏆', color: 'from-purple-500 to-pink-500' };
    if (totalAnalyses >= 10) return { level: 'Pro', emoji: '⭐', color: 'from-blue-500 to-cyan-500' };
    if (totalAnalyses >= 5) return { level: 'Enthusiast', emoji: '🔍', color: 'from-green-500 to-emerald-500' };
    return { level: 'Beginner', emoji: '🎯', color: 'from-gray-500 to-gray-600' };
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const info = getLevelInfo(profile.totalAnalyses);

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 cursor-pointer transition-transform hover:scale-110`}
      >
        {info.emoji}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {info.level} • {profile.totalAnalyses} analyses
      </div>
    </div>
  );
};

interface AchievementBadgeProps {
  achievementId: string;
  icon: string;
  title: string;
  unlocked: boolean;
  size?: 'sm' | 'md';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  unlocked,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
  };

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} ${
          unlocked
            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-300'
            : 'bg-gray-700 border-gray-600 grayscale opacity-50'
        } border-2 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110`}
      >
        {icon}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {title}
      </div>
    </div>
  );
};

// Rozet koleksiyonu gösterimi
export const BadgeCollection: React.FC = () => {
  const profile = getUserProfile();

  const badges = [
    { id: 'analyses', label: 'Analyses', value: profile.totalAnalyses, icon: '📊' },
    { id: 'avgScore', label: 'Avg Score', value: profile.averageScore, icon: '⭐' },
    { id: 'achievements', label: 'Achievements', value: profile.achievements.length, icon: '🏆' },
  ];

  return (
    <div className="flex gap-4 items-center">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span className="text-2xl">{badge.icon}</span>
          <div>
            <div className="text-white font-bold">{badge.value}</div>
            <div className="text-xs text-purple-300">{badge.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
