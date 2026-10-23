import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * GET /api/products
 * Fetch products from Supabase with optional category and search filters
 */
router.get("/", async (req, res, next) => {
  try {
    const { category, search, limit = 50 } = req.query;

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .limit(parseInt(limit, 10));

    if (category && category !== "all") {
      query = query.ilike("category", `%${category}%`);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase products fetch error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/products
 * Create a new product (Admin)
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, category, price, mrp, unit, stock, image_url, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Product name and price are required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category: category || "General",
          price: Number(price),
          mrp: Number(mrp || price),
          unit: unit || "1 kg",
          stock: Number(stock || 100),
          image_url: image_url || null,
          description: description || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({ success: true, message: "Product created successfully", data });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: "Product updated", data });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/products/:id
 * Soft delete product (set is_active = false)
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: "Product deactivated successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
