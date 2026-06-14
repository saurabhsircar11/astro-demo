/* ═══════════════════════════════════════════════════════
   Contact Form Component — Client Interaction Script
   Vanilla JS, ES Module compliant
   ═══════════════════════════════════════════════════════ */

(function() {
  function initContactForms() {
    const sections = document.querySelectorAll('.contact-form-section');

    sections.forEach(section => {
      const input = section.querySelector('#comments');
      const counter = section.querySelector('.form-counter__current');

      if (!input || !counter) return;

      input.addEventListener('input', () => {
        counter.textContent = String(input.value.length);
      });
    });
  }

  // Support direct run or DOMContentLoaded execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForms);
  } else {
    initContactForms();
  }
})();
