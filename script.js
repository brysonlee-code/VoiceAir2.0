/* ============================================
   VOICE AIR 2.0 — Landing Page Scripts
   Scroll animations, nav behavior, mobile menu,
   revenue leak calculator
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Nav scroll behavior ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;
    let savedScrollY = 0;
    let menuBusy = false;

    function openMenu() {
        if (menuOpen || menuBusy) return;
        menuBusy = true;
        menuOpen = true;
        savedScrollY = window.scrollY;
        hamburger.classList.add('is-open');
        mobileMenu.classList.add('is-open');
        document.body.classList.add('menu-open');
        document.body.style.top = `-${savedScrollY}px`;
        setTimeout(() => { menuBusy = false; }, 450);
    }

    function closeMenu() {
        if (!menuOpen || menuBusy) return;
        menuBusy = true;
        menuOpen = false;
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollY);
        setTimeout(() => { menuBusy = false; }, 450);
    }

    hamburger.addEventListener('click', () => {
        menuOpen ? closeMenu() : openMenu();
    });

    document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta').forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu();
    });

    // --- Scroll-triggered animations ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay) || 0;

                setTimeout(() => {
                    el.classList.add('is-visible');
                }, delay * 1000);

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Draggable marquee ---
    const marquee = document.querySelector('.marquee');
    const marqueeTrack = document.querySelector('.marquee__track');

    if (marquee && marqueeTrack) {
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;

        const getTranslateX = () => {
            const style = window.getComputedStyle(marqueeTrack);
            const matrix = new DOMMatrix(style.transform);
            return matrix.m41;
        };

        const onStart = (x) => {
            isDragging = true;
            startX = x;
            currentTranslate = getTranslateX();
            marquee.classList.add('is-dragging');
            marqueeTrack.style.transform = `translateX(${currentTranslate}px)`;
        };

        const onMove = (x) => {
            if (!isDragging) return;
            const diff = x - startX;
            marqueeTrack.style.transform = `translateX(${currentTranslate + diff}px)`;
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            marquee.classList.remove('is-dragging');
            marqueeTrack.style.transform = '';
        };

        marquee.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
        window.addEventListener('mousemove', (e) => onMove(e.clientX));
        window.addEventListener('mouseup', onEnd);

        marquee.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchend', onEnd);
    }

    // --- Parallax on hero background ---
    const heroBg = document.querySelector('.hero__bg');

    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('is-active'));
                    navLink.classList.add('is-active');
                }
            }
        });
    }, { passive: true });

    // --- Revenue Leak Calculator ---
    window.calculateLeak = function() {
        const calls = parseFloat(document.getElementById('missedCalls').value) || 0;
        const deal = parseFloat(document.getElementById('dealValue').value) || 0;
        const rate = parseFloat(document.getElementById('closeRate').value) || 0;
        const annual = calls * deal * (rate / 100) * 52;
        document.getElementById('resultAmount').textContent = '$' + annual.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    // Run on page load
    window.calculateLeak();

    // Live update on input change
    document.querySelectorAll('#calculator input').forEach(input => {
        input.addEventListener('input', window.calculateLeak);
    });

    // --- Live Demo Modal ---
    const demoModal = document.getElementById('demoModal');

    window.openDemoModal = function() {
        demoModal.classList.add('is-open');
        document.body.classList.add('menu-open');
        document.getElementById('demoPhone').focus();
    };

    window.closeDemoModal = function() {
        demoModal.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        // Reset form state
        document.getElementById('demoForm').style.display = '';
        document.getElementById('demoSuccess').style.display = 'none';
        document.getElementById('demoSubmitBtn').classList.remove('is-loading');
        document.getElementById('demoSubmitBtn').textContent = 'Call Me Now';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal.classList.contains('is-open')) {
            window.closeDemoModal();
        }
    });

    window.submitDemoRequest = function(e) {
        e.preventDefault();

        const phone = document.getElementById('demoPhone').value.trim();
        const name = document.getElementById('demoName').value.trim();
        const btn = document.getElementById('demoSubmitBtn');

        if (!phone) return;

        btn.classList.add('is-loading');
        btn.textContent = 'Calling...';

        // ── WEBHOOK: Replace this URL with your actual webhook endpoint ──
        const WEBHOOK_URL = 'YOUR_WEBHOOK_URL';

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: phone,
                name: name,
                source: 'voiceair-website',
                timestamp: new Date().toISOString()
            })
        })
        .then(() => {
            // Show success state
            document.getElementById('demoForm').style.display = 'none';
            document.getElementById('demoSuccess').style.display = 'block';
        })
        .catch(() => {
            // Still show success (webhook may not return CORS headers from static site)
            document.getElementById('demoForm').style.display = 'none';
            document.getElementById('demoSuccess').style.display = 'block';
        });
    };
});
