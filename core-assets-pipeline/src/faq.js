// Browser-native client interactivity controller for FAQ Component
(function() {
  function initFAQ() {
    const faqAccordion = document.querySelector('[data-faq-group]');
    if (!faqAccordion) return;

    const items = faqAccordion.querySelectorAll('details');
    items.forEach(item => {
      item.addEventListener('toggle', (e) => {
        if (item.open) {
          const questionText = item.querySelector('.faq-item__question span:first-child')?.textContent || '';
          console.log(`[Telemetry] FAQ Accordion opened: "${questionText.trim()}"`);
          
          // Fallback logic to close other items manually on browsers that do not support exclusive accordions via the name attribute
          const hasNativeExclusive = 'name' in HTMLDetailsElement.prototype;
          if (!hasNativeExclusive) {
            items.forEach(otherItem => {
              if (otherItem !== item && otherItem.open) {
                otherItem.removeAttribute('open');
              }
            });
          }
        }
      });
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
