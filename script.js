/**
 * ULTIMATE AGRITECH INTERACTIVITY (FINAL FIX)
 */

// --- 1. PRELOADER ---
let progress = 0;
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

function initHeroSequence() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, index) => {
        setTimeout(() => el.classList.add('active'), index * 150 + 300);
    });
    const glitchText = document.querySelector('.glitch-effect');
    if(glitchText) scrambleText(glitchText);
}

const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 3) + 1;
    if (progress > 100) progress = 100;
    if (progressText) progressText.innerText = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (progress === 100) {
        clearInterval(loadingInterval);
        setTimeout(() => {
            document.body.classList.add('loaded');
            document.body.classList.remove('loading-state');
            initHeroSequence();
        }, 500);
    }
}, 30);

// --- 2. CANVAS PARTICLES ---
const canvas = document.getElementById('particle-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }
    
    resizeCanvas();

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80; 

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.8; 
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 1.5 + 1; 
            this.baseOpacity = Math.random() * 0.5 + 0.2;
            this.opacity = this.baseOpacity;
            this.fadeSpeed = 0.005 + Math.random() * 0.005;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
            if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
            this.opacity += this.fadeSpeed;
            if (this.opacity > this.baseOpacity + 0.3 || this.opacity < 0.1) this.fadeSpeed *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163, 230, 53, ${this.opacity})`;
            ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(163, 230, 53, 0.5)';
            ctx.fill(); ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    initParticles(); animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

// --- 3. SEED TRAIL ---
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.2) return; 
    const seed = document.createElement('div');
    seed.classList.add('seed-particle');
    seed.style.left = `${e.clientX}px`; seed.style.top = `${e.clientY}px`;
    seed.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(seed);
    requestAnimationFrame(() => {
        seed.style.opacity = '0';
        seed.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${60 + Math.random() * 40}px) rotate(${Math.random() * 360}deg) scale(0.5)`;
    });
    setTimeout(() => seed.remove(), 1000);
});

// --- 4. COUNTERS ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const steps = 100;
            const increment = target / steps;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(count);
                }
            }, 20);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.1 }); 
counters.forEach(c => counterObserver.observe(c));

// --- 5. AUDIO ---
const audioBtn = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
let isPlaying = false;

if (audioBtn && bgMusic) {
    bgMusic.volume = 0.4;
    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            iconPlay.classList.remove('hidden'); iconPause.classList.add('hidden');
            audioBtn.classList.remove('animate-pulse');
        } else {
            bgMusic.play().catch(e => console.log("Audio block"));
            iconPlay.classList.add('hidden'); iconPause.classList.remove('hidden');
            audioBtn.classList.add('animate-pulse');
        }
        isPlaying = !isPlaying;
    });
}

// --- 6. SCROLL PROGRESS & SCROLL TO TOP (FIXED) ---
const scrollBar = document.querySelector('.scroll-progress-bar');
const scrollTopBtn = document.getElementById('scrollToTopBtn');

// Gunakan fungsi onscroll window global agar lebih reliable
window.onscroll = function() {
    // Ambil nilai scroll dari berbagai kemungkinan properti browser
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // Progress Bar Logic
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    if(scrollBar) scrollBar.style.width = `${scrolled}%`;

    // Scroll Top Button Logic
    if (scrollTopBtn) {
        if (scrollTop > 300) { // Muncul setelah scroll 300px
            scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
            scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
            scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
    }
    
    // Navbar Hide/Show Logic
    if (typeof lastScrollY !== 'undefined') {
        const navbar = document.querySelector('.navbar');
        if (scrollTop > lastScrollY && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        // Navbar Style
        if (scrollTop > 20) {
            navbar.style.background = 'rgba(6, 78, 59, 0.95)';
            navbar.style.paddingTop = '10px'; navbar.style.paddingBottom = '10px';
        } else {
            navbar.style.background = 'rgba(6, 78, 59, 0.85)';
            navbar.style.paddingTop = '15px'; navbar.style.paddingBottom = '15px';
        }
        lastScrollY = scrollTop;
    } else {
        window.lastScrollY = scrollTop;
    }
};

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- 7. PARALLAX TEXT ---
const textContainer = document.querySelector('.parallax-text-container');
const layers = document.querySelectorAll('.layer');
if(textContainer) {
    textContainer.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        layers.forEach(layer => {
            const depth = layer.getAttribute('data-depth');
            layer.style.transform = `translateX(${x * depth * 50}px) translateY(${y * depth * 50}px)`;
        });
    });
}

// --- 8. CURSOR ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const hoverTriggers = document.querySelectorAll('.hover-trigger');

if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    });
}
hoverTriggers.forEach(t => {
    t.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    t.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Spotlight
const cardsContainer = document.getElementById('cards-container');
if (cardsContainer) {
    cardsContainer.onmousemove = e => {
        for(const card of cardsContainer.querySelectorAll('.spotlight-card')) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
    };
}

// Text Scramble
function scrambleText(element) {
    const originalText = element.getAttribute('data-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    const interval = setInterval(() => {
        element.innerText = originalText.split("").map((l, i) => {
            if(i < iteration) return originalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1/3;
    }, 30);
}

// Standard Slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
setInterval(() => {
    if(slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 4000);

// Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Hero Tilt
const heroTilt = document.getElementById('hero-tilt');
const heroContainer = document.querySelector('.perspective-container');
if (heroContainer && heroTilt) {
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const xRot = -((e.clientY - rect.top - rect.height/2) / rect.height * 10);
        const yRot = ((e.clientX - rect.left - rect.width/2) / rect.width * 10);
        heroTilt.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`;
    });
    heroContainer.addEventListener('mouseleave', () => {
        heroTilt.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
}
