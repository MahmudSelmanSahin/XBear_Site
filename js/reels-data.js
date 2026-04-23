/* ============================================================
   XBear Reels Listesi
   ------------------------------------------------------------
   İKİ TİP REEL VARDIR:

   1) VIDEO (kendi mp4 dosyamız):
      {
        src: 'assets/videos/Xbearvideo7.mp4',
        title: 'Yeni Etkinlik 🎉',
        poster: 'assets/images/reels/...jpg', // opsiyonel kapak
      }

   2) INSTAGRAM (embed):
      {
        url: 'https://www.instagram.com/reel/SHORTCODE/',
        title: 'Marka Çekimi',
        thumb: 'assets/images/reels/xbearmedia_SHORTCODE.jpg', // opsiyonel
      }

   Listeye yeni reel eklemek için ilgili dizinin EN BAŞINA obje ekle.
   ============================================================ */

window.XBEAR_REELS = {
  xbearevent: [
    { src: 'assets/videos/Xbearvideo1.mp4',  title: 'XBear Event #1' },
    { src: 'assets/videos/Xbearvideo2.mp4',  title: 'XBear Event #2' },
    { src: 'assets/videos/Xbearvideo3.mp4',  title: 'XBear Event #3' },
    { src: 'assets/videos/Xbearvideo4.mp4',  title: 'XBear Event #4' },
    { src: 'assets/videos/Xbearvideo5.mp4',  title: 'XBear Event #5' },
    { src: 'assets/videos/Xbearvideo6.mp4',  title: 'XBear Event #6' },
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
