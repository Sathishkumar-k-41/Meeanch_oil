/**
 * Meenachi Grocery - Main Application Controller
 * Coordinates category display, product rendering, responsive interactions,
 * PIN code verification, cart drawer, modals, and bilingual updates.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Subsystems
  window.i18n.applyTranslations();
  window.searchManager.init("#headerSearchInput", "#searchResultsDropdown");

  // Render Homepage Components
  renderCategoryGrid();
  renderAllProductSections();
  updateCartBadges();
  setupEventListeners();
  loadSavedPincode();
});

/**
 * Render Categories Grid
 */
function renderCategoryGrid() {
  const container = document.getElementById("categoriesGrid");
  if (!container || !window.groceryCatalog) return;

  const isTa = window.i18n.getLang() === "ta";
  const categories = window.groceryCatalog.categories;

  container.innerHTML = categories.map((cat) => {
    const title = isTa ? cat.nameTa : cat.nameEn;
    return `
      <a href="pages/shop.html?category=${cat.id}" class="category-card" data-category-id="${cat.id}">
        <div class="category-thumb-wrapper">
          <img src="${cat.image}" alt="${title}" class="category-thumb-img" onerror="this.src='${window.groceryCatalog.FALLBACK_IMAGE}'">
        </div>
        <span class="category-title">${title}</span>
        <span class="category-count">${cat.itemCount} items</span>
      </a>
    `;
  }).join("");
}

/**
 * Render All Product Grids (Best Sellers, Today's Offers, Recently Added)
 */
function renderAllProductSections() {
  renderProductGrid("bestSellersGrid", window.groceryCatalog.getBestSellers().slice(0, 8));
  renderProductGrid("todaysOffersGrid", window.groceryCatalog.getOffers().slice(0, 8));
  renderProductGrid("recentlyAddedGrid", window.groceryCatalog.getRecentlyAdded().slice(0, 4));
}

/**
 * Render a single grid of products with reactive Add-to-Cart and variant controls
 */
