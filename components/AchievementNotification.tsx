import React, { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animasyon için kısa gecikme
    setTimeout(() => setIsVisible(true), 100);

    // 5 saniye sonra otomatik kapat
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[100] transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-yellow-300 rounded-xl p-4 shadow-2xl max-w-sm animate-bounce-subtle">
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-pulse">{achievement.icon}</div>
          <div className="flex-1">
            <div className="text-xs font-bold text-yellow-900 uppercase tracking-wider mb-1">
              🎉 Achievement Unlocked!
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
            <p className="text-sm text-yellow-100">{achievement.description}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-yellow-900 hover:text-yellow-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// Başarı kuyruğu yöneticisi
export const AchievementQueue: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const [queue, setQueue] = useState<Achievement[]>(achievements);
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !current) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, current]);

  const handleClose = () => {
    setCurrent(null);
  };

  if (!current) return null;

  return <AchievementNotification achievement={current} onClose={handleClose} />;
};
