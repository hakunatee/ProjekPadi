/**
 * ULTIMATE AGRITECH INTERACTIVITY (FINAL REFINED v3)
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

// --- 2. DYNAMIC BACKGROUND (CANVAS PARTICLES - FIREFLIES) ---
// REVISI: Menggunakan Canvas untuk partikel kecil, jelas, dan bergerak otomatis
const canvas = document.getElementById('particle-canvas');
const parallaxBg = document.getElementById('parallax-bg');

// Sembunyikan orb besar yang "samar" agar tidak mengganggu
if (parallaxBg) {
    parallaxBg.style.display = 'none'; 
}

if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    // Jumlah partikel disesuaikan agar tidak terlalu ramai tapi terlihat jelas
    const particleCount = window.innerWidth < 768 ? 30 : 60; 

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Kecepatan gerak otomatis (Tanpa Mouse)
            this.vx = (Math.random() - 0.5) * 1.5; 
            this.vy = (Math.random() - 0.5) * 1.5;
            // Ukuran kecil-kecil sesuai request (1px - 3px)
            this.size = Math.random() * 2 + 1; 
            this.baseOpacity = Math.random() * 0.5 + 0.3; // Lebih jelas (min 0.3)
            this.opacity = this.baseOpacity;
            this.fadeSpeed = 0.01;
        }

        update() {
            // Gerak terus menerus
            this.x += this.vx;
            this.y += this.vy;

            // Pantulan di tepi layar (Bounce)
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Efek Kedip (Twinkle)
            this.opacity += this.fadeSpeed;
            if (this.opacity > this.baseOpacity + 0.2 || this.opacity < this.baseOpacity - 0.2) {
                this.fadeSpeed *= -1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Warna Lime Green yang menyala
            ctx.fillStyle = `rgba(163, 230, 53, ${this.opacity})`;
            // Efek Glow
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#a3e635';
            ctx.fill();
            // Reset shadow untuk performa
            ctx.shadowBlur = 0; 
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}

// --- 3. SEED TRAIL EFFECT (INTERACTIVE) ---
document.addEventListener('mousemove', (e) => {
    // Throttle agar performa tetap ringan
    if (Math.random() > 0.2) return; 

    const seed = document.createElement('div');
    seed.classList.add('seed-particle');
    
    // Styling Golden Grain
    seed.style.position = 'fixed';
    seed.style.width = '5px';
    seed.style.height = '8px'; 
    seed.style.backgroundColor = '#fbbf24'; // Emas
    seed.style.borderRadius = '50%'; 
    seed.style.pointerEvents = 'none';
    seed.style.zIndex = '9998';
    seed.style.left = `${e.clientX}px`;
    seed.style.top = `${e.clientY}px`;
    
    const rotation = Math.random() * 360;
    const fallDistance = 60 + Math.random() * 40;
    const drift = (Math.random() - 0.5) * 60;
    
    seed.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s';
    seed.style.opacity = '1';
    seed.style.transform = `rotate(${rotation}deg) scale(1)`;

    document.body.appendChild(seed);

    requestAnimationFrame(() => {
        seed.style.opacity = '0';
        seed.style.transform = `translate(${drift}px, ${fallDistance}px) rotate(${rotation + 180}deg) scale(0.5)`;
    });
    
    setTimeout(() => seed.remove(), 1000);
});

// --- 4. ANIMATED COUNTERS ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            
            let count = 0;
            const duration = 2000;
            const intervalTime = 30;
            const steps = duration / intervalTime;
            const increment = target / steps;

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(count);
                }
            }, intervalTime);
            
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.1 }); 

counters.forEach(counter => counterObserver.observe(counter));

// --- 5. AUDIO PLAYER TOGGLE ---
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
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            audioBtn.classList.remove('animate-pulse');
        } else {
            bgMusic.play().catch(e => console.log("Audio autoplay blocked"));
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
            audioBtn.classList.add('animate-pulse');
        }
        isPlaying = !isPlaying;
    });
}

// --- 6. SCROLL PROGRESS BAR ---
const scrollBar = document.querySelector('.scroll-progress-bar');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    if(scrollBar) scrollBar.style.width = `${scrolled}%`;
});

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

// --- 8. CURSOR & SPOTLIGHT ---
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

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
setInterval(() => {
    if(slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 4000);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
