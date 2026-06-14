// Browser-native client interactivity controller for the Site Header component
(function() {
  function initHeader() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('[data-header-toggle]');
    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('site-header--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      console.log(`[Telemetry] Header mobile nav ${isOpen ? 'opened' : 'closed'}`);
    });

    // Close the mobile panel when a nav link is chosen
    header.querySelectorAll('[data-header-nav] a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('site-header--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
