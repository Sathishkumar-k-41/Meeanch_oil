/**
 * Meenachi Grocery - Realistic Product Catalog Dataset & Helper Utilities
 * Contains 28 realistic South Indian and daily grocery products across 11 categories.
 * Equipped with responsive images, safe fallbacks, pack-size variants, MRP, and selling prices.
 */

const categories = [
  {
    id: "rice-grains",
    nameEn: "Rice & Grains",
    nameTa: "அரிசி & தானியங்கள்",
    icon: "🌾",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    itemCount: 42
  },
  {
    id: "dhal-pulses",
    nameEn: "Dhal & Pulses",
    nameTa: "பருப்பு வகைகள்",
    icon: "🥣",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    itemCount: 35
  },
  {
    id: "cooking-oil",
    nameEn: "Cooking Oil",
    nameTa: "சமையல் எண்ணெய்",
    icon: "🫒",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    itemCount: 22
  },
  {
    id: "spices-masala",
    nameEn: "Spices & Masala",
    nameTa: "மசாலா & பொடிகள்",
    icon: "🌶️",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    itemCount: 56
  },
  {
    id: "vegetables",
    nameEn: "Vegetables",
    nameTa: "காய்கறிகள்",
    icon: "🥦",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    itemCount: 48
  },
  {
    id: "fruits",
    nameEn: "Fresh Fruits",
    nameTa: "பழங்கள்",
    icon: "🍎",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
    itemCount: 30
  },
  {
    id: "dairy-eggs",
    nameEn: "Dairy & Eggs",
    nameTa: "பால் & முட்டை",
    icon: "🥛",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    itemCount: 26
  },
  {
    id: "snacks-biscuits",
    nameEn: "Snacks & Biscuits",
    nameTa: "சிற்றுண்டிகள்",
    icon: "🥨",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281080?auto=format&fit=crop&w=600&q=80",
    itemCount: 40
  },
  {
    id: "beverages",
    nameEn: "Beverages",
    nameTa: "பானங்கள் & காபி",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    itemCount: 28
  },
  {
    id: "personal-care",
    nameEn: "Personal Care",
    nameTa: "தனிநபர் பராமரிப்பு",
    icon: "🧼",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    itemCount: 34
  },
  {
    id: "cleaning-household",
    nameEn: "Cleaning & Essentials",
    nameTa: "வீட்டு உபயோகப் பொருட்கள்",
    icon: "🧹",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    itemCount: 38
  }
];

// Fallback SVG data URI in case remote CDN fails
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%23F3EFE6%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%2319583B%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2248%25%22%20text-anchor%3D%22middle%22%3EMeenachi%20Grocery%3C%2Ftext%3E%3Ctext%20fill%3D%22%23E99A38%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%3E100%25%20Farm%20Fresh%20Purity%3C%2Ftext%3E%3C%2Fsvg%3E";

