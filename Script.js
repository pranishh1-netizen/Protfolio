/* ---------- Profile photo fallback ---------- */
// If images/pranish.jpg is missing, show the "PN" initials instead of a broken image.
const photo = document.getElementById('profilePhoto');
const frame = document.getElementById('photoFrame');
if (photo) {
    photo.addEventListener('error', () => frame.classList.add('no-photo'));
    if (photo.complete && photo.naturalWidth === 0) frame.classList.add('no-photo');
}

/* ---------- Image slider ---------- */
class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;

        this.track = this.slider.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
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
        this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
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

        // Pause autoplay while the mouse is over the slider
        this.slider.addEventListener('mouseenter', () => clearInterval(this.timer));
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        // Swipe on phones
        let startX = 0;
        this.slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        this.slider.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 40) {
                diff < 0 ? this.nextSlide() : this.prevSlide();
                this.startAutoPlay();
            }
        });

        // Arrow keys when the slider has focus
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.dots = [];
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => { this.goTo(index); this.startAutoPlay(); });
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider('.slider');

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Highlight the nav link of the section you're viewing
    const links = document.querySelectorAll('.nav a');
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => s && observer.observe(s));
});