(function () {
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

    var smsBody = encodeURIComponent(message);
    textLink.href = 'sms:+15128432291?body=' + smsBody;
    emailLink.href = 'mailto:ea.weekendtech@gmail.com?subject=' + encodeURIComponent('Weekend tech help: ' + service) + '&body=' + smsBody;

    confirmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  copyConfirmBtn.addEventListener('click', function () {
    copyText(confirmText.textContent, copyConfirmBtn);
  });
})();
