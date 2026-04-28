const baseProducts = [
  {
    name: "Syltherine",
    subtitle: "Stylish cafe chair",
    price: 2500000,
    oldPrice: 3500000,
    badgeType: "sale",
    badgeText: "-30%",
    image: "../assets/Syltherine.png",
    keywords: ["chair", "cafe", "stylish", "wood", "dining"]
  },
  {
    name: "Leviosa",
    subtitle: "Stylish cafe chair",
    price: 2500000,
    oldPrice: null,
    badgeType: null,
    badgeText: "",
    image: "../assets/Leviosa.png",
    keywords: ["chair", "cafe", "modern", "stylish"]
  },
  {
    name: "Lolito",
    subtitle: "Luxury big sofa",
    price: 7000000,
    oldPrice: 14000000,
    badgeType: "sale",
    badgeText: "-50%",
    image: "../assets/Lolito.png",
    keywords: ["sofa", "luxury", "big", "living room", "couch"]
  },
  {
    name: "Respira",
    subtitle: "Outdoor bar table and stool",
    price: 500000,
    oldPrice: null,
    badgeType: "new",
    badgeText: "New",
    image: "../assets/Respira.jpg",
    keywords: ["table", "stool", "outdoor", "bar", "patio"]
  }
];

const products = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  ...baseProducts[i % 4]
}));

const TOTAL_RESULTS = products.length;

const productGrid = document.getElementById("productGrid");
const showSelect = document.getElementById("showSelect");
const sortSelect = document.getElementById("sortSelect");
const resultsText = document.getElementById("resultsText");
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const menuBtn = document.getElementById("menuBtn");
const primaryNav = document.getElementById("primaryNav");
const paginationNav = document.getElementById("pagination");

window.currentPage = window.currentPage || 1;
window.currentSearchQuery = window.currentSearchQuery || (new URLSearchParams(window.location.search).get("search") || "");

let currentPage = window.currentPage;
let currentSearchQuery = window.currentSearchQuery;

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

  if (window.currentSearchQuery && window.currentSearchQuery.trim() !== "") {
    const q = window.currentSearchQuery.toLowerCase().trim();
    const searchWords = q.split(/\s+/);

    items = items.filter(p => {
      // Must match EVERY word typed
      return searchWords.every(word => {
        const inName = p.name.toLowerCase().includes(word);
        const inSubtitle = p.subtitle && p.subtitle.toLowerCase().includes(word);
        const inKeywords = p.keywords && p.keywords.some(kw => {
          const k = kw.toLowerCase();
          // Check for exact word or word prefix in keywords to avoid loose partial matches
          return k === word || k.startsWith(word) || k.includes(" " + word);
        });
        return inName || inSubtitle || inKeywords;
      });
    });
  }

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

  const totalPages = Math.ceil(items.length / perPage);
  const startIndex = (window.currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    items: items.slice(startIndex, endIndex),
    totalPages: totalPages,
    totalItems: items.length,
    startIndex: startIndex,
    perPage: perPage
  };
}

function renderProducts() {
  if (!productGrid) return;

  const result = getVisibleProducts();
  const items = result.items;

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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 10.6667C11.4747 10.6667 11 10.8733 10.644 11.2047L5.94 8.46667C5.97333 8.31334 6 8.16 6 8C6 7.84 5.97333 7.68667 5.94 7.53334L10.64 4.79334C11 5.12667 11.4733 5.33334 12 5.33334C13.1067 5.33334 14 4.44 14 3.33334C14 2.22667 13.1067 1.33334 12 1.33334C10.8933 1.33334 10 2.22667 10 3.33334C10 3.49334 10.0267 3.64667 10.06 3.8L5.36 6.54C5 6.20667 4.52667 6 4 6C2.89333 6 2 6.89334 2 8C2 9.10667 2.89333 10 4 10C4.52667 10 5 9.79333 5.36 9.46L10.0587 12.2053C10.0211 12.3563 10.0014 12.5111 10 12.6667C10 13.0622 10.1173 13.4489 10.3371 13.7778C10.5568 14.1067 10.8692 14.3631 11.2346 14.5144C11.6001 14.6658 12.0022 14.7054 12.3902 14.6282C12.7781 14.5511 13.1345 14.3606 13.4142 14.0809C13.6939 13.8012 13.8844 13.4448 13.9616 13.0568C14.0387 12.6689 13.9991 12.2668 13.8478 11.9013C13.6964 11.5358 13.44 11.2235 13.1111 11.0037C12.7822 10.784 12.3956 10.6667 12 10.6667Z" fill="white"/>
                  </svg>
                  Share
                </button>
                <a class="action-link" href="comparsion.html">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.66 6L9.66 7L13.1 3.55L9.58 0L8.58 1L10.38 2.8H0.58V4.2H10.4L8.66 6ZM4.44 8L3.44 7L0 10.5L3.49 14L4.49 13L2.68 11.2H12.58V9.8H2.68L4.44 8Z" fill="white"/>
                  </svg>
                  Compare
                </a>
                <button class="action-link" type="button" data-action="like">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.99973 14.0361C-5.33333 6.66667 3.99999 -1.33333 7.99973 3.72537C12 -1.33334 21.3333 6.66667 7.99973 14.0361Z" stroke="white" stroke-width="1.8"/>
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
  renderPagination();
}

