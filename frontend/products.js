import { supabase } from "./supabase.js";

async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

    if (error) {
        console.error("API Error:", error.message);
        const container = document.getElementById("products");
        if (container) {
            container.innerHTML = `<p style="color: #DC3545;">Error loading products: ${error.message}</p>`;
        }
        return;
    }

    console.log("Supabase Products Loaded:", data);

    const container = document.getElementById("products");

    if (container) {
        container.innerHTML = data.map(product => `
            <div class="product-card">
                <span class="product-badge" style="position: static; display: inline-block; margin-bottom: 8px;">In Stock</span>
                <h3 class="product-title" style="min-height: auto; margin-bottom: 6px;">${product.name}</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">Category: <strong>${product.category}</strong></p>
                <div class="product-footer-row" style="border-top: none; padding-top: 0;">
                    <div class="product-pricing">
                        <span class="product-price-current">₹${product.price}</span>
                        ${product.mrp ? `<span class="product-mrp-strike">₹${product.mrp}</span>` : ''}
                    </div>
                    <span class="variant-badge-single">${product.unit || '1 unit'}</span>
                </div>
                <p style="font-size: 0.76rem; color: var(--primary); margin: 6px 0 10px; font-weight: 600;">Stock: ${product.stock} units</p>
                <button type="button" class="add-to-cart-btn" style="width: 100%; justify-content: center;"
                        onclick="if(window.cart) { window.cart.addItem({ id: 'sb-${product.id}', nameEn: '${product.name}', price: ${product.price}, mrp: ${product.mrp || product.price}, unit: '${product.unit || '1 unit'}' }); } else { alert('Added ${product.name} to cart'); }">
                    + Add to Cart
                </button>
            </div>
        `).join("");
    }
}

getProducts();
