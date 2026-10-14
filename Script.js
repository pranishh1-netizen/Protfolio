/* ================= IMAGE SLIDER (runs first, independent of everything else) ================= */
class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) { console.error('Slider not found: ' + selector); return; }

        this.track = this.slider.querySelector('.slider-track');
        this.slides = Array.from(this.track.querySelectorAll('.slide'));
        this.prevButton = this.slider.querySelector('.prev');
        this.nextButton = this.slider.querySelector('.next');
        this.dotsContainer = this.slider.querySelector('.slider-dots');
        this.dots = [];
        this.currentIndex = 0;
        this.timer = null;

        this.init();
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.updateSliderPosition();
        this.startAutoPlay();
    }

    updateSliderPosition() {
        this.track.style.transform = 'translateX(' + (-this.currentIndex * 100) + '%)';
        this.updateDots();
    }

    goTo(index) {
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        this.updateSliderPosition();
    }

    nextSlide() { this.goTo(this.currentIndex + 1); }
    prevSlide() { this.goTo(this.currentIndex - 1); }

    bindEvents() {
        this.nextButton.addEventListener('click', () => { this.nextSlide(); this.startAutoPlay(); });
        this.prevButton.addEventListener('click', () => { this.prevSlide(); this.startAutoPlay(); });

        this.slider.addEventListener('mouseenter', () => clearInterval(this.timer));
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        let startX = 0;
        this.slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        this.slider.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 40) {
                if (diff < 0) this.nextSlide(); else this.prevSlide();
                this.startAutoPlay();
            }
        });
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.dots = [];
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
            dot.addEventListener('click', () => { this.goTo(index); this.startAutoPlay(); });
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateDots() {
        this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
    }

    startAutoPlay() {
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), 4000);
    }
}

function startSlider() {
    try { new ImageSlider('.slider'); } catch (e) { console.error('Slider error:', e); }
}

/* ================= EXTRAS (errors here can no longer break the slider) ================= */
function startExtras() {
    try {
        const photo = document.getElementById('profilePhoto');
        const frame = document.getElementById('photoFrame');
        if (photo && frame) {
            photo.addEventListener('error', () => frame.classList.add('no-photo'));
            if (photo.complete && photo.naturalWidth === 0) frame.classList.add('no-photo');
        }

        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();

        const links = document.querySelectorAll('.nav a');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        links.forEach((a) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) observer.observe(target);
        });
    } catch (e) { console.error('Extras error:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { startSlider(); startExtras(); });
} else {
    startSlider();
    startExtras();
}