function renderPagination() {
  if (!paginationNav) return;

  const result = getVisibleProducts();
  const totalPages = result.totalPages;

  let html = '';

  if (currentPage > 1) {
    html += `<button class="page-btn page-btn--prev" onclick="goToPage(${currentPage - 1})" type="button">Prev</button>`;
  }

  const maxPagesToShow = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage ? 'is-active' : '';
    html += `<button class="page-btn ${isActive}" onclick="goToPage(${i})" type="button">${i}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn page-btn--next" onclick="goToPage(${currentPage + 1})" type="button">Next</button>`;
  }

  paginationNav.innerHTML = html;
}

function goToPage(pageNum) {
  currentPage = pageNum;
  renderProducts();

  document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
}

function updateResultsText() {
  if (!resultsText) return;
  const result = getVisibleProducts();
  const perPage = result.perPage;
  const totalItems = result.totalItems;
  const startNum = result.startIndex + 1;
  const endNum = Math.min(result.startIndex + perPage, totalItems);

  if (totalItems === 0) {
    resultsText.textContent = "Showing 0 results";
  } else {
    resultsText.textContent = `Showing ${startNum}–${endNum} of ${totalItems} results`;
  }
}

if (showSelect) {
  showSelect.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentPage = 1;
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

    const product = products.find(p => p.name === name);

    if (product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({
          ...product,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      window.location.href = "cart.html";
    }
  }
});

document.addEventListener("click", (e) => {
  const likeBtn = e.target.closest('[data-action="like"]');
  if (likeBtn) {
    const card = likeBtn.closest(".product-card");
    const name = card && card.dataset && card.dataset.name ? card.dataset.name : "Product";

    const product = products.find(p => p.name === name);

    if (product) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      const existingItem = wishlist.find(item => item.id === product.id);
      if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== product.id);
        likeBtn.classList.remove("is-liked");
      } else {
        wishlist.push(product);
        likeBtn.classList.add("is-liked");
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }
});

document.addEventListener("click", (e) => {
  const shareBtn = e.target.closest('[data-action="share"]');
  if (shareBtn) {
    e.preventDefault();
    const card = shareBtn.closest(".product-card");
    const name = card && card.dataset && card.dataset.name ? card.dataset.name : "Product";

    // Create a link to share
    const productUrl = window.location.origin + window.location.pathname.replace('Shop.html', 'product.html') + '?name=' + encodeURIComponent(name);

    if (navigator.share) {
      navigator.share({
        title: name,
        text: 'Check out this ' + name + ' from Furino!',
        url: productUrl
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(productUrl).then(() => {
        alert('Product link copied to clipboard!\n' + productUrl);
      }).catch(() => {
        alert('Could not copy link.');
      });
    }
  }
});

function updateLikeButtons() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const likeButtons = document.querySelectorAll('[data-action="like"]');

  likeButtons.forEach(btn => {
    const card = btn.closest(".product-card");
    const name = card && card.dataset && card.dataset.name ? card.dataset.name : "";
    const isLiked = wishlist.some(item => item.name === name);

    if (isLiked) {
      btn.classList.add("is-liked");
    } else {
      btn.classList.remove("is-liked");
    }
  });
}

renderProducts();
updateLikeButtons();

// ── View Toggle (Grid/List) ───────────────────────────────────────────────────
(function initViewToggle() {
  const viewBtns = document.querySelectorAll("[data-view]");
  if (!viewBtns.length || !productGrid) return;

  const savedView = localStorage.getItem("shopView") || "grid";

  productGrid.classList.remove("grid-view", "list-view");
  productGrid.classList.add(savedView === "list" ? "list-view" : "grid-view");

  viewBtns.forEach(btn => {
    if (btn.dataset.view === savedView) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }

    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      localStorage.setItem("shopView", view);

      viewBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      productGrid.classList.remove("grid-view", "list-view");
      productGrid.classList.add(view === "list" ? "list-view" : "grid-view");
    });
  });
})();