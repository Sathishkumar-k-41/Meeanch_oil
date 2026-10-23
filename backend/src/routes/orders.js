import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// In-memory fallback cache if Supabase orders table is pending creation
let memoryOrders = [
  {
    orderId: "MG-842915",
    customer_name: "Meenakshi Sundaram",
    customer_phone: "+91 98765 11223",
    delivery_pincode: "600040",
    shipping_address: "Flat 3B, Sri Meenakshi Nilayam, Anna Nagar, Chennai",
    delivery_slot: "2-Hour Express",
    order_status: "Delivered",
    payment_method: "ONLINE",
    total_inr: 895,
    items: [
      { nameEn: "Meenachi Premium Ponni Boiled Rice", unit: "5 kg", quantity: 1, price: 340 },
      { nameEn: "Meenachi Wood Pressed Sesame Oil", unit: "1 L", quantity: 1, price: 375 },
      { nameEn: "Unpolished Country Toor Dal", unit: "1 kg", quantity: 1, price: 168 }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

/**
 * GET /api/orders
 * Fetch all orders
 */
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return res.json({ success: true, count: data.length, data });
    }

    // Fallback to in-memory orders
    return res.json({ success: true, count: memoryOrders.length, data: memoryOrders });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/orders
 * Place new order
 */
router.post("/", async (req, res, next) => {
  try {
    const { customer, items, slot, payment, total } = req.body;

    if (!customer?.name || !customer?.phone || !items || !items.length) {
      return res.status(400).json({ success: false, message: "Customer details and items are required" });
    }

    const orderId = "MG-" + Math.floor(100000 + Math.random() * 900000);
    const orderPayload = {
      orderId,
      customer_name: customer.name,
      customer_phone: customer.phone,
      delivery_pincode: customer.pin || "600040",
      shipping_address: customer.address || "Chennai",
      delivery_slot: slot || "2-Hour Express",
      order_status: "Confirmed",
      payment_method: payment || "ONLINE",
      total_inr: Number(total || 0),
      items: items,
      created_at: new Date().toISOString()
    };

    // Attempt insert into Supabase
    try {
      const { error: ordErr } = await supabase.from("orders").insert([
        {
          id: orderId,
          customer_name: orderPayload.customer_name,
          customer_phone: orderPayload.customer_phone,
          delivery_pincode: orderPayload.delivery_pincode,
          shipping_address: orderPayload.shipping_address,
          delivery_slot: orderPayload.delivery_slot,
          order_status: orderPayload.order_status,
          payment_method: orderPayload.payment_method,
          subtotal_inr: orderPayload.total_inr,
          total_inr: orderPayload.total_inr
        }
      ]);

      if (!ordErr) {
        const itemRows = items.map((i) => ({
          order_id: orderId,
          product_name: i.nameEn || i.name,
          unit_label: i.unit || "1 unit",
          unit_price_inr: Number(i.price || 0),
          quantity: Number(i.quantity || 1),
          total_line_inr: Number((i.price || 0) * (i.quantity || 1))
        }));
        await supabase.from("order_items").insert(itemRows);
        console.log(`📦 Order ${orderId} saved to Supabase PostgreSQL table.`);
      } else {
        console.warn("Supabase orders table not ready, saved in memory:", ordErr.message);
      }
    } catch (dbErr) {
      console.warn("DB insert fallback:", dbErr.message);
    }

    // Always update in-memory
    memoryOrders.unshift(orderPayload);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId,
      data: orderPayload
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status (Admin / Delivery)
 */
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Placed", "Confirmed", "Packed", "Dispatched", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    // Update in Supabase
    try {
      await supabase.from("orders").update({ order_status: status }).eq("id", id);
    } catch (e) {
      console.warn("Supabase status update fallback:", e.message);
    }

    // Update in memory
    const ord = memoryOrders.find((o) => o.orderId === id);
    if (ord) {
      ord.order_status = status;
    }

    return res.json({ success: true, message: `Order #${id} marked as ${status}` });
  } catch (err) {
    next(err);
  }
});

export default router;
