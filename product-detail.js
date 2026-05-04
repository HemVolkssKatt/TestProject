document.addEventListener('DOMContentLoaded', () => {
    // 0. Dynamic Product Loading
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    let currentProduct = null;
    if (typeof products !== 'undefined') {
        currentProduct = products.find(p => p.id === productId);
    }

    if (currentProduct) {
        // Update Title and Breadcrumbs
        const titleEl = document.querySelector('.info__title');
        if (titleEl) titleEl.textContent = currentProduct.name;
        
        const crumbEl = document.querySelector('.crumbs__current');
        if (crumbEl) crumbEl.textContent = currentProduct.name;

        // Update Price
        const priceEl = document.querySelector('.info__price');
        if (priceEl) {
            const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            priceEl.textContent = formatter.format(currentProduct.price).replace('Rp', 'Rs.');
        }

        // Update Hero Image
        const heroImg = document.querySelector('.hero img');
        if (heroImg) heroImg.src = currentProduct.image;
    }

    // 1. Thumbnail switching
    const thumbs = document.querySelectorAll('.thumb img');
    const heroImg = document.querySelector('.hero img');
    
    thumbs.forEach(thumb => {
        thumb.parentElement.addEventListener('click', () => {
            if (heroImg) heroImg.src = thumb.src;
            
            // Visual feedback for active thumb
            thumbs.forEach(t => t.parentElement.style.border = 'none');
            thumb.parentElement.style.border = '1px solid #b88e2f';
        });
    });

    // 2. Size selection
    const sizeBtns = document.querySelectorAll('.size');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
        });
    });

    // 3. Color selection
    const colorBtns = document.querySelectorAll('.dot');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => {
                b.style.outline = 'none';
                b.style.boxShadow = 'none';
            });
            
            btn.style.outline = '2px solid #b88e2f';
            btn.style.outlineOffset = '2px';
        });
    });

    // 4. Quantity buttons
    const qtyVal = document.querySelector('.qty__val');
    const qtyBtns = document.querySelectorAll('.qty__btn');
    
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let current = parseInt(qtyVal.textContent);
            if (btn.textContent === '+') {
                qtyVal.textContent = current + 1;
            } else if (btn.textContent === '-' && current > 1) {
                qtyVal.textContent = current - 1;
            }
        });
    });

    // 5. Add to Cart integration
    const addToCartBtn = document.querySelector('.btn--primary');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const product = {
                id: currentProduct ? currentProduct.id : 'asgaard-sofa',
                name: currentProduct ? currentProduct.name : 'Asgaard sofa',
                price: currentProduct ? currentProduct.price : 250000,
                image: document.querySelector('.hero img').src,
                quantity: parseInt(qtyVal.textContent),
                size: document.querySelector('.size.is-active')?.textContent || 'L'
            };
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.id === product.id);
            
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Success feedback
            addToCartBtn.textContent = 'Added to Cart!';
            addToCartBtn.style.backgroundColor = '#2ec1ac';
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 800);
        });
    }

    // 6. Like Button on Product Page
    const wishlistBtn = document.querySelector('[data-action="like"]');
    if (wishlistBtn && currentProduct) {
        wishlistBtn.setAttribute('data-id', currentProduct.id);
    }
});
