
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       HERO PARTICLES ANIMATION (Canvas)
       ========================================= */
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;
        const connectionDistance = 120;
        let animationId;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5 - 0.2, // Slight upward drift
                    radius: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const lineOpacity = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(45, 212, 191, ${lineOpacity})`; 
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            }

            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    /* =========================================
       GSAP HERO TEXT ANIMATIONS
       ========================================= */
    if (typeof gsap !== 'undefined') {

        // Initial State
        gsap.set(".hero-kicker", { y: 30, opacity: 0 });
        gsap.set(".hero-headline .line-1", { y: 100, opacity: 0 });
        gsap.set(".hero-headline .line-2", { y: 100, opacity: 0 });
        gsap.set(".hero-headline .line-sub", { y: 60, opacity: 0 });
        gsap.set(".hero-subtext", { y: 30, opacity: 0 });
        gsap.set(".hero-actions", { y: 20, opacity: 0 });

        // Stagger Timeline
        const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.3 });

        tl.to(".hero-kicker", {
            duration: 1,
            y: 0,
            opacity: 1
        })
        .to(".hero-headline .line-1", {
            duration: 1.2,
            y: 0,
            opacity: 1
        }, "-=0.7")
        .to(".hero-headline .line-2", {
            duration: 1.2,
            y: 0,
            opacity: 1
        }, "-=0.9")
        .to(".hero-headline .line-sub", {
            duration: 1,
            y: 0,
            opacity: 1
        }, "-=0.9")
        .to(".hero-subtext", {
            duration: 1,
            y: 0,
            opacity: 1
        }, "-=0.7")
        .to(".hero-actions", {
            duration: 1,
            y: 0,
            opacity: 1
        }, "-=0.8");

        // Interactive Glow Effect on "Intelligence"
        const title = document.querySelector('.hero-headline .line-2');
        if (title) {
            document.addEventListener('mousemove', (e) => {
                const xPos = (e.clientX / window.innerWidth) - 0.5;
                const yPos = (e.clientY / window.innerHeight) - 0.5;
                gsap.to(title, {
                    duration: 1,
                    textShadow: `${xPos * 20}px ${yPos * 20}px 30px rgba(45, 212, 191, 0.4)`,
                    ease: "power1.out"
                });
            });
        }

    } else {
        // Fallback: just show everything if GSAP fails to load
        document.querySelectorAll('.hero-kicker, .hero-headline .line-1, .hero-headline .line-2, .hero-subtext, .hero-actions').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    /* =========================================
       SCROLL REVEAL ANIMATIONS
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* =========================================
       COUNTER ANIMATION (Stats)
       ========================================= */
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 2000;
                    const start = performance.now();

                    function updateCounter(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = eased * target;
                        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
                        if (progress < 1) requestAnimationFrame(updateCounter);
                    }
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    /* =========================================
       TESTIMONIAL SLIDER
       ========================================= */
    const track = document.querySelector('.testimonial-track');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (track && prevBtn && nextBtn) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsPerView = 1;

        function getCardsPerView() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        }

        function updateSlider() {
            cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            const card = cards[0];
            const cardStyle = getComputedStyle(card);
            const cardWidth = card.offsetWidth + parseFloat(cardStyle.marginRight || 0);
            const offset = -currentIndex * cardWidth;
            track.style.transform = `translateX(${offset}px)`;

            // Update dots
            if (dotsContainer) {
                const totalDots = maxIndex + 1;
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalDots; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if (i === currentIndex) dot.classList.add('active');
                    dot.addEventListener('click', () => { currentIndex = i; updateSlider(); });
                    dotsContainer.appendChild(dot);
                }
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; updateSlider(); }
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (currentIndex < maxIndex) { currentIndex++; updateSlider(); }
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();

        // Auto-slide
        let autoSlide = setInterval(() => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
            updateSlider();
        }, 5000);

        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.parentElement.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                const maxIndex = Math.max(0, cards.length - cardsPerView);
                currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
                updateSlider();
            }, 5000);
        });
    }

    /* =========================================
       COMPARISON SLIDER (Before/After) - Smoother Version
       ========================================= */
    const compareSlider = document.getElementById('compareSlider');
    if (compareSlider) {
        const handle = compareSlider.querySelector('.c-handle');
        const afterImg = compareSlider.querySelector('.c-img.after');
        
        let isDragging = false;
        let targetPercent = 50;
        let currentPercent = 50;
        let rafActive = false;

        function updateSlider() {
            const delta = targetPercent - currentPercent;
            currentPercent += delta * 0.15; // Damping for smooth feel

            if (Math.abs(delta) > 0.05) {
                afterImg.style.clipPath = `inset(0 ${100 - currentPercent}% 0 0)`;
                handle.style.left = currentPercent + '%';
                requestAnimationFrame(updateSlider);
            } else {
                afterImg.style.clipPath = `inset(0 ${100 - targetPercent}% 0 0)`;
                handle.style.left = targetPercent + '%';
                rafActive = false;
            }
        }

        function setTargetPosition(x) {
            const rect = compareSlider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            targetPercent = Math.max(0, Math.min(100, percent));
            
            if (!rafActive) {
                rafActive = true;
                requestAnimationFrame(updateSlider);
            }
        }

        compareSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            setTargetPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) setTargetPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        compareSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            setTargetPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) setTargetPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => isDragging = false);
        compareSlider.addEventListener('click', (e) => setTargetPosition(e.clientX));
    }

    /* =========================================
       NAVBAR SCROLL EFFECT
       ========================================= */
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const isHeroPage = document.querySelector('.hero-modern'); // Check if we are on index.html

    if (nav) {
        if (isHeroPage) {
            // Dynamic transparency logic for Homepage
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
            
            // Check initial scroll position
            if (window.scrollY > 50) nav.classList.add('scrolled');
        } else {
            // Always use the "Scrolled Blue" style on other pages
            nav.classList.add('scrolled');
            // Remove the vertical translation hover effect for a more stable feel on subpages
            nav.style.transform = 'none'; 
        }
    }

    /* =========================================
       MOBILE MENU TOGGLE
       ========================================= */
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    /* FAQ Accordion */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            const isOpen = parent.classList.contains('open');

            // Close other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                parent.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
