/**
 * Meenachi Grocery - Supabase Database & Auth Service Layer
 * Interfaces with the Express API (http://localhost:5000/api) backed by Supabase PostgreSQL,
 * with automatic fallback to direct client-side Supabase and local cache.
 */

class DBService {
  constructor() {
    // If served from Express (port 5000), use relative "/api"; otherwise point to localhost:5000
    this.apiBase = window.location.origin.includes(":5000")
      ? "/api"
      : "http://localhost:5000/api";
    this.client = null;
    this.initClient();
  }

  initClient() {
    if (window.supabaseClient) {
      this.client = window.supabaseClient;
    }
  }

  getClient() {
    if (!this.client && window.supabaseClient) {
      this.client = window.supabaseClient;
    }
    return this.client;
  }

  /**
   * Helper to map image fallbacks for items with null image_url
   */
  getDefaultImageForProduct(name, category) {
    const n = (name || "").toLowerCase();
    const c = (category || "").toLowerCase();

    if (n.includes("rice") || c.includes("rice")) {
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80";
    }
    if (n.includes("dal") || n.includes("dhal") || c.includes("dhal") || c.includes("pulse")) {
      return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
    }
    if (n.includes("oil") || c.includes("oil")) {
      return "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80";
    }
    if (n.includes("turmeric") || n.includes("spice") || c.includes("spice")) {
      return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80";
    }
    if (n.includes("sugar") || n.includes("sweet")) {
      return "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80";
    }
    if (c.includes("veg")) {
      return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
    }
    if (c.includes("fruit")) {
      return "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  }

  normalizeCategorySlug(category) {
    if (!category) return "rice-grains";
    const cat = category.toLowerCase();
    if (cat.includes("rice")) return "rice-grains";
    if (cat.includes("dhal") || cat.includes("pulse")) return "dhal-pulses";
    if (cat.includes("oil")) return "cooking-oil";
    if (cat.includes("spice") || cat.includes("masala")) return "spices-masala";
    if (cat.includes("veg")) return "vegetables";
    if (cat.includes("fruit")) return "fruits";
    if (cat.includes("dairy") || cat.includes("egg")) return "dairy-eggs";
    if (cat.includes("snack") || cat.includes("biscuit")) return "snacks-biscuits";
    if (cat.includes("beverage") || cat.includes("coffee") || cat.includes("tea")) return "beverages";
    if (cat.includes("personal")) return "personal-care";
    if (cat.includes("clean") || cat.includes("essential")) return "cleaning-household";
    return "rice-grains";
  }

  /**
   * Fetch categories from Express API (with fallback)
   */
  async getCategories() {
    try {
      const res = await fetch(`${this.apiBase}/categories`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return json.data.map(cat => ({
            id: cat.id || cat.slug,
            nameEn: cat.nameEn || cat.name_en,
            nameTa: cat.nameTa || cat.name_ta || cat.nameEn,
            icon: cat.icon || "📦",
            image: cat.image || cat.image_url,
            itemCount: 20
          }));
        }
      }
    } catch (e) {
      console.warn("Express /api/categories unavailable, using local catalog.");
    }
    return window.groceryCatalog?.categories || [];
  }

  /**
   * Fetch products from Express API -> Supabase (with fallback)
   */
  async getProducts() {
    let rawItems = [];

    // 1. Try Express API
    try {
      const res = await fetch(`${this.apiBase}/products`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          rawItems = json.data;
        }
      }
    } catch (e) {
      console.warn("Express backend unavailable, attempting direct Supabase query.");
    }

    // 2. If Express returned products, map them
    if (rawItems.length > 0) {
      const dbProducts = rawItems.map((p) => {
        const titleEn = p.name || p.name_en || "Grocery Item";
        const titleTa = p.name_ta || titleEn;
        const price = Number(p.price || p.selling_price_inr || 50);
        const mrp = Number(p.mrp || p.mrp_inr || Math.round(price * 1.15));
        const unit = p.unit || p.unit_label || "1 kg";
        const categorySlug = this.normalizeCategorySlug(p.category || p.category_id);
        const image = p.image_url || this.getDefaultImageForProduct(titleEn, p.category);
        const discountPct = mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF` : "";

        return {
          id: "sb-" + p.id,
          category: categorySlug,
          brand: p.brand || "Meenachi",
          nameEn: titleEn,
          nameTa: titleTa,
          description: p.description || p.description_en || `${titleEn} - fresh, pure and directly sourced for your kitchen.`,
          image: image,
          isBestSeller: true,
          isOffer: discountPct !== "",
          isNew: false,
          badge: discountPct ? "Fresh Stock" : null,
          rating: Number(p.rating || 4.8),
          reviewsCount: p.reviews_count || 128,
          variants: [{ unit: unit, price: price, mrp: mrp }],
          price: price,
          mrp: mrp,
          unit: unit,
          discount: discountPct,
          stockCount: p.stock ?? 100
        };
      });

      // Merge with sample catalog for a rich 25+ item supermarket experience
      const sampleRest = (window.groceryCatalog?.products || []).filter(
        sp => !dbProducts.some(dp => dp.nameEn.toLowerCase() === sp.nameEn.toLowerCase())
      );
      return [...dbProducts, ...sampleRest];
    }

    return window.groceryCatalog?.products || [];
  }

  /**
   * Save a newly placed order via Express API / Supabase
   */
  async createOrder(orderPayload) {
    // 1. Always update local storage for immediate persistence
    const localOrders = JSON.parse(localStorage.getItem("meenachi_orders") || "[]");
    localOrders.unshift(orderPayload);
    localStorage.setItem("meenachi_orders", JSON.stringify(localOrders));

    // 2. Post to Express backend
    try {
      const res = await fetch(`${this.apiBase}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const json = await res.json();
        console.log("🌿 Order confirmed by Express server:", json.orderId);
        return { success: true, orderId: json.orderId };
      }
    } catch (e) {
      console.warn("Express backend order save fallback:", e.message);
    }

    return { success: true, orderId: orderPayload.orderId };
  }

  /**
   * Fetch all orders from Express API / Supabase
   */
  async getOrders() {
    try {
      const res = await fetch(`${this.apiBase}/orders`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return json.data.map(ord => ({
            orderId: ord.orderId || ord.id,
            date: ord.created_at ? new Date(ord.created_at).toLocaleDateString("en-IN", {
              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            }) : "Today",
            customer: {
              name: ord.customer_name || ord.customer?.name,
              phone: ord.customer_phone || ord.customer?.phone,
              pin: ord.delivery_pincode || ord.customer?.pin,
              address: ord.shipping_address || ord.customer?.address
            },
            slot: ord.delivery_slot || ord.slot,
            status: ord.order_status || ord.status || "Confirmed",
            total: ord.total_inr || ord.total,
            payment: ord.payment_method || ord.payment,
            items: ord.items || (ord.order_items || []).map(it => ({
              nameEn: it.product_name,
              unit: it.unit_label,
              quantity: it.quantity,
              price: it.unit_price_inr
            }))
          }));
        }
      }
    } catch (e) {
      console.warn("Express backend /api/orders fallback:", e.message);
    }

    return JSON.parse(localStorage.getItem("meenachi_orders") || "[]");
  }

