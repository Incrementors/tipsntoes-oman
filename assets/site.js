(function () {
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var body = document.body;

  // Strategy notes for the client walkthrough
  function setNotes(on) {
    body.classList.toggle('notes', on);
    store.set('tnt-notes', on ? '1' : '0');
  }
  setNotes(store.get('tnt-notes') === '1');
  document.querySelectorAll('[data-notes]').forEach(function (b) {
    b.addEventListener('click', function () { setNotes(!body.classList.contains('notes')); });
  });

  // English / Arabic: swap every element that carries an Arabic string
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-ar]'));
  nodes.forEach(function (n) { n.setAttribute('data-en', n.innerHTML); });
  function setLang(ar) {
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    nodes.forEach(function (n) { n.innerHTML = ar ? n.getAttribute('data-ar') : n.getAttribute('data-en'); });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.textContent = ar ? 'English' : 'عربي'; });
    store.set('tnt-lang', ar ? 'ar' : 'en');
  }
  if (store.get('tnt-lang') === 'ar') setLang(true);
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(document.documentElement.dir !== 'rtl'); });
  });

  // Mobile menu
  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () { body.classList.toggle('menu'); });

  // Booking demo
  var modal = document.getElementById('book-modal');
  if (!modal) return;
  var sum = modal.querySelector('.sum');
  var slots = modal.querySelector('.slots');
  var title = modal.querySelector('h3');
  var note = modal.querySelector('.demo');
  var confirm = modal.querySelector('[data-confirm]');
  function val(id, fallback) {
    var el = document.getElementById(id);
    return el && el.value ? el.options[el.selectedIndex].text : fallback;
  }
  function open(mode, lounge) {
    var l = lounge || val('f-lounge', 'Your nearest lounge');
    var t = val('f-treat', 'Manicure & pedicure');
    var d = val('f-day', 'Today');
    sum.textContent = t + ' · ' + l + ' · ' + d;
    if (mode === 'chat') {
      title.textContent = 'Chat to book';
      slots.style.display = 'none';
      note.textContent = 'On the live site this opens a chat with the lounge you picked, with your treatment and day already typed in, so booking takes one message.';
      confirm.textContent = 'Got it';
    } else {
      title.textContent = 'Choose a time';
      slots.style.display = '';
      note.textContent = 'Sample times. On the live site these come straight from your booking system, and the client gets a confirmation and a reminder.';
      confirm.textContent = 'Confirm booking (demo)';
    }
    modal.classList.add('open');
  }
  document.querySelectorAll('[data-book]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open(b.getAttribute('data-book'), b.getAttribute('data-lounge')); });
  });
  slots.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') return;
    slots.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    e.target.classList.add('on');
  });
  confirm.addEventListener('click', function () { modal.classList.remove('open'); });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('x')) modal.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('open'); });
})();
