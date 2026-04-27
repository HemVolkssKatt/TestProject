// Products are now loaded from sources/products.js

const TOTAL_RESULTS = products.length;

const productGrid = document.getElementById("productGrid");
const showSelect = document.getElementById("showSelect");
const sortSelect = document.getElementById("sortSelect");
const resultsText = document.getElementById("resultsText");
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const viewButtons = document.querySelectorAll("[data-view]");
const menuBtn = document.getElementById("menuBtn");
const primaryNav = document.getElementById("primaryNav");
const discountToggle = document.getElementById("discountToggle");
const newToggle = document.getElementById("newToggle");
const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const rangeFill = document.getElementById("rangeFill");
const rangeMinText = document.getElementById("rangeMinText");
const rangeMaxText = document.getElementById("rangeMaxText");

let filteredTotal = products.length;

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

function getVisibleProducts() {
  const perPage = showSelect ? Number(showSelect.value) || products.length : products.length;
  let items = [...products];

  if (discountToggle && discountToggle.checked) {
    items = items.filter(p => p.badgeType === "sale");
  }

  if (newToggle && newToggle.checked) {
    items = items.filter(p => p.badgeType === "new");
  }

  if (minRange && maxRange) {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);
    
    const filterMin = Math.min(minVal, maxVal);
    const filterMax = Math.max(minVal, maxVal);
    
    items = items.filter(p => p.price >= filterMin && p.price <= filterMax);
  }

  filteredTotal = items.length;

  if (sortSelect) {
    const sort = sortSelect.value;
    switch (sort) {
      case "newest":
        items.sort((a, b) => b.id - a.id);
        break;
      case "default":
      default:
        break;
    }}
   return items.slice(0, perPage);
}
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const navSearch = document.getElementById("navSearch");
  const navSearchBox = document.getElementById("navSearchBox");

  if (!searchInput) return;
 
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;

    if (typeof window.currentSearchQuery !== "undefined") {
      window.currentSearchQuery = query;
    }
    if (typeof window.currentPage !== "undefined") {
      window.currentPage = 1;
    }

    if (typeof window.renderProducts === "function") {
      window.renderProducts();
    }
  });

  if (searchToggleBtn && navSearch) {
    searchToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navSearch.classList.add("is-open");
      searchInput.focus();
    });
  }

  if (searchCloseBtn && navSearch) {
    searchCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navSearch.classList.remove("is-open");
    });
  }

  return items.slice(0, perPage);
}

function renderProducts() {
  if (!productGrid) return;

  const items = getVisibleProducts();

  productGrid.innerHTML = items
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
            <a href="product.html">
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
                <button class="action-link ${getWishlist().includes(p.id) ? 'is-liked' : ''}" type="button" data-action="like" data-id="${p.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="${getWishlist().includes(p.id) ? 'red' : 'none'}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-7-4.6-9.3-9.1C1 8.5 3.2 6 6.2 6c1.7 0 3.2.9 3.8 2 .6-1.1 2.1-2 3.8-2 3 0 5.2 2.5 3.5 5.9C19 16.4 12 21 12 21Z" stroke="${getWishlist().includes(p.id) ? 'red' : 'currentColor'}" stroke-width="2" stroke-linejoin="round"/>
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
              ${p.oldPrice
          ? `<span class="price-old">${formatRupiah(p.oldPrice)}</span>`
          : ""
        }
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  updateResultsText();
}

function updateResultsText() {
  if (!resultsText) return;
  const perPage = showSelect ? Number(showSelect.value) || filteredTotal : filteredTotal;
  const end = Math.min(perPage, filteredTotal);

  if (filteredTotal === 0) {
    resultsText.textContent = "Showing 0 results";
  } else {
    resultsText.textContent = `Showing 1–${end} of ${filteredTotal} results`;
  }
}

if (showSelect) {
  showSelect.addEventListener("change", () => {
    renderProducts();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    renderProducts();
  });
}

if (discountToggle) {
  discountToggle.addEventListener("change", () => {
    renderProducts();
  });
}

if (newToggle) {
  newToggle.addEventListener("change", () => {
    renderProducts();
  });
}

function updateRange() {
  if (!minRange || !maxRange || !rangeFill) return;
  
  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);
  
  // Visual swap for the fill bar if handles cross
  const visualMin = Math.min(minVal, maxVal);
  const visualMax = Math.max(minVal, maxVal);
  
  const minPercent = (visualMin / minRange.max) * 100;
  const maxPercent = (visualMax / maxRange.max) * 100;
  
  rangeFill.style.left = minPercent + "%";
  rangeFill.style.width = (maxPercent - minPercent) + "%";
  
  if (rangeMinText) rangeMinText.textContent = formatRupiah(visualMin);
  if (rangeMaxText) rangeMaxText.textContent = formatRupiah(visualMax);
  
  renderProducts();
}

if (minRange) minRange.addEventListener("input", updateRange);
if (maxRange) maxRange.addEventListener("input", updateRange);

// Initialize slider on load
updateRange();

if (filterBtn && filterPanel) {
  filterBtn.addEventListener("click", () => {
    const isHidden = filterPanel.hasAttribute("hidden");
    if (isHidden) filterPanel.removeAttribute("hidden");
    else filterPanel.setAttribute("hidden", "");
  });
}

viewButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    viewButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const view = btn.dataset.view;
    if (productGrid && view) {
      productGrid.dataset.view = view;
    }
  });
});

if (menuBtn && primaryNav) {
  menuBtn.addEventListener("click", () => {
    primaryNav.classList.toggle("is-open");
  });
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
    renderProducts();
  }
});

renderProducts();


function initializeViewToggle() {
  const viewButtons = document.querySelectorAll("[data-view]");
  const productGrid = document.getElementById("productGrid");

  if (!productGrid || viewButtons.length === 0) return;

  const savedView = localStorage.getItem("productView") || "grid";

  productGrid.classList.remove("grid-view", "list-view");
  productGrid.classList.add(savedView === "list" ? "list-view" : "grid-view");

  viewButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === savedView);
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      if (!view) return;

      viewButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      productGrid.classList.remove("grid-view", "list-view");
      productGrid.classList.add(view === "list" ? "list-view" : "grid-view");

      localStorage.setItem("productView", view);

      if (typeof renderProducts === "function") {
        renderProducts();
      }
    });
  });
}

function initializeShop() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeSearch();
      initializeViewToggle();
    });
  } else {
    initializeSearch();
    initializeViewToggle();
  }
}

initializeShop();
