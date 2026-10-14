document.addEventListener('DOMContentLoaded', function () {
    var slider = document.querySelector('.slider');
    var track = slider.querySelector('.slider-track');
    var slides = track.querySelectorAll('.slide');
    var prevBtn = slider.querySelector('.prev');
    var nextBtn = slider.querySelector('.next');
    var dotsBox = slider.querySelector('.slider-dots');
    var current = 0;
    var timer;
    var dots = [];

    function show(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-current * 100) + '%)';
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === current);
        }
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(function () { show(current + 1); }, 4000);
    }

    for (let i = 0; i < slides.length; i++) {
        var dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { show(i); restart(); });
        dotsBox.appendChild(dot);
        dots.push(dot);
    }

    nextBtn.addEventListener('click', function () { show(current + 1); restart(); });
    prevBtn.addEventListener('click', function () { show(current - 1); restart(); });

    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    show(0);
    restart();

    // Footer year
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Fallback initials if the profile photo is missing
    var photo = document.getElementById('profilePhoto');
    var frame = document.getElementById('photoFrame');
    if (photo && frame) {
        photo.addEventListener('error', function () { frame.classList.add('no-photo'); });
    }
});