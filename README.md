# XBear Site

XBear Event-Media icin hazirlanmis tek sayfa tanitim sitesidir.

## Gelistirme

Bu proje statik bir yapidadir (HTML/CSS/JS).

- Ana dosya: `index.html`
- Stil dosyasi: `css/style.css`
- Davranislar: `js/main.js`
- Reels veri kaynagi: `js/reels-data.js`

Yerelde acmak icin:

- `index.html` dosyasini tarayicida acin, veya
- Bir local server ile calistirin (onerilir).

## Icerik Yonetimi

### Reels guncelleme

Reels listesi `js/reels-data.js` dosyasindadir.

- Event reels: `window.XBEAR_REELS.xbearevent`
- Media reels: `window.XBEAR_REELS.xbearmedia`

Her kayit icin temel alan:

- `src`: video yolu
- `title`: kart basligi

Opsiyonel alanlar:

- `thumb`: kart kapagi (verilmezse otomatik thumb kullanilir)
- `previewAt`: saniye bazli kapak karesi
- `popupFit`, `popupPosition`, `popupZoom`: popup kadraj ayarlari

### Foto guncelleme

Galeri foto satirlari `index.html` icinde:

- Event foto satiri: `photoScrollEvent`
- Media foto satiri: `photoScrollMedia`

Yeni gorselleri `assets/images/reels/` altina koyup ilgili satira yeni kart ekleyin.

## Iletisim Formu

Form `FormSubmit` uzerinden mail gonderir.

Hedef mail adresi:

- `index.html` icindeki `#contactForm` elemaninda
- `data-recipient-email` alanindan degistirilir.

## Notlar

- Cache nedeniyle JS/CSS degisiklikleri gorunmuyorsa hard refresh yapin (`Cmd + Shift + R`).
- Sabit WhatsApp butonu `0506 478 14 90` numarasina yonlenir.
