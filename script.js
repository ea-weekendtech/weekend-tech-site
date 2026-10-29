(function () {
  // light is the default; the toggle in the header switches to dark and remembers the choice
  var root = document.documentElement;
  var themeBtn = document.querySelector('.theme-toggle');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (themeBtn) themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#0F7A41' : '#0B6B3A');
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      applyTheme(next);
      setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // scroll-reveal
  var revealEls = document.querySelectorAll('.reveal, .road, .route');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      q.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  function copyText(text, btn) {
    function done(ok) {
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Select & copy';
      setTimeout(function () { btn.textContent = original; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy'));
      if (target) copyText(target.textContent.trim(), btn);
    });
  });

  var form = document.getElementById('quote-form');
  if (!form) return;

  var confirmPanel = document.getElementById('confirm-panel');
  var confirmText = document.getElementById('confirm-text');
  var textLink = document.getElementById('text-link');
  var emailLink = document.getElementById('email-link');
  var copyConfirmBtn = document.getElementById('copy-confirm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    var method = data.get('method');
    var contact = (data.get('contact') || '').toString().trim();
    var service = data.get('service');
    var details = (data.get('details') || '').toString().trim();

    var lines = [
      'Hi, this is ' + (name || 'a neighbor') + '.',
      'I need help with: ' + service + '.',
      details ? 'Details: ' + details : null,
      'Best way to reach me: ' + method + ' at ' + (contact || 'n/a') + '.'
    ].filter(Boolean);
    var message = lines.join('\n');

    confirmText.textContent = message;
    confirmPanel.classList.add('show');
    confirmPanel.classList.remove('in');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { confirmPanel.classList.add('in'); });
    });

    var smsBody = encodeURIComponent(message);
    textLink.href = 'sms:+15128432291?body=' + smsBody;
    emailLink.href = 'mailto:ea.weekendtech@gmail.com?subject=' + encodeURIComponent('Weekend tech help: ' + service) + '&body=' + smsBody;

    confirmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  copyConfirmBtn.addEventListener('click', function () {
    copyText(confirmText.textContent, copyConfirmBtn);
  });
})();
