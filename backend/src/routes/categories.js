import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const DEFAULT_CATEGORIES = [
  { id: "rice-grains", nameEn: "Rice & Grains", nameTa: "அரிசி & தானியங்கள்", icon: "🌾", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80" },
  { id: "dhal-pulses", nameEn: "Dhal & Pulses", nameTa: "பருப்பு வகைகள்", icon: "🥣", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80" },
  { id: "cooking-oil", nameEn: "Cooking Oil", nameTa: "சமையல் எண்ணெய்", icon: "🫒", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80" },
  { id: "spices-masala", nameEn: "Spices & Masala", nameTa: "மசாலா & பொடிகள்", icon: "🌶️", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80" },
  { id: "vegetables", nameEn: "Vegetables", nameTa: "காய்கறிகள்", icon: "🥦", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" },
  { id: "fruits", nameEn: "Fresh Fruits", nameTa: "பழங்கள்", icon: "🍎", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80" },
  { id: "dairy-eggs", nameEn: "Dairy & Eggs", nameTa: "பால் & முட்டை", icon: "🥛", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80" },
  { id: "snacks-biscuits", nameEn: "Snacks & Biscuits", nameTa: "சிற்றுண்டிகள்", icon: "🥨", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281080?auto=format&fit=crop&w=600&q=80" },
  { id: "beverages", nameEn: "Beverages", nameTa: "பானங்கள் & காபி", icon: "☕", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
  { id: "personal-care", nameEn: "Personal Care", nameTa: "தனிநபர் பராமரிப்பு", icon: "🧼", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
  { id: "cleaning-household", nameEn: "Cleaning & Essentials", nameTa: "வீட்டு உபயோகப் பொருட்கள்", icon: "🧹", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80" }
];

/**
 * GET /api/categories
 * Returns active categories from Supabase (or defaults)
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");

    if (!error && data && data.length > 0) {
      return res.json({ success: true, count: data.length, data });
    }
  } catch (err) {
    console.warn("Categories fetch fallback:", err.message);
  }

  // Graceful fallback to default categories
  return res.json({ success: true, count: DEFAULT_CATEGORIES.length, data: DEFAULT_CATEGORIES });
});

export default router;
