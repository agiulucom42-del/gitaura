# 📝 GitAura Changelog

## Version 2.0.0 - Major Update (December 2025)

### 🎉 Yeni Özellikler

#### 1. 🔐 Güvenli API Yönetimi
- **API Kurulum Rehberi**: İlk kullanımda otomatik açılan interaktif kurulum rehberi
- **Güvenli Depolama**: API anahtarları yalnızca tarayıcıda (localStorage) saklanır
- **Çoklu Kaynak**: Environment variables ve localStorage desteği
- **Kolay Yönetim**: Ayarlar menüsünden API anahtarlarını güncelleyebilme

**Desteklenen API'ler:**
- Google Gemini API Key (Zorunlu)
- GitHub Personal Access Token (Opsiyonel, rate limit artırımı için)

#### 2. 💾 Otomatik Analiz Kaydetme
- **Akıllı Depolama**: Tüm analizler otomatik olarak kaydedilir
- **Geçmiş Yönetimi**: Son 50 analiz saklanır
- **Detaylı Kayıtlar**: Analiz tipi, mod, tarih ve sonuçlar
- **Veri Dışa/İçe Aktarma**: JSON formatında yedekleme ve geri yükleme

#### 3. 👤 Kullanıcı Profil Sistemi
- **Kişisel Dashboard**: Kapsamlı kullanıcı profili sayfası
- **İstatistikler**:
  - Toplam analiz sayısı
  - Ortalama puan
  - Puan dağılımı (Unicorn, Legendary, Epic, vb.)
  - Mod kullanım istatistikleri
- **3 Sekme Yapısı**:
  - 📊 Genel Bakış: İstatistikler ve grafikler
  - 📈 Analizler: Detaylı analiz geçmişi
  - 🏆 Başarılar: Açılan ve kilitli başarılar
- **Profil Özelleştirme**: Kullanıcı adı düzenleme
- **Veri Yönetimi**: Dışa aktarma, içe aktarma, temizleme

#### 4. 🏆 Rozet ve Başarı Sistemi
- **8 Farklı Başarı**:
  - 🎯 İlk Adım: İlk analizi tamamla
  - 🔍 Analiz Meraklısı: 5 analiz
  - ⭐ Analiz Uzmanı: 10 analiz
  - 🏆 Analiz Gurusu: 25 analiz
  - 👑 Analiz Efsanesi: 50 analiz
  - 💎 Mükemmellik: 100 puan al
  - 🌟 Yüksek Performans: 90+ puan
  - 🦄 Unicorn Avcısı: Unicorn rütbesi kazan

- **Rozet Türleri**:
  - **Skor Rozeti**: Analiz sonuçlarına göre renkli rozetler
  - **Profil Rozeti**: Kullanıcı seviyesini gösteren rozet
  - **Başarı Rozeti**: Açılan başarılar için özel rozetler

- **Bildirim Sistemi**:
  - Başarı açıldığında animasyonlu bildirim
  - 5 saniye otomatik kapanma
  - Kuyruk sistemi ile çoklu bildirim desteği

#### 5. 🎨 UI/UX İyileştirmeleri
- **Profil Badge**: Header'da kullanıcı profil rozeti
- **Animasyonlar**: Smooth transitions ve hover efektleri
- **Responsive Design**: Mobil ve tablet uyumlu
- **Dark Theme**: Modern karanlık tema

### 🔧 Teknik İyileştirmeler

#### Yeni Servisler
1. **configService.ts**: API yapılandırma yönetimi
2. **storageService.ts**: Veri depolama ve profil yönetimi

#### Yeni Bileşenler
1. **ApiSetupGuide.tsx**: API kurulum rehberi
2. **UserProfile.tsx**: Kullanıcı profil sayfası
3. **AchievementNotification.tsx**: Başarı bildirimleri
4. **BadgeSystem.tsx**: Rozet sistemi bileşenleri

#### Güvenlik
- API anahtarları hiçbir sunucuya gönderilmez
- Tüm veriler client-side'da saklanır
- .env.example ile güvenli yapılandırma şablonu

### 📚 Dokümantasyon
- `.env.example`: API anahtarları için şablon
- `CHANGELOG.md`: Versiyon geçmişi
- README güncellemeleri

### 🐛 Düzeltmeler
- API anahtarı eksikliğinde kullanıcı dostu hata mesajları
- localStorage parse hataları için error handling
- Rate limit kontrolü iyileştirmeleri

### 🚀 Performans
- Lazy loading için hazırlık
- LocalStorage optimizasyonu
- Component memoization

---

## Version 1.0.0 - Initial Release

### Temel Özellikler
- ✦ 3 Analiz Modu: Single, Versus, Squad
- 🧠 3 Perspektif: Marketing, Code Quality, Documentation
- 🔮 Mistik İçgörüler: Developer Persona, Fortune Teller
- 📊 Detaylı Raporlama
- 🌐 Çoklu Dil Desteği: Türkçe, İngilizce
- 💎 Rozet Oluşturucu
- 📱 Sosyal Medya Paylaşımı

---

**Not**: Versiyon 2.0.0 ile GitAura artık daha kişisel, daha güvenli ve daha kapsamlı bir deneyim sunuyor!
