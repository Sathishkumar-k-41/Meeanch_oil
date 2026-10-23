/**
 * Meenachi Grocery - Shopping Cart State Manager
 * Handles localStorage persistence, quantity updates, coupon calculation,
 * delivery fee tiers, and real-time synchronization with UI badges and drawer.
 */

class CartManager {
  constructor() {
    this.storageKey = "meenachi_cart";
    this.couponKey = "meenachi_applied_coupon";
    this.items = this.loadCart();
    this.appliedCoupon = this.loadCoupon();
    this.minOrderAmount = 200; // Minimum order value in INR
    this.freeDeliveryThreshold = 499; // Free delivery above this
    this.standardDeliveryFee = 40; // Delivery fee below threshold
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }

  loadCoupon() {
    try {
      const saved = localStorage.getItem(this.couponKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveCoupon(coupon) {
    this.appliedCoupon = coupon;
    if (coupon) {
      localStorage.setItem(this.couponKey, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(this.couponKey);
    }
    this.notifyListeners();
  }

  notifyListeners() {
    window.dispatchEvent(new CustomEvent("cartUpdated", {
      detail: {
        items: this.items,
        summary: this.getSummary()
      }
    }));
  }

  /**
   * Add a product or variant to the cart
   */
  addItem(product, variantIndex = null, quantity = 1) {
    const vIndex = variantIndex !== null ? variantIndex : (product.defaultVariantIndex || 0);
    const variant = product.variants ? product.variants[vIndex] : null;
    const itemUnit = variant ? variant.unit : product.unit;
    const itemPrice = variant ? variant.price : product.price;
    const itemMrp = variant ? variant.mrp : product.mrp;
    const itemKey = `${product.id}_${itemUnit}`;

    const existingIndex = this.items.findIndex((item) => item.key === itemKey);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        key: itemKey,
        id: product.id,
        nameEn: product.nameEn,
        nameTa: product.nameTa,
        brand: product.brand,
        unit: itemUnit,
        price: itemPrice,
        mrp: itemMrp,
        image: product.image,
        quantity: quantity,
        category: product.category
      });
    }

    this.saveCart();
    this.showToast(`${product.nameEn} (${itemUnit}) added to basket!`);
    return this.getItemQuantity(product.id, itemUnit);
  }

  /**
   * Update item quantity directly
   */
  updateQuantity(itemKey, newQuantity) {
    const index = this.items.findIndex((item) => item.key === itemKey);
    if (index > -1) {
      if (newQuantity <= 0) {
        const removed = this.items.splice(index, 1)[0];
        this.saveCart();
        this.showToast(`${removed.nameEn} removed from basket`);
      } else {
        this.items[index].quantity = newQuantity;
        this.saveCart();
      }
    }
  }

  /**
   * Increment quantity by 1
   */
  increment(itemKey) {
    const item = this.items.find((i) => i.key === itemKey);
    if (item) {
      this.updateQuantity(itemKey, item.quantity + 1);
    }
  }

  /**
   * Decrement quantity by 1
   */
  decrement(itemKey) {
    const item = this.items.find((i) => i.key === itemKey);
    if (item) {
      this.updateQuantity(itemKey, item.quantity - 1);
    }
  }

  /**
   * Remove item completely
   */
  removeItem(itemKey) {
    const index = this.items.findIndex((item) => item.key === itemKey);
    if (index > -1) {
      const removed = this.items.splice(index, 1)[0];
      this.saveCart();
      this.showToast(`${removed.nameEn} removed`);
    }
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    localStorage.removeItem(this.couponKey);
    this.saveCart();
  }

  /**
   * Get quantity of a product currently in cart
   */
  getItemQuantity(productId, unit = null) {
    if (unit) {
      const item = this.items.find((i) => i.id === productId && i.unit === unit);
      return item ? item.quantity : 0;
    }
    return this.items
      .filter((i) => i.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  }

  /**
   * Check if a product is in cart
   */
  isInCart(productId) {
    return this.items.some((i) => i.id === productId);
  }

  /**
   * Get total item count (sum of quantities)
   */
  getTotalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Compute comprehensive bill breakdown
   */
  getSummary() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalMrp = this.items.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
    const catalogSavings = Math.max(0, totalMrp - subtotal);

    let couponDiscount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === "flat") {
        couponDiscount = Math.min(this.appliedCoupon.value, subtotal);
      } else if (this.appliedCoupon.type === "percent") {
        couponDiscount = Math.round((subtotal * this.appliedCoupon.value) / 100);
      }
    }

    const deliveryFee = subtotal === 0 || subtotal >= this.freeDeliveryThreshold ? 0 : this.standardDeliveryFee;
    const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);
    const totalSavings = catalogSavings + couponDiscount;

    return {
      subtotal,
      totalMrp,
      catalogSavings,
      couponDiscount,
      deliveryFee,
      isFreeDelivery: deliveryFee === 0 && subtotal > 0,
      amountNeededForFreeDelivery: Math.max(0, this.freeDeliveryThreshold - subtotal),
      finalTotal,
      totalSavings,
      itemCount: this.getTotalCount(),
      appliedCoupon: this.appliedCoupon,
      canCheckout: subtotal >= this.minOrderAmount
    };
  }

  /**
   * Apply coupon code
   */
  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    const subtotal = this.getSummary().subtotal;

    const availableCoupons = {
      "MEENACHI150": {
        code: "MEENACHI150",
        type: "flat",
        value: 150,
        minOrder: 899,
        description: "₹150 off on orders above ₹899"
      },
      "FREESHIP": {
        code: "FREESHIP",
        type: "flat",
        value: 40,
        minOrder: 250,
        description: "Free shipping voucher"
      },
      "FARM10": {
        code: "FARM10",
        type: "percent",
        value: 10,
        minOrder: 499,
        description: "10% discount on order value"
      }
    };

    const coupon = availableCoupons[cleanCode];
    if (!coupon) {
      return { success: false, message: "Invalid coupon code. Try MEENACHI150 or FARM10." };
    }

    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Coupon requires minimum order of ₹${coupon.minOrder}. Add items worth ₹${coupon.minOrder - subtotal} more.`
      };
    }

    this.saveCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!`, coupon };
  }

  removeCoupon() {
    this.saveCoupon(null);
  }

  /**
   * Toast notification helper
   */
  showToast(message) {
    if (window.showToastNotification) {
      window.showToastNotification(message);
    }
  }
}

const cart = new CartManager();
window.cart = cart;
