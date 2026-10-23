/**
 * Meenachi Grocery - Centralized Bilingual Translation System (English & Tamil)
 * Supports dynamic runtime language switching across all UI elements and dynamic content.
 */

const translations = {
  en: {
    // Top bar & Announcement
    announcement: "🌿 Free delivery on orders above ₹499 | Guaranteed Freshness Guaranteed Savings!",
    checkPincode: "Check PIN Code",
    deliverTo: "Deliver to",
    selectLocation: "Select PIN / Area",
    pincodePrompt: "Enter your 6-digit delivery PIN code:",
    serviceable: "Available in your area! ⚡ Delivery in 2 hours",
    unserviceable: "Sorry, we currently deliver only to select PIN codes (e.g., 600001 - 600120, 625001, 641001).",
    
    // Header & Nav
    searchPlaceholder: "Search 5,000+ groceries (e.g., Ponni Rice, Idhayam Oil, Toor Dal)...",
    navHome: "Home",
    navShop: "Shop",
    navCategories: "Categories",
    navOffers: "Offers",
    navFamilyPack: "Family Packs",
    navAbout: "About Us",
    navContact: "Contact",
    account: "Account",
    signIn: "Sign In",
    wishlist: "Wishlist",
    cart: "Cart",
    items: "items",
    
    // Hero
    heroTag: "100% Farm Fresh & Pure Groceries",
    heroHeading: "Good Food. Great Value.",
    heroSubheading: "Wholesome grains, cold-pressed oils, fresh country dhal, and daily essentials delivered straight from South Indian farms to your kitchen doorstep.",
    shopNow: "Shop Now",
    exploreOffers: "Explore Offers",
    badgeFreshness: "100% Quality Checked",
    badgeDelivery: "2-Hour Express Delivery",
    badgeBestPrices: "Direct Mill Pricing",
    
    // Category Section
    categoriesTitle: "Shop by Category",
    categoriesSubtitle: "Handpicked South Indian pantry staples and everyday household necessities",
    viewAllCategories: "View All Categories",
    catRiceGrains: "Rice & Grains",
    catDhalPulses: "Dhal & Pulses",
    catCookingOil: "Cooking Oil",
    catSpicesMasala: "Spices & Masala",
    catVegetables: "Vegetables",
    catFruits: "Fresh Fruits",
    catDairyEggs: "Dairy & Eggs",
    catSnacksBiscuits: "Snacks & Biscuits",
    catBeverages: "Beverages",
    catPersonalCare: "Personal Care",
    catHousehold: "Cleaning & Essentials",
    
    // Sections
    bestsellersTitle: "Popular Best Sellers",
    bestsellersSubtitle: "Our most-loved daily grocery essentials ordered by 10,000+ happy households",
    todaysOffersTitle: "Today's Super Saver Offers",
    todaysOffersSubtitle: "Exclusive limited-time discounts on South Indian staples and grocery packs",
    recentlyAddedTitle: "New Arrivals in Store",
    recentlyAddedSubtitle: "Fresh seasonal harvests and newly added pantry items",
    
    // Product Card
    mrp: "MRP",
    ourPrice: "Price",
    save: "SAVE",
    off: "OFF",
    addToCart: "Add to Cart",
    added: "Added",
    inCart: "In Cart",
    outOfStock: "Out of Stock",
    viewDetails: "View Details",
    weight: "Net Wt",
    
    // Monthly Family Pack
    familyPackTag: "Smart Monthly Saver",
    familyPackTitle: "Meenachi Monthly Family Grocery Pack",
    familyPackDesc: "Everything a South Indian family of 4 needs for an entire month. Curated by expert homemakers: premium ponni rice, authentic cold-pressed oils, native pulses, aromatic hand-ground spices, and essential cleaning supplies at wholesale prices.",
    familyPackItemsCount: "28 Essential Items (approx. 45 kg)",
    familyPackOriginalPrice: "₹4,650",
    familyPackOfferPrice: "₹3,499",
    familyPackSavings: "Save ₹1,151 this month",
    customizePack: "View Pack Details",
    addPackToCart: "Add Pack to Cart",
    
    // Benefits / Why Shop
    whyChooseTitle: "Why South India Trusts Meenachi Grocery",
    whyChooseSubtitle: "Traditional quality standards combined with modern grocery convenience",
    benefit1Title: "Direct Mill & Farm Sourcing",
    benefit1Desc: "We eliminate middlemen. Grains and cold-pressed oils are sourced directly from certified farmer producer organizations and local traditional chekku mills.",
    benefit2Title: "No Adulteration Guarantee",
    benefit2Desc: "Every grain, spice, and oil drop goes through a 24-point quality inspection before packaging. Absolutely unpolished and chemical-free.",
    benefit3Title: "Lightning 2-Hour Delivery",
    benefit3Desc: "Our temperature-controlled micro-fulfilment hubs across city zones ensure your vegetables stay crisp and oils stay fresh.",
    benefit4Title: "Transparent Honest Pricing",
    benefit4Desc: "Direct wholesale prices for retail buyers. Transparent weights, verified scales, and no hidden packaging or convenience fees.",
    
    // Newsletter & Promo
    newsletterTitle: "Get ₹150 Off on Your First Order",
    newsletterSubtitle: "Subscribe for seasonal harvest alerts, regional recipe secrets, and weekly flash discounts.",
    subscribePlaceholder: "Enter your mobile number or email",
    subscribeBtn: "Get Voucher",
    consentText: "By subscribing, you agree to receive promotional updates via WhatsApp / SMS. You can opt out anytime.",
    
    // Reviews
    reviewsTitle: "Loved by Over 50,000+ Homemakers",
    reviewsSubtitle: "Real reviews from genuine families who trust us for their daily cooking",
    
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Got questions? We've got answers.",
    faq1Q: "How are your cold-pressed cooking oils extracted?",
    faq1A: "Our cooking oils (Groundnut, Sesame, and Coconut) are cold-pressed in traditional wooden churners (Vagai Marachekku) at temperatures below 40°C. No heat, no refining chemicals, and zero preservatives.",
    faq2Q: "What are your delivery time slots and charges?",
    faq2A: "We offer 2-hour express delivery and 3 convenient scheduled slots: Morning (7 AM - 10 AM), Afternoon (1 PM - 4 PM), and Evening (6 PM - 9 PM). Delivery is completely FREE for orders above ₹499.",
    faq3Q: "Can I customize the Monthly Family Grocery Pack?",
    faq3A: "Yes! You can swap rice varieties (e.g., Sona Masoori instead of Ponni) or switch oil types right inside the cart before checkout.",
    faq4Q: "What payment options do you support?",
    faq4A: "We support secure UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking via Razorpay, as well as Cash on Delivery (COD) for verified addresses.",
    faq5Q: "What is your return & refund policy if an item is damaged?",
    faq5A: "We have a no-questions-asked instant return policy. Hand it back to our delivery partner at the door or request a refund via WhatsApp within 24 hours.",

    // Footer
    footerAbout: "Meenachi Grocery is your friendly neighbourhood digital supermarket bringing traditional South Indian purity, native pulses, unrefined oils, and daily essentials right to your kitchen.",
    quickLinks: "Quick Links",
    categoriesNav: "Categories",
    customerCare: "Customer Care",
    contactUs: "Contact Us",
    helpline: "Helpline: +91 98765 43210 (8 AM - 9 PM)",
    email: "support@meenachigrocery.com",
    address: "Meenachi Supermarket Hub, 42 South Masi Street, Madurai / Anna Nagar, Chennai, Tamil Nadu 600040",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    deliveryPolicy: "Delivery & Shipping Policy",
    refundPolicy: "Cancellation & Refund Policy",
    copyright: "© 2026 Meenachi Grocery. All rights reserved. Freshness at Your Doorstep.",
    
    // Mobile Bottom Nav
    mobHome: "Home",
    mobCategories: "Categories",
    mobCart: "Cart",
    mobOrders: "Orders",
    mobAccount: "Profile",

    // Cart Drawer
    cartDrawerTitle: "Your Shopping Basket",
    emptyCartTitle: "Your basket is empty",
    emptyCartSubtitle: "Looks like you haven't added anything to your cart yet. Discover fresh spices, oils, and grains now!",
    continueShopping: "Start Shopping",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    free: "FREE",
    totalAmount: "Total Payable",
    checkoutBtn: "Proceed to Checkout",
    viewCart: "View Cart Page",
    itemCountText: "items in basket",
    clearCart: "Clear Basket",

    // Toasts
    itemAddedToast: "added to your basket!",
    itemRemovedToast: "removed from basket",
    pincodeSuccessToast: "PIN Code updated! You qualify for Express Delivery.",
    newsletterToast: "Thank you! Check your inbox/WhatsApp for the ₹150 voucher code."
  },

  ta: {
    // Top bar & Announcement
    announcement: "🌿 ₹499-க்கு மேல் ஆர்டர் செய்தால் இலவச டெலிவரி | 100% தூய்மையான மளிகைப் பொருட்கள்!",
    checkPincode: "பின் கோடு சரிபார்க்கவும்",
    deliverTo: "டெலிவரி இடம்",
    selectLocation: "பின் கோடு தேர்ந்தெடுக்கவும்",
    pincodePrompt: "உங்கள் 6-இலக்க டெலிவரி பின் கோடை உள்ளிடவும்:",
    serviceable: "உங்கள் பகுதியில் சேவை உள்ளது! ⚡ 2 மணி நேரத்தில் டெலிவரி",
    unserviceable: "மன்னிக்கவும், தற்போது தேர்ந்தெடுக்கப்பட்ட பின் கோடுகளில் மட்டுமே சேவை உள்ளது (எ.கா: 600001, 625001, 641001).",
    
    // Header & Nav
    searchPlaceholder: "5,000+ மளிகைப் பொருட்களைத் தேடுங்கள் (பொன்னி அரிசி, நல்லெண்ணெய், துவரம் பருப்பு)...",
    navHome: "முகப்பு",
    navShop: "கடைகள்",
    navCategories: "வகைகள்",
    navOffers: "சலுகைகள்",
    navFamilyPack: "குடும்ப பேக்",
    navAbout: "எங்களைப் பற்றி",
    navContact: "தொடர்புக்கு",
    account: "கணக்கு",
    signIn: "உள்நுழைய",
    wishlist: "விருப்பப்பட்டியல்",
    cart: "கூடை",
    items: "பொருட்கள்",
    
    // Hero
    heroTag: "100% நேரடி பண்ணை மளிகைப் பொருட்கள்",
    heroHeading: "நல் உணவு. நல் சேமிப்பு.",
    heroSubheading: "பாரம்பரிய மரச்செக்கு எண்ணெய்கள், நயம் பொன்னி அரிசி, நாட்டு பருப்பு வகைகள் மற்றும் அன்றாட தேவைகள் அனைத்தும் உங்கள் வீட்டு வாசலில்.",
    shopNow: "இப்போதே வாங்க",
    exploreOffers: "சலுகைகளை காண்க",
    badgeFreshness: "100% தரப் பரிசோதனை",
    badgeDelivery: "2 மணி நேர விரைவு டெலிவரி",
    badgeBestPrices: "நேரடி மில் விலை",
    
    // Category Section
    categoriesTitle: "பிரிவுகள் வாரியாக வாங்க",
    categoriesSubtitle: "நம் பாரம்பரிய தென் இந்திய சமையலறைக்குத் தேவையான அத்தியாவசியப் பொருட்கள்",
    viewAllCategories: "அனைத்து பிரிவுகளும்",
    catRiceGrains: "அரிசி & தானியங்கள்",
    catDhalPulses: "பருப்பு வகைகள்",
    catCookingOil: "சமையல் எண்ணெய்",
    catSpicesMasala: "மசாலா & பொடிகள்",
    catVegetables: "காய்கறிகள்",
    catFruits: "பழங்கள்",
    catDairyEggs: "பால் & முட்டை",
    catSnacksBiscuits: "சிற்றுண்டிகள்",
    catBeverages: "பானங்கள் & காபி",
    catPersonalCare: "தனிநபர் பராமரிப்பு",
    catHousehold: "வீட்டு உபயோகப் பொருட்கள்",
    
    // Sections
    bestsellersTitle: "அதிகம் வாங்கியவை",
    bestsellersSubtitle: "10,000+ குடும்பங்கள் தினமும் விரும்பி வாங்கும் அத்தியாவசிய பொருட்கள்",
    todaysOffersTitle: "இன்றைய சிறப்புச் சலுகைகள்",
    todaysOffersSubtitle: "மளிகைப் பொருட்களுக்கு குறைந்த நேர சிறப்பு தள்ளுபடிகள்",
    recentlyAddedTitle: "புதிய வரவுகள்",
    recentlyAddedSubtitle: "புதிய அறுவடை தானியங்கள் மற்றும் பிரத்யேக மளிகைப் பொருட்கள்",
    
    // Product Card
    mrp: "அச்சிட்ட விலை",
    ourPrice: "நமது விலை",
    save: "சேமிப்பு",
    off: "தள்ளுபடி",
    addToCart: "கூடையில் சேர்க்க",
    added: "சேர்க்கப்பட்டது",
    inCart: "கூடையில் உள்ளது",
    outOfStock: "இருப்பு இல்லை",
    viewDetails: "விவரங்களை பார்க்க",
    weight: "எடை",
    
    // Monthly Family Pack
    familyPackTag: "மாதாந்திர சேமிப்பு பேக்",
    familyPackTitle: "மீனாட்சி மாதாந்திர குடும்ப மளிகை பேக்",
    familyPackDesc: "ஒரு குடும்பத்திற்கு 1 மாதத்திற்கு தேவையான அனைத்து மளிகைப் பொருட்களும் ஒரே தொகுப்பில்! 25 கிலோ பொன்னி அரிசி, நாட்டு செக்கு எண்ணெய்கள், கைக்குத்தல் பருப்பு, அத்தியாவசிய மசாலாக்கள் மொத்த விலையில்.",
    familyPackItemsCount: "28 அத்தியாவசிய பொருட்கள் (சுமார் 45 கிலோ)",
    familyPackOriginalPrice: "₹4,650",
    familyPackOfferPrice: "₹3,499",
    familyPackSavings: "இந்த மாதம் ₹1,151 மிச்சம்",
    customizePack: "பொருட்கள் பட்டியல்",
    addPackToCart: "பேக்கை கூடையில் சேர்க்க",
    
    // Benefits / Why Shop
    whyChooseTitle: "மீனாட்சி மளிகையை ஏன் தேர்ந்தெடுக்க வேண்டும்?",
    whyChooseSubtitle: "பாரம்பரியத் தூய்மையும் நவீன சேவையும் ஒருங்கே இணைந்த நம்பகமான அங்காடி",
    benefit1Title: "நேரடி மில் மற்றும் உழவர் கொள்முதல்",
    benefit1Desc: "இடைத்தரகர்கள் இன்றி, உழவர் உற்பத்தியாளர் நிறுவனங்களிடமிருந்தும் பாரம்பரிய மரச்செக்குகளிலிருந்தும் நேரடியாகக் கொள்முதல் செய்யப்படுகிறது.",
    benefit2Title: "கலப்படமற்ற தூய்மை உத்தரவாதம்",
    benefit2Desc: "ஒவ்வொரு தானியமும் 24-கட்ட தரப் பரிசோதனைக்குப் பிறகே பேக் செய்யப்படுகிறது. பாலிஷ் செய்யப்படாத இயற்கை சத்துக்கள்.",
    benefit3Title: "2 மணி நேர விரைவு டெலிவரி",
    benefit3Desc: "நகரெங்கும் அமைக்கப்பட்ட பாதுகாப்பான சேமிப்புக் கிடங்குகள் மூலம் உங்கள் வீட்டு வாசலுக்கு உடனுக்குடன் கொண்டு சேர்க்கிறோம்.",
    benefit4Title: "நேர்மையான நியாய விலை",
    benefit4Desc: "சில்லறை வாடிக்கையாளர்களுக்கும் மொத்த விற்பனை விலை. மறைமுக கட்டணங்கள் எதுவுமில்லை.",
    
    // Newsletter & Promo
    newsletterTitle: "முதல் ஆர்டருக்கு ₹150 தள்ளுபடி பெறுங்கள்",
    newsletterSubtitle: "எங்கள் சிறப்புச் சலுகைகள் மற்றும் புதிய அறுவடை தகவல்களை வாட்ஸ்அப்பில் பெற பதிவு செய்யுங்கள்.",
    subscribePlaceholder: "உங்கள் மொபைல் எண் அல்லது மின்னஞ்சல்",
    subscribeBtn: "கூப்பன் பெறுக",
    consentText: "பதிவு செய்வதன் மூலம் நீங்கள் வாட்ஸ்அப் / எஸ்எம்எஸ் வழியாக அறிவிப்புகளைப் பெற ஒப்புக்கொள்கிறீர்கள்.",
    
    // Reviews
    reviewsTitle: "50,000+ இல்லத்தரசிகளின் பேராதரவு",
    reviewsSubtitle: "தினசரி சமையலுக்கு எங்களை நம்பும் உண்மை வாடிக்கையாளர்களின் அனுபவங்கள்",
    
    // FAQ
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqSubtitle: "உங்கள் சந்தேகங்களுக்கான தெளிவான விளக்கங்கள்",
    faq1Q: "உங்கள் மரச்செக்கு எண்ணெய்கள் எவ்வாறு தயாரிக்கப்படுகின்றன?",
    faq1A: "பாரம்பரிய வாகை மரச்செக்குகளில் 40°C-க்கு குறைவான வெப்பநிலையில் இயற்கை முறையில் ஆட்டப்படுகிறது. எவ்வித ரசாயனங்களும் சேர்க்கப்படுவதில்லை.",
    faq2Q: "டெலிவரி நேரங்கள் மற்றும் கட்டணங்கள் என்ன?",
    faq2A: "காலை (7 - 10), மதியம் (1 - 4), மாலை (6 - 9) ஆகிய நேரங்களில் டெலிவரி பெறலாம். ₹499-க்கு மேல் ஆர்டர் செய்தால் இலவச டெலிவரி.",
    faq3Q: "மாதாந்திர பேக்கிலுள்ள பொருட்களை மாற்ற முடியுமா?",
    faq3A: "நிச்சயமாக! உங்கள் விருப்பத்திற்கேற்ப பொன்னி அரிசிக்கு பதில் சோனா மசூரி அல்லது எண்ணெய் வகைகளை மாற்றிக்கொள்ளலாம்.",
    faq4Q: "என்னென்ன பணப் பரிவர்த்தனை முறைகள் உள்ளன?",
    faq4A: "கூகிள் பே, போன்பே, பேடிஎம் (UPI), கார்டுகள், நெட் பேங்கிங் மற்றும் பொருள் வந்தவுடன் பணம் செலுத்தும் (COD) வசதி உண்டு.",
    faq5Q: "பொருட்கள் சேதமடைந்தால் திருப்பித் தரும் வசதி உள்ளதா?",
    faq5A: "ஆம், எந்த நிபந்தனையுமின்றி டெலிவரி செய்யும் போதே திருப்பித் தரலாம் அல்லது 24 மணி நேரத்திற்குள் வாட்ஸ்அப்பில் தெரிவிக்கலாம்.",

    // Footer
    footerAbout: "மீனாட்சி மளிகை - தூய பாரம்பரிய நவதானியங்கள், செக்கு எண்ணெய்கள் மற்றும் அன்றாட உணவுப் பொருட்களை உங்கள் வீட்டு வாசலுக்குக் கொண்டு சேர்க்கும் நம்பகமான அங்காடி.",
    quickLinks: "முக்கிய இணைப்புகள்",
    categoriesNav: "பிரிவுகள்",
    customerCare: "வாடிக்கையாளர் சேவை",
    contactUs: "தொடர்பு கொள்ள",
    helpline: "உதவி எண்: +91 98765 43210 (காலை 8 முதல் இரவு 9)",
    email: "support@meenachigrocery.com",
    address: "மீனாட்சி சூப்பர் மார்க்கெட், 42 தெற்கு மாசி வீதி, மதுரை / அண்ணா நகர், சென்னை, தமிழ்நாடு 600040",
    terms: "விதிமுறைகள்",
    privacy: "தனியுரிமைக் கொள்கை",
    deliveryPolicy: "டெலிவரி கொள்கை",
    refundPolicy: "திரும்பப் பெறுதல் & பணம் திரும்பப் பெறுதல் கொள்கை",
    copyright: "© 2026 மீனாட்சி மளிகை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    
    // Mobile Bottom Nav
    mobHome: "முகப்பு",
    mobCategories: "பிரிவுகள்",
    mobCart: "கூடை",
    mobOrders: "ஆர்டர்கள்",
    mobAccount: "கணக்கு",

    // Cart Drawer
    cartDrawerTitle: "உங்கள் கூடை",
    emptyCartTitle: "கூடை காலியாக உள்ளது",
    emptyCartSubtitle: "நீங்கள் இன்னும் பொருட்கள் எதையும் சேர்க்கவில்லை. உயர்தர மளிகைப் பொருட்களைப் பாருங்கள்!",
    continueShopping: "ஷாப்பிங் செய்ய",
    subtotal: "மொத்தத் தொகை",
    deliveryFee: "டெலிவரி கட்டணம்",
    free: "இலவசம்",
    totalAmount: "செலுத்த வேண்டிய தொகை",
    checkoutBtn: "செக்அவுட் செய்க",
    viewCart: "கூடைப் பக்கத்திற்குச் செல்க",
    itemCountText: "பொருட்கள் கூடையில் உள்ளன",
    clearCart: "கூடையை காலிசெய்",

    // Toasts
    itemAddedToast: "கூடையில் சேர்க்கப்பட்டது!",
    itemRemovedToast: "கூடையிலிருந்து நீக்கப்பட்டது",
    pincodeSuccessToast: "பின் கோடு உறுதிசெய்யப்பட்டது! விரைவு டெலிவரி உண்டு.",
    newsletterToast: "நன்றி! உங்கள் வாட்ஸ்அப் / மின்னஞ்சலில் ₹150 கூப்பன் அனுப்பப்பட்டுள்ளது."
  }
};

class TranslationManager {
  constructor() {
    this.currentLang = localStorage.getItem("meenachi_lang") || "en";
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("meenachi_lang", lang);
      this.applyTranslations();
      document.documentElement.lang = lang;
      // Trigger event for dynamic components
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    }
  }

  t(key) {
    return translations[this.currentLang]?.[key] || translations["en"]?.[key] || key;
  }

  applyTranslations() {
    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = this.t(key);
      if (text) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Translate attributes like placeholder if marked with data-i18n-placeholder
    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    placeholders.forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = this.t(key);
      if (text) el.placeholder = text;
    });

    // Update active state in language toggles
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });
  }
}

const i18n = new TranslationManager();
window.i18n = i18n;
