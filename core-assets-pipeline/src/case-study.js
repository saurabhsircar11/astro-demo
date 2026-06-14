/* ═══════════════════════════════════════════════════════
   Case Study Component — Client Interaction Script
   Vanilla JS, ES Module compliant
   ═══════════════════════════════════════════════════════ */

(function() {
  function initCaseStudySliders() {
    const sections = document.querySelectorAll('.case-study-section');
    
    sections.forEach(section => {
      const slides = section.querySelectorAll('.case-study-slide');
      const prevBtn = section.querySelector('.case-study__arrow--prev');
      const nextBtn = section.querySelector('.case-study__arrow--next');
      const currentCounter = section.querySelector('.case-study__current');
      const totalCounter = section.querySelector('.case-study__total');
      
      if (slides.length === 0) return;
      
      let currentIndex = 0;
      
      // Update total counter
      if (totalCounter) {
        totalCounter.textContent = String(slides.length).padStart(2, '0');
      }
      
      function showSlide(index) {
        slides.forEach((slide, i) => {
          if (i === index) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });
        
        if (currentCounter) {
          currentCounter.textContent = String(index + 1).padStart(2, '0');
        }
        
        currentIndex = index;
      }
      
      // Initialize first slide
      showSlide(0);
      
      // Click listeners
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          let prevIndex = currentIndex - 1;
          if (prevIndex < 0) prevIndex = slides.length - 1;
          showSlide(prevIndex);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          let nextIndex = currentIndex + 1;
          if (nextIndex >= slides.length) nextIndex = 0;
          showSlide(nextIndex);
        });
      }
    });
  }

  // Support direct run or DOMContentLoaded execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCaseStudySliders);
  } else {
    initCaseStudySliders();
  }
})();
