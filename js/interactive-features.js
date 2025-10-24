// Interactive Features for Engineering College Website

document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveFeatures();
});

function initializeInteractiveFeatures() {
    // Program filtering on About page
    initializeProgramFiltering();
    
    // FAQ accordion enhancements
    initializeFAQAccordion();
    
    // Campus gallery lightbox
    initializeGalleryLightbox();
    
    // Smooth animations
    initializeAnimations();
}

// Program Filtering Feature
function initializeProgramFiltering() {
    const filterButtons = document.querySelectorAll('.program-filters .btn');
    const programCards = document.querySelectorAll('#programs-container .col-lg-6');
    
    if (filterButtons.length === 0 || programCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter programs
            programCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// FAQ Accordion Enhancements
function initializeFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const collapse = item.querySelector('.accordion-collapse');
        
        if (button && collapse) {
            // Add click animation
            button.addEventListener('click', function() {
                // Add subtle animation to content
                const body = collapse.querySelector('.accordion-body');
                if (body && collapse.classList.contains('show')) {
                    body.style.opacity = '0';
                    body.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        body.style.opacity = '1';
                        body.style.transform = 'translateY(0)';
                    }, 150);
                }
            });
            
            // Animate on show
            collapse.addEventListener('show.bs.collapse', function() {
                const body = this.querySelector('.accordion-body');
                if (body) {
                    body.style.opacity = '0';
                    body.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        body.style.opacity = '1';
                        body.style.transform = 'translateY(0)';
                    }, 300);
                }
            });
        }
    });
}

// Campus Gallery Lightbox Feature
function initializeGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    
    if (!modal || galleryItems.length === 0) return;
    
    const modalImage = modal.querySelector('#modalImage');
    const modalTitle = modal.querySelector('#modalTitle');
    const modalDescription = modal.querySelector('#modalDescription');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const image = this.querySelector('.gallery-image i').cloneNode(true);
            const title = this.querySelector('.gallery-caption h6').textContent;
            const description = this.querySelector('.gallery-caption p').textContent;
            
            // Clear previous content
            modalImage.innerHTML = '';
            modalImage.appendChild(image);
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Show modal
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        });
    });
}

// Smooth Animations
function initializeAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .organization-card, .process-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial state and observe
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Animate stats counter
    animateStatsCounter();
}

// Animate Statistics Counter
function animateStatsCounter() {
    const statElements = document.querySelectorAll('.display-4.fw-bold');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(element => {
        observer.observe(element);
    });
}

function animateValue(element) {
    const originalText = element.textContent;
    const value = parseInt(originalText.replace(/[^0-9]/g, ''));
    const suffix = originalText.replace(value, '');
    
    if (isNaN(value)) return;
    
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(value * easeOutQuart);
        element.textContent = currentValue.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = value.toLocaleString() + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Additional Utility Functions

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeInteractiveFeatures,
        debounce,
        throttle
    };
}
