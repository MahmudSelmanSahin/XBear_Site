/* XBear — Hizmetler kitabı (sayfa çevirme) */
(function () {
  function init() {
    var book = document.getElementById('servicesBook');
    if (!book) return;
    var sheets = Array.prototype.slice.call(book.querySelectorAll('.book-sheet'));
    var prev = document.getElementById('bookPrev');
    var next = document.getElementById('bookNext');
    var label = document.getElementById('bookIndicator');
    var total = sheets.length;
    var current = 0;
    function render() {
      book.classList.toggle('is-closed', current === 0);
      sheets.forEach(function (s, i) {
        var flipped = i < current;
        s.classList.toggle('flipped', flipped);
        if (!s.classList.contains('is-animating')) s.style.zIndex = flipped ? i + 1 : total - i;
      });
      var pages = (total - 1) * 2;
      if (label) label.textContent = current === 0 ? 'Kapak' : 'Sayfa ' + Math.min((current - 1) * 2 + 1, pages) + ' / ' + pages;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === total;
    }
    function goTo(n) {
      n = Math.max(0, Math.min(total, n));
      if (n === current) return;
      if (current === 1 && n === 0) {
        book.classList.add('is-closing');
        setTimeout(function () { book.classList.remove('is-closing'); }, 870);
      }
      var sheet = sheets[n > current ? current : current - 1];
      sheet.classList.add('is-animating');
      sheet.style.zIndex = 40;
      var done = function (e) {
        if (e.propertyName && e.propertyName !== 'transform') return;
        sheet.classList.remove('is-animating');
        sheet.removeEventListener('transitionend', done);
        render();
      };
      sheet.addEventListener('transitionend', done);
      current = n;
      render();
    }
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); });
    book.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      var sheet = e.target.closest('.book-sheet');
      if (sheet) {
        var i = sheets.indexOf(sheet);
        goTo(i < current ? i : i + 1);
        return;
      }
      if (e.target.closest('.book-base--left')) goTo(current - 1);
      else if (e.target.closest('.book-base--right')) goTo(current + 1);
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
