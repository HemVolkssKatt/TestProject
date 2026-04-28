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

let filteredTotal = typeof products !== 'undefined' ? products.length : 0;
let currentSearchQuery = "";
let currentPage = 1;

function getWishlist() {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

function isProductLiked(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => {
    if (typeof item === 'object' && item !== null) return item.id === productId;
    return item === productId;
  });
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(item => {
    if (typeof item === 'object' && item !== null) return item.id === productId;
    return item === productId;
  });

  if (index === -1) {
    if (typeof products !== 'undefined') {
      const product = products.find(p => p.id === productId);
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

function formatRupiah(num) {
  return (
    "Rp " +
    num
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

function matchesSearch(p, query) {
  if (!query || query.trim() === "") return true;
  const q = query.toLowerCase().trim();
  const searchWords = q.split(/\s+/);
  
  return searchWords.every(word => {
    const inName = p.name.toLowerCase().includes(word);
    const inSubtitle = p.subtitle && p.subtitle.toLowerCase().includes(word);
    const inKeywords = Array.isArray(p.keywords) && p.keywords.some(k => {
      const lowerK = k.toLowerCase();
      return lowerK === word || lowerK.startsWith(word) || lowerK.includes(" " + word);
    });
    return inName || inSubtitle || inKeywords;
  });
}

function getVisibleProducts() {
  if (typeof products === 'undefined') return [];
  
  const perPage = showSelect ? Number(showSelect.value) || products.length : products.length;
  let items = [...products];

  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");
  if (selectedCategory) {
    items = items.filter(p => p.category === selectedCategory);
  }

  if (currentSearchQuery && currentSearchQuery.trim() !== "") {
    items = items.filter(p => matchesSearch(p, currentSearchQuery));
  }

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
    }
  }

  return items.slice(0, perPage);
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get("search");
  if (urlQuery) {
    searchInput.value = urlQuery;
    currentSearchQuery = urlQuery;
    const navSearch = document.getElementById("navSearch");
    if (navSearch) navSearch.classList.add("is-open");
    renderProducts();
  }

  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    currentPage = 1;
    renderProducts();
  });

  const searchCloseBtn = document.getElementById("searchCloseBtn");
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", () => {
      currentSearchQuery = "";
      searchInput.value = "";
      currentPage = 1;
      renderProducts();
    });
  }
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
        <article class="product-card" data-id="${p.id}" data-name="${p.name}">
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
                <button class="action-link ${isProductLiked(p.id) ? 'is-liked' : ''}" type="button" data-action="like" data-id="${p.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="${isProductLiked(p.id) ? 'red' : 'none'}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-7-4.6-9.3-9.1C1 8.5 3.2 6 6.2 6c1.7 0 3.2.9 3.8 2 .6-1.1 2.1-2 3.8-2 3 0 5.2 2.5 3.5 5.9C19 16.4 12 21 12 21Z" stroke="${isProductLiked(p.id) ? 'red' : 'currentColor'}" stroke-width="2" stroke-linejoin="round"/>
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
              ${p.oldPrice ? `<span class="price-old">${formatRupiah(p.oldPrice)}</span>` : ""}
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

if (showSelect) showSelect.addEventListener("change", () => renderProducts());
if (sortSelect) sortSelect.addEventListener("change", () => renderProducts());
if (discountToggle) discountToggle.addEventListener("change", () => renderProducts());
if (newToggle) newToggle.addEventListener("change", () => renderProducts());

function updateRange() {
  if (!minRange || !maxRange || !rangeFill) return;

  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);

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

updateRange();

if (filterBtn && filterPanel) {
  filterBtn.addEventListener("click", () => {
    const isHidden = filterPanel.hasAttribute("hidden");
    if (isHidden) filterPanel.removeAttribute("hidden");
    else filterPanel.setAttribute("hidden", "");
  });
}

if (menuBtn && primaryNav) {
  menuBtn.addEventListener("click", () => {
    primaryNav.classList.toggle("is-open");
  });
}

document.addEventListener("click", (e) => {
  const likeBtn = e.target.closest('[data-action="like"]');
  if (likeBtn) {
    const id = parseInt(likeBtn.dataset.id);
    toggleWishlist(id);
    renderProducts();
  }
});

function initializeViewToggle() {
  const viewButtons = document.querySelectorAll("[data-view]");
  if (!productGrid || viewButtons.length === 0) return;

  const savedView = localStorage.getItem("productView") || "grid";
  const currentView = savedView === "list" ? "list-view" : "grid-view";
  
  productGrid.classList.remove("grid-view", "list-view");
  productGrid.classList.add(currentView);

  viewButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === (savedView || "grid"));
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
      renderProducts();
    });
  });

  // Initial render on page load
  renderProducts();
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
