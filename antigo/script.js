    // Global variables
let isLoading = true;
let currentFilter = 'all';
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize components after loading
    setTimeout(() => {
        hideLoadingScreen();
        initializeNavigation();
        initializeScrollAnimations();
        initializePortfolio();
        initializeContactForm();
        initializeParticleEffects();
        initializeSmoothScrolling();
        initializeHoverEffects();
    }, 2500);
}

// Loading Screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    isLoading = false;
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observeElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .artist-card, .contact-item, .section-header'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                // Stagger animation for grid items
                if (entry.target.parentElement.classList.contains('services-grid') ||
                    entry.target.parentElement.classList.contains('artists-grid') ||
                    entry.target.parentElement.classList.contains('portfolio-grid')) {
                    
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    observeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Portfolio Filter
function initializePortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter);
            currentFilter = filter;
        });
    });
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        setTimeout(() => {
            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.animationDelay = `${index * 100}ms`;
            } else {
                item.classList.add('hidden');
            }
        }, index * 50);
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Add floating label effects
    formInputs.forEach(input => {
        // Set initial state
        if (input.value) {
            input.parentElement.classList.add('filled');
        }
        
        // Handle focus and blur events
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
        
        // Handle input events
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
            
            // Real-time validation
            validateField(input);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmission);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.parentElement.classList.remove('error');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Add error styling if invalid
    if (!isValid) {
        field.parentElement.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        hideFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#ff4757';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.style.display = 'block';
}

function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formFields = e.target.querySelectorAll('input, select, textarea');
    
    let isFormValid = true;
    
    // Validate all fields
    formFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            e.target.reset();
            formFields.forEach(field => {
                field.parentElement.classList.remove('filled', 'focused');
                hideFieldError(field);
            });
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    } else {
        showNotification('Please correct the errors in the form.', 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.9rem',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #00f5ff, #0099cc)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'inherit';
    closeButton.style.marginLeft = '1rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '1.2rem';
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Particle Effects
function initializeParticleEffects() {
    createFloatingParticles();
    initializeHeroParticles();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;
    
    // Create additional animated particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random positioning and styling
        const size = Math.random() * 4 + 1;
        const color = ['#00f5ff', '#ff0080', '#ffff00'][Math.floor(Math.random() * 3)];
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            animation: `floatParticle ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            pointerEvents: 'none'
        });
        
        particleContainer.appendChild(particle);
    }
    
    // Add CSS for floating animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
                50% { transform: translateY(-10px) translateX(-10px) rotate(180deg); }
                75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Add mouse interaction for particle effects
    hero.addEventListener('mousemove', (e) => {
        if (isLoading) return;
        
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Update CSS custom properties for interactive effects
        hero.style.setProperty('--mouse-x', `${x}%`);
        hero.style.setProperty('--mouse-y', `${y}%`);
        
        // Create temporary particle on click
        if (e.buttons === 1) { // Left mouse button pressed
            createClickParticle(e.clientX, e.clientY);
        }
    });
    
    hero.addEventListener('click', (e) => {
        createClickParticle(e.clientX, e.clientY);
    });
}

function createClickParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    
    Object.assign(particle.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '6px',
        height: '6px',
        background: 'radial-gradient(circle, #00f5ff, transparent)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '1000',
        transform: 'translate(-50%, -50%)',
        animation: 'clickParticleExpand 0.6s ease-out forwards'
    });
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
        }
    }, 600);
    
    // Add CSS for click particle animation
    if (!document.querySelector('#click-particle-styles')) {
        const style = document.createElement('style');
        style.id = 'click-particle-styles';
        style.textContent = `
            @keyframes clickParticleExpand {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(8);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Hover Effects
function initializeHoverEffects() {
    // Button hover effects
    initializeButtonEffects();
    
    // Card hover effects
    initializeCardEffects();
    
    // Image hover effects
    initializeImageEffects();
}

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            createButtonRipple(e);
        });
        
        button.addEventListener('click', (e) => {
            createButtonRipple(e);
        });
    });
}

function createButtonRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    
    Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'rippleEffect 0.6s ease-out',
        pointerEvents: 'none'
    });
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentElement) {
            ripple.parentElement.removeChild(ripple);
        }
    }, 600);
    
    // Add CSS for ripple effect
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeCardEffects() {
    const cards = document.querySelectorAll('.service-card, .artist-card, .portfolio-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add tilt effect based on mouse position
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });
}

function initializeImageEffects() {
    const imageContainers = document.querySelectorAll('.portfolio-image, .artist-avatar');
    
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            const placeholder = container.querySelector('.image-placeholder, .avatar-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.1)';
                placeholder.style.filter = 'brightness(1.2) saturate(1.3)';
            }
        });
        
        container.addEventListener('mouseleave', () => {
            const placeholder = container.querySelector('.image-placeholder, .avatar-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1)';
                placeholder.style.filter = 'brightness(1) saturate(1)';
            }
        });
    });
}

// Performance optimizations
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
window.addEventListener('scroll', throttle(() => {
    if (!isLoading) {
        updateActiveNavLink();
    }
}, 100));

// Optimize resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent features
    if (!isLoading) {
        // Add resize handling if needed
    }
}, 250));

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Don't show error to users in production, but log for debugging
});

// Prevent right-click context menu on production (optional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Initialize service worker for better performance (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here if implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for potential external use
window.NeoEvents = {
    showNotification,
    filterPortfolioItems,
    validateField
};
