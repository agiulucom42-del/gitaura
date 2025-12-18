import React, { useState } from 'react';
import { saveGeminiApiKey, saveGithubToken, loadApiConfig } from '../services/configService';

interface ApiSetupGuideProps {
  onComplete: () => void;
  language: 'Turkish' | 'English';
}

export const ApiSetupGuide: React.FC<ApiSetupGuideProps> = ({ onComplete, language }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const isTurkish = language === 'Turkish';

  const handleSave = () => {
    if (geminiKey.trim()) {
      saveGeminiApiKey(geminiKey);
      if (githubToken.trim()) {
        saveGithubToken(githubToken);
      }
      onComplete();
    }
  };

  const handleSkip = () => {
    const config = loadApiConfig();
    if (config.geminiApiKey) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isTurkish ? 'API Anahtarlarını Ayarla' : 'Setup API Keys'}
          </h2>
          <p className="text-purple-200">
            {isTurkish 
              ? 'GitAura\'yı kullanmak için API anahtarlarınızı eklemeniz gerekiyor.'
              : 'You need to add your API keys to use GitAura.'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Gemini API Key */}
          <div>
            <label className="block text-white font-semibold mb-2">
              🤖 Google Gemini API Key <span className="text-red-400">*</span>
            </label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder={isTurkish ? 'API anahtarınızı buraya yapıştırın' : 'Paste your API key here'}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <div className="mt-2 space-y-1">
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-1"
              >
                {isTurkish ? '→ Ücretsiz API anahtarı al' : '→ Get free API key'}
              </a>
              <p className="text-xs text-gray-400">
                {isTurkish 
                  ? 'Yapay zeka destekli analiz için gereklidir'
                  : 'Required for AI-powered analysis'}
              </p>
            </div>
          </div>

          {/* GitHub Token */}
          <div>
            <label className="block text-white font-semibold mb-2">
              🐙 GitHub Personal Access Token <span className="text-gray-400">(Opsiyonel)</span>
            </label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder={isTurkish ? 'Token\'ınızı buraya yapıştırın' : 'Paste your token here'}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <div className="mt-2 space-y-1">
              <a
                href="https://github.com/settings/tokens/new?description=GitAura&scopes=public_repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-1"
              >
                {isTurkish ? '→ GitHub Token oluştur' : '→ Create GitHub Token'}
              </a>
              <p className="text-xs text-gray-400">
                {isTurkish 
                  ? 'Rate limit artırmak için önerilir (saatte 60 → 5000 istek)'
                  : 'Recommended to increase rate limit (60 → 5000 requests/hour)'}
              </p>
            </div>
          </div>

          {/* Show/Hide Keys Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showKeys"
              checked={showKeys}
              onChange={(e) => setShowKeys(e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/30 bg-black/30 text-purple-500 focus:ring-purple-500"
            />
            <label htmlFor="showKeys" className="text-sm text-gray-300 cursor-pointer">
              {isTurkish ? 'Anahtarları göster' : 'Show keys'}
            </label>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <h4 className="text-yellow-200 font-semibold mb-1">
                {isTurkish ? 'Güvenlik Notu' : 'Security Note'}
              </h4>
              <p className="text-sm text-yellow-100/80">
                {isTurkish 
                  ? 'API anahtarlarınız yalnızca tarayıcınızda (localStorage) saklanır ve hiçbir sunucuya gönderilmez. Tamamen güvenlidir.'
                  : 'Your API keys are stored only in your browser (localStorage) and never sent to any server. Completely secure.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={!geminiKey.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50"
          >
            {isTurkish ? '✓ Kaydet ve Başla' : '✓ Save and Start'}
          </button>
          {loadApiConfig().geminiApiKey && (
            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-gray-700/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-600/50 transition-all"
            >
              {isTurkish ? 'Atla' : 'Skip'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
