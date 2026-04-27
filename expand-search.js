// Expandable navbar search toggle
(function () {
  const navSearch      = document.getElementById("navSearch");
  const toggleBtn      = document.getElementById("searchToggleBtn");
  const searchBox      = document.getElementById("navSearchBox");
  const closeBtn       = document.getElementById("searchCloseBtn");
  const searchInput    = document.getElementById("searchInput");

  if (!navSearch || !toggleBtn || !searchBox) return;

  function openSearch() {
    navSearch.classList.add("is-open");
    // Focus the input after the CSS transition starts
    setTimeout(() => searchInput && searchInput.focus(), 50);
  }

  function closeSearch() {
    navSearch.classList.remove("is-open");
    if (searchInput) searchInput.value = "";
    // Trigger product re-render only if Shop.js is on the page
    if (typeof renderProducts === "function") {
      currentSearchQuery = "";
      currentPage = 1;
      renderProducts();
    }
  }

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (navSearch.classList.contains("is-open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeSearch();
    });
  }

  // Close when clicking outside
  document.addEventListener("click", function (e) {
    if (!navSearch.contains(e.target)) {
      if (navSearch.classList.contains("is-open")) {
        closeSearch();
      }
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navSearch.classList.contains("is-open")) {
      closeSearch();
    }
  });

  // If search was pre-filled from URL param, open the box
  if (searchInput && searchInput.value) {
    openSearch();
  }
})();
