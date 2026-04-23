/* ============================================================
   XBear Reels Listesi
   ------------------------------------------------------------
   Yeni bir reel eklemek için:
     1) Instagram reel URL'ini kopyala (örn: https://www.instagram.com/reel/ABC123/)
     2) İlgili hesabın dizisinin EN BAŞINA yeni bir obje ekle.
     3) thumb alanı opsiyoneldir; verirsen kart kapağında görünür.
        - Önerilen isim: assets/images/reels/<hesap>_<shortcode>.jpg
        - Bırakırsan otomatik olarak Instagram logolu gradient kapak gösterilir.

   Örnek:
     {
       url: 'https://www.instagram.com/reel/NEW_SHORTCODE/',
       title: 'Yeni Etkinlik 🎉',
       thumb: 'assets/images/reels/xbearevent_NEW_SHORTCODE.jpg',
     },
   ============================================================ */

window.XBEAR_REELS = {
  xbearevent: [
    {
      url: 'https://www.instagram.com/reel/DXZfBz-jLeR/',
      title: 'Açık Hava Sinema 🎬',
      thumb: 'assets/images/reels/xbearevent_DXZfBz-jLeR.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DWmChYdDMjk/',
      title: 'Halloween Gecesi 🎃',
      thumb: 'assets/images/reels/xbearevent_DWmChYdDMjk.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DWlypfyDEgh/',
      title: 'Kalben Konseri ✨',
      thumb: 'assets/images/reels/xbearevent_DWlypfyDEgh.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DWpYK6RDLd8/',
      title: 'Pentagon PSM 🚀',
      thumb: 'assets/images/reels/xbearevent_DWpYK6RDLd8.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DXG2rdBjZe1/',
      title: 'Ekip Büyüyor 💪',
      thumb: 'assets/images/reels/xbearevent_DXG2rdBjZe1.jpg',
    },
  ],

  xbearmedia: [
    {
      url: 'https://www.instagram.com/reel/DXILGmHNEwN/',
      title: 'Master Chicken 🍗',
      thumb: 'assets/images/reels/xbearmedia_DXILGmHNEwN.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DXILAUAN1Tt/',
      title: 'Tanıtım Filmi 🎥',
      thumb: 'assets/images/reels/xbearmedia_DXILAUAN1Tt.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DXIKLa8talT/',
      title: 'Parma Pizza 🍕',
      thumb: 'assets/images/reels/xbearmedia_DXIKLa8talT.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DXIIn_ONWUn/',
      title: 'Mackbear ☕',
      thumb: 'assets/images/reels/xbearmedia_DXIIn_ONWUn.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/DXIIfgqNSGF/',
      title: 'Marka Prodüksiyon 🎬',
      thumb: 'assets/images/reels/xbearmedia_DXIIfgqNSGF.jpg',
    },
  ],
};
