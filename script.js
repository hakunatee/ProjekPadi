/**
 * ULTIMATE AGRITECH INTERACTIVITY
 * Author: Lead Dev AI
 */

// --- 1. PRELOADER & INITIALIZATION LOGIC ---
// Variable untuk tracking status loading
let progress = 0;
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const preloader = document.getElementById('preloader');

// Fungsi untuk memulai animasi masuk (Entrance)
function initHeroSequence() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, index * 150 + 300); // Staggered animation
    });

    // Scramble effect for title text
    const glitchText = document.querySelector('.glitch-effect');
    if(glitchText) scrambleText(glitchText);
}

// Simulasi Loading 0-100%
const loadingInterval = setInterval(() => {
    // Kecepatan random agar terasa natural
    progress += Math.floor(Math.random() * 3) + 1;
    
    if (progress > 100) progress = 100;

    // Update UI
    if (progressText) progressText.innerText = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Jika sudah 100%, hilangkan preloader
    if (progress === 100) {
        clearInterval(loadingInterval);
        
        setTimeout(() => {
            // Hilangkan preloader
            document.body.classList.add('loaded');
            document.body.classList.remove('loading-state');
            
            // Jalankan animasi halaman utama
            initHeroSequence();
        }, 500); // Delay sebentar saat 100% sebelum hilang
    }
}, 30); // Kecepatan update (semakin kecil semakin cepat)


// --- 2. CUSTOM CURSOR SYSTEM ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const hoverTriggers = document.querySelectorAll('.hover-trigger');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag (animation)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Magnetic & Hover Effects
hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    trigger.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });
});


// --- 3. PARTICLE SYSTEM (CANVAS FIREFLIES) ---
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.005; // Twinkle effect
            if (this.size <= 0.2) this.size = Math.random() * 2 + 0.5;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(163, 230, 53, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // Resize Canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


// --- 4. SPOTLIGHT CARD EFFECT (MOUSE TRACKING GLOW) ---
const cardsContainer = document.getElementById('cards-container');
const profilContainer = document.getElementById('profil');

if (cardsContainer) {
    cardsContainer.onmousemove = e => {
        for(const card of document.querySelectorAll('#cards-container .spotlight-card')) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    };
}

if (profilContainer) {
    profilContainer.onmousemove = e => {
        for(const card of document.querySelectorAll('#profil .spotlight-card')) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    };
}


// --- 5. TEXT SCRAMBLE EFFECT ---
function scrambleText(element) {
    const originalText = element.getAttribute('data-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    
    const interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if(index < iteration) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
}

// --- 6. STANDARD SLIDER & SCROLL LOGIC ---
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

// 7. 3D Tilt for Hero Image
const heroTilt = document.getElementById('hero-tilt');
const heroContainer = document.querySelector('.perspective-container');
if (heroContainer && heroTilt) {
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRot = -((y - rect.height/2) / rect.height * 10);
        const yRot = ((x - rect.width/2) / rect.width * 10);
        heroTilt.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`;
    });
    heroContainer.addEventListener('mouseleave', () => {
        heroTilt.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
}
