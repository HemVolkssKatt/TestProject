// Expandable navbar search toggle + product suggestion dropdown
(function () {
  const navSearch   = document.getElementById("navSearch");
  const toggleBtn   = document.getElementById("searchToggleBtn");
  const searchBox   = document.getElementById("navSearchBox");
  const closeBtn    = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");

  if (!navSearch || !toggleBtn || !searchBox) return;

  // ── Create suggestion dropdown container ────────────────────────────────────
  const dropdown = document.createElement("div");
  dropdown.className = "search-suggestions";
  dropdown.setAttribute("role", "listbox");
  dropdown.setAttribute("aria-label", "Product suggestions");
  navSearch.appendChild(dropdown);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function openSearch() {
    navSearch.classList.add("is-open");
    setTimeout(() => searchInput && searchInput.focus(), 50);
  }

  function closeSearch() {
    navSearch.classList.remove("is-open");
    hideDropdown();
    if (searchInput) searchInput.value = "";
    // Reset shop grid if we are on the Shop page
    if (typeof renderProducts === "function") {
      if (typeof currentSearchQuery !== "undefined") currentSearchQuery = "";
      if (typeof window.currentSearchQuery !== "undefined") window.currentSearchQuery = "";
      if (typeof currentPage !== "undefined") currentPage = 1;
      if (typeof window.currentPage !== "undefined") window.currentPage = 1;
      renderProducts();
    }
  }

  function hideDropdown() {
    dropdown.classList.remove("is-visible");
    dropdown.innerHTML = "";
  }

  // ── Strict keyword match (same logic as Shop.js matchesSearch) ──────────────
  function productMatchesQuery(p, query) {
    if (!query || query.trim() === "") return false;
    const searchWords = query.toLowerCase().trim().split(/\s+/);

    return searchWords.every(word => {
      const inName     = p.name.toLowerCase().includes(word);
      const inSubtitle = p.subtitle && p.subtitle.toLowerCase().includes(word);
      const inKeywords = Array.isArray(p.keywords) && p.keywords.some(k => {
        const lk = k.toLowerCase();
        return lk === word || lk.startsWith(word) || lk.includes(" " + word);
      });
      return inName || inSubtitle || inKeywords;
    });
  }

  // ── Deduplicate products by name ────────────────────────────────────────────
  function getUniqueProducts() {
    if (typeof products === "undefined" || !Array.isArray(products)) return [];
    const seen = new Set();
    return products.filter(p => {
      const key = p.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ── Highlight matching text in gold ────────────────────────────────────────
  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, '<mark style="background:transparent;color:#B88E2F;font-weight:700;">$1</mark>');
  }

  // ── Build and render the suggestions dropdown ───────────────────────────────
  function showSuggestions(query) {
    dropdown.innerHTML = "";

    if (!query || query.trim().length === 0) {
      hideDropdown();
      return;
    }

    const matches = getUniqueProducts()
      .filter(p => productMatchesQuery(p, query))
      .slice(0, 6);

    if (matches.length === 0) {
      const noResult = document.createElement("div");
      noResult.className = "search-no-results";
      noResult.textContent = "No products found";
      dropdown.appendChild(noResult);
    } else {
      matches.forEach(p => {
        const item = document.createElement("a");
        item.className = "search-suggestion-item";
        item.href = `product.html?id=${p.id}`;
        item.setAttribute("role", "option");
        item.setAttribute("tabindex", "0");

        item.innerHTML = `
          <img class="suggestion-thumb" src="${p.image}" alt="${p.name}">
          <div class="suggestion-info">
            <span class="suggestion-name">${highlight(p.name, query)}</span>
            <span class="suggestion-sub">${highlight(p.subtitle || "", query)}</span>
          </div>
        `;

        // Navigate on click
        item.addEventListener("click", e => {
          e.preventDefault();
          hideDropdown();
          window.location.href = item.href;
        });

        // Arrow key support from item back to input
        item.addEventListener("keydown", e => {
          if (e.key === "ArrowDown") {
            const next = item.nextElementSibling;
            if (next) { e.preventDefault(); next.focus(); }
          } else if (e.key === "ArrowUp") {
            const prev = item.previousElementSibling;
            e.preventDefault();
            prev ? prev.focus() : searchInput && searchInput.focus();
          } else if (e.key === "Enter") {
            window.location.href = item.href;
          } else if (e.key === "Escape") {
            closeSearch();
          }
        });

        dropdown.appendChild(item);
      });
    }

    dropdown.classList.add("is-visible");
  }

  // ── Search input listener ───────────────────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value;

      // Keep shop grid in sync when on Shop page
      if (typeof renderProducts === "function") {
        if (typeof currentSearchQuery !== "undefined") currentSearchQuery = query;
        if (typeof window.currentSearchQuery !== "undefined") window.currentSearchQuery = query;
        if (typeof currentPage !== "undefined") currentPage = 1;
        if (typeof window.currentPage !== "undefined") window.currentPage = 1;
        renderProducts();
      }

      showSuggestions(query);
    });

    // Arrow down from input → move into first suggestion
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        const first = dropdown.querySelector(".search-suggestion-item");
        if (first) { e.preventDefault(); first.focus(); }
      } else if (e.key === "Escape") {
        closeSearch();
      }
    });
  }

  // ── Toggle open / close ─────────────────────────────────────────────────────
  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    navSearch.classList.contains("is-open") ? closeSearch() : openSearch();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeSearch();
    });
  }

  // ── Close when clicking outside ─────────────────────────────────────────────
  document.addEventListener("click", function (e) {
    if (!navSearch.contains(e.target)) {
      hideDropdown();
      if (navSearch.classList.contains("is-open")) closeSearch();
    }
  });

  // ── Escape key ──────────────────────────────────────────────────────────────
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navSearch.classList.contains("is-open")) {
      closeSearch();
    }
  });

  // ── Pre-fill from URL param (?search=chair) ─────────────────────────────────
  if (searchInput && searchInput.value) {
    openSearch();
    showSuggestions(searchInput.value);
  }
})();
