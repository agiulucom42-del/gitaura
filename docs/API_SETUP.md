# 🔑 GitAura API Kurulum Rehberi

GitAura'yı kullanmak için iki API anahtarına ihtiyacınız var. Bu rehber, adım adım nasıl API anahtarlarınızı alacağınızı ve yapılandıracağınızı gösterir.

## 📋 Gerekli API Anahtarları

### 1. Google Gemini API Key (Zorunlu)

Gemini API, GitAura'nın yapay zeka destekli analiz motorudur. **Ücretsiz** olarak kullanabilirsiniz.

#### Adım 1: Google AI Studio'ya Gidin
1. Tarayıcınızda [https://ai.google.dev](https://ai.google.dev) adresini açın
2. Google hesabınızla giriş yapın

#### Adım 2: API Anahtarı Oluşturun
1. Sol menüden **"Get API Key"** seçeneğine tıklayın
2. **"Create API Key"** butonuna basın
3. Bir proje seçin veya yeni proje oluşturun
4. API anahtarınız oluşturulacak ve ekranda görünecek

#### Adım 3: API Anahtarını Kopyalayın
1. **"Copy"** butonuna tıklayarak anahtarı kopyalayın
2. Güvenli bir yere kaydedin (şimdilik)

#### Kullanım Limitleri (Ücretsiz)
- **15 istek/dakika**
- **1,500 istek/gün**
- **1 milyon token/ay**

GitAura normal kullanımda bu limitleri aşmaz.

---

### 2. GitHub Personal Access Token (Opsiyonel)

GitHub token, API rate limitinizi artırır. **Opsiyoneldir** ancak şiddetle önerilir.

| Token Durumu | Rate Limit |
|--------------|------------|
| **Token Yok** | 60 istek/saat |
| **Token Var** | 5,000 istek/saat |

#### Adım 1: GitHub Settings'e Gidin
1. GitHub'da oturum açın
2. Sağ üst köşeden profil fotoğrafınıza tıklayın
3. **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**

#### Adım 2: Yeni Token Oluşturun
1. **"Generate new token"** > **"Generate new token (classic)"** seçin
2. Token için bir isim verin: `GitAura`
3. Expiration: **No expiration** veya **90 days** seçin

#### Adım 3: İzinleri Seçin
Sadece şu izni seçin:
- ✅ **public_repo** (Access public repositories)

Diğer izinlere gerek yok!

#### Adım 4: Token'ı Oluşturun ve Kopyalayın
1. Sayfanın altındaki **"Generate token"** butonuna tıklayın
2. Token oluşturulacak ve **sadece bir kez** gösterilecek
3. **Hemen kopyalayın!** Sayfayı kapatırsanız bir daha göremezsiniz

---

## 🔧 GitAura'da Yapılandırma

### Yöntem 1: İlk Kullanımda (Önerilen)

1. GitAura'yı ilk açtığınızda **API Kurulum Rehberi** otomatik açılır
2. Gemini API Key'inizi yapıştırın
3. (Opsiyonel) GitHub Token'ınızı yapıştırın
4. **"Kaydet ve Başla"** butonuna tıklayın

### Yöntem 2: Ayarlar Menüsünden

1. Sağ üst köşedeki **⚙️ (Ayarlar)** ikonuna tıklayın
2. **"API Keys"** sekmesine gidin
3. Anahtarlarınızı girin ve kaydedin

### Yöntem 3: Environment Variables (Geliştiriciler İçin)

Projeyi yerel olarak çalıştırıyorsanız:

1. Proje kök dizininde `.env` dosyası oluşturun:
   ```bash
   cp .env.example .env
   ```

2. `.env` dosyasını düzenleyin:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GITHUB_TOKEN=your_github_token_here
   ```

3. Uygulamayı yeniden başlatın:
   ```bash
   npm run dev
   ```

---

## 🔒 Güvenlik

### API Anahtarlarınız Güvende mi?

**Evet!** GitAura API anahtarlarınızı şu şekilde korur:

1. **Hiçbir Sunucuya Gönderilmez**: Anahtarlar sadece tarayıcınızda saklanır
2. **LocalStorage**: Veriler cihazınızdan çıkmaz
3. **Şifrelenmemiş Ama Gizli**: Sadece siz erişebilirsiniz
4. **Açık Kaynak**: Kodları inceleyebilirsiniz

### En İyi Güvenlik Pratikleri

1. ✅ **Token izinlerini sınırlı tutun** (sadece public_repo)
2. ✅ **Expiration date belirleyin** (90 gün önerilir)
3. ✅ **Token'ı kimseyle paylaşmayın**
4. ✅ **Şüphe duyarsanız token'ı yenileyin**
5. ❌ **Token'ı GitHub'a commit etmeyin**

---

## 🛠️ Sorun Giderme

### "API Key geçersiz" Hatası

**Çözüm:**
1. API anahtarını doğru kopyaladığınızdan emin olun
2. Başında/sonunda boşluk olmadığını kontrol edin
3. Gemini API'da projenin aktif olduğunu doğrulayın

### "Rate Limit Aşıldı" Hatası

**Çözüm:**
1. GitHub token ekleyin (60 → 5000 istek/saat)
2. Birkaç dakika bekleyin
3. Çok fazla analiz yapmayın (spam)

### "Network Error" Hatası

**Çözüm:**
1. İnternet bağlantınızı kontrol edin
2. GitHub ve Google AI Studio'nun erişilebilir olduğunu doğrulayın
3. VPN kullanıyorsanız kapatmayı deneyin

### Token Görünmüyor

**Çözüm:**
1. Tarayıcı console'unu açın (F12)
2. `localStorage.getItem('gitaura_gemini_api_key')` yazın
3. Null dönüyorsa token kaydedilmemiş

---

## 📞 Yardım

Hala sorun yaşıyorsanız:

- 📖 [GitHub Issues](https://github.com/agiulucom42-del/gitaura/issues)
- 💬 [Discussions](https://github.com/agiulucom42-del/gitaura/discussions)
- 📧 Email: support@gitaura.dev (varsa)

---

## 🎉 Hazırsınız!

API anahtarlarınızı yapılandırdıktan sonra GitAura'nın tüm özelliklerini kullanabilirsiniz:

- ✦ Sınırsız analiz
- 🔮 AI destekli içgörüler
- 📊 Detaylı raporlar
- 🏆 Başarı sistemi
- 💾 Otomatik kaydetme

**Keyifli analizler!** 🚀
