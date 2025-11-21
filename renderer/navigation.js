/**
 * Responsive Navigation Component
 * Mobile-friendly sidebar navigation with touch support
 */

class ResponsiveNav {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.isOpen = false;
    this.initialize();
  }

  initialize() {
    this.createOverlay();
    this.setupEventListeners();
    this.setupTouchEvents();
  }

  /**
   * Create backdrop overlay for mobile
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'nav-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 998;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    this.overlay.addEventListener('click', () => this.closeNav());
    document.body.appendChild(this.overlay);
  }

  /**
   * Open navigation sidebar
   */
  openNav() {
    this.sidebar = document.getElementById('SideBarNav');
    if (!this.sidebar) return;

    this.sidebar.style.width = this.isMobile() ? '100%' : '280px';
    this.sidebar.classList.add('active');
    
    // Show overlay on mobile
    if (this.isMobile()) {
      this.overlay.style.display = 'block';
      setTimeout(() => {
        this.overlay.style.opacity = '1';
      }, 10);
    }
    
    this.isOpen = true;
    
    // Adjust main content
    const main = document.getElementById('main') || document.getElementById('Schedule');
    if (main && !this.isMobile()) {
      main.style.marginLeft = '280px';
    }

    // Prevent body scroll on mobile
    if (this.isMobile()) {
      document.body.style.overflow = 'hidden';
    }

    // Focus first link for accessibility
    const firstLink = this.sidebar.querySelector('a:not(.closebtn)');
    if (firstLink) {
      firstLink.focus();
    }
  }

  /**
   * Close navigation sidebar
   */
  closeNav() {
    this.sidebar = document.getElementById('SideBarNav');
    if (!this.sidebar) return;

    this.sidebar.style.width = '0';
    this.sidebar.classList.remove('active');
    
    // Hide overlay
    this.overlay.style.opacity = '0';
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 300);
    
    this.isOpen = false;
    
    // Reset main content
    const main = document.getElementById('main') || document.getElementById('Schedule');
    if (main) {
      main.style.marginLeft = '0';
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Toggle navigation
   */
  toggleNav() {
    if (this.isOpen) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  /**
   * Check if mobile viewport
   */
  isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeNav();
      }
    });

    // Close on window resize if needed
    window.addEventListener('resize', () => {
      if (!this.isMobile() && this.isOpen) {
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Prevent clicks inside sidebar from closing it
    document.addEventListener('click', (e) => {
      this.sidebar = document.getElementById('SideBarNav');
      if (this.isOpen && this.sidebar && !this.sidebar.contains(e.target) && !e.target.closest('[onclick*="openNav"]')) {
        const isOverlay = e.target === this.overlay;
        const isOutside = !this.sidebar.contains(e.target);
        
        if (isOverlay || (isOutside && this.isMobile())) {
          this.closeNav();
        }
      }
    });
  }

  /**
   * Setup touch events for swipe gestures
   */
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  /**
   * Handle swipe gestures
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    // Swipe left to close
    if (this.isOpen && diff > swipeThreshold) {
      this.closeNav();
    }
    
    // Swipe right from edge to open
    if (!this.isOpen && startX < 50 && diff < -swipeThreshold) {
      this.openNav();
    }
  }
}

// Initialize responsive navigation
let responsiveNav;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    responsiveNav = new ResponsiveNav();
  });
} else {
  responsiveNav = new ResponsiveNav();
}

// Replace global nav functions with responsive versions
window.openNav = () => responsiveNav?.openNav();
window.closeNav = () => responsiveNav?.closeNav();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveNav;
}
