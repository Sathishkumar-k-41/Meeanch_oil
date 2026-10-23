import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const COUPONS_MAP = {
  "MEENACHI150": { code: "MEENACHI150", type: "flat", value: 150, minOrder: 899, description: "₹150 off on orders above ₹899" },
  "FREESHIP": { code: "FREESHIP", type: "flat", value: 40, minOrder: 250, description: "Free express delivery voucher" },
  "FARM10": { code: "FARM10", type: "percent", value: 10, minOrder: 499, description: "10% off on your entire basket" }
};

/**
 * POST /api/coupons/validate
 */
router.post("/validate", async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  const cleanCode = (code || "").trim().toUpperCase();

  // Try fetching from Supabase first
  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", cleanCode)
      .eq("is_active", true)
      .single();

    if (!error && data) {
      if (subtotal < data.min_order_inr) {
        return res.status(400).json({
          success: false,
          message: `Coupon requires minimum order of ₹${data.min_order_inr}`
        });
      }
      return res.json({
        success: true,
        message: `Coupon ${data.code} applied!`,
        coupon: {
          code: data.code,
          type: data.discount_type,
          value: Number(data.discount_value),
          minOrder: Number(data.min_order_inr)
        }
      });
    }
  } catch (e) {
    // Fall back to predefined coupon list
  }

  const coupon = COUPONS_MAP[cleanCode];
  if (!coupon) {
    return res.status(404).json({ success: false, message: "Invalid coupon code. Try MEENACHI150 or FARM10." });
  }

  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Coupon requires minimum order of ₹${coupon.minOrder}. Add ₹${coupon.minOrder - subtotal} more.`
    });
  }

  return res.json({
    success: true,
    message: `Coupon ${coupon.code} applied successfully!`,
    coupon
  });
});

export default router;
