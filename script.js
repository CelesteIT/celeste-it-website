// ========================================
// CELESTE IT - ENHANCED PREMIUM JAVASCRIPT
// ========================================

// Initialize AOS Animation Library
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out'
});

// ========================================
// 2. BACK TO TOP BUTTON
// ========================================
function initBackToTop() {
    const button = document.createElement('div');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

initBackToTop();

// ========================================
// 3. MOUSE FOLLOW GLOW
// ========================================
function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });
}

initMouseGlow();

// ========================================
// 4. RIPPLE EFFECT ON BUTTONS
// ========================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

initRippleEffect();

// ========================================
// 5. TYPING ANIMATION FOR HERO
// ========================================
function initTypingAnimation() {
    const heroSpan = document.querySelector('.hero-title span');
    if (heroSpan && !heroSpan.hasAttribute('data-typed')) {
        const originalText = heroSpan.innerText;
        heroSpan.setAttribute('data-typed', 'true');
        heroSpan.innerText = '';
        heroSpan.classList.add('typing-text');
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroSpan.innerText += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                heroSpan.classList.remove('typing-text');
            }
        }
        
        setTimeout(typeWriter, 500);
    }
}

setTimeout(initTypingAnimation, 100);

// ========================================
// 6. NUMBER COUNTER ANIMATION
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;
    
    function startCounters() {
        if (counted) return;
        
        counters.forEach(counter => {
            const targetText = counter.innerText;
            const target = parseInt(targetText.replace(/[^0-9]/g, ''));
            const suffix = targetText.replace(/[0-9]/g, '');
            
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = target / 60;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCounter();
        });
        counted = true;
    }
    
    const statsSection = document.querySelector('.stats, .about-stats, .value-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
}

initCounters();

// ========================================
// 7. NAVBAR SCROLL EFFECT
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// 8. MOBILE MENU TOGGLE
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburger) {
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ========================================
// 9. PARALLAX EFFECT
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        });
    }
}

initParallax();

// ========================================
// 10. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// 11. DARK MODE LOGO FIX
// ========================================
function updateLogoForTheme() {
    const logo = document.querySelector('.logo-image');
    const footerLogo = document.querySelector('.footer-logo-image');
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        if (logo) logo.style.filter = 'invert(1) brightness(2)';
        if (footerLogo) footerLogo.style.filter = 'invert(1) brightness(2)';
    } else {
        if (logo) logo.style.filter = 'none';
        if (footerLogo) footerLogo.style.filter = 'none';
    }
}

updateLogoForTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogoForTheme);

// ========================================
// 12. ADD PARALLAX BACKGROUND DIVS
// ========================================
function addParallaxBg() {
    const sections = document.querySelectorAll('.hero, .cta, .page-header');
    sections.forEach(section => {
        if (!section.querySelector('.parallax-bg')) {
            const bg = document.createElement('div');
            bg.className = 'parallax-bg';
            section.style.position = 'relative';
            section.insertBefore(bg, section.firstChild);
        }
    });
}

addParallaxBg();

// ========================================
// 13. FORM SUBMIT HANDLER (if contact form exists)
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        formStatus.innerHTML = '<div class="status-sending">Sending message... <i class="fas fa-spinner fa-spin"></i></div>';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formStatus.innerHTML = '<div class="status-success"><i class="fas fa-check-circle"></i> Message sent successfully! We\'ll get back to you soon.</div>';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.innerHTML = '<div class="status-error"><i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again or email us directly at hello@celesteit.com</div>';
        }
        
        setTimeout(() => {
            formStatus.innerHTML = '';
        }, 5000);
    });
}

// ========================================
// 14. 3D CARD TILT EFFECT
// ========================================
const tiltCards = document.querySelectorAll('.service-card, .feature-card, .industry-card, .team-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// ========================================
// 15. SCROLL PROGRESS BAR
// ========================================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

console.log('Celeste IT - Premium Website Loaded Successfully 🚀');