/**
 * ULTRA-MODERN AGRITECH INTERACTIVITY SCRIPT
 * Features: Smart Navbar, LERP Parallax, 3D Tilt, Magnetic Hover, Staggered Reveal
 */

// --- 1. PRELOADER & ENTRANCE SEQUENCE ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Minimum load time simulation for smoother UX
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.body.classList.remove('loading-state');
        
        // Trigger Hero Animations Sequentially (Staggered)
        initHeroSequence();
    }, 800);
});

function initHeroSequence() {
    // Select hero elements specifically
    const heroElements = document.querySelectorAll('#home .reveal');
    
    heroElements.forEach((el, index) => {
        // Add cascading delay based on index
        setTimeout(() => {
            el.classList.add('active');
        }, index * 200 + 300); // Base delay 300ms + 200ms per item
    });
}

// --- 2. ADVANCED SLIDER LOGIC ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const slideInterval = 4000; // Sedikit lebih lambat agar lebih elegan

function nextSlide() {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
// Start slider
const sliderTimer = setInterval(nextSlide, slideInterval);


// --- 3. SCROLL REVEAL (INTERSECTION OBSERVER) ---
const observerOptions = {
    threshold: 0.1, // Trigger lebih awal
    rootMargin: "0px 0px -50px 0px" // Offset sedikit dari bawah
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Jika elemen adalah container grid, kita bisa men-stagger anak-anaknya (opsional)
            // observer.unobserve(entry.target); // Optional: Run once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// --- 4. SMOOTH MOUSE PARALLAX (LERP SYSTEM) ---
// Linear Interpolation untuk gerakan mouse yang buttery smooth
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// State variables
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

// Track mouse
window.addEventListener('mousemove', (e) => {
    // Normalize coordinates (-1 to 1) from center
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animation Loop
function animateParallax() {
    // Smoothly interpolate current position to target mouse position
    currentX = lerp(currentX, mouseX, 0.05); // 0.05 is the "smoothness" factor
    currentY = lerp(currentY, mouseY, 0.05);
    
    const orbs = document.querySelectorAll('.parallax-orb');
    
    orbs.forEach(orb => {
        const speed = parseFloat(orb.getAttribute('data-speed') || 1);
        const xMove = currentX * 50 * speed; // Max movement range
        const yMove = currentY * 50 * speed;
        
        orb.style.transform = `translate3d(${xMove}px, ${yMove}px, 0)`;
    });
    
    requestAnimationFrame(animateParallax);
}
animateParallax();


// --- 5. REFINED 3D TILT EFFECT ---
const heroTilt = document.getElementById('hero-tilt');
const heroContainer = document.querySelector('.perspective-container');

if (heroContainer && heroTilt) {
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X relative to element
        const y = e.clientY - rect.top;  // Mouse Y relative to element
        
        // Calculate rotation (max 8 degrees for subtlety)
        // Center of element is 0 rotation
        const xRotation = -((y - rect.height / 2) / rect.height * 16); 
        const yRotation = ((x - rect.width / 2) / rect.width * 16);
        
        // Apply transform directly for responsiveness
        heroTilt.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroContainer.addEventListener('mouseleave', () => {
        // Smooth reset
        heroTilt.style.transition = 'transform 0.5s ease-out';
        heroTilt.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        
        // Remove transition after animation finishes so mousemove is fast again
        setTimeout(() => {
            heroTilt.style.transition = '';
        }, 500);
    });
    
    // Add transition on enter for smooth initial movement
    heroContainer.addEventListener('mouseenter', () => {
        heroTilt.style.transition = 'transform 0.1s ease-out';
    });
}


// --- 6. SMART NAVBAR & ACTIVE LINK HIGHLIGHT ---
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Smart Hide/Show Logic
    // Sembunyikan saat scroll ke bawah (biar fokus konten), munculkan saat scroll ke atas
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    // Style change on scroll (Glass effect intensity)
    // Updated colors to match Fresh Emerald Theme
    if (currentScrollY > 20) {
        navbar.style.paddingTop = '10px';
        navbar.style.paddingBottom = '10px';
        navbar.style.background = 'rgba(6, 78, 59, 0.95)'; // Emerald 900
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.paddingTop = '15px';
        navbar.style.paddingBottom = '15px';
        navbar.style.background = 'rgba(6, 95, 70, 0.85)'; // Emerald 800
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
    
    // Update Active Link
    highlightActiveSection();
});

function highlightActiveSection() {
    const sections = ['home', 'analisis', 'detail-fase', 'dashboard'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            // Jika scroll melewati 30% dari bagian atas section
            if (window.scrollY >= (sectionTop - window.innerHeight / 3)) {
                current = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-[#a3e635]'); // Updated Lime Color
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('text-[#a3e635]');
        }
    });
}


// --- 7. MAGNETIC BUTTON EFFECT ---
// Efek tombol yang "tertarik" ke kursor mouse
const magneticElements = document.querySelectorAll('.btn-dashboard, .nav-link');

magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move element slightly towards mouse (magnetic pull)
        elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    elem.addEventListener('mouseleave', () => {
        // Snap back
        elem.style.transform = 'translate(0px, 0px)';
        elem.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)';
        
        setTimeout(() => {
            elem.style.transition = '';
        }, 300);
    });
});