function renderProductGrid(elementId, products) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const isTa = window.i18n.getLang() === "ta";

  container.innerHTML = products.map((product) => {
    const title = isTa ? product.nameTa : product.nameEn;
    const currentVariantIndex = product.selectedVariantIndex || product.defaultVariantIndex || 0;
    const currentVariant = product.variants ? product.variants[currentVariantIndex] : null;
    const unitText = currentVariant ? currentVariant.unit : product.unit;
    const price = currentVariant ? currentVariant.price : product.price;
    const mrp = currentVariant ? currentVariant.mrp : product.mrp;
    const priceFormatted = window.groceryCatalog.formatINR(price);
    const mrpFormatted = window.groceryCatalog.formatINR(mrp);

    // Check if this item variant is in cart
    const qtyInCart = window.cart.getItemQuantity(product.id, unitText);
    const isWishlisted = isItemWishlisted(product.id);

    // Variant options dropdown if multiple variants exist
    let variantHtml = "";
    if (product.variants && product.variants.length > 1) {
      const options = product.variants.map((v, idx) => `
        <option value="${idx}" ${idx === currentVariantIndex ? "selected" : ""}>
          ${v.unit} - ${window.groceryCatalog.formatINR(v.price)}
        </option>
      `).join("");
      variantHtml = `
        <div class="variant-selector-wrap">
          <select class="variant-select" onchange="handleVariantChange('${product.id}', this.value, '${elementId}')">
            ${options}
          </select>
        </div>
      `;
    } else {
      variantHtml = `
        <div class="variant-selector-wrap">
          <span class="variant-badge-single">${unitText}</span>
        </div>
      `;
    }

    // Action button or Quantity Stepper
    let actionBtnHtml = "";
    if (qtyInCart > 0) {
      const itemKey = `${product.id}_${unitText}`;
      actionBtnHtml = `
        <div class="product-qty-stepper">
          <button type="button" class="stepper-btn" onclick="window.cart.decrement('${itemKey}')">−</button>
          <span class="stepper-val">${qtyInCart}</span>
          <button type="button" class="stepper-btn" onclick="window.cart.increment('${itemKey}')">+</button>
        </div>
      `;
    } else {
      actionBtnHtml = `
        <button type="button" class="add-to-cart-btn" onclick="handleAddProduct('${product.id}', ${currentVariantIndex})">
          + ${window.i18n.t("addToCart")}
        </button>
      `;
    }

    return `
      <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
        ${product.badge ? `<span class="product-badge ${product.isOffer ? 'offer-badge' : ''}">${product.badge}</span>` : ""}
        
        <button type="button" class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
          ${isWishlisted ? "❤️" : "🤍"}
        </button>

        <div class="product-image-container" onclick="openProductQuickView('${product.id}')">
          <img src="${product.image}" alt="${title}" class="product-image" loading="lazy"
               onerror="this.src='${window.groceryCatalog.FALLBACK_IMAGE}'">
        </div>

        <div class="product-meta-row">
          <span class="product-brand">${product.brand}</span>
          <span class="product-rating">★ ${product.rating}</span>
        </div>

        <h3 class="product-title" onclick="openProductQuickView('${product.id}')" title="${title}">
          ${title}
        </h3>

        ${variantHtml}

        <div class="product-footer-row">
          <div class="product-pricing">
            <span class="product-price-current">${priceFormatted}</span>
            <div class="product-price-strike-row">
              <span class="product-mrp-strike">${mrpFormatted}</span>
              <span class="product-discount-pill">${product.discount}</span>
            </div>
          </div>
          ${actionBtnHtml}
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Handle Variant Change in product card
 */
function handleVariantChange(productId, variantIndex, containerId) {
  const product = window.groceryCatalog.getProductById(productId);
  if (!product) return;
  product.selectedVariantIndex = parseInt(variantIndex, 10);
  renderAllProductSections();
}

/**
 * Handle Add Product button click
 */
function handleAddProduct(productId, variantIndex) {
  const product = window.groceryCatalog.getProductById(productId);
  if (!product) return;
  window.cart.addItem(product, variantIndex, 1);
}

/**
 * Handle Add Monthly Family Pack bundle to cart
 */
function addFamilyPackToCart() {
  const packProduct = {
    id: "mg-pack-01",
    nameEn: "Meenachi Monthly Family Grocery Pack (45kg)",
    nameTa: "மீனாட்சி மாதாந்திர குடும்ப மளிகை பேக்",
    brand: "Meenachi Special",
    unit: "1 Month Pack (28 items)",
    price: 3499,
    mrp: 4650,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    category: "rice-grains"
  };

  window.cart.addItem(packProduct, 0, 1);
  openCartDrawer();
  showToastNotification("Monthly Family Pack added to your basket! You saved ₹1,151.");
}

/**
 * Cart Listeners and Drawer Management
 */
window.addEventListener("cartUpdated", () => {
  updateCartBadges();
  renderAllProductSections();
  renderCartDrawer();
});

function updateCartBadges() {
  const summary = window.cart.getSummary();
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach((badge) => {
    badge.textContent = summary.itemCount;
    badge.style.display = summary.itemCount > 0 ? "flex" : "none";
  });
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer && overlay) {
    renderCartDrawer();
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/**
 * Render Cart Drawer Contents
 */
function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItemsContainer");
  const summary = window.cart.getSummary();
  const isTa = window.i18n.getLang() === "ta";

  if (!container) return;

  // Free delivery progress meter
  const meterText = document.getElementById("deliveryMeterText");
  const meterFill = document.getElementById("deliveryMeterFill");
  if (meterText && meterFill) {
    if (summary.isFreeDelivery) {
      meterText.innerHTML = `🎉 <strong>${isTa ? "இலவச டெலிவரிக்கு தகுதி பெற்றுவிட்டீர்கள்!" : "Congratulations! You qualified for FREE Delivery."}</strong>`;
      meterFill.style.width = "100%";
    } else {
      const needed = summary.amountNeededForFreeDelivery;
      const pct = Math.min(100, Math.round(((499 - needed) / 499) * 100));
      meterText.innerHTML = `${isTa ? "இன்னும்" : "Add"} <strong>₹${needed}</strong> ${isTa ? "சேர்த்தால் இலவச டெலிவரி!" : "more for FREE Express Delivery!"}`;
      meterFill.style.width = `${pct}%`;
    }
  }

  if (summary.itemCount === 0) {
    container.innerHTML = `
      <div class="cart-empty-drawer">
        <div class="cart-empty-icon">🛒</div>
        <h4 class="cart-empty-title">${window.i18n.t("emptyCartTitle")}</h4>
        <p class="cart-empty-desc">${window.i18n.t("emptyCartSubtitle")}</p>
        <button type="button" class="btn-primary" onclick="closeCartDrawer()">
          ${window.i18n.t("continueShopping")}
        </button>
      </div>
    `;
    updateDrawerFooter(summary);
    return;
  }

  container.innerHTML = window.cart.items.map((item) => {
    const title = isTa ? item.nameTa : item.nameEn;
    const priceFmt = window.groceryCatalog.formatINR(item.price);

    return `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${title}" class="drawer-item-img" onerror="this.src='${window.groceryCatalog.FALLBACK_IMAGE}'">
        <div class="drawer-item-details">
          <span class="drawer-item-name">${title}</span>
          <span class="drawer-item-unit">${item.unit}</span>
          <span class="drawer-item-price">${priceFmt}</span>
        </div>
        <div class="drawer-qty-controls">
          <button type="button" class="drawer-qty-btn" onclick="window.cart.decrement('${item.key}')">−</button>
          <span class="drawer-qty-num">${item.quantity}</span>
          <button type="button" class="drawer-qty-btn" onclick="window.cart.increment('${item.key}')">+</button>
        </div>
        <button type="button" class="drawer-item-delete" onclick="window.cart.removeItem('${item.key}')" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  updateDrawerFooter(summary);
}

function updateDrawerFooter(summary) {
  const subtotalEl = document.getElementById("drawerSubtotal");
  const deliveryEl = document.getElementById("drawerDeliveryFee");
  const discountRow = document.getElementById("drawerDiscountRow");
  const discountEl = document.getElementById("drawerCouponDiscount");
  const totalEl = document.getElementById("drawerFinalTotal");
  const savingsNotice = document.getElementById("drawerSavingsNotice");
  const checkoutBtn = document.getElementById("drawerCheckoutBtn");

  if (subtotalEl) subtotalEl.textContent = window.groceryCatalog.formatINR(summary.subtotal);
  if (deliveryEl) {
    deliveryEl.textContent = summary.deliveryFee === 0 ? "FREE" : window.groceryCatalog.formatINR(summary.deliveryFee);
    deliveryEl.style.color = summary.deliveryFee === 0 ? "var(--primary)" : "var(--text-main)";
  }

  if (discountRow && discountEl) {
    if (summary.couponDiscount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = "- " + window.groceryCatalog.formatINR(summary.couponDiscount);
    } else {
      discountRow.style.display = "none";
    }
  }

  if (totalEl) totalEl.textContent = window.groceryCatalog.formatINR(summary.finalTotal);
  if (savingsNotice) {
    if (summary.totalSavings > 0) {
      savingsNotice.style.display = "block";
      savingsNotice.textContent = `You are saving ${window.groceryCatalog.formatINR(summary.totalSavings)} on this order!`;
    } else {
      savingsNotice.style.display = "none";
    }
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = !summary.canCheckout || summary.itemCount === 0;
    if (!summary.canCheckout && summary.itemCount > 0) {
      checkoutBtn.textContent = `Min order is ₹200 (Add ₹${200 - summary.subtotal} more)`;
    } else {
      checkoutBtn.innerHTML = `Proceed to Checkout • ${window.groceryCatalog.formatINR(summary.finalTotal)} ➔`;
    }
  }
}

/**
 * Coupon Application inside Drawer
 */
function handleCouponSubmit() {
  const input = document.getElementById("drawerCouponInput");
  const msgEl = document.getElementById("drawerCouponMsg");
  if (!input || !msgEl) return;

  const result = window.cart.applyCoupon(input.value);
  msgEl.textContent = result.message;
  msgEl.className = "coupon-msg " + (result.success ? "success" : "error");

  if (result.success) {
    showToastNotification(result.message);
  }
}

/**
 * PIN Code Delivery Area Checker
 */
const SERVICEABLE_PINS = {
  // Chennai
  "600001": { area: "George Town, Chennai", slot: "Express 2-hr delivery" },
  "600028": { area: "R.A. Puram, Chennai", slot: "Express 2-hr delivery" },
  "600040": { area: "Anna Nagar, Chennai", slot: "Express 2-hr delivery" },
  "600096": { area: "Perungudi OMR, Chennai", slot: "Express 2-hr delivery" },
  // Madurai
  "625001": { area: "Meenakshi Amman Temple Zone, Madurai", slot: "Express 2-hr delivery" },
  "625020": { area: "K.K. Nagar, Madurai", slot: "Express 2-hr delivery" },
  // Coimbatore
  "641001": { area: "R.S. Puram, Coimbatore", slot: "Express 2-hr delivery" },
  "641004": { area: "Peelamedu, Coimbatore", slot: "Express 2-hr delivery" },
  // Trichy
  "620001": { area: "Cantonment, Trichy", slot: "Next-day morning slot" },
  // Salem
  "636001": { area: "Salem Town", slot: "Next-day morning slot" },
  // Bengaluru
  "560001": { area: "MG Road / Central Bengaluru", slot: "Express 2-hr delivery" },
  "560034": { area: "Koramangala, Bengaluru", slot: "Express 2-hr delivery" }
};

function openPincodeModal() {
  const modal = document.getElementById("pincodeModal");
  if (modal) {
    modal.classList.add("active");
    const input = document.getElementById("pincodeInput");
    if (input) input.focus();
  }
}

function closePincodeModal() {
  const modal = document.getElementById("pincodeModal");
  if (modal) modal.classList.remove("active");
}

function checkEnteredPincode(customPin = null) {
  const input = document.getElementById("pincodeInput");
  const statusBox = document.getElementById("pincodeStatusBox");
  const pin = (customPin || (input ? input.value : "")).trim();
  const isTa = window.i18n.getLang() === "ta";

  if (!/^\d{6}$/.test(pin)) {
    statusBox.className = "pincode-status-box error";
    statusBox.textContent = isTa ? "சரியான 6-இலக்க பின் கோடை உள்ளிடவும்" : "Please enter a valid 6-digit Indian PIN code.";
    return;
  }

  // Range or direct match
  const pinNum = parseInt(pin, 10);
  let isDeliverable = false;
  let details = SERVICEABLE_PINS[pin];

  if (details) {
    isDeliverable = true;
  } else if ((pinNum >= 600001 && pinNum <= 600120) || (pinNum >= 625001 && pinNum <= 625025) || (pinNum >= 641001 && pinNum <= 641045)) {
    isDeliverable = true;
    details = { area: "City Hub Zone", slot: "Express 2-hr delivery" };
  }

  if (isDeliverable) {
    statusBox.className = "pincode-status-box success";
    statusBox.innerHTML = `
      ✅ <strong>${details.area} (${pin})</strong><br>
      ⚡ ${details.slot} is active! Free delivery on orders above ₹499.
    `;
    savePincode(pin, details.area);
    setTimeout(() => {
      closePincodeModal();
      showToastNotification(`Delivering to ${details.area} (${pin})`);
    }, 1200);
  } else {
    statusBox.className = "pincode-status-box error";
    statusBox.innerHTML = `
      ❌ Sorry, we do not deliver to <strong>${pin}</strong> yet.<br>
      Try demo PINs: <strong>600040</strong> (Chennai), <strong>625001</strong> (Madurai), or <strong>641001</strong> (Coimbatore).
    `;
  }
}

function savePincode(pin, area) {
  localStorage.setItem("meenachi_pincode", pin);
  localStorage.setItem("meenachi_area", area);
  updatePincodeDisplay(pin, area);
}

function loadSavedPincode() {
  const pin = localStorage.getItem("meenachi_pincode") || "600040";
  const area = localStorage.getItem("meenachi_area") || "Anna Nagar, Chennai";
  updatePincodeDisplay(pin, area);
}

function updatePincodeDisplay(pin, area) {
  const headerPinEl = document.getElementById("headerPincodeText");
  if (headerPinEl) {
    headerPinEl.textContent = `${pin} (${area.split(",")[0]})`;
  }
}

/**
 * Wishlist Storage & Toggling
 */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("meenachi_wishlist") || "[]");
  } catch (e) {
    return [];
  }
}

