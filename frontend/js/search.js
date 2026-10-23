/**
 * Meenachi Grocery - Search-as-you-type Autocomplete & Filter Module
 * Offers live debounce search across English and Tamil product names, categories, and brands.
 */

class SearchManager {
  constructor() {
    this.searchInput = null;
    this.resultsContainer = null;
    this.debounceTimer = null;
    this.activeSelectedIndex = -1;
  }

  init(inputSelector = "#headerSearchInput", containerSelector = "#searchResultsDropdown") {
    this.searchInput = document.querySelector(inputSelector);
    this.resultsContainer = document.querySelector(containerSelector);

    if (!this.searchInput || !this.resultsContainer) return;

    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimer);
      const query = e.target.value.trim();

      if (query.length < 2) {
        this.hideResults();
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.performSearch(query);
      }, 250);
    });

    this.searchInput.addEventListener("keydown", (e) => {
      this.handleKeyNavigation(e);
    });

    // Close dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!this.searchInput.contains(e.target) && !this.resultsContainer.contains(e.target)) {
        this.hideResults();
      }
    });

    // Focus restore
    this.searchInput.addEventListener("focus", () => {
      if (this.searchInput.value.trim().length >= 2) {
        this.performSearch(this.searchInput.value.trim());
      }
    });
  }

  performSearch(query) {
    const q = query.toLowerCase();
    const products = window.groceryCatalog?.products || [];
    const isTa = window.i18n?.getLang() === "ta";

    const matches = products.filter((p) => {
      const matchEn = p.nameEn.toLowerCase().includes(q);
      const matchTa = p.nameTa.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
      return matchEn || matchTa || matchBrand || matchCat || matchDesc;
    }).slice(0, 6); // Top 6 matches

    this.renderResults(matches, query, isTa);
  }

  renderResults(matches, query, isTa) {
    if (matches.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <div class="search-empty-icon">🔍</div>
          <p class="search-empty-title">${isTa ? "பொருட்கள் எதுவும் கிடைக்கவில்லை" : "No groceries found matching"} "<strong>${this.escapeHtml(query)}</strong>"</p>
          <p class="search-empty-hint">${isTa ? "பிரபலமான தேடல்கள்:" : "Popular searches:"}</p>
          <div class="search-suggestions-chips">
            <button type="button" class="search-chip" onclick="searchManager.setQuery('Ponni Rice')">🌾 Ponni Rice</button>
            <button type="button" class="search-chip" onclick="searchManager.setQuery('Sesame Oil')">🫒 Sesame Oil</button>
            <button type="button" class="search-chip" onclick="searchManager.setQuery('Toor Dal')">🥣 Toor Dal</button>
            <button type="button" class="search-chip" onclick="searchManager.setQuery('Ghee')">🥛 Pure Ghee</button>
          </div>
        </div>
      `;
      this.showResults();
      return;
    }

    const itemsHtml = matches.map((item, index) => {
      const title = isTa ? item.nameTa : item.nameEn;
      const priceFmt = window.groceryCatalog.formatINR(item.price);
      const mrpFmt = window.groceryCatalog.formatINR(item.mrp);

      return `
        <div class="search-result-item" data-index="${index}" onclick="searchManager.selectProduct('${item.id}')">
          <img src="${item.image}" alt="${title}" class="search-item-img" onerror="this.src='${window.groceryCatalog.FALLBACK_IMAGE}'">
          <div class="search-item-info">
            <span class="search-item-cat">${item.brand} • ${item.unit}</span>
            <span class="search-item-title">${this.highlightMatch(title, query)}</span>
            <div class="search-item-price-row">
              <span class="search-item-price">${priceFmt}</span>
              <span class="search-item-mrp">${mrpFmt}</span>
              <span class="search-item-discount">${item.discount}</span>
            </div>
          </div>
          <button type="button" class="search-item-add-btn" onclick="event.stopPropagation(); window.cart.addItem(window.groceryCatalog.getProductById('${item.id}'))">
            + ${isTa ? "சேர்" : "Add"}
          </button>
        </div>
      `;
    }).join("");

    this.resultsContainer.innerHTML = `
      <div class="search-results-header">
        <span>${isTa ? "தேடல் முடிவுகள்" : "Matching Groceries"} (${matches.length})</span>
      </div>
      <div class="search-results-list">
        ${itemsHtml}
      </div>
    `;

    this.activeSelectedIndex = -1;
    this.showResults();
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<mark class='search-highlight'>$1</mark>");
  }

  escapeHtml(string) {
    const div = document.createElement("div");
    div.textContent = string;
    return div.innerHTML;
  }

  setQuery(text) {
    if (this.searchInput) {
      this.searchInput.value = text;
      this.searchInput.focus();
      this.performSearch(text);
    }
  }

  selectProduct(productId) {
    this.hideResults();
    // Scroll to product if present on page or open quick view
    if (window.showProductModal) {
      window.showProductModal(productId);
    } else {
      const card = document.querySelector(`[data-product-id="${productId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("card-highlight");
        setTimeout(() => card.classList.remove("card-highlight"), 2000);
      }
    }
  }

  handleKeyNavigation(e) {
    const items = this.resultsContainer.querySelectorAll(".search-result-item");
    if (!items.length || this.resultsContainer.classList.contains("hidden")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.activeSelectedIndex = Math.min(this.activeSelectedIndex + 1, items.length - 1);
      this.updateActiveItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.activeSelectedIndex = Math.max(this.activeSelectedIndex - 1, 0);
      this.updateActiveItem(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.activeSelectedIndex > -1 && items[this.activeSelectedIndex]) {
        items[this.activeSelectedIndex].click();
      }
    } else if (e.key === "Escape") {
      this.hideResults();
    }
  }

  updateActiveItem(items) {
    items.forEach((item, idx) => {
      item.classList.toggle("selected", idx === this.activeSelectedIndex);
      if (idx === this.activeSelectedIndex) {
        item.scrollIntoView({ block: "nearest" });
      }
    });
  }

  showResults() {
    this.resultsContainer.classList.remove("hidden");
    this.resultsContainer.classList.add("visible");
  }

  hideResults() {
    this.resultsContainer.classList.remove("visible");
    this.resultsContainer.classList.add("hidden");
    this.activeSelectedIndex = -1;
  }
}

const searchManager = new SearchManager();
window.searchManager = searchManager;
