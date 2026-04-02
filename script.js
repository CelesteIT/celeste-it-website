// CELESTE IT - FINAL MATCHED SCRIPT
// Built to match the cleaned style.css and current HTML structure

(function () {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function markPageLoaded() {
        document.body.classList.add('page-loaded');
    }

    function initNavbarScroll() {
        const navbar = $('.navbar');
        if (!navbar) return;

        const update = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function initMobileMenu() {
        const hamburger = $('#hamburger');
        const navLinks = $('#navLinks');
        if (!hamburger || !navLinks) return;

        const icon = $('i', hamburger);

        function setOpen(open) {
            navLinks.classList.toggle('active', open);
            document.body.classList.toggle('menu-open', open);
            hamburger.setAttribute('aria-expanded', String(open));

            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        }

        hamburger.addEventListener('click', () => {
            setOpen(!navLinks.classList.contains('active'));
        });

        $$('#navLinks a').forEach(link => {
            link.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('active')) return;
            const insideMenu = navLinks.contains(e.target);
            const insideButton = hamburger.contains(e.target);
            if (!insideMenu && !insideButton) setOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setOpen(false);
        });
    }

    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
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

    function initPageTransition() {
        if (prefersReducedMotion) return;

        $$('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const isHash = href.startsWith('#');
            const isExternal = /^https?:\/\//i.test(href);
            const isMailOrTel = href.startsWith('mailto:') || href.startsWith('tel:');
            const isBlank = link.target === '_blank';
            const isDownload = link.hasAttribute('download');

            if (isHash || isExternal || isMailOrTel || isBlank || isDownload) return;

            link.addEventListener('click', function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                document.body.classList.remove('page-loaded');
            });
        });
    }

    function initBackToTop() {
        let btn = $('.back-to-top');

        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Back to top');
            btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
            document.body.appendChild(btn);
        }

        const update = () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    function initScrollProgress() {
        let bar = $('.scroll-progress');

        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'scroll-progress';
            document.body.appendChild(bar);
        }

        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
            bar.style.width = progress + '%';
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    }

    function animateCounter(el) {
        if (el.dataset.counted === 'true') return;

        const raw = el.textContent.trim();
        const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        if (Number.isNaN(target)) return;

        el.dataset.counted = 'true';

        const suffix = raw.includes('%') ? '%' : raw.includes('+') ? '+' : '';
        if (prefersReducedMotion) {
            el.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = `${value}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = `${target}${suffix}`;
            }
        }

        requestAnimationFrame(tick);
    }

    function initCounters() {
        const counters = $$('.trust-number, .stat-number, .proof-number');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        counters.forEach(counter => observer.observe(counter));
    }

    function initRevealSystem() {
        const targets = $$([
            'section',
            '.service-card',
            '.feature-card',
            '.industry-card',
            '.trust-card',
            '.proof-card',
            '.team-card',
            '.service-detail',
            '.mission',
            '.vision',
            '.founder-shell',
            '.mid-cta-content',
            '.case-card',
            '.highlight-card',
            '.address-card',
            '.contact-form'
        ].join(','));

        if (!targets.length) return;

        if (window.innerWidth <= 768 || prefersReducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        targets.forEach(el => observer.observe(el));
    }

    function initCustomSelect() {
        const customSelect = $('#serviceSelect');
        if (!customSelect) return;

        const trigger = $('.custom-select-trigger', customSelect);
        const menu = $('.custom-select-menu', customSelect);
        const text = $('.custom-select-text', customSelect);
        const options = $$('.custom-select-option', customSelect);
        const hiddenInput = $('#service-hidden');

        if (!trigger || !menu || !text || !options.length || !hiddenInput) return;

        function closeSelect() {
            customSelect.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', () => {
            const isOpen = customSelect.classList.toggle('open');
            trigger.setAttribute('aria-expanded', String(isOpen));
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                text.textContent = option.textContent.trim();
                hiddenInput.value = option.getAttribute('data-value') || '';
                closeSelect();
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) closeSelect();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSelect();
        });
    }

    function initContactForm() {
        const form = $('#contactForm');
        const status = $('#formStatus');
        if (!form || !status) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            status.className = 'form-status';
            status.innerHTML = '<div class="status-sending"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending message...</div>';

            const payload = {
                name: form.name ? form.name.value.trim() : '',
                email: form.email ? form.email.value.trim() : '',
                phone: form.phone ? form.phone.value.trim() : '',
                service: $('#service-hidden') ? $('#service-hidden').value.trim() : '',
                message: form.message ? form.message.value.trim() : ''
            };

            try {
                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Request failed');

                status.innerHTML = '<div class="status-success"><i class="fas fa-check-circle" aria-hidden="true"></i> Message received. Our team will review it and get back to you soon.</div>';
                form.reset();

                const hidden = $('#service-hidden');
                if (hidden) hidden.value = '';

                const customSelect = $('#serviceSelect');
                if (customSelect) {
                    const txt = $('.custom-select-text', customSelect);
                    const opts = $$('.custom-select-option', customSelect);
                    if (txt) txt.textContent = 'Select a service';
                    opts.forEach(opt => opt.classList.remove('selected'));
                    customSelect.classList.remove('open');
                    const trigger = $('.custom-select-trigger', customSelect);
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            } catch (err) {
                status.innerHTML = '<div class="status-error"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Something went wrong. Please try again.</div>';
            }

            window.setTimeout(() => {
                status.innerHTML = '';
                status.className = '';
            }, 5000);
        });
    }

    function initComingSoonOverlay() {
        const overlay = $('#comingSoonOverlay');
        const loginBox = $('#adminLoginBox');
        const passwordInput = $('#adminPasswordInput');
        const enterBtn = $('#enterSiteBtn');
        const errorText = $('#adminLoginError');
        const secretLogo = $('#comingSoonOverlay .cs-logo');

        if (!overlay || !loginBox || !passwordInput || !enterBtn || !errorText || !secretLogo) return;

        const ADMIN_PASSWORD = 'Celeste@HQ2026';

        overlay.style.display = 'flex';

        let tapCount = 0;
        let tapTimer = null;

        secretLogo.addEventListener('click', () => {
            tapCount += 1;

            window.clearTimeout(tapTimer);
            tapTimer = window.setTimeout(() => {
                tapCount = 0;
            }, 900);

            if (tapCount >= 3) {
                tapCount = 0;
                loginBox.classList.add('active');
                errorText.textContent = '';
                window.setTimeout(() => passwordInput.focus(), 50);
            }
        });

        function unlockSite() {
            const entered = passwordInput.value.trim();

            if (entered === ADMIN_PASSWORD) {
                errorText.textContent = '';
                overlay.classList.add('hidden');
                window.setTimeout(() => {
                    overlay.style.display = 'none';
                }, 400);
            } else {
                errorText.textContent = 'Incorrect password';
                passwordInput.focus();
                passwordInput.select();
            }
        }

        enterBtn.addEventListener('click', unlockSite);

        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') unlockSite();
        });
    }

    function initThemeLogoListener() {
        const update = () => {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            $$('.logo-image').forEach(logo => {
                if (logo.classList.contains('footer-logo-image')) return;
                logo.style.filter = isDark ? 'invert(1) brightness(2)' : 'none';
            });

            $$('.footer-logo-image').forEach(logo => {
                logo.style.filter = 'brightness(0) invert(1)';
            });
        };

        update();

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', update);
        } else if (typeof media.addListener === 'function') {
            media.addListener(update);
        }
    }

    function init() {
        markPageLoaded();
        initNavbarScroll();
        initMobileMenu();
        initSmoothScroll();
        initPageTransition();
        initBackToTop();
        initScrollProgress();
        initCounters();
        initRevealSystem();
        initCustomSelect();
        initContactForm();
        initComingSoonOverlay();
        initThemeLogoListener();
        console.log('Celeste IT matched script loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();