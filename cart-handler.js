document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.add-to-cart') || e.target.closest('.btn-cart');
    if (cartBtn) {
        const productItem = cartBtn.closest('.product-item') || cartBtn.closest('.product-card');
        if (!productItem)
            return;

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
});

function extractPrice(s1) {
    const priceText = s1.querySelector('.price').textContent;
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
