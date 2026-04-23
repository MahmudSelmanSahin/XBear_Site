# XBear Instagram Scraper

Bu script, `@xbearevent` ve `@xbearmedia` hesaplarından son gönderileri
otomatik olarak çeker, thumbnail'leri indirir ve `assets/data/gallery.json`
dosyasını günceller. Site, bu JSON'u bulduğunda galeriyi otomatik olarak
doldurur (bulamazsa mevcut statik içerik aynen korunur).

## Kurulum (tek sefer)

```bash
cd scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## (Önerilen) Oturum açma

Instagram, giriş yapmamış istemcilere karşı agresif rate-limit uygular.
Bir kez kendi kullanıcı adınla giriş yap, script bu oturumu kullansın:

```bash
instaloader --login=<kullanici_adin>
# Şifre istenir, ardından oturum diske kaydedilir
```

## Çalıştırma

```bash
# Varsayılan: her hesaptan son 30 post
python fetch_instagram.py

# Oturum kullanarak (önerilir)
python fetch_instagram.py --login <kullanici_adin>

# Daha fazla post çek
python fetch_instagram.py --limit 60

# Özel hesap listesi
python fetch_instagram.py --accounts xbearevent
```

Çıktı:

- `assets/images/gallery/auto/<kullanici>/<shortcode>.jpg` — thumbnail'ler
- `assets/data/gallery.json` — site tarafından okunan veri dosyası

## Periyodik çalıştırma

Mac üzerinde `cron` veya `launchd` ile günlük çalıştırabilirsin:

```cron
0 4 * * * cd /path/to/XBear_Site/scraper && .venv/bin/python fetch_instagram.py --login <kullanici_adin>
```

## Notlar

- Instagram zaman zaman rate-limit uygular. Çok sık çalıştırma.
- Script idempotenttir: zaten indirilmiş thumbnail'ler tekrar indirilmez.
- Public olmayan hesapları çekmek için oturum zorunludur.
- Instagram ToS'ına dikkat et; kendi hesaplarında kullanım sorun değil.
