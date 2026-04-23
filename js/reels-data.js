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
    { src: 'assets/videos/Xbearvideo1.mp4',  title: 'XBear Tanıtım' },
    { src: 'assets/videos/Xbearvideo2.mp4',  title: 'XBear Sinema Gecesi' },
    { src: 'assets/videos/Xbearvideo3.mp4',  title: 'Üniversiteye Hoşgeldin Partisi' },
    { src: 'assets/videos/Xbearvideo4.mp4',  title: 'Üniversiteye Hoşgeldin Partisi #2' },
    { src: 'assets/videos/Xbearvideo5.mp4',  title: 'Hallowen Party' },
    { src: 'assets/videos/Xbearvideo6.mp4',  title: 'XBear Tanıtım #2' },
    { src: 'assets/videos/Xbearvideo7.mp4',  title: 'NO1 KONSER', previewAt: 1 },
    { src: 'assets/videos/Xbearvideo8.mp4',  title: 'RÖPORTAJ', popupFit: 'cover', popupPosition: 'center top' },
    { src: 'assets/videos/Xbearvideo9.mp4',  title: 'RÖPORTAJ #2', popupFit: 'cover', popupPosition: 'center bottom' },
    { src: 'assets/videos/Xbearvideo10.mp4', title: 'TEDX SELCUKUNI', popupFit: 'cover', popupPosition: 'left 128%', popupZoom: 1.12 },
    { src: 'assets/videos/Xbearvideo11.mp4', title: 'KEEPERS', popupFit: 'cover', popupPosition: 'center bottom', previewAt: 1 },
    { src: 'assets/videos/Xbearvideo12.mp4', title: 'KEEPERS #2' },
  ],

  xbearmedia: [
    { src: 'assets/videos/Xbearmediavideo0.mp4', title: 'KAMPANYA' },
    { src: 'assets/videos/Xbearmediavideo1.mp4', title: 'LUPEN' },
    { src: 'assets/videos/Xbearmediavideo2.mp4', title: 'LUPEN SİNEMATİK' },
    { src: 'assets/videos/Xbearmediavideo3.mp4', title: 'MYPOINT' },
    { src: 'assets/videos/Xbearmediavideo4.mp4', title: 'MACKBEAR SİNEMATİK' },
    { src: 'assets/videos/Xbearmediavideo5.mp4', title: 'MACKBEAR' },
    { src: 'assets/videos/Xbearmediavideo6.mp4', title: 'EXTRABLATT SİNEMATİK' },
    { src: 'assets/videos/Xbearmediavideo7.mp4', title: 'BACKSTAGE', previewAt: 1 },
    { src: 'assets/videos/Xbearmediavideo8.mp4', title: 'ÖZÜMÜZ' },
    { src: 'assets/videos/Xbearmediavideo9.mp4', title: 'BACKSTAGE #2' },
  ],
};
