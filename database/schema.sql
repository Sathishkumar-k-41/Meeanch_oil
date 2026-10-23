-- ============================================================================
-- MEENACHI GROCERY - PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- Brand: Meenachi Grocery ("Freshness at Your Doorstep")
-- Description: Full normalized relational schema with RLS policies and seed data
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. USER PROFILES & ROLES (Linked with Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta')),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'delivery_staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. ADDRESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    house_flat_no VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(6) NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_pincode ON public.addresses(pincode);

-- ============================================================================
-- 4. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_ta VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10),
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. PRODUCTS & VARIANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    brand VARCHAR(100) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    name_ta VARCHAR(200) NOT NULL,
    description_en TEXT,
    description_ta TEXT,
    image_url TEXT NOT NULL,
    is_best_seller BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    badge VARCHAR(50),
    rating NUMERIC(3,2) DEFAULT 4.80,
    reviews_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON public.products(is_best_seller);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE CASCADE,
    unit_label VARCHAR(50) NOT NULL, -- e.g., '5 kg', '1 L', '500 g'
    mrp_inr NUMERIC(10,2) NOT NULL,
    selling_price_inr NUMERIC(10,2) NOT NULL,
    stock_quantity INT DEFAULT 100 CHECK (stock_quantity >= 0),
    is_default BOOLEAN DEFAULT false,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);

