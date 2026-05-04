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

document.addEventListener('DOMContentLoaded', function () {
    const showMoreBtn = document.querySelector('.view-more');
    const productGrid = document.querySelector('.product-grid');

    if (showMoreBtn && productGrid) {
        showMoreBtn.addEventListener('click', function () {
            const moreProductsHTML = `
            <div class="product-item" data-id="9" data-name="Asgard">
                <div class="product-img-wrapper">
                    <a href="product.html"><img src="../assets/pingky.jpg" alt="Asgard"></a>
                    <div class="badge badge-discount">-15%</div>
                    <div class="product-overlay">
                        <button class="add-to-cart">Add to cart</button>
                        <div class="overlay-actions">
                            <a href="#"><i class="fa-solid fa-share-nodes"></i> Share</a>
                            <a href="comparsion.html"><i class="fa-solid fa-right-left"></i> Compare</a>
                            <a href="#" data-action="like" data-id="9"><i class="fa-regular fa-heart"></i> Like</a>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="product.html?id=9">Asgard</a></h3>
                    <p class="description">Modern lounge sofa</p>
                    <div class="price-box">
                        <span class="price">Rp 5.500.000</span>
                        <span class="old-price">Rp 6.500.000</span>
                    </div>
                </div>
            </div>

            <div class="product-item" data-id="10" data-name="Bjursta">
                <div class="product-img-wrapper">
                    <a href="product.html?id=10"><img src="../assets/livingroom.jpg" alt="Bjursta"></a>
                    <div class="product-overlay">
                        <button class="add-to-cart">Add to cart</button>
                        <div class="overlay-actions">
                            <a href="#"><i class="fa-solid fa-share-nodes"></i> Share</a>
                            <a href="comparsion.html"><i class="fa-solid fa-right-left"></i> Compare</a>
                            <a href="#" data-action="like" data-id="10"><i class="fa-regular fa-heart"></i> Like</a>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="product.html?id=10">Bjursta</a></h3>
                    <p class="description">Extendable dining table</p>
                    <div class="price-box">
                        <span class="price">Rp 3.200.000</span>
                    </div>
                </div>
            </div>

            <div class="product-item" data-id="11" data-name="Klippan">
                <div class="product-img-wrapper">
                    <a href="product.html?id=11"><img src="../assets/lolito.png" alt="Klippan"></a>
                    <div class="badge badge-new">New</div>
                    <div class="product-overlay">
                        <button class="add-to-cart">Add to cart</button>
                        <div class="overlay-actions">
                            <a href="#"><i class="fa-solid fa-share-nodes"></i> Share</a>
                            <a href="comparsion.html"><i class="fa-solid fa-right-left"></i> Compare</a>
                            <a href="#" data-action="like" data-id="11"><i class="fa-regular fa-heart"></i> Like</a>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="product.html?id=11">Klippan</a></h3>
                    <p class="description">Compact loveseat</p>
                    <div class="price-box">
                        <span class="price">Rp 4.000.000</span>
                    </div>
                </div>
            </div>

            <div class="product-item" data-id="12" data-name="Hemnes">
                <div class="product-img-wrapper">
                    <a href="product.html?id=12"><img src="../assets/potty.jpg" alt="Hemnes"></a>
                    <div class="badge badge-discount">-20%</div>
                    <div class="product-overlay">
                        <button class="add-to-cart">Add to cart</button>
                        <div class="overlay-actions">
                            <a href="#"><i class="fa-solid fa-share-nodes"></i> Share</a>
                            <a href="comparsion.html"><i class="fa-solid fa-right-left"></i> Compare</a>
                            <a href="#" data-action="like" data-id="12"><i class="fa-regular fa-heart"></i> Like</a>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="product.html?id=12">Hemnes</a></h3>
                    <p class="description">Classic wooden bookshelf</p>
                    <div class="price-box">
                        <span class="price">Rp 1.800.000</span>
                        <span class="old-price">Rp 2.250.000</span>
                    </div>
                </div>
            </div>
            `;

            productGrid.insertAdjacentHTML('beforeend', moreProductsHTML);

            showMoreBtn.style.display = 'none';
        });
    }
});
