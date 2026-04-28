document.addEventListener('DOMContentLoaded', () => {
    // 1. Thumbnail switching
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
            colorBtns.forEach(b => b.style.outline = 'none');
            colorBtns.forEach(b => b.style.boxShadow = 'none');
            
            // Add a simple visual feedback for active color
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
                id: 'asgaard-sofa',
                name: 'Asgaard sofa',
                price: 250000,
                image: document.querySelector('.hero img').src,
                quantity: parseInt(qtyVal.textContent),
                size: document.querySelector('.size.is-active')?.textContent || 'L'
            };
            
            // Re-using the addToCart logic from cart-handler if possible, 
            // but cart-handler.js is set up for event delegation.
            // Let's just manually trigger it or implement here.
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.id === product.id);
            
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'cart.html';
        });
    }
});
