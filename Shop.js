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
const paginationNav = document.getElementById("pagination");
const resetFiltersBtn = document.getElementById("resetFilters");

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
    if (typeof item === 'object' && item !== null) return item.id == productId;
    return item == productId;
  });
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

  let items = [...products];

  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");

  if (selectedCategory && selectedCategory !== "all") {
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

  if (sortSelect) {
    const sort = sortSelect.value;
    if (sort === "newest") {
      items.sort((a, b) => b.id - a.id);
    }
  }

  filteredTotal = items.length;

  const perPage = showSelect ? Number(showSelect.value) || 16 : 16;
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return items.slice(start, end);
}

function renderPagination() {
  if (!paginationNav) return;
  const perPage = showSelect ? Number(showSelect.value) || 16 : 16;
  const totalPages = Math.ceil(filteredTotal / perPage);

  if (totalPages <= 1) {
    paginationNav.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
  }
  paginationNav.innerHTML = html;

  paginationNav.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      renderProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderProducts() {
  if (!productGrid) return;

  const items = getVisibleProducts();

  if (items.length === 0) {
    productGrid.innerHTML = `
      <div class="no-results">
        <i class="fa-solid fa-box-open"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search query to find what you're looking for.</p>
      </div>
    `;
    updateResultsText();
    renderPagination();
    return;
  }

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
                  <i class="fa-solid fa-share-nodes"></i> Share
                </button>
                <a class="action-link" href="comparsion.html">
                  <i class="fa-solid fa-right-left"></i> Compare
                </a>
                <button class="action-link ${isProductLiked(p.id) ? 'is-liked' : ''}" type="button" data-action="like" data-id="${p.id}">
                  <i class="fa-${isProductLiked(p.id) ? 'solid' : 'regular'} fa-heart" style="${isProductLiked(p.id) ? 'color: red;' : ''}"></i> Like
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
  renderPagination();
}

function updateResultsText() {
  if (!resultsText) return;
  const perPage = showSelect ? Number(showSelect.value) || filteredTotal : filteredTotal;
  const start = filteredTotal === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, filteredTotal);

  if (filteredTotal === 0) {
    resultsText.textContent = "Showing 0 results";
  } else {
    resultsText.textContent = `Showing ${start}–${end} of ${filteredTotal} results`;
  }
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
  }

  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    currentPage = 1;
    renderProducts();
  });
}

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
    });
  });
}

if (showSelect) showSelect.addEventListener("change", () => { currentPage = 1; renderProducts(); });
if (sortSelect) sortSelect.addEventListener("change", () => renderProducts());
if (discountToggle) discountToggle.addEventListener("change", () => { currentPage = 1; renderProducts(); });
if (newToggle) newToggle.addEventListener("change", () => { currentPage = 1; renderProducts(); });

if (filterBtn && filterPanel) {
  filterBtn.addEventListener("click", () => {
    const isHidden = filterPanel.hidden;
    filterPanel.hidden = !isHidden;
    filterBtn.classList.toggle("is-active", !isHidden);
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    if (discountToggle) discountToggle.checked = false;
    if (newToggle) newToggle.checked = false;
    if (minRange) minRange.value = 0;
    if (maxRange) maxRange.value = 10000000;
    
    // Reset search
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
      currentSearchQuery = "";
    }
    
    // Clear URL category
    const url = new URL(window.location);
    url.searchParams.delete("category");
    window.history.replaceState({}, '', url);

    updateRange();
  });
}

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
  currentPage = 1;
  renderProducts();
}

// Initial set of category dropdown if present in URL
function syncUrlToFilters() {
  // Category dropdown removed, but we still handle URL category filtering
}

if (minRange) minRange.addEventListener("input", updateRange);
if (maxRange) maxRange.addEventListener("input", updateRange);



function initializeShop() {
  initializeSearch();
  initializeViewToggle();
  syncUrlToFilters();
  updateRange();
  renderProducts();
}

document.addEventListener("DOMContentLoaded", initializeShop);