function isItemWishlisted(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  let list = getWishlist();
  const product = window.groceryCatalog.getProductById(id);
  const title = product ? product.nameEn : "Product";

  if (list.includes(id)) {
    list = list.filter((item) => item !== id);
    showToastNotification(`${title} removed from wishlist`);
  } else {
    list.push(id);
    showToastNotification(`❤️ ${title} saved to wishlist!`);
  }

  localStorage.setItem("meenachi_wishlist", JSON.stringify(list));
  renderAllProductSections();
}

/**
 * Product Quick View Modal
 */
function openProductQuickView(productId) {
  const product = window.groceryCatalog.getProductById(productId);
  if (!product) return;

  const modal = document.getElementById("quickViewModal");
  const content = document.getElementById("quickViewModalContent");
  const isTa = window.i18n.getLang() === "ta";
  if (!modal || !content) return;

  const title = isTa ? product.nameTa : product.nameEn;
  const currentVariantIndex = product.selectedVariantIndex || product.defaultVariantIndex || 0;
  const variant = product.variants ? product.variants[currentVariantIndex] : null;
  const price = variant ? variant.price : product.price;
  const mrp = variant ? variant.mrp : product.mrp;

  content.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; align-items: center;">
      <div style="border-radius: var(--radius-md); overflow: hidden; background: var(--bg-warm); height: 260px;">
        <img src="${product.image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;"
             onerror="this.src='${window.groceryCatalog.FALLBACK_IMAGE}'">
      </div>
      <div>
        <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--accent);">${product.brand}</span>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin: 6px 0 10px; color: var(--text-main);">${title}</h2>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 14px;">${product.description}</p>
        
        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px;">
          <span style="font-size: 1.6rem; font-weight: 800; color: var(--primary);">${window.groceryCatalog.formatINR(price)}</span>
          <span style="font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through;">${window.groceryCatalog.formatINR(mrp)}</span>
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent); background: #FFF4E6; padding: 2px 8px; border-radius: 4px;">${product.discount}</span>
        </div>

        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn-primary" style="flex: 1; justify-content: center;"
                  onclick="handleAddProduct('${product.id}', ${currentVariantIndex}); closeQuickViewModal();">
            + Add to Basket
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function closeQuickViewModal() {
  const modal = document.getElementById("quickViewModal");
  if (modal) modal.classList.remove("active");
}

