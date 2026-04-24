
 
const TOTAL_RESULTS = products.length;
 
const productGrid = document.getElementById("productGrid");
const showSelect  = document.getElementById("showSelect");
const sortSelect  = document.getElementById("sortSelect");
const resultsText = document.getElementById("resultsText");
const filterBtn   = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const viewButtons = document.querySelectorAll("[data-view]");
const menuBtn     = document.getElementById("menuBtn");
const primaryNav  = document.getElementById("primaryNav");
 
function formatRupiah(num) {
  return (
    "Rp " +
    num
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}
 
function getVisibleProducts() {
  const perPage = showSelect ? Number(showSelect.value) || TOTAL_RESULTS : TOTAL_RESULTS;
  let items = [...products];
 
  if (sortSelect) {
    const sort = sortSelect.value;
    switch (sort) {
      case "priceLow":
        items.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        items.sort((a, b) => b.price - a.price);
        break;
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
                <button class="action-link" type="button" data-action="like">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-7-4.6-9.3-9.1C1 8.5 3.2 6 6.2 6c1.7 0 3.2.9 3.8 2 .6-1.1 2.1-2 3.8-2 3 0 5.2 2.5 3.5 5.9C19 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                  Like
                </button>
              </div>
            </div>
          </div>
 
          <div class="product-card__body">
            <h3 class="product-title"><a href="product.html">${p.name}</a></h3>
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
 
  updateResultsText();
}
 
function updateResultsText() {
  if (!resultsText) return;
  const perPage = showSelect ? Number(showSelect.value) || TOTAL_RESULTS : TOTAL_RESULTS;
  const end = Math.min(perPage, TOTAL_RESULTS);
 
  if (TOTAL_RESULTS === 0) {
    resultsText.textContent = "Showing 0 results";
  } else {
    resultsText.textContent = `Showing 1–${end} of ${TOTAL_RESULTS} results`;
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

renderProducts();
 