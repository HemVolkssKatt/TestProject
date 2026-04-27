(function () {
    const slider = document.querySelector('.inspiration-slider');
    const nextBtn = document.querySelector('.slider-next-btn');
    const dots = document.querySelectorAll('.slider-pagination .dot');
    const slides = document.querySelectorAll('.inspiration-slider .slide');
    const GAP = 24;

    if (!slider || !nextBtn || slides.length === 0) return;

    let currentIndex = 0;   

    function getSlideWidth(index) {
        return slides[index].getBoundingClientRect().width;
    }
 
    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        const inactiveWidth = 372;
        const offset = (inactiveWidth + GAP) * currentIndex;

        slider.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        slides.forEach((slide, i) => slide.classList.toggle('slide-main', i === currentIndex));
    }


    nextBtn.addEventListener('click', function () {
        goToSlide(currentIndex + 1);    
    });


    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goToSlide(i);
        });
    });
})();
