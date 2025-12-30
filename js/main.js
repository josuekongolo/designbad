/**
 * DESIGNBAD AS - Premium Bathroom Renovations
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    const contactForm = document.getElementById('contactForm');

    // ============================================
    // Header Scroll Effect
    // ============================================
    function handleHeaderScroll() {
        if (!header) return;

        const scrollY = window.scrollY;
        const threshold = 100;

        if (scrollY > threshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    // ============================================
    // Mobile Menu
    // ============================================
    function toggleMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.classList.toggle('menu-toggle--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.classList.remove('menu-toggle--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Fade-in Animations on Scroll
    // ============================================
    function handleScrollAnimations() {
        if (!fadeElements.length) return;

        const triggerPoint = window.innerHeight * 0.85;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerPoint) {
                element.classList.add('visible');
            }
        });
    }

    // ============================================
    // Contact Form Validation
    // ============================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        // Allow Norwegian phone formats
        const re = /^(\+47)?[\s-]?[0-9]{2,3}[\s-]?[0-9]{2}[\s-]?[0-9]{3}$/;
        return phone === '' || re.test(phone.replace(/\s/g, ''));
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const phoneInput = form.querySelector('#phone');
        const projectTypeInput = form.querySelector('#projectType');
        const messageInput = form.querySelector('#message');

        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Vennligst fyll inn ditt navn');
            isValid = false;
        }

        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Vennligst fyll inn din e-postadresse');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Vennligst oppgi en gyldig e-postadresse');
            isValid = false;
        }

        // Validate phone (optional but check format if provided)
        if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
            showError(phoneInput, 'Vennligst oppgi et gyldig telefonnummer');
            isValid = false;
        }

        // Validate project type
        if (!projectTypeInput.value) {
            showError(projectTypeInput, 'Vennligst velg en prosjekttype');
            isValid = false;
        }

        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Vennligst beskriv ditt prosjekt');
            isValid = false;
        }

        if (isValid) {
            // Hide form and show success message
            const formInner = form.querySelector('.contact-form__inner');
            const successMessage = form.querySelector('.form-success');

            if (formInner && successMessage) {
                formInner.style.display = 'none';
                successMessage.classList.add('show');
            }

            // In a real implementation, you would send the form data to a server here
            console.log('Form submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                projectType: projectTypeInput.value,
                message: messageInput.value
            });
        }
    }

    // Real-time validation feedback
    function handleInputBlur(e) {
        const input = e.target;
        const value = input.value.trim();

        if (input.hasAttribute('required') && !value) {
            return; // Don't show error on blur if empty - will show on submit
        }

        if (input.type === 'email' && value && !validateEmail(value)) {
            showError(input, 'Vennligst oppgi en gyldig e-postadresse');
        } else if (input.type === 'tel' && value && !validatePhone(value)) {
            showError(input, 'Vennligst oppgi et gyldig telefonnummer');
        } else {
            clearError(input);
        }
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        }
    }

    // ============================================
    // Image Lazy Loading
    // ============================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // Project Cards Hover Effect (Touch Devices)
    // ============================================
    function initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                // Remove hover class from other cards
                projectCards.forEach(c => c.classList.remove('touch-hover'));
                // Add to current card
                this.classList.add('touch-hover');
            });
        });

        // Remove hover on touch outside
        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.project-card')) {
                projectCards.forEach(card => card.classList.remove('touch-hover'));
            }
        });
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Header scroll
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Check initial state

        // Mobile menu
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (mobileMenuLinks.length) {
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        // Scroll animations
        window.addEventListener('scroll', handleScrollAnimations, { passive: true });
        handleScrollAnimations(); // Check initial state

        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', handleInputBlur);
                input.addEventListener('input', () => clearError(input));
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // Lazy loading
        initLazyLoading();

        // Project cards
        initProjectCards();

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                closeMobileMenu();
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