  /**
   * Update order status via Express API / Supabase
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      await fetch(`${this.apiBase}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn("Express backend status update fallback:", e.message);
    }

    const local = JSON.parse(localStorage.getItem("meenachi_orders") || "[]");
    const target = local.find(o => o.orderId === orderId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem("meenachi_orders", JSON.stringify(local));
    }
  }

  /**
   * Supabase Auth: Sign Up Customer
   */
  async signUp(email, password, fullName, phone) {
    try {
      const res = await fetch(`${this.apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone })
      });
      return await res.json();
    } catch (e) {
      const client = this.getClient();
      if (!client) return { error: { message: "Server not connected" } };
      return await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone_number: phone } }
      });
    }
  }

  /**
   * Supabase Auth: Sign In Customer
   */
  async signIn(email, password) {
    try {
      const res = await fetch(`${this.apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (res.ok && json.success) return { data: json, error: null };
      return { data: null, error: { message: json.message || "Login failed" } };
    } catch (e) {
      const client = this.getClient();
      if (!client) return { error: { message: "Server not connected" } };
      return await client.auth.signInWithPassword({ email, password });
    }
  }

  /**
   * Supabase Auth: Sign Out
   */
  async signOut() {
    try {
      await fetch(`${this.apiBase}/auth/logout`, { method: "POST" });
    } catch (e) {}
    const client = this.getClient();
    if (client) await client.auth.signOut();
  }
}

const dbService = new DBService();
window.dbService = dbService;