const sampleProducts = [
  // 1. Rice & Grains
  {
    id: "mg-001",
    nameEn: "Meenachi Premium Ponni Boiled Rice",
    nameTa: "மீனாட்சி நயம் பொன்னி புழுங்கல் அரிசி",
    category: "rice-grains",
    brand: "Meenachi Mills",
    variants: [
      { unit: "5 kg", price: 340, mrp: 390 },
      { unit: "10 kg", price: 660, mrp: 750 },
      { unit: "25 kg", price: 1580, mrp: 1820 }
    ],
    defaultVariantIndex: 0,
    price: 340,
    mrp: 390,
    unit: "5 kg",
    discount: "13% OFF",
    rating: 4.8,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    badge: "Best Seller",
    inStock: true,
    stockCount: 85,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "Aged for 12 months. Non-sticky, long grain boiled rice sourced directly from Thanjavur paddy fields. Perfect for daily family lunch and idli-dosa."
  },
  {
    id: "mg-002",
    nameEn: "Royal Sona Masoori Raw Rice (Aged)",
    nameTa: "ராயல் சோனா மசூரி பச்சரிசி",
    category: "rice-grains",
    brand: "Royal Harvest",
    variants: [
      { unit: "1 kg", price: 72, mrp: 85 },
      { unit: "5 kg", price: 335, mrp: 395 },
      { unit: "25 kg", price: 1550, mrp: 1850 }
    ],
    defaultVariantIndex: 1,
    price: 335,
    mrp: 395,
    unit: "5 kg",
    discount: "15% OFF",
    rating: 4.7,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    inStock: true,
    stockCount: 45,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Delicate, aromatic medium-grain raw rice. Light on digestion and ideal for South Indian sambar sadam and rasam sadam."
  },
  {
    id: "mg-003",
    nameEn: "Meenachi Traditional Idli Rice",
    nameTa: "மீனாட்சி பாரம்பரிய இட்லி அரிசி",
    category: "rice-grains",
    brand: "Meenachi Mills",
    variants: [
      { unit: "1 kg", price: 46, mrp: 55 },
      { unit: "5 kg", price: 215, mrp: 260 }
    ],
    defaultVariantIndex: 1,
    price: 215,
    mrp: 260,
    unit: "5 kg",
    discount: "17% OFF",
    rating: 4.9,
    reviewsCount: 512,
    image: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=600&q=80",
    badge: "Customer Favorite",
    inStock: true,
    stockCount: 110,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "Specially selected plump round grains that give feather-soft, fluffy jasmine-white idlis and golden crispy dosas every single morning."
  },

  // 2. Dhal & Pulses
  {
    id: "mg-004",
    nameEn: "Unpolished Country Toor Dal (Oorathur)",
    nameTa: "நாட்டு துவரம் பருப்பு (பாலீஷ் செய்யப்படாதது)",
    category: "dhal-pulses",
    brand: "Meenachi Organic",
    variants: [
      { unit: "500 g", price: 89, mrp: 105 },
      { unit: "1 kg", price: 168, mrp: 198 }
    ],
    defaultVariantIndex: 1,
    price: 168,
    mrp: 198,
    unit: "1 kg",
    discount: "15% OFF",
    rating: 4.8,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    badge: "100% Native",
    inStock: true,
    stockCount: 65,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Chemical-free, unpolished toor dal with natural yellow hue. Melts effortlessly into aromatic South Indian sambar with rich natural protein."
  },
  {
    id: "mg-005",
    nameEn: "Organic Urad Dal (Ulundhu Gundu)",
    nameTa: "நாட்டு வெள்ளை உளுந்து உருண்டை",
    category: "dhal-pulses",
    brand: "Meenachi Organic",
    variants: [
      { unit: "500 g", price: 78, mrp: 92 },
      { unit: "1 kg", price: 148, mrp: 175 }
    ],
    defaultVariantIndex: 1,
    price: 148,
    mrp: 175,
    unit: "1 kg",
    discount: "15% OFF",
    rating: 4.9,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1585994192701-49b80892a013?auto=format&fit=crop&w=600&q=80",
    badge: "High Yield",
    inStock: true,
    stockCount: 50,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "High batter-volume white whole urad dal. Grinds easily into smooth, airy batter for crunchy medu vadas and fluffy idlis."
  },
  {
    id: "mg-006",
    nameEn: "Yellow Moong Dal (Paasi Paruppu)",
    nameTa: "பாசிப் பருப்பு (நயம்)",
    category: "dhal-pulses",
    brand: "Meenachi Organics",
    variants: [
      { unit: "500 g", price: 68, mrp: 80 },
      { unit: "1 kg", price: 129, mrp: 155 }
    ],
    defaultVariantIndex: 1,
    price: 129,
    mrp: 155,
    unit: "1 kg",
    discount: "17% OFF",
    rating: 4.7,
    reviewsCount: 165,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    badge: "Fresh Stock",
    inStock: true,
    stockCount: 70,
    isBestSeller: false,
    isOffer: true,
    isNew: false,
    description: "Cleaned and sorted sweet moong dal. Essential for ven pongal, sweet payasam, and comforting dal tadka."
  },

  // 3. Cooking Oil
  {
    id: "mg-007",
    nameEn: "Meenachi Wood Pressed Sesame / Gingelly Oil (Nallennai)",
    nameTa: "மீனாட்சி மரச்செக்கு நல்லெண்ணெய்",
    category: "cooking-oil",
    brand: "Meenachi Chekku",
    variants: [
      { unit: "500 ml", price: 195, mrp: 230 },
      { unit: "1 L", price: 375, mrp: 440 },
      { unit: "5 L", price: 1790, mrp: 2100 }
    ],
    defaultVariantIndex: 1,
    price: 375,
    mrp: 440,
    unit: "1 L",
    discount: "15% OFF",
    rating: 4.95,
    reviewsCount: 680,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    badge: "Vagai Marachekku",
    inStock: true,
    stockCount: 120,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "Extracted in traditional Vaagai wooden churners with natural palm jaggery. Rich nutty aroma, natural antioxidants, and ideal for idli podi and vatha kuzhambu."
  },
  {
    id: "mg-008",
    nameEn: "Cold Pressed Pure Groundnut Oil (Kadala Ennai)",
    nameTa: "மரச்செக்கு சுத்தமான கடலை எண்ணெய்",
    category: "cooking-oil",
    brand: "Meenachi Chekku",
    variants: [
      { unit: "1 L", price: 215, mrp: 260 },
      { unit: "5 L", price: 1025, mrp: 1250 }
    ],
    defaultVariantIndex: 0,
    price: 215,
    mrp: 260,
    unit: "1 L",
    discount: "17% OFF",
    rating: 4.8,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    badge: "100% Unrefined",
    inStock: true,
    stockCount: 90,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Traditional cold-pressed peanut oil with high smoke point and genuine nutty flavour. Unbleached, unrefined, zero trans fat."
  },
  {
    id: "mg-009",
    nameEn: "Virgin Coconut Oil (Thengai Ennai)",
    nameTa: "பாரம்பரிய சுத்தமான தேங்காய் எண்ணெய்",
    category: "cooking-oil",
    brand: "Meenachi Chekku",
    variants: [
      { unit: "500 ml", price: 155, mrp: 185 },
      { unit: "1 L", price: 295, mrp: 350 }
    ],
    defaultVariantIndex: 1,
    price: 295,
    mrp: 350,
    unit: "1 L",
    discount: "16% OFF",
    rating: 4.9,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=80",
    badge: "Cold Pressed",
    inStock: true,
    stockCount: 40,
    isBestSeller: false,
    isOffer: false,
    isNew: true,
    description: "Made from sun-dried Pollachi copra coconuts. Perfect for Kerala avial, coastal fish curries, and natural hair nourishment."
  },

  // 4. Spices & Masala
  {
    id: "mg-010",
    nameEn: "Meenachi Special Chettinad Sambar Powder",
    nameTa: "மீனாட்சி செட்டிநாடு சாம்பார் பொடி",
    category: "spices-masala",
    brand: "Meenachi Spices",
    variants: [
      { unit: "200 g", price: 65, mrp: 80 },
      { unit: "500 g", price: 155, mrp: 190 }
    ],
    defaultVariantIndex: 1,
    price: 155,
    mrp: 190,
    unit: "500 g",
    discount: "18% OFF",
    rating: 4.9,
    reviewsCount: 415,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    badge: "Grandmother's Recipe",
    inStock: true,
    stockCount: 150,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Slow-roasted coriander, Guntur chilies, cumin, fenugreek, and black pepper hand-ground according to authentic Karaikudi household traditions."
  },
  {
    id: "mg-011",
    nameEn: "Salem Pure Turmeric Powder (Viral Manjal)",
    nameTa: "சேலம் சுத்தமான விரலி மஞ்சள் தூள்",
    category: "spices-masala",
    brand: "Meenachi Spices",
    variants: [
      { unit: "250 g", price: 58, mrp: 75 },
      { unit: "500 g", price: 110, mrp: 140 }
    ],
    defaultVariantIndex: 1,
    price: 110,
    mrp: 140,
    unit: "500 g",
    discount: "21% OFF",
    rating: 4.85,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    badge: "High Curcumin",
    inStock: true,
    stockCount: 80,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Golden Salem turmeric with >4.5% natural curcumin content. Free from lead chromate, chalk, and artificial food coloring."
  },
  {
    id: "mg-012",
    nameEn: "Guntur Dry Red Chilli (Stemless)",
    nameTa: "குண்டூர் காய்ந்த மிளகாய் (காம்பு நீக்கியது)",
    category: "spices-masala",
    brand: "Meenachi Spices",
    variants: [
      { unit: "250 g", price: 75, mrp: 90 },
      { unit: "500 g", price: 145, mrp: 175 }
    ],
    defaultVariantIndex: 1,
    price: 145,
    mrp: 175,
    unit: "500 g",
    discount: "17% OFF",
    rating: 4.75,
    reviewsCount: 180,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    badge: "Fiery Taste",
    inStock: true,
    stockCount: 60,
    isBestSeller: false,
    isOffer: false,
    isNew: true,
    description: "Crisp sun-dried Guntur chilies that give rich red color and balanced pungency to everyday curries and chutneys."
  },

  // 5. Fresh Farm Vegetables
  {
    id: "mg-013",
    nameEn: "Country Tomatoes (Naatu Thakkali)",
    nameTa: "நாட்டுத் தக்காளி",
    category: "vegetables",
    brand: "Farm Direct",
    variants: [
      { unit: "1 kg", price: 34, mrp: 45 },
      { unit: "2 kg", price: 65, mrp: 90 }
    ],
    defaultVariantIndex: 0,
    price: 34,
    mrp: 45,
    unit: "1 kg",
    discount: "24% OFF",
    rating: 4.6,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    badge: "Harvested Today",
    inStock: true,
    stockCount: 200,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Tangy country tomatoes picked early morning from Dindigul and Krishnagiri farms. Natural juicy goodness for curries and rasam."
  },
  {
    id: "mg-014",
    nameEn: "Small Shallots / Sambar Onion (Chinna Vengayam)",
    nameTa: "சின்ன வெங்காயம் (நாட்டு நயம்)",
    category: "vegetables",
    brand: "Farm Direct",
    variants: [
      { unit: "500 g", price: 42, mrp: 55 },
      { unit: "1 kg", price: 79, mrp: 105 }
    ],
    defaultVariantIndex: 1,
    price: 79,
    mrp: 105,
    unit: "1 kg",
    discount: "25% OFF",
    rating: 4.85,
    reviewsCount: 390,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
    badge: "Pungent & Sweet",
    inStock: true,
    stockCount: 95,
    isBestSeller: true,
    isOffer: true,
    isNew: false,
    description: "Essential for authentic Tamil Nadu sambar, kara kuzhambu, and egg omelettes. Hand-cleaned and sorted for maximum shelf life."
  },

  // 6. Fruits
  {
    id: "mg-015",
    nameEn: "Robusta Banana (Ripe Cavendish)",
    nameTa: "வாழைப்பழம் (ரொபஸ்டா)",
    category: "fruits",
    brand: "Farm Direct",
    variants: [
      { unit: "1 kg (approx 6-8 pcs)", price: 48, mrp: 60 }
    ],
    defaultVariantIndex: 0,
    price: 48,
    mrp: 60,
    unit: "1 kg",
    discount: "20% OFF",
    rating: 4.7,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    badge: "Naturally Ripened",
    inStock: true,
    stockCount: 75,
    isBestSeller: false,
    isOffer: true,
    isNew: false,
    description: "Naturally ripened without carbide chemicals. Sweet, energy-packed fruit for breakfasts and healthy smoothies."
  },
  {
    id: "mg-016",
    nameEn: "Fresh Pomegranate (Maadhulai)",
    nameTa: "நாட்டு மாதுளம் பழம்",
    category: "fruits",
    brand: "Farm Direct",
    variants: [
      { unit: "1 kg", price: 165, mrp: 210 }
    ],
    defaultVariantIndex: 0,
    price: 165,
    mrp: 210,
    unit: "1 kg",
    discount: "21% OFF",
    rating: 4.8,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    badge: "Antioxidant Rich",
    inStock: true,
    stockCount: 35,
    isBestSeller: false,
    isOffer: true,
    isNew: false,
    description: "Ruby red pearls packed with iron and antioxidants. Crisp, sweet seeds picked from premium orchards."
  },

  // 7. Dairy & Eggs
  {
    id: "mg-017",
    nameEn: "Fresh Country Eggs (Naatu Kozhi Muttai)",
    nameTa: "நாட்டுக்கோழி முட்டை (பண்ணை ஃப்ரெஷ்)",
    category: "dairy-eggs",
    brand: "Poultry Direct",
    variants: [
      { unit: "6 pcs", price: 65, mrp: 75 },
      { unit: "12 pcs", price: 125, mrp: 150 }
    ],
    defaultVariantIndex: 1,
    price: 125,
    mrp: 150,
    unit: "12 pcs",
    discount: "17% OFF",
    rating: 4.9,
    reviewsCount: 480,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
    badge: "Free Range",
    inStock: true,
    stockCount: 80,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "Antibiotic-free country eggs from pasture-raised hens fed natural grains. Rich yellow yolk with natural protein goodness."
  },
  {
    id: "mg-018",
    nameEn: "Traditional Pure Cow Ghee (Nei)",
    nameTa: "சுத்தமான நாட்டு பசும் நெய்",
    category: "dairy-eggs",
    brand: "Meenachi Dairy",
    variants: [
      { unit: "200 ml", price: 175, mrp: 210 },
      { unit: "500 ml", price: 395, mrp: 460 },
      { unit: "1 L", price: 760, mrp: 890 }
    ],
    defaultVariantIndex: 1,
    price: 395,
    mrp: 460,
    unit: "500 ml",
    discount: "14% OFF",
    rating: 4.95,
    reviewsCount: 630,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    badge: "Bilona Method",
    inStock: true,
    stockCount: 70,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "Granular aromatic ghee prepared from slow-boiled curd butter using traditional method. Heavenly aroma for hot rice, dosa, and sweets."
  },

  // 8. Snacks & Biscuits
  {
    id: "mg-019",
    nameEn: "Madurai Special Butter Murukku",
    nameTa: "மதுரை ஸ்பெஷல் வெண்ணெய் முறுக்கு",
    category: "snacks-biscuits",
    brand: "Meenachi Delights",
    variants: [
      { unit: "200 g", price: 55, mrp: 65 },
      { unit: "400 g", price: 105, mrp: 125 }
    ],
    defaultVariantIndex: 1,
    price: 105,
    mrp: 125,
    unit: "400 g",
    discount: "16% OFF",
    rating: 4.85,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281080?auto=format&fit=crop&w=600&q=80",
    badge: "Melt-in-Mouth",
    inStock: true,
    stockCount: 65,
    isBestSeller: false,
    isOffer: true,
    isNew: true,
    description: "Crunchy, melt-in-mouth traditional butter murukku made with fresh rice flour, pure butter, and roasted cumin seeds."
  },
  {
    id: "mg-020",
    nameEn: "South Indian Kara Mixture",
    nameTa: "தென்னிந்திய கார மிக்சர்",
    category: "snacks-biscuits",
    brand: "Meenachi Delights",
    variants: [
      { unit: "250 g", price: 65, mrp: 75 },
      { unit: "500 g", price: 120, mrp: 145 }
    ],
    defaultVariantIndex: 1,
    price: 120,
    mrp: 145,
    unit: "500 g",
    discount: "17% OFF",
    rating: 4.75,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80",
    badge: "Tea-Time Classic",
    inStock: true,
    stockCount: 45,
    isBestSeller: false,
    isOffer: false,
    isNew: false,
    description: "Crispy mixture loaded with roasted peanuts, curry leaves, fried gram, and mild garlic seasoning. Perfect companion for evening filter coffee."
  },

  // 9. Beverages
  {
    id: "mg-021",
    nameEn: "Meenachi Royal Kumbakonam Degree Filter Coffee",
    nameTa: "மீனாட்சி கும்பகோணம் டிகிரி ஃபில்டர் காபி",
    category: "beverages",
    brand: "Meenachi Coffee",
    variants: [
      { unit: "200 g", price: 110, mrp: 130 },
      { unit: "500 g", price: 260, mrp: 310 }
    ],
    defaultVariantIndex: 1,
    price: 260,
    mrp: 310,
    unit: "500 g",
    discount: "16% OFF",
    rating: 4.95,
    reviewsCount: 740,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    badge: "80:20 Blend",
    inStock: true,
    stockCount: 130,
    isBestSeller: true,
    isOffer: false,
    isNew: false,
    description: "80% high-grown Chikmagalur Arabica/Robusta coffee with 20% premium roasted chicory. Rich decoction with irresistible thick froth."
  },
  {
    id: "mg-022",
    nameEn: "Nilgiri Special Dust Tea (Strong Blend)",
    nameTa: "நீலகிரி ஸ்பெஷல் டஸ்ட் டீ",
    category: "beverages",
    brand: "Meenachi Tea",
    variants: [
      { unit: "250 g", price: 85, mrp: 100 },
      { unit: "500 g", price: 165, mrp: 195 }
    ],
    defaultVariantIndex: 1,
    price: 165,
    mrp: 195,
    unit: "500 g",
    discount: "15% OFF",
    rating: 4.7,
    reviewsCount: 180,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    badge: "Strong Taste",
    inStock: true,
    stockCount: 55,
    isBestSeller: false,
    isOffer: true,
    isNew: false,
    description: "Deep liquor, brisk aroma, and energizing strength straight from the misty hills of the Nilgiris."
  },

  // 10. Personal Care
  {
    id: "mg-023",
    nameEn: "Traditional Herbal Bath Powder (Nalangu Maavu)",
    nameTa: "பாரம்பரிய மூலிகை நலங்கு மாவு",
    category: "personal-care",
    brand: "Meenachi Naturals",
    variants: [
      { unit: "200 g", price: 95, mrp: 120 },
      { unit: "500 g", price: 220, mrp: 275 }
    ],
    defaultVariantIndex: 1,
    price: 220,
    mrp: 275,
    unit: "500 g",
    discount: "20% OFF",
    rating: 4.88,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    badge: "18 Herbs",
    inStock: true,
    stockCount: 40,
    isBestSeller: false,
    isOffer: true,
    isNew: true,
    description: "Ayurvedic blend of Kasturi Manjal, rose petals, poolankilangu, vetiver, and green gram. Leaves skin radiant and glowing naturally."
  },

  // 11. Cleaning & Essentials
  {
    id: "mg-024",
    nameEn: "Natural Bio-Enzyme Floor Cleaner (Citrus & Neem)",
    nameTa: "இயற்கை வேம்பு தரை துடைக்கும் திரவம்",
    category: "cleaning-household",
    brand: "Meenachi Clean",
    variants: [
      { unit: "1 L", price: 145, mrp: 180 },
      { unit: "5 L", price: 620, mrp: 780 }
    ],
    defaultVariantIndex: 0,
    price: 145,
    mrp: 180,
    unit: "1 L",
    discount: "19% OFF",
    rating: 4.75,
    reviewsCount: 155,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    badge: "Pet & Kid Safe",
    inStock: true,
    stockCount: 60,
    isBestSeller: false,
    isOffer: true,
    isNew: false,
    description: "Chemical-free floor cleaner infused with organic neem oil and lemon extract. Repels insects while leaving a calming natural aroma."
  }
];

// Helper functions for catalogue operations
function formatINR(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function getProductById(id) {
  return sampleProducts.find((p) => p.id === id);
}

function getBestSellers() {
  return sampleProducts.filter((p) => p.isBestSeller);
}

function getOffers() {
  return sampleProducts.filter((p) => p.isOffer);
}

function getRecentlyAdded() {
  return sampleProducts.filter((p) => p.isNew || p.id === "mg-009" || p.id === "mg-012" || p.id === "mg-019" || p.id === "mg-023");
}

function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return sampleProducts;
  return sampleProducts.filter((p) => p.category === categoryId);
}

// Make globally available
window.groceryCatalog = {
  categories,
  products: sampleProducts,
  formatINR,
  getProductById,
  getBestSellers,
  getOffers,
  getRecentlyAdded,
  getProductsByCategory,
  FALLBACK_IMAGE
};
