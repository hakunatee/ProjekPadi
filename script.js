/**
 * ULTIMATE AGRITECH INTERACTIVITY (FINAL)
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

// --- 2. RESTORED MOUSE PARALLAX FOR ORBS (FIXED & SMOOTH) ---
// Menggunakan Linear Interpolation (LERP) agar orbs bergerak halus dan nyata
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Titik tengah layar
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    // Gunakan clientX/Y agar orb tetap di view saat scroll
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
});

const orbs = document.querySelectorAll('.parallax-orb');

function animateOrbs() {
    // LERP: Mengejar posisi mouse dengan delay halus (0.1)
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;

    orbs.forEach(orb => {
        const speed = parseFloat(orb.getAttribute('data-speed') || 1);
        
        // Kalkulasi posisi baru (dibagi 15 agar movement terasa tapi tidak liar)
        const x = (targetX * speed) / 15; 
        const y = (targetY * speed) / 15;
        
        orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(animateOrbs);
}

// Jalankan animasi jika ada orb
if (orbs.length > 0) {
    animateOrbs();
}

// --- 3. SEED TRAIL EFFECT ---
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return; 
    const seed = document.createElement('div');
    seed.classList.add('seed-particle');
    seed.style.left = `${e.clientX}px`;
    seed.style.top = `${e.clientY}px`;
    seed.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(seed);
    setTimeout(() => seed.remove(), 1000);
});

// --- 4. ANIMATED COUNTERS ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 30);
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
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
