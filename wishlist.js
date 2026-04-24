const productGrid = document.getElementById("productGrid");

function getWishlist() {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  if (index === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(index, 1);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function formatRupiah(num) {
  return (
    "Rp " +
    num
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

function renderWishlist() {
  if (!productGrid) return;
  const wishlistIds = getWishlist();
  const likedProducts = products.filter(p => wishlistIds.includes(p.id));

  if (likedProducts.length === 0) {
    productGrid.parentElement.innerHTML = `
      <div class="wishlist-empty">
        <h2>Your wishlist is empty</h2>
        <p>Go to the shop to find something you love!</p>
        <a href="Shop.html" class="btn-shop">Back to Shop</a>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = likedProducts
    .map((p) => {
      let badgeHtml = "";
      if (p.badgeType === "sale") {
        badgeHtml = `<span class="badge badge--sale">${p.badgeText}</span>`;
      } else if (p.badgeType === "new") {
        badgeHtml = `<span class="badge badge--new">${p.badgeText}</span>`;
      }

      return `
        <article class="product-card" data-name="${p.name}">
          <div class="product-card__media">
            ${badgeHtml}
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}">
            </a>
            <div class="product-card__overlay">
              <button class="btn-cart" type="button">Add to cart</button>
              <div class="overlay-actions">
                <button class="action-link" type="button" data-action="share">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8a3 3 0 1 0-2.8-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M9 13l6-3M9 11l6 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="18" cy="5" r="2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="6" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="18" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Share
                </button>
                <a class="action-link" href="comparsion.html">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3H5v18h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M19 21h-5V3h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M10 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Compare
                </a>
                <button class="action-link is-liked" type="button" data-action="like" data-id="${p.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="red" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-7-4.6-9.3-9.1C1 8.5 3.2 6 6.2 6c1.7 0 3.2.9 3.8 2 .6-1.1 2.1-2 3.8-2 3 0 5.2 2.5 3.5 5.9C19 16.4 12 21 12 21Z" stroke="red" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                  Like
                </button>
              </div>
            </div>
          </div>

          <div class="product-card__body">
            <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <p class="product-sub">${p.subtitle}</p>
            <div class="price-row">
              <span class="price">${formatRupiah(p.price)}</span>
              ${
                p.oldPrice
                  ? `<span class="price-old">${formatRupiah(p.oldPrice)}</span>`
                  : ""
              }
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("click", (e) => {
  const cartBtn = e.target.closest(".btn-cart");
  if (cartBtn) {
    const card = cartBtn.closest(".product-card");
    const name = card && card.dataset && card.dataset.name ? card.dataset.name : "Product";
    alert(`${name} added to cart`);
  }

  const likeBtn = e.target.closest('[data-action="like"]');
  if (likeBtn) {
    const id = parseInt(likeBtn.dataset.id);
    toggleWishlist(id);
    renderWishlist(); // Re-render to remove the item from the list
  }
});

renderWishlist();
