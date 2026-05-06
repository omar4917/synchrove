/**
* Template Name: Kelly
* Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Theme toggle (Peacock / Whale)
   */
  const themeButtons = document.querySelectorAll('.theme-btn');
  if (themeButtons.length) {
    const supportedThemes = ['peacock', 'whale', 'd1', 'd2', 'sl1'];
    const themeClasses = supportedThemes.map((theme) => `theme-${theme}`);

    const applyTheme = (theme) => {
      const selectedTheme = supportedThemes.includes(theme) ? theme : 'peacock';
      document.body.classList.remove(...themeClasses);
      document.body.classList.add(`theme-${selectedTheme}`);
      try {
        localStorage.setItem('synch-theme', selectedTheme);
      } catch (error) {
        /* Storage might be unavailable */
      }
      themeButtons.forEach((btn) => {
        const isActive = btn.dataset.theme === selectedTheme;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem('synch-theme');
    } catch (error) {
      storedTheme = null;
    }

    applyTheme(storedTheme);

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });
  }

  const canUseGSAP = () => {
    if (typeof gsap === 'undefined') {
      return false;
    }
    if (typeof ScrollTrigger !== 'undefined' && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }
    return true;
  };

  /**
   * Services GSAP animation (home page grid)
   */
  const initServicesAnimation = () => {
    if (!canUseGSAP()) return;

    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    if (!serviceCards.length) return;

    gsap.set(serviceCards, { opacity: 0, y: 50, scale: 0.97 });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.services-showcase',
        start: 'top 80%',
        once: true,
        animation: gsap.to(serviceCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.06
        })
      });
    } else {
      gsap.to(serviceCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.06
      });
    }
  };

  /**
   * Detailed services (services page) animation
   */
  const initMainServicesAnimation = () => {
    if (!canUseGSAP()) return;

    const serviceDetails = gsap.utils.toArray('.main-services .service-detail');
    if (!serviceDetails.length) return;

    serviceDetails.forEach((detail) => {
      const fromX = detail.classList.contains('reverse') ? 140 : -140;
      const icon = detail.querySelector('.service-icon');
      const title = detail.querySelector('.service-info h3');
      const summary = detail.querySelector('.service-info p');
      const features = detail.querySelectorAll('.service-features li');
      const image = detail.querySelector('.service-image .image-placeholder');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: detail,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse'
        }
      });

      tl.from(detail, {
        x: fromX,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
        .from(icon, {
          scale: 0.4,
          opacity: 0,
          duration: 0.3,
          ease: 'back.out(1.8)'
        }, '-=0.35')
        .from([title, summary], {
          y: 30,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          stagger: 0.08
        }, '-=0.25')
        .from(features, {
          opacity: 0,
          x: -20,
          duration: 0.18,
          stagger: 0.04,
          ease: 'power2.out'
        }, '-=0.15')
        .from(image, {
          opacity: 0,
          scale: 0.8,
          duration: 0.35,
          ease: 'power2.out'
        }, '-=0.45');
    });
  };

  window.addEventListener('load', () => {
    initServicesAnimation();
    initMainServicesAnimation();
  });

})();
