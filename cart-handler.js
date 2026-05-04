function getWishlist() {
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
}

function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => {
        if (typeof item === 'object' && item !== null) return item.id == productId;
        return item == productId;
    });

    if (index === -1) {
        if (typeof products !== 'undefined') {
            const product = products.find(p => p.id == productId);
            if (product) wishlist.push(product);
            else wishlist.push(productId);
        } else {
            wishlist.push(productId);
        }
    } else {
        wishlist.splice(index, 1);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

document.addEventListener('click', (e) => {
    // Cart Logic
    const cartBtn = e.target.closest('.add-to-cart') || e.target.closest('.btn-cart');
    if (cartBtn) {
        const productItem = cartBtn.closest('.product-item') || cartBtn.closest('.product-card');
        if (!productItem) return;

        const id = parseInt(productItem.dataset.id); 
        const name = productItem.dataset.name;

        if (typeof products !== 'undefined') {     
            const product = products.find(p => p.id === id || p.name === name);
            if (product) {
                addToCart(product);
                return;
            }
        }

        const product = {
            id: id || Date.now(),
            name: name || productItem.querySelector('h3').textContent.trim(),
            price: extractPrice(productItem),
            image: productItem.querySelector('img').src,
            quantity: 1
        };
        addToCart(product);
    } 

    // Wishlist Logic
    const likeBtn = e.target.closest('[data-action="like"]');
    if (likeBtn) {
        e.preventDefault();
        const idStr = likeBtn.dataset.id;
        const id = parseInt(idStr);
        if (!isNaN(id)) {
            toggleWishlist(id);
            
            // Refresh if on wishlist page
            if (typeof renderWishlist === 'function') {
                renderWishlist();
            }
            if (typeof renderProducts === 'function') {
                renderProducts();
            }

            // Visual feedback
            const icon = likeBtn.querySelector('i');
            if (icon) {
                const isLiked = getWishlist().some(item => (item.id == id || item == id));
                if (isLiked) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                    icon.style.color = 'red';
                } else {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                    icon.style.color = '';
                }
            }
        }
    }
});

function extractPrice(s1) {
    const priceEl = s1.querySelector('.price');
    if (!priceEl) return 0;
    const priceText = priceEl.textContent;
    return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id || item.name === product.name);
                 
    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }                  
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html';
}