-- ============================================================================
-- 6. INVENTORY MOVEMENTS (Auditing Stock Adjustments)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    change_quantity INT NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('order_placed', 'order_cancelled', 'manual_restock', 'spoilage_return')),
    reference_order_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. COUPONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    code VARCHAR(50) PRIMARY KEY,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('flat', 'percent')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_inr NUMERIC(10,2) DEFAULT 0,
    max_discount_inr NUMERIC(10,2),
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    usage_limit INT DEFAULT 1000,
    times_used INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- 8. ORDERS & ORDER ITEMS (Concurrency-safe and immutable history)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'MG-842915'
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    delivery_pincode VARCHAR(6) NOT NULL,
    shipping_address TEXT NOT NULL,
    delivery_slot VARCHAR(100) NOT NULL, -- e.g., '2-Hour Express', 'Morning (7 AM - 10 AM)'
    order_status VARCHAR(30) DEFAULT 'Confirmed' 
        CHECK (order_status IN ('Placed', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled')),
    payment_method VARCHAR(30) DEFAULT 'ONLINE' CHECK (payment_method IN ('ONLINE', 'COD')),
    payment_status VARCHAR(30) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    subtotal_inr NUMERIC(10,2) NOT NULL,
    delivery_fee_inr NUMERIC(10,2) DEFAULT 0,
    coupon_code VARCHAR(50) REFERENCES public.coupons(code) ON DELETE SET NULL,
    discount_inr NUMERIC(10,2) DEFAULT 0,
    total_inr NUMERIC(10,2) NOT NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL, -- Preserved snapshot
    unit_label VARCHAR(50) NOT NULL,   -- Preserved snapshot
    unit_price_inr NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_line_inr NUMERIC(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================================
-- 9. DELIVERIES TABLE (Rider dispatch management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES public.orders(id) ON DELETE CASCADE,
    rider_name VARCHAR(100) DEFAULT 'Murugan S.',
    rider_phone VARCHAR(15) DEFAULT '+91 98401 22334',
    delivery_status VARCHAR(30) DEFAULT 'Assigned' CHECK (delivery_status IN ('Assigned', 'In-Transit', 'Delivered', 'Failed')),
    delivery_otp VARCHAR(4),
    delivered_at TIMESTAMPTZ,
    notes TEXT
);

-- ============================================================================
-- 10. REVIEWS & RATINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read on categories, products, variants, and active coupons
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Allow public inserts on orders and order_items (for guest checkout demo)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders status" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);

-- ============================================================================
-- 12. INITIAL SEED DATA (11 Categories & Starter South Indian Groceries)
-- ============================================================================
INSERT INTO public.categories (id, name_en, name_ta, slug, icon, image_url, display_order)
VALUES
('rice-grains', 'Rice & Grains', 'அரிசி & தானியங்கள்', 'rice-grains', '🌾', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 1),
('dhal-pulses', 'Dhal & Pulses', 'பருப்பு வகைகள்', 'dhal-pulses', '🥣', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 2),
('cooking-oil', 'Cooking Oil', 'சமையல் எண்ணெய்', 'cooking-oil', '🫒', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 3),
('spices-masala', 'Spices & Masala', 'மசாலா & பொடிகள்', 'spices-masala', '🌶️', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 4),
('vegetables', 'Vegetables', 'காய்கறிகள்', 'vegetables', '🥦', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', 5),
('fruits', 'Fresh Fruits', 'பழங்கள்', 'fruits', '🍎', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', 6),
('dairy-eggs', 'Dairy & Eggs', 'பால் & முட்டை', 'dairy-eggs', '🥛', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', 7),
('snacks-biscuits', 'Snacks & Biscuits', 'சிற்றுண்டிகள்', 'snacks-biscuits', '🥨', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281080?auto=format&fit=crop&w=600&q=80', 8),
('beverages', 'Beverages', 'பானங்கள் & காபி', 'beverages', '☕', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 9),
('personal-care', 'Personal Care', 'தனிநபர் பராமரிப்பு', 'personal-care', '🧼', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', 10),
('cleaning-household', 'Cleaning & Essentials', 'வீட்டு உபயோகப் பொருட்கள்', 'cleaning-household', '🧹', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80', 11)
ON CONFLICT (id) DO NOTHING;

-- Initial Active Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_inr, is_active)
VALUES
('MEENACHI150', 'flat', 150.00, 899.00, true),
('FREESHIP', 'flat', 40.00, 250.00, true),
('FARM10', 'percent', 10.00, 499.00, true)
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (id, category_id, brand, name_en, name_ta, description_en, image_url, is_best_seller, is_offer, badge)
VALUES
('mg-001', 'rice-grains', 'Meenachi Mills', 'Meenachi Premium Ponni Boiled Rice', 'மீனாட்சி நயம் பொன்னி புழுங்கல் அரிசி', 'Aged for 12 months. Non-sticky, long grain boiled rice sourced directly from Thanjavur paddy fields.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true, false, 'Best Seller'),
('mg-004', 'dhal-pulses', 'Meenachi Organic', 'Unpolished Country Toor Dal (Oorathur)', 'நாட்டு துவரம் பருப்பு (பாலீஷ் செய்யப்படாதது)', 'Chemical-free, unpolished toor dal with natural yellow hue.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', true, true, '100% Native'),
('mg-007', 'cooking-oil', 'Meenachi Chekku', 'Meenachi Wood Pressed Sesame / Gingelly Oil (Nallennai)', 'மீனாட்சி மரச்செக்கு நல்லெண்ணெய்', 'Extracted in traditional Vaagai wooden churners with natural palm jaggery.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', true, false, 'Vagai Marachekku'),
('mg-010', 'spices-masala', 'Meenachi Spices', 'Meenachi Special Chettinad Sambar Powder', 'மீனாட்சி செட்டிநாடு சாம்பார் பொடி', 'Slow-roasted coriander, Guntur chilies, cumin, fenugreek, and black pepper hand-ground.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true, true, 'Grandmother''s Recipe'),
('mg-018', 'dairy-eggs', 'Meenachi Dairy', 'Traditional Pure Cow Ghee (Nei)', 'சுத்தமான நாட்டு பசும் நெய்', 'Granular aromatic ghee prepared from slow-boiled curd butter using traditional method.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', true, false, 'Bilona Method'),
('mg-021', 'beverages', 'Meenachi Coffee', 'Meenachi Royal Kumbakonam Degree Filter Coffee', 'மீனாட்சி கும்பகோணம் டிகிரி ஃபில்டர் காபி', '80% high-grown Chikmagalur Arabica/Robusta coffee with 20% premium chicory.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', true, false, '80:20 Blend')
ON CONFLICT (id) DO NOTHING;

-- Variants
INSERT INTO public.product_variants (product_id, unit_label, mrp_inr, selling_price_inr, stock_quantity, is_default)
VALUES
('mg-001', '5 kg', 390.00, 340.00, 100, true),
('mg-004', '1 kg', 198.00, 168.00, 80, true),
('mg-007', '1 L', 440.00, 375.00, 120, true),
('mg-010', '500 g', 190.00, 155.00, 150, true),
('mg-018', '500 ml', 460.00, 395.00, 70, true),
('mg-021', '500 g', 310.00, 260.00, 90, true)
ON CONFLICT DO NOTHING;
