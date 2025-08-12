/**
 * Hyundai Coupe Website - Main JavaScript
 * Handles language switching, dark mode, navigation, and interactive features
 * Updated for RD and GK generation structure
 */

class HyundaiCoupeWebsite {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.currentTheme = this.getStoredTheme();
    this.translations = {};

    this.init();
  }

  init() {
    this.initializeTheme();
    this.initializeLanguage();
    this.bindEvents();
    this.initializeCarousels();
    this.initializeLazyLoading();
    this.initializeVideoPlaylist();
    this.initializeImageModal();
    this.initializeSmoothScrolling();

    // Add fade-in animation to sections
    this.addFadeInAnimations();

    // Start additional features
    this.start();
  }

  // Theme Management
  initializeTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    this.updateThemeIcon();
  }

  getStoredTheme() {
    return localStorage.getItem("hyundai-coupe-theme") || "light";
  }

  setStoredTheme(theme) {
    localStorage.setItem("hyundai-coupe-theme", theme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setStoredTheme(this.currentTheme);
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector("#darkModeToggle i");
    if (themeIcon) {
      themeIcon.className =
        this.currentTheme === "light" ? "bi bi-moon-fill" : "bi bi-sun-fill";
    }
  }

  // Language Management
  initializeLanguage() {
    this.applyLanguage(this.currentLanguage);
  }

  getStoredLanguage() {
    return localStorage.getItem("hyundai-coupe-language") || "en";
  }

  setStoredLanguage(language) {
    localStorage.setItem("hyundai-coupe-language", language);
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === "en" ? "ar" : "en";
    this.setStoredLanguage(this.currentLanguage);
    this.applyLanguage(this.currentLanguage);
  }

  applyLanguage(language) {
    const html = document.documentElement;
    const langToggleSpan = document.querySelector("#langToggle span");

    // Set HTML attributes
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

    // Update language toggle button
    if (langToggleSpan) {
      langToggleSpan.textContent = language === "en" ? "العربية" : "English";
    }

    // Update all translatable elements
    document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
      const translation = element.getAttribute(`data-${language}`);
      if (translation) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = translation;
        } else {
          element.innerHTML = translation;
        }
      }
    });

    // Update page title
    document.title =
      language === "en"
        ? "Hyundai Coupe (Tiburon) - Complete Guide - RD & GK Generations"
        : "هيونداي كوبيه (تيبورون) - دليل شامل - أجيال RD و GK";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        language === "en"
          ? "Comprehensive guide to the Hyundai Coupe (Tiburon) - RD1, RD2, GK1, GK2 generations with technical specifications, history, and gallery"
          : "دليل شامل لهيونداي كوبيه (تيبورون) - أجيال RD1, RD2, GK1, GK2 مع المواصفات التقنية والتاريخ والمعرض";
    }
  }

  // Event Binding
  bindEvents() {
    // Theme toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Language toggle
    const langToggle = document.getElementById("langToggle");
    if (langToggle) {
      langToggle.addEventListener("click", () => this.toggleLanguage());
    }

    // Navigation links
    document.querySelectorAll(".nav-link-custom").forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavigation(e));
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardNavigation(e)
    );

    // Window resize handler
    window.addEventListener("resize", () => this.handleWindowResize());

    // Scroll event for navbar
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close dropdown on mobile
    const dropdown = bootstrap.Dropdown.getInstance(
      document.getElementById("navDropdown")
    );
    if (dropdown) {
      dropdown.hide();
    }
  }

  handleKeyboardNavigation(e) {
    // ESC key to close modals and dropdowns
    // Arrow keys for carousel navigation
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const activeCarousel = document.querySelector(".carousel:hover");
      if (activeCarousel) {
        const carouselInstance = bootstrap.Carousel.getInstance(activeCarousel);
        if (carouselInstance) {
          if (e.key === "ArrowLeft") {
            carouselInstance.prev();
          } else {
            carouselInstance.next();
          }
        }
      }
    }
  }

  handleWindowResize() {
    // Adjust carousel heights on resize
    this.adjustCarouselHeights();
  }

  handleScroll() {
    const navbar = document.getElementById("mainNavbar");
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Carousel Management
  initializeCarousels() {
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach((carousel) => {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true,
        touch: true,
      });
    });

    this.adjustCarouselHeights();
  }

  adjustCarouselHeights() {
    const carousels = document.querySelectorAll(".image-slider-container");
    carousels.forEach((container) => {
      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("load", () => {
          // Ensure consistent heights
          const containerHeight = container.offsetHeight;
          img.style.height = containerHeight + "px";
        });
      });
    });
  }

  // Lazy Loading
  initializeLazyLoading() {
    if ("IntersectionObserver" in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  }

  // Video Playlist
  initializeVideoPlaylist() {
    const playlistButtons = document.querySelectorAll(".playlist-item button");
    const mainVideo = document.querySelector(".video-container video");

    playlistButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const videoSrc = button.getAttribute("data-video");
        if (videoSrc && mainVideo) {
          // Add loading state
          const originalContent = button.innerHTML;
          button.innerHTML =
            '<i class="bi bi-hourglass-split me-2"></i><span>Loading...</span>';
          button.disabled = true;

          // Change video source
          mainVideo.src = videoSrc;
          mainVideo.load();

          // Reset button after video loads
          mainVideo.addEventListener(
            "loadeddata",
            () => {
              button.innerHTML = originalContent;
              button.disabled = false;
            },
            { once: true }
          );

          // Update active state
          playlistButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
        }
      });
    });
  }

  // Image Modal
  initializeImageModal() {
    const galleryImages = document.querySelectorAll(".gallery-img");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    galleryImages.forEach((img) => {
      img.addEventListener("click", () => {
        const src = img.getAttribute("data-src") || img.src;
        const alt = img.alt;

        modalImage.src = src;
        modalImage.alt = alt;
      });
    });

    // Keyboard navigation in modal
    modal.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // Navigate through gallery images
        const currentSrc = modalImage.src;
        const allImages = Array.from(galleryImages);
        const currentIndex = allImages.findIndex(
          (img) => (img.getAttribute("data-src") || img.src) === currentSrc
        );

        let nextIndex;
        if (e.key === "ArrowLeft") {
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
        } else {
          nextIndex =
            currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
        }

        const nextImg = allImages[nextIndex];
        modalImage.src = nextImg.getAttribute("data-src") || nextImg.src;
        modalImage.alt = nextImg.alt;
      }
    });
  }

  // Smooth Scrolling
  initializeSmoothScrolling() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector(".navbar").offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Animations
  addFadeInAnimations() {
    const sections = document.querySelectorAll(
      ".generation-section, .video-section, .gallery-section, .references-section"
    );

    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in");
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      sections.forEach((section) => {
        section.classList.add("fade-in");
      });
    }
  }

  // Utility Methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Performance Monitoring
  measurePerformance() {
    if ("performance" in window) {
      window.addEventListener("load", () => {
        const navigationTiming = performance.getEntriesByType("navigation")[0];
        console.log("Page Load Performance:", {
          domContentLoaded:
            navigationTiming.domContentLoadedEventEnd -
            navigationTiming.navigationStart,
          loadComplete:
            navigationTiming.loadEventEnd - navigationTiming.navigationStart,
          ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        });
      });
    }
  }

  // Error Handling
  handleErrors() {
    window.addEventListener("error", (e) => {
      console.error("JavaScript Error:", {
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno,
        error: e.error,
      });
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled Promise Rejection:", e.reason);
    });
  }

  // Accessibility Enhancements
  enhanceAccessibility() {
    // Add skip links
    this.addSkipLinks();

    // Improve focus management
    this.improveFocusManagement();

    // Add ARIA live regions for dynamic content
    this.addLiveRegions();
  }

  addSkipLinks() {
    const skipLink = document.createElement("a");
    skipLink.href = "#main";
    skipLink.textContent =
      this.currentLanguage === "en"
        ? "Skip to main content"
        : "تخطى إلى المحتوى الرئيسي";
    skipLink.className = "skip-link";
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  improveFocusManagement() {
    // Ensure modals trap focus
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.addEventListener("shown.bs.modal", () => {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      });
    });

    // Improve keyboard navigation for carousels
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach((carousel) => {
      carousel.setAttribute("tabindex", "0");
      carousel.setAttribute("role", "region");
      carousel.setAttribute(
        "aria-label",
        this.currentLanguage === "en" ? "Image carousel" : "دائري الصور"
      );
    });
  }

  addLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.id = "live-region";
    document.body.appendChild(liveRegion);

    // Announce theme changes
    const originalToggleTheme = this.toggleTheme.bind(this);
    this.toggleTheme = () => {
      originalToggleTheme();
      this.announce(
        this.currentTheme === "dark"
          ? this.currentLanguage === "en"
            ? "Dark mode enabled"
            : "تم تفعيل الوضع الليلي"
          : this.currentLanguage === "en"
          ? "Light mode enabled"
          : "تم تفعيل الوضع النهاري"
      );
    };

    // Announce language changes
    const originalToggleLanguage = this.toggleLanguage.bind(this);
    this.toggleLanguage = () => {
      const newLang = this.currentLanguage === "en" ? "ar" : "en";
      originalToggleLanguage();
      this.announce(
        newLang === "ar"
          ? "تم تغيير اللغة إلى العربية"
          : "Language changed to English"
      );
    };
  }

  announce(message) {
    const liveRegion = document.getElementById("live-region");
    if (liveRegion) {
      liveRegion.textContent = "";
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  }

  // Service Worker Registration (for offline functionality)
  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful:",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed:", error);
          });
      });
    }
  }

  // Print Functionality
  initializePrintStyles() {
    const printButton = document.createElement("button");
    printButton.innerHTML =
      '<i class="bi bi-printer"></i> <span data-en="Print" data-ar="طباعة">Print</span>';
    printButton.className = "btn btn-outline-secondary d-print-none me-2";
    printButton.addEventListener("click", () => {
      window.print();
    });

    // Add print button to navigation controls
    const navControls = document.querySelector(".navbar-controls");
    if (navControls) {
      navControls.insertBefore(printButton, navControls.firstChild);
    }
  }

  // Analytics Integration (placeholder for future enhancement)
  initializeAnalytics() {
    // Track page views for different generations
    this.trackGenerationViews();
    console.log("Analytics initialized for RD and GK generations");
  }

  trackGenerationViews() {
    const generationSections = document.querySelectorAll(
      "#rd1, #rd2, #gk1, #gk2"
    );

    if ("IntersectionObserver" in window) {
      const viewObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const generationId = entry.target.id;
              console.log(`Generation viewed: ${generationId}`);
              // Here you would send to your analytics service
              // gtag('event', 'generation_view', { generation: generationId });
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      generationSections.forEach((section) => {
        viewObserver.observe(section);
      });
    }
  }

  // Image Optimization
  initializeImageOptimization() {
    // Convert images to WebP if supported
    if (this.supportsWebP()) {
      const images = document.querySelectorAll("img[data-webp]");
      images.forEach((img) => {
        img.src = img.getAttribute("data-webp");
      });
    }

    // Implement progressive loading for large images
    this.implementProgressiveLoading();
  }

  supportsWebP() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  implementProgressiveLoading() {
    const images = document.querySelectorAll(".progressive-img");
    images.forEach((img) => {
      const lowRes = img.getAttribute("data-low-res");
      const highRes = img.src;

      if (lowRes) {
        // Load low resolution first
        img.src = lowRes;
        img.classList.add("loading");

        // Preload high resolution
        const highResImg = new Image();
        highResImg.onload = () => {
          img.src = highRes;
          img.classList.remove("loading");
          img.classList.add("loaded");
        };
        highResImg.src = highRes;
      }
    });
  }

  // Generation-specific features
  initializeGenerationFeatures() {
    // Add generation comparison functionality
    this.addGenerationComparison();

    // Initialize engine code highlighting
    this.highlightEngineCodes();

    // Add timeline navigation
    this.addTimelineNavigation();
  }

  addGenerationComparison() {
    // Create comparison button for each generation
    const generationSections = document.querySelectorAll(".generation-section");
    generationSections.forEach((section) => {
      const compareBtn = document.createElement("button");
      compareBtn.className = "btn btn-outline-primary mt-2";
      compareBtn.innerHTML =
        '<i class="bi bi-arrow-left-right me-1"></i><span data-en="Compare" data-ar="قارن">Compare</span>';

      compareBtn.addEventListener("click", () => {
        this.openComparisonModal(section.id);
      });

      const detailsContainer = section.querySelector(".details-container");
      if (detailsContainer) {
        detailsContainer.appendChild(compareBtn);
      }
    });
  }

  openComparisonModal(currentGeneration) {
    // Implementation for comparison modal would go here
    console.log(`Opening comparison for ${currentGeneration}`);
  }

  highlightEngineCodes() {
    // Highlight engine codes in specifications
    const engineCodes = ["G4GR", "G4GF", "G4GC", "G6BA"];
    const specItems = document.querySelectorAll(".spec-item li");

    specItems.forEach((item) => {
      engineCodes.forEach((code) => {
        if (item.textContent.includes(code)) {
          item.innerHTML = item.innerHTML.replace(
            code,
            `<mark class="engine-code">${code}</mark>`
          );
        }
      });
    });
  }

  addTimelineNavigation() {
    // Create timeline for easy navigation between generations
    const timeline = document.createElement("div");
    timeline.className = "generation-timeline fixed-bottom d-none d-lg-block";
    timeline.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-auto">
                        <div class="timeline-nav">
                            <a href="#rd1" class="timeline-item" data-year="1996-2000">RD1</a>
                            <a href="#rd2" class="timeline-item" data-year="2000-2001">RD2</a>
                            <a href="#gk1" class="timeline-item" data-year="2002-2005">GK1</a>
                            <a href="#gk2" class="timeline-item" data-year="2006-2009">GK2</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(timeline);

    // Add CSS for timeline
    const timelineCSS = `
            .generation-timeline {
                background: var(--navbar-bg);
                backdrop-filter: blur(10px);
                padding: 10px 0;
                z-index: 999;
            }
            .timeline-nav {
                display: flex;
                gap: 1rem;
                background: var(--card-bg);
                padding: 0.5rem 1rem;
                border-radius: 25px;
                box-shadow: 0 4px 15px var(--shadow);
            }
            .timeline-item {
                color: var(--text-secondary);
                text-decoration: none;
                padding: 0.5rem 1rem;
                border-radius: 15px;
                transition: all 0.2s ease;
                font-weight: 600;
                position: relative;
            }
            .timeline-item:hover, .timeline-item.active {
                color: var(--primary-color);
                background: var(--bg-secondary);
            }
            .timeline-item::after {
                content: attr(data-year);
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.7rem;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            .timeline-item:hover::after {
                opacity: 1;
            }
        `;

    const style = document.createElement("style");
    style.textContent = timelineCSS;
    document.head.appendChild(style);

    // Add smooth scrolling to timeline items
    timeline.querySelectorAll(".timeline-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector(".navbar").offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });

    // Update active timeline item on scroll
    window.addEventListener(
      "scroll",
      this.debounce(() => {
        this.updateActiveTimelineItem();
      }, 100)
    );
  }

  updateActiveTimelineItem() {
    const sections = ["rd1", "rd2", "gk1", "gk2"];
    const timeline = document.querySelector(".generation-timeline");

    if (!timeline) return;

    let activeSection = null;
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeSection = sectionId;
        }
      }
    });

    // Update active state
    timeline.querySelectorAll(".timeline-item").forEach((item) => {
      item.classList.remove("active");
      if (activeSection && item.getAttribute("href") === `#${activeSection}`) {
        item.classList.add("active");
      }
    });
  }

  // Initialize everything
  start() {
    this.measurePerformance();
    this.handleErrors();
    this.enhanceAccessibility();
    this.registerServiceWorker();
    this.initializePrintStyles();
    this.initializeAnalytics();
    this.initializeImageOptimization();
    this.initializeGenerationFeatures();

    // Add generation-specific enhancements
    this.addGenerationSpecificFeatures();
  }

  addGenerationSpecificFeatures() {
    // Add tooltips for engine codes
    this.addEngineCodeTooltips();

    // Add performance comparison charts
    this.addPerformanceCharts();

    // Add generation transition animations
    this.addTransitionAnimations();
  }

  addEngineCodeTooltips() {
    const engineCodeData = {
      G4GR: {
        en: "Naturally aspirated 1.6L DOHC 16-valve inline-4 engine",
        ar: "محرك 1.6 لتر طبيعي الشفط DOHC 16 صمام 4 أسطوانات",
      },
      G4GF: {
        en: "Naturally aspirated 2.0L DOHC 16-valve inline-4 engine",
        ar: "محرك 2.0 لتر طبيعي الشفط DOHC 16 صمام 4 أسطوانات",
      },
      G4GC: {
        en: "Naturally aspirated 2.0L DOHC 16-valve inline-4 engine (Beta II)",
        ar: "محرك 2.0 لتر طبيعي الشفط DOHC 16 صمام 4 أسطوانات (بيتا II)",
      },
      G6BA: {
        en: "Naturally aspirated 2.7L DOHC 24-valve V6 engine",
        ar: "محرك 2.7 لتر طبيعي الشفط DOHC 24 صمام V6",
      },
    };

    document.querySelectorAll(".engine-code").forEach((code) => {
      const engineCode = code.textContent;
      const data = engineCodeData[engineCode];

      if (data) {
        code.setAttribute("title", data[this.currentLanguage] || data.en);
        code.setAttribute("data-bs-toggle", "tooltip");
        code.setAttribute("data-bs-placement", "top");

        // Initialize Bootstrap tooltip
        new bootstrap.Tooltip(code);
      }
    });
  }

  addPerformanceCharts() {
    // Add simple performance comparison charts using CSS
    const performanceData = {
      rd1: { hp: 140, torque: 133, acceleration: 8.9 },
      rd2: { hp: 142, torque: 136, acceleration: 8.7 },
      gk1: { hp: 172, torque: 181, acceleration: 7.6 },
      gk2: { hp: 172, torque: 181, acceleration: 7.4 },
    };

    Object.keys(performanceData).forEach((generation) => {
      const section = document.getElementById(generation);
      if (section) {
        const chartContainer = document.createElement("div");
        chartContainer.className = "performance-chart mt-3";
        chartContainer.innerHTML = this.generatePerformanceChart(
          performanceData[generation]
        );

        const specsSection = section.querySelector(".specs-section");
        if (specsSection) {
          specsSection.appendChild(chartContainer);
        }
      }
    });
  }

  generatePerformanceChart(data) {
    const maxHp = 200;
    const maxTorque = 200;
    const minAcceleration = 6;
    const maxAcceleration = 10;

    const hpPercent = (data.hp / maxHp) * 100;
    const torquePercent = (data.torque / maxTorque) * 100;
    const accelPercent =
      ((maxAcceleration - data.acceleration) /
        (maxAcceleration - minAcceleration)) *
      100;

    return `
            <h5 data-en="Performance Overview" data-ar="نظرة عامة على الأداء">Performance Overview</h5>
            <div class="chart-bars">
                <div class="chart-bar">
                    <label data-en="Horsepower" data-ar="القوة الحصانية">Horsepower</label>
                    <div class="bar-container">
                        <div class="bar" style="width: ${hpPercent}%"></div>
                        <span>${data.hp} hp</span>
                    </div>
                </div>
                <div class="chart-bar">
                    <label data-en="Torque" data-ar="عزم الدوران">Torque</label>
                    <div class="bar-container">
                        <div class="bar" style="width: ${torquePercent}%"></div>
                        <span>${data.torque} lb-ft</span>
                    </div>
                </div>
                <div class="chart-bar">
                    <label data-en="0-100 km/h" data-ar="0-100 كم/س">0-100 km/h</label>
                    <div class="bar-container">
                        <div class="bar acceleration" style="width: ${accelPercent}%"></div>
                        <span>${data.acceleration}s</span>
                    </div>
                </div>
            </div>
        `;
  }

  addTransitionAnimations() {
    // Add CSS for performance charts and animations
    const chartCSS = `
            .performance-chart {
                background: var(--card-bg);
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 1rem;
                border: 1px solid var(--border-color);
            }
            
            .chart-bars {
                margin-top: 1rem;
            }
            
            .chart-bar {
                margin-bottom: 1rem;
            }
            
            .chart-bar label {
                display: block;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: var(--text-primary);
            }
            
            .bar-container {
                position: relative;
                background: var(--bg-secondary);
                border-radius: 4px;
                height: 30px;
                overflow: hidden;
            }
            
            .bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), #4a90e2);
                border-radius: 4px;
                transition: width 2s ease;
                animation: fillBar 2s ease forwards;
            }
            
            .bar.acceleration {
                background: linear-gradient(90deg, var(--success-color), #28a745);
            }
            
            .bar-container span {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-weight: 600;
                color: var(--text-primary);
                font-size: 0.9rem;
            }
            
            @keyframes fillBar {
                from { width: 0%; }
                to { width: var(--target-width, 100%); }
            }
            
            .generation-section.fade-in .performance-chart {
                animation: slideUp 0.6s ease 0.3s both;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

    const style = document.createElement("style");
    style.textContent = chartCSS;
    document.head.appendChild(style);
  }

  // Additional utility methods for generation-specific features
  getGenerationData(generationId) {
    const generationData = {
      rd1: {
        years: "1996-2000",
        codename: "RD1",
        nickname: "First Generation",
        keyFeatures: [
          "Giugiaro Design",
          "Budget Sports Coupe",
          "G4GR/G4GF Engines",
        ],
      },
      rd2: {
        years: "2000-2001",
        codename: "RD2",
        nickname: "Refreshed Generation",
        keyFeatures: ["Updated Styling", "Improved Quality", "Refined Engines"],
      },
      gk1: {
        years: "2002-2005",
        codename: "GK1",
        nickname: "Aggressive Redesign",
        keyFeatures: ["Bold Styling", "V6 Introduction", "G6BA Engine"],
      },
      gk2: {
        years: "2006-2009",
        codename: "GK2",
        nickname: "Final Evolution",
        keyFeatures: [
          "Refined Design",
          "Best Build Quality",
          "Final Generation",
        ],
      },
    };

    return generationData[generationId] || null;
  }

  // Search functionality
  initializeSearch() {
    // Add search functionality for technical specifications
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder =
      this.currentLanguage === "en"
        ? "Search specifications..."
        : "البحث في المواصفات...";
    searchInput.className = "form-control me-2";
    searchInput.id = "specSearch";

    searchInput.addEventListener(
      "input",
      this.debounce((e) => {
        this.performSearch(e.target.value);
      }, 300)
    );

    const navControls = document.querySelector(".navbar-controls");
    if (navControls) {
      navControls.insertBefore(searchInput, navControls.lastElementChild);
    }
  }

  performSearch(query) {
    if (!query.trim()) {
      this.clearSearchHighlights();
      return;
    }

    const searchTerm = query.toLowerCase();
    const specItems = document.querySelectorAll(".spec-item li");
    let foundResults = 0;

    this.clearSearchHighlights();

    specItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        this.highlightSearchTerm(item, searchTerm);
        foundResults++;
      }
    });

    console.log(`Found ${foundResults} results for "${query}"`);
  }

  highlightSearchTerm(element, term) {
    const text = element.innerHTML;
    const regex = new RegExp(`(${term})`, "gi");
    element.innerHTML = text.replace(
      regex,
      '<mark class="search-highlight">$1</mark>'
    );
    element.classList.add("search-result");
  }

  clearSearchHighlights() {
    document.querySelectorAll(".search-highlight").forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });

    document.querySelectorAll(".search-result").forEach((result) => {
      result.classList.remove("search-result");
    });
  }
}

// Initialize the website when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const website = new HyundaiCoupeWebsite();

  // Initialize search functionality
  website.initializeSearch();
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = HyundaiCoupeWebsite;
}

// Add CSS for search functionality
const searchCSS = `
    .search-highlight {
        background-color: #ffeb3b;
        color: #000;
        border-radius: 2px;
        padding: 1px 2px;
    }
    
    .search-result {
        background-color: var(--bg-secondary);
        border-radius: 4px;
        animation: searchPulse 0.5s ease;
    }
    
    @keyframes searchPulse {
        0% { background-color: var(--primary-color); color: white; }
        100% { background-color: var(--bg-secondary); color: var(--text-primary); }
    }
    
    #specSearch {
        max-width: 200px;
        transition: max-width 0.3s ease;
    }
    
    #specSearch:focus {
        max-width: 250px;
    }
    
    @media (max-width: 768px) {
        #specSearch {
            max-width: 150px;
        }
        
        #specSearch:focus {
            max-width: 180px;
        }
    }
`;

// Add search styles to the document
const searchStyleElement = document.createElement("style");
searchStyleElement.textContent = searchCSS;
document.head.appendChild(searchStyleElement);

// Arrow
