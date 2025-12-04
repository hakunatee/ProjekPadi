/**
 * ULTIMATE AGRITECH INTERACTIVITY (REFINED & FIXED)
 */

// --- 1. PRELOADER & INITIALIZATION ---
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
    
    // Pastikan elemen ada sebelum diupdate untuk mencegah error
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

// --- 2. SEED TRAIL EFFECT (JEJAK BENIH PADI) ---
document.addEventListener('mousemove', (e) => {
    // Throttle: Hanya buat partikel setiap beberapa frame agar tidak berat
    if (Math.random() > 0.2) return; 

    const seed = document.createElement('div');
    seed.classList.add('seed-particle');
    
    // Styling visual butir padi langsung di sini agar lebih distinct
    seed.style.position = 'fixed';
    seed.style.width = '8px';
    seed.style.height = '8px';
    seed.style.backgroundColor = '#ffd700'; // Warna Emas (Gabah Matang)
    seed.style.borderRadius = '80% 0 50% 0'; // Bentuk lonjong seperti biji
    seed.style.pointerEvents = 'none';
    seed.style.zIndex = '9998';
    seed.style.boxShadow = '0 0 4px rgba(255, 215, 0, 0.6)'; // Glow efek
    
    seed.style.left = `${e.clientX}px`;
    seed.style.top = `${e.clientY}px`;
    
    // Rotasi acak agar terlihat natural seperti taburan benih
    const rotation = Math.random() * 360;
    seed.style.transform = `rotate(${rotation}deg)`;
    
    // Animasi jatuh sederhana
    seed.animate([
        { transform: `translate(0, 0) rotate(${rotation}deg)`, opacity: 1 },
        { transform: `translate(0, 60px) rotate(${rotation + 90}deg)`, opacity: 0 }
    ], {
        duration: 800,
        easing: 'ease-in'
    });
    
    document.body.appendChild(seed);
    
    // Hapus elemen setelah animasi selesai
    setTimeout(() => seed.remove(), 800);
});

// --- 3. ANIMATED COUNTERS (FIXED LOGIC) ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target'); // Ambil angka target
            
            // Logika hitung berbasis durasi (2 detik)
            const duration = 2000; 
            const startTimestamp = performance.now();
            
            const step = (currentTime) => {
                const elapsed = currentTime - startTimestamp;
                const progress = Math.min(elapsed / duration, 1); // 0 sampai 1
                
                // Easing function (easeOutExpo) agar melambat di akhir
                const easeProgress = 1 - Math.pow(2, -10 * progress);
                
                const currentCount = Math.floor(easeProgress * target);
                counter.innerText = currentCount;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.innerText = target; // Pastikan angka akhir tepat
                }
            };
            
            requestAnimationFrame(step);
            counterObserver.unobserve(counter); // Hanya jalankan sekali
        }
    });
}, { threshold: 0.1 }); // Ubah threshold jadi 0.1 (lebih sensitif) agar pasti trigger

counters.forEach(counter => counterObserver.observe(counter));

// --- 4. AUDIO PLAYER TOGGLE ---
const audioBtn = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
let isPlaying = false;

if (audioBtn && bgMusic) {
    bgMusic.volume = 0.3; // Volume background (tidak terlalu keras)
    
    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            if(iconPlay) iconPlay.classList.remove('hidden');
            if(iconPause) iconPause.classList.add('hidden');
            audioBtn.classList.remove('animate-pulse');
        } else {
            // Menggunakan Promise untuk handle autoplay policy browser
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Play sukses
                    if(iconPlay) iconPlay.classList.add('hidden');
                    if(iconPause) iconPause.classList.remove('hidden');
                    audioBtn.classList.add('animate-pulse');
                })
                .catch(error => {
                    console.log("Audio play blocked check browser settings or interactions");
                });
            }
        }
        isPlaying = !isPlaying;
    });
}

// --- 5. SCROLL PROGRESS BAR ---
const scrollBar = document.querySelector('.scroll-progress-bar');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    if(scrollBar) scrollBar.style.width = `${scrolled}%`;
});

// --- 6. PARALLAX TEXT ---
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

// --- 7. CURSOR, SPOTLIGHT, ETC ---
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
