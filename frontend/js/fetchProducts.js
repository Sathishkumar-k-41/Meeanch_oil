import { supabase } from "./supabase.js";

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

    if (error) {
        console.error("API Error:", error.message);
        return;
    }

    console.log("Fetched Products from Supabase:", data);

    const container = document.getElementById("products");

    if (container) {
        container.innerHTML = data.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price}</p>
                <p>Stock: ${product.stock}</p>
            </div>
        `).join("");
    }
}

// Execute on load
getProducts();
