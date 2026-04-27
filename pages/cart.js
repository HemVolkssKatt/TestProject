document.addEventListener('DOMContentLoaded', () => {
    const cartTable = document.querySelector('.cart-table');
    const subtotalEl = document.querySelector('.js-cart-subtotal');
    const totalEl = document.querySelector('.js-cart-total');

    function formatCurrency(value) {
        return 'Rp ' + value.toLocaleString('id-ID');
    }

    function renderCart() {
        
        const rows = document.querySelectorAll('.cart-table__row');
        rows.forEach(row => row.remove());

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'cart-table__row';
            emptyRow.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: span 4;">Your cart is empty.</div>';
            cartTable.appendChild(emptyRow);
            updateTotals();
            return;
        }

        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-table__row';
            row.dataset.id = item.id;
            row.innerHTML = `
                <div class="cart-table__product">
                    <div class="cart-table__thumb">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-table__name">${item.name}</div>
                </div>
                <div class="cart-table__cell cart-table__muted js-cart-price" data-price="${item.price}">${formatCurrency(item.price)}</div>
                <div class="cart-table__cell">
                    <input class="cart-table__qty js-cart-qty" type="number" value="${item.quantity}" min="1">
                </div>
                <div class="cart-table__cell cart-table__subtotal">
                    <span class="js-cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</span>
                    <button class="cart-table__remove" aria-label="Remove">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z"></path>
                            <path d="M6 9h12l-1 12H7L6 9Z"></path>
                        </svg>
                    </button>
                </div>
            `;
            cartTable.appendChild(row);
        });

        updateTotals();
    }

    function updateTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let grandTotal = 0;

        cart.forEach(item => {
            grandTotal += item.price * item.quantity;
        });

        if (subtotalEl) subtotalEl.textContent = formatCurrency(grandTotal);
        if (totalEl) totalEl.textContent = formatCurrency(grandTotal);
    }

    document.body.addEventListener('input', (e) => {
        if (e.target.classList.contains('js-cart-qty')) {
            const row = e.target.closest('.cart-table__row');
            const id = parseInt(row.dataset.id);
            const newQty = parseInt(e.target.value) || 1;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity = newQty;
                localStorage.setItem('cart', JSON.stringify(cart));
                
                
                const itemSubtotalEl = row.querySelector('.js-cart-item-subtotal');
                if (itemSubtotalEl) itemSubtotalEl.textContent = formatCurrency(item.price * item.quantity);
                
                updateTotals();
            }
        }
    });

  
    document.body.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.cart-table__remove');
        if (removeBtn) {
            const row = removeBtn.closest('.cart-table__row');
            const id = parseInt(row.dataset.id);

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));

            row.remove();
            if (cart.length === 0) {
                renderCart();
            } else {
                updateTotals();
            }
        }
    });

    renderCart();
});