/**
 * Newsletter Subscription
 */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("newsletterInput");
  if (!input) return;
  const val = input.value.trim();

  if (!val) {
    showToastNotification("Please enter a valid phone number or email.");
    return;
  }

  showToastNotification("🎉 Welcome to Meenachi Family! Use voucher code MEENACHI150 for ₹150 OFF.");
  input.value = "";
}

/**
 * Toast Notification Utility
 */
function showToastNotification(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🌿</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
window.showToastNotification = showToastNotification;

/**
 * Mobile Navigation Drawer
 */
function openMobileMenu() {
  const drawer = document.getElementById("mobileNavDrawer");
  const overlay = document.getElementById("mobileNavOverlay");
  if (drawer && overlay) {
    drawer.classList.add("active");
    overlay.classList.add("active");
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById("mobileNavDrawer");
  const overlay = document.getElementById("mobileNavOverlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
  }
}

/**
 * Setup Global Event Listeners & Accordions
 */
function setupEventListeners() {
  // Language Change Listener
  window.addEventListener("languageChanged", () => {
    renderCategoryGrid();
    renderAllProductSections();
    renderCartDrawer();
  });

  // Accordion Toggles
  document.querySelectorAll(".faq-question-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item.classList.contains("active");

      // Close other open accordions
      document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Checkout redirect placeholder
  const checkoutBtn = document.getElementById("drawerCheckoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "pages/checkout.html";
    });
  }
}

// Global Exports
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openPincodeModal = openPincodeModal;
window.closePincodeModal = closePincodeModal;
window.checkEnteredPincode = checkEnteredPincode;
window.openProductQuickView = openProductQuickView;
window.closeQuickViewModal = closeQuickViewModal;
window.toggleWishlist = toggleWishlist;
window.handleVariantChange = handleVariantChange;
window.handleAddProduct = handleAddProduct;
window.addFamilyPackToCart = addFamilyPackToCart;
window.handleCouponSubmit = handleCouponSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
