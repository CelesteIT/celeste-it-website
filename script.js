<<<<<<< HEAD
// ========================================
// CELESTE IT - FINAL PREMIUM JAVASCRIPT
// Stable, mobile-aware, reduced-motion-friendly
// ========================================

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const hasAOS = typeof AOS !== 'undefined';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    function initAOS() {
        if (!hasAOS) return;
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out'
        });
    }

    function initBackToTop() {
        if ($('.back-to-top')) return;

        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.type = 'button';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                button.classList.toggle('visible', window.scrollY > 500);
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initMouseGlow() {
        if (prefersReducedMotion || isTouchDevice || $('.mouse-glow')) return;

        const glow = document.createElement('div');
        glow.className = 'mouse-glow';
        document.body.appendChild(glow);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            glow.classList.remove('active');
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
            window.requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }

    function initRippleEffect() {
        if (prefersReducedMotion) return;

        $$('.btn-primary, .btn-outline, .btn-nav').forEach((button) => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.position = 'absolute';

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                window.setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    function initTypingAnimation() {
        if (prefersReducedMotion) return;

        const heroSpan = $('.hero-title span');
        if (!heroSpan || heroSpan.hasAttribute('data-typed')) return;

        const originalText = heroSpan.textContent.trim();
        if (!originalText) return;

        heroSpan.setAttribute('data-typed', 'true');
        heroSpan.textContent = '';
        heroSpan.classList.add('typing-text');

        let index = 0;
        function typeWriter() {
            if (index < originalText.length) {
                heroSpan.textContent += originalText.charAt(index);
                index += 1;
                window.setTimeout(typeWriter, 70);
            } else {
                heroSpan.classList.remove('typing-text');
            }
        }

        window.setTimeout(typeWriter, 350);
    }

    function animateCounter(counter) {
        const targetText = counter.textContent.trim();
        const target = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
        const prefix = (targetText.match(/^[^0-9]+/) || [''])[0];
        const suffix = (targetText.match(/[^0-9]+$/) || [''])[0];

        if (Number.isNaN(target)) return;
        if (prefersReducedMotion) {
            counter.textContent = `${prefix}${target}${suffix}`;
            return;
        }

        let current = 0;
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.floor(progress * target);
            counter.textContent = `${prefix}${current}${suffix}`;
            if (progress < 1) {
                window.requestAnimationFrame(update);
            } else {
                counter.textContent = `${prefix}${target}${suffix}`;
            }
        }

        window.requestAnimationFrame(update);
    }

    function initCounters() {
        const counters = $$('.stat-number, .proof-number');
        if (!counters.length) return;

        const observedSection = $('.stats, .about-stats, .value-stats, .proof-strip');
        if (!observedSection || !('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                counters.forEach(animateCounter);
                observer.disconnect();
            });
        }, { threshold: 0.25 });

        observer.observe(observedSection);
    }

    function initNavbarScroll() {
        const navbar = $('.navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initMobileMenu() {
        const hamburger = $('#hamburger');
        const navLinks = $('#navLinks');
        if (!hamburger || !navLinks) return;

        const icon = $('i', hamburger);

        function setMenuState(open) {
            navLinks.classList.toggle('active', open);
            document.body.classList.toggle('menu-open', open);
            hamburger.setAttribute('aria-expanded', String(open));

            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        }

        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            setMenuState(!isOpen);
        });

        $$('#navLinks a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuState(false);
        });

        document.addEventListener('click', (e) => {
            const clickedInsideMenu = navLinks.contains(e.target);
            const clickedHamburger = hamburger.contains(e.target);
            if (!clickedInsideMenu && !clickedHamburger && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuState(false);
        });
    }

    function initParallax() {
        if (prefersReducedMotion || isTouchDevice) return;
        const hero = $('.hero');
        if (!hero) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                hero.style.backgroundPositionY = `${scrolled * 0.2}px`;
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = $(href);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        });
    }

    function updateLogoForTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const logos = $$('.logo-image, .footer-logo-image');

        logos.forEach((logo) => {
            if (logo.classList.contains('footer-logo-image')) {
                logo.style.filter = 'brightness(0) invert(1)';
                return;
            }
            logo.style.filter = isDarkMode ? 'invert(1) brightness(2)' : 'none';
        });
    }

    function initThemeLogoListener() {
        updateLogoForTheme();
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', updateLogoForTheme);
        } else if (typeof media.addListener === 'function') {
            media.addListener(updateLogoForTheme);
        }
    }

    function addParallaxBg() {
        $$('.hero, .cta, .page-header').forEach((section) => {
            if (section.querySelector('.parallax-bg')) return;
            const bg = document.createElement('div');
            bg.className = 'parallax-bg';
            section.style.position = section.style.position || 'relative';
            section.insertBefore(bg, section.firstChild);
        });
    }

    function initContactForm() {
        const contactForm = $('#contactForm');
        const formStatus = $('#formStatus');
        if (!contactForm || !formStatus) return;

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            formStatus.className = 'form-status';
            formStatus.innerHTML = '<div class="status-sending"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending message...</div>';

            try {
                const hiddenServiceInput = document.getElementById('service-hidden');

                const payload = {
                    name: contactForm.name ? contactForm.name.value.trim() : '',
                    email: contactForm.email ? contactForm.email.value.trim() : '',
                    phone: contactForm.phone ? contactForm.phone.value.trim() : '',
                    service: hiddenServiceInput ? hiddenServiceInput.value.trim() : '',
                    message: contactForm.message ? contactForm.message.value.trim() : ''
                };

                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (_) {
                        // ignore json parse failure
                    }
                    throw new Error(data.error || 'Failed to send WhatsApp message');
                }

                formStatus.innerHTML = '<div class="status-success"><i class="fas fa-check-circle" aria-hidden="true"></i> Message received. Our team will review it and get back to you soon.</div>';
                contactForm.reset();

                if (hiddenServiceInput) {
                    hiddenServiceInput.value = '';
                }

                const customSelect = document.getElementById('serviceSelect');
                if (customSelect) {
                    const text = customSelect.querySelector('.custom-select-text');
                    const options = customSelect.querySelectorAll('.custom-select-option');
                    if (text) text.textContent = 'Select a service';
                    options.forEach(opt => opt.classList.remove('selected'));
                    if (options.length) options[0].classList.add('selected');
                    customSelect.classList.remove('open');
                    const trigger = customSelect.querySelector('.custom-select-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            } catch (error) {
                formStatus.innerHTML = '<div class="status-error"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Something went wrong. Please try again.</div>';
            }

            window.setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = '';
            }, 5000);
        });
    }

    function initTiltCards() {
        if (prefersReducedMotion || isTouchDevice) return;

        const tiltCards = $$('.service-card, .feature-card, .industry-card, .team-card, .proof-card');
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 24;
                const rotateY = (centerX - x) / 24;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }

    function initScrollProgressBar() {
        if ($('.scroll-progress')) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = `${scrollPercent}%`;
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initCustomSelect() {
        const customSelect = document.getElementById('serviceSelect');
        if (!customSelect) return;

        const trigger = customSelect.querySelector('.custom-select-trigger');
        const text = customSelect.querySelector('.custom-select-text');
        const options = customSelect.querySelectorAll('.custom-select-option');
        const hiddenInput = document.getElementById('service-hidden');

        if (!trigger || !text || !options.length || !hiddenInput) return;

        trigger.addEventListener('click', function () {
            const isOpen = customSelect.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        options.forEach(option => {
            option.addEventListener('click', function () {
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                const value = this.getAttribute('data-value') || '';
                const label = this.textContent.trim();

                text.textContent = label;
                hiddenInput.value = value;

                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function init() {
        initAOS();
        initBackToTop();
        initMouseGlow();
        initRippleEffect();
        initTypingAnimation();
        initCounters();
        initNavbarScroll();
        initMobileMenu();
        initParallax();
        initSmoothScroll();
        initThemeLogoListener();
        addParallaxBg();
        initContactForm();
        initTiltCards();
        initScrollProgressBar();
        initCustomSelect();

        console.log('Celeste IT - Final premium website loaded successfully 🚀');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
=======
// ========================================
// CELESTE IT - FINAL PREMIUM JAVASCRIPT
// Stable, mobile-aware, reduced-motion-friendly
// ========================================

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const hasAOS = typeof AOS !== 'undefined';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    function initAOS() {
        if (!hasAOS) return;
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out'
        });
    }

    function initBackToTop() {
        if ($('.back-to-top')) return;

        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.type = 'button';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                button.classList.toggle('visible', window.scrollY > 500);
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initMouseGlow() {
        if (prefersReducedMotion || isTouchDevice || $('.mouse-glow')) return;

        const glow = document.createElement('div');
        glow.className = 'mouse-glow';
        document.body.appendChild(glow);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            glow.classList.remove('active');
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
            window.requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }

    function initRippleEffect() {
        if (prefersReducedMotion) return;

        $$('.btn-primary, .btn-outline, .btn-nav').forEach((button) => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.position = 'absolute';

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                window.setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    function initTypingAnimation() {
        if (prefersReducedMotion) return;

        const heroSpan = $('.hero-title span');
        if (!heroSpan || heroSpan.hasAttribute('data-typed')) return;

        const originalText = heroSpan.textContent.trim();
        if (!originalText) return;

        heroSpan.setAttribute('data-typed', 'true');
        heroSpan.textContent = '';
        heroSpan.classList.add('typing-text');

        let index = 0;
        function typeWriter() {
            if (index < originalText.length) {
                heroSpan.textContent += originalText.charAt(index);
                index += 1;
                window.setTimeout(typeWriter, 70);
            } else {
                heroSpan.classList.remove('typing-text');
            }
        }

        window.setTimeout(typeWriter, 350);
    }

    function animateCounter(counter) {
        const targetText = counter.textContent.trim();
        const target = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
        const prefix = (targetText.match(/^[^0-9]+/) || [''])[0];
        const suffix = (targetText.match(/[^0-9]+$/) || [''])[0];

        if (Number.isNaN(target)) return;
        if (prefersReducedMotion) {
            counter.textContent = `${prefix}${target}${suffix}`;
            return;
        }

        let current = 0;
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.floor(progress * target);
            counter.textContent = `${prefix}${current}${suffix}`;
            if (progress < 1) {
                window.requestAnimationFrame(update);
            } else {
                counter.textContent = `${prefix}${target}${suffix}`;
            }
        }

        window.requestAnimationFrame(update);
    }

    function initCounters() {
        const counters = $$('.stat-number, .proof-number');
        if (!counters.length) return;

        const observedSection = $('.stats, .about-stats, .value-stats, .proof-strip');
        if (!observedSection || !('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                counters.forEach(animateCounter);
                observer.disconnect();
            });
        }, { threshold: 0.25 });

        observer.observe(observedSection);
    }

    function initNavbarScroll() {
        const navbar = $('.navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initMobileMenu() {
        const hamburger = $('#hamburger');
        const navLinks = $('#navLinks');
        if (!hamburger || !navLinks) return;

        const icon = $('i', hamburger);

        function setMenuState(open) {
            navLinks.classList.toggle('active', open);
            document.body.classList.toggle('menu-open', open);
            hamburger.setAttribute('aria-expanded', String(open));

            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        }

        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            setMenuState(!isOpen);
        });

        $$('#navLinks a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuState(false);
        });

        document.addEventListener('click', (e) => {
            const clickedInsideMenu = navLinks.contains(e.target);
            const clickedHamburger = hamburger.contains(e.target);
            if (!clickedInsideMenu && !clickedHamburger && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuState(false);
        });
    }

    function initParallax() {
        if (prefersReducedMotion || isTouchDevice) return;
        const hero = $('.hero');
        if (!hero) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                hero.style.backgroundPositionY = `${scrolled * 0.2}px`;
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = $(href);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        });
    }

    function updateLogoForTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const logos = $$('.logo-image, .footer-logo-image');

        logos.forEach((logo) => {
            if (logo.classList.contains('footer-logo-image')) {
                logo.style.filter = 'brightness(0) invert(1)';
                return;
            }
            logo.style.filter = isDarkMode ? 'invert(1) brightness(2)' : 'none';
        });
    }

    function initThemeLogoListener() {
        updateLogoForTheme();
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', updateLogoForTheme);
        } else if (typeof media.addListener === 'function') {
            media.addListener(updateLogoForTheme);
        }
    }

    function addParallaxBg() {
        $$('.hero, .cta, .page-header').forEach((section) => {
            if (section.querySelector('.parallax-bg')) return;
            const bg = document.createElement('div');
            bg.className = 'parallax-bg';
            section.style.position = section.style.position || 'relative';
            section.insertBefore(bg, section.firstChild);
        });
    }

    function initContactForm() {
        const contactForm = $('#contactForm');
        const formStatus = $('#formStatus');
        if (!contactForm || !formStatus) return;

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            formStatus.className = 'form-status';
            formStatus.innerHTML = '<div class="status-sending"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending message...</div>';

            try {
                const hiddenServiceInput = document.getElementById('service-hidden');

                const payload = {
                    name: contactForm.name ? contactForm.name.value.trim() : '',
                    email: contactForm.email ? contactForm.email.value.trim() : '',
                    phone: contactForm.phone ? contactForm.phone.value.trim() : '',
                    service: hiddenServiceInput ? hiddenServiceInput.value.trim() : '',
                    message: contactForm.message ? contactForm.message.value.trim() : ''
                };

                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (_) {
                        // ignore json parse failure
                    }
                    throw new Error(data.error || 'Failed to send WhatsApp message');
                }

                formStatus.innerHTML = '<div class="status-success"><i class="fas fa-check-circle" aria-hidden="true"></i> Message received. Our team will review it and get back to you soon.</div>';
                contactForm.reset();

                if (hiddenServiceInput) {
                    hiddenServiceInput.value = '';
                }

                const customSelect = document.getElementById('serviceSelect');
                if (customSelect) {
                    const text = customSelect.querySelector('.custom-select-text');
                    const options = customSelect.querySelectorAll('.custom-select-option');
                    if (text) text.textContent = 'Select a service';
                    options.forEach(opt => opt.classList.remove('selected'));
                    if (options.length) options[0].classList.add('selected');
                    customSelect.classList.remove('open');
                    const trigger = customSelect.querySelector('.custom-select-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            } catch (error) {
                formStatus.innerHTML = '<div class="status-error"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Something went wrong. Please try again.</div>';
            }

            window.setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = '';
            }, 5000);
        });
    }

    function initTiltCards() {
        if (prefersReducedMotion || isTouchDevice) return;

        const tiltCards = $$('.service-card, .feature-card, .industry-card, .team-card, .proof-card');
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 24;
                const rotateY = (centerX - x) / 24;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }

    function initScrollProgressBar() {
        if ($('.scroll-progress')) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = `${scrollPercent}%`;
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    function initCustomSelect() {
        const customSelect = document.getElementById('serviceSelect');
        if (!customSelect) return;

        const trigger = customSelect.querySelector('.custom-select-trigger');
        const text = customSelect.querySelector('.custom-select-text');
        const options = customSelect.querySelectorAll('.custom-select-option');
        const hiddenInput = document.getElementById('service-hidden');

        if (!trigger || !text || !options.length || !hiddenInput) return;

        trigger.addEventListener('click', function () {
            const isOpen = customSelect.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        options.forEach(option => {
            option.addEventListener('click', function () {
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                const value = this.getAttribute('data-value') || '';
                const label = this.textContent.trim();

                text.textContent = label;
                hiddenInput.value = value;

                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function init() {
        initAOS();
        initBackToTop();
        initMouseGlow();
        initRippleEffect();
        initTypingAnimation();
        initCounters();
        initNavbarScroll();
        initMobileMenu();
        initParallax();
        initSmoothScroll();
        initThemeLogoListener();
        addParallaxBg();
        initContactForm();
        initTiltCards();
        initScrollProgressBar();
        initCustomSelect();

        console.log('Celeste IT - Final premium website loaded successfully 🚀');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
>>>>>>> 9db36e72b8a61946b31a28ae968b26fa714edb04
