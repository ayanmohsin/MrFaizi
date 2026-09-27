export interface MenuItem {
  name: string;
  price: string;
  description?: string;
  badge?: string;
  isPopular?: boolean;
}

export interface ProductGroup {
  id: string;
  name: string;
  category: string;
  tagline: string;
  secondaryTagline?: string;
  accentColor: string;
  gradient: string;
  bgAtmosphere: string;
  badge: string;
  image: string; // Primary image
  images?: string[]; // Multiple images per group (2-4 images)
  imageAlt: string;
  items: MenuItem[];
  highlights: string[];
  preparationTime?: string;
  servingNote?: string;
  isVisible?: boolean;
}

export interface RestaurantInfo {
  brandName: string;
  subtitle: string;
  deliveryNumber: string;
  tagline: string;
  logoUrl?: string; // Optional custom logo image uploaded by user
  urduNote?: string;
  englishNote?: string;
}

export const RESTAURANT_INFO: RestaurantInfo = {
  brandName: "MR FAIZI",
  subtitle: "Fast Food, BBQ & Gourmet Kitchen",
  deliveryNumber: "0322-7816809",
  tagline: "Taste That Keeps You Coming Back",
  urduNote: "نوٹ: رائیدڑ سے بل لازمی لیں اور کھلے پیسے خود دیں۔ بصورت اس کے ذمہ دار ہم نہیں ہونگے۔",
  englishNote: "Please collect receipt from delivery rider and settle exact cash upon delivery.",
};

export const MENU_GROUPS: ProductGroup[] = [
  {
    id: "broast",
    name: "CRISPY BROAST",
    category: "Signature Fried Chicken",
    tagline: "Golden Crisp on the Outside, Juicy & Tender on the Inside",
    secondaryTagline: "Deep pressure-fried in pure vegetable oil with our secret 12-spice marinade",
    accentColor: "from-amber-500 via-orange-500 to-red-600",
    gradient: "from-amber-500/20 via-orange-950/40 to-black/90",
    bgAtmosphere: "radial-gradient(ellipse at 80% 50%, rgba(245, 158, 11, 0.28), rgba(15, 15, 18, 0.95))",
    badge: "Crowd Favorite #1",
    image: "/src/assets/images/mr_faizi_broast_slide_1790469734927.jpg",
    images: [
      "/src/assets/images/mr_faizi_broast_slide_1790469734927.jpg",
      "/src/assets/images/faizi_broast_pieces_1790470770144.jpg",
      "/src/assets/images/faizi_spicy_broast_1790470788540.jpg",
    ],
    imageAlt: "Mr Faizi Golden Crispy Broast Chicken with French Fries and Garlic Mayo Dip",
    highlights: ["100% Halal Fresh Chicken", "Secret Garlic Mayo Dip Included", "Served with Hot Bun & Fries"],
    preparationTime: "Freshly Fried (12-15 Mins)",
    items: [
      { name: "Full Broast", price: "Rs. 2100/-", description: "Complete feast with 4 golden pieces, fries & 2 dips", isPopular: true, badge: "Best Value" },
      { name: "Half Broast", price: "Rs. 1050/-", description: "2 juicy pieces with golden fries and garlic dip", isPopular: true },
      { name: "Quarter Broast (Chest)", price: "Rs. 550/-", description: "Lean, juicy white meat chest cut", isPopular: true },
      { name: "Quarter Broast (Leg)", price: "Rs. 500/-", description: "Tender, succulent drumstick & thigh portion" },
      { name: "Spicy Garlic Broast", price: "Rs. 600/-", description: "Infused with fiery crushed garlic and chili glaze", badge: "Chef Pick" },
    ],
  },
  {
    id: "burger",
    name: "GOURMET BURGERS",
    category: "Flame-Grilled & Crispy Buns",
    tagline: "Flame-Kissed Perfection, Packed with Unstoppable Flavor",
    secondaryTagline: "Toasted brioche buns, double melted cheese & signature Faizi secret sauces",
    accentColor: "from-orange-500 via-red-600 to-amber-600",
    gradient: "from-red-500/20 via-stone-900/60 to-black/90",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(239, 68, 68, 0.25), rgba(18, 18, 22, 0.95))",
    badge: "Heavy Hitters",
    image: "/src/assets/images/faizi_burgers_banner_1790470108070.jpg",
    images: [
      "/src/assets/images/faizi_burgers_banner_1790470108070.jpg",
      "/src/assets/images/faizi_zinger_stacked_1790470803296.jpg",
    ],
    imageAlt: "Juicy Stacked Faizi Signature Gourmet Burger with Melty Cheese & Fries",
    highlights: ["100% Pure Beef & Crispy Chicken Fillet", "Signature Faizi Special Sauce", "Melted Golden Cheddar"],
    items: [
      { name: "Faizi Signature Burger", price: "Rs. 700/-", description: "Ultimate double patty with caramelized glaze", badge: "VIP Signature", isPopular: true },
      { name: "Faizi Special Burger", price: "Rs. 550/-", description: "Chef's custom spicy blend with melted cheddar", isPopular: true },
      { name: "Zinger Cheese Burger", price: "Rs. 550/-", description: "Jumbo crispy chicken fillet draped in cheddar slice" },
      { name: "Zinger Burger", price: "Rs. 500/-", description: "Crunchy spicy fried chicken breast with crisp iceberg", isPopular: true },
      { name: "Spicy Burger", price: "Rs. 530/-", description: "Spicy mayo kick with jalapeño relish" },
      { name: "Junior Zinger Burger", price: "Rs. 400/-", description: "Crispy single fillet, kid & quick snack favorite" },
      { name: "Chicken Cheese Burger", price: "Rs. 380/-", description: "Grilled spiced chicken patty with melted cheese" },
      { name: "Chicken Burger", price: "Rs. 330/-", description: "Classic seasoned chicken patty burger" },
      { name: "Beef Cheese Burger", price: "Rs. 350/-", description: "Sizzled beef patty topped with warm melted slice" },
      { name: "Beef Burger", price: "Rs. 300/-", description: "Old-school charred ground beef patty" },
    ],
  },
  {
    id: "pizza",
    name: "ARTISAN PIZZAS & CRUSTS",
    category: "Wood-Fired Style Crusts & Stuffed Edge",
    tagline: "Cheesy, Loaded & Baked to Golden Italian Perfection",
    secondaryTagline: "Stretched fresh daily, smothered with rich marinara and 100% mozzarella pull",
    accentColor: "from-red-600 via-amber-500 to-yellow-500",
    gradient: "from-amber-600/25 via-red-950/40 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(220, 38, 38, 0.28), rgba(15, 12, 10, 0.95))",
    badge: "Oven Baked Marvel",
    image: "/src/assets/images/faizi_pizza_banner_1790470126020.jpg",
    images: [
      "/src/assets/images/faizi_pizza_banner_1790470126020.jpg",
      "/src/assets/images/faizi_kabab_crust_pizza_1790470817756.jpg",
    ],
    imageAlt: "Stuffed Crust Gourmet Pizza with Hot Melted Mozzarella Cheese Pull",
    highlights: ["Stuffed Crust & Kabab Edge Options", "100% Real Mozzarella", "Rich Smoky BBQ & Creamy Sauces"],
    items: [
      { name: "7 Inch Small Regular", price: "Rs. 380/-", description: "Personal 4-slice size for solo craving" },
      { name: "7 Inch Small Special", price: "Rs. 550/-", description: "Specialty stuffed crust / gourmet recipe" },
      { name: "9 Inch Medium Regular", price: "Rs. 750/-", description: "6 slices, perfect for couples" },
      { name: "9 Inch Medium Special", price: "Rs. 1050/-", description: "Stuffed crust loaded with specialty toppings", isPopular: true },
      { name: "12 Inch Large Regular", price: "Rs. 950/-", description: "8 jumbo slices for family sharing" },
      { name: "12 Inch Large Special", price: "Rs. 1250/-", description: "Supreme feast with Kabab Crust / Stuff Crust", isPopular: true },
      { name: "14 Inch Jumbo Regular", price: "Rs. 1150/-", description: "Massive party pizza loaded edge-to-edge" },
      { name: "14 Inch Jumbo Special", price: "Rs. 1450/-", description: "Ultimate Faizi Supreme stuffed crust experience", badge: "Party King" },
    ],
    servingNote: "Available in: Chicken Tikka, Fajita, Afghani Tikka, Malai Boti, Creemy Lover, Cheese Lover, Vegge, Hot N Spicy, Super Supreme, Kabab Crust & Phantom!",
  },
  {
    id: "rolls",
    name: "PARATHA ROLLS & WRAPS",
    category: "Fresh Crispy Paratha Wraps & Shawarma",
    tagline: "Hot, Flaky Parathas Wrapped Around Sizzling Delights",
    secondaryTagline: "Layered with sliced onions, crunchy cabbage, garlic mayo and spicy chatni",
    accentColor: "from-emerald-500 via-teal-600 to-amber-700",
    gradient: "from-teal-600/20 via-stone-900/60 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(13, 148, 136, 0.25), rgba(12, 12, 14, 0.95))",
    badge: "Street-Style Craving",
    image: "/src/assets/images/faizi_paratha_rolls_banner_1790470158131.jpg",
    images: [
      "/src/assets/images/faizi_paratha_rolls_banner_1790470158131.jpg",
      "/src/assets/images/faizi_rolls_variety_1790470833046.jpg",
    ],
    imageAlt: "Golden fried paratha rolls bursting with chicken boti, zinger strips and spicy mayo",
    highlights: ["Crisp Layered Parathas", "Loaded Garlic Mayo Sauces", "Zinger & BBQ Filling Varieties"],
    items: [
      { name: "Zinger Cheese Roll", price: "Rs. 500/-", description: "Crispy zinger strip + rich melted cheese slice", isPopular: true, badge: "Top Seller" },
      { name: "Zinger Crispy Garlic Roll", price: "Rs. 470/-", description: "Zinger strips drizzled with garlic cream emulsion" },
      { name: "Zinger Chilli Roll", price: "Rs. 470/-", description: "Fiery chili sauce with crunchy zinger fillet" },
      { name: "Zinger Crispy Roll", price: "Rs. 450/-", description: "Golden fried chicken strip wrapped in warm paratha" },
      { name: "Chicken Malai Boti Roll", price: "Rs. 240/-", description: "Creamy boneless chicken with tangy green yogurt", isPopular: true },
      { name: "Chicken Mayo Roll", price: "Rs. 240/-", description: "Juicy chicken cubes smothered in thick garlic mayo" },
      { name: "Chicken Roll", price: "Rs. 220/-", description: "Classic spicy chicken boti with crisp onion rings" },
      { name: "Boti Mayo Roll", price: "Rs. 220/-", description: "Tender beef boti rolled with garlic mayo sauce" },
      { name: "Boti Roll", price: "Rs. 200/-", description: "Smoky charcoal beef boti in hot flaky paratha" },
      { name: "Kabab Mayo Roll", price: "Rs. 180/-", description: "Melted seekh kabab with mayo dressing" },
      { name: "Kabab Roll", price: "Rs. 160/-", description: "Pocket-friendly charcoal seekh kabab roll" },
    ],
  },
  {
    id: "sandwiches",
    name: "TOASTED CLUB SANDWICHES",
    category: "Tri-Layer Deli Sandwiches & Shawarma Style",
    tagline: "Layered with Freshness, Crafted for Real Cravings",
    secondaryTagline: "Triple-decker golden toasted bread filled with chicken, egg, and fresh veggies",
    accentColor: "from-amber-500 via-yellow-600 to-rose-700",
    gradient: "from-yellow-600/20 via-zinc-900/50 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(217, 119, 6, 0.25), rgba(15, 15, 18, 0.95))",
    badge: "Triple Decker",
    image: "/src/assets/images/faizi_sandwiches_banner_1790470171755.jpg",
    images: [
      "/src/assets/images/faizi_sandwiches_banner_1790470171755.jpg",
      "/src/assets/images/faizi_kabab_crust_pizza_1790470817756.jpg",
    ],
    imageAlt: "Gourmet cut club sandwiches stacked high with fries and dips",
    highlights: ["Golden Buttered Toast", "Double Protein Layers", "Accompanied by Crispy Fries"],
    items: [
      { name: "Malai Club Sandwich", price: "Rs. 500/-", description: "Tender malai chicken boti with rich creamy dressing", isPopular: true, badge: "Chef Special" },
      { name: "Crispy Club Sandwich", price: "Rs. 480/-", description: "Crunchy fried zinger chicken fillet inside club toast", isPopular: true },
      { name: "B.B.Q Club Sandwich", price: "Rs. 450/-", description: "Smoky shredded BBQ chicken with spicy relish" },
      { name: "Club Sandwich", price: "Rs. 430/-", description: "Classic tri-layer with sliced chicken, egg & cheese" },
      { name: "Chicken Sandwich", price: "Rs. 400/-", description: "Comforting creamy shredded chicken sandwich" },
      { name: "Mexican Sandwich (Pizza Style)", price: "Rs. 500/-", description: "Toasted baked sandwich with salsa & jalapeños" },
      { name: "Chicago Sandwich (Pizza Style)", price: "Rs. 850/-", description: "Deep-dish sandwich bursting with melted mozzarella & toppings", badge: "Monster Feast" },
    ],
  },
  {
    id: "tikka_bbq",
    name: "CHARCOAL TIKKA & BOTI",
    category: "Authentic Live Sigri Grill",
    tagline: "Spiced to Perfection, Roasted Over Glowing Embers",
    secondaryTagline: "Smoky charcoal perfection with freshly squeezed lemons, mint raita & salad",
    accentColor: "from-red-600 via-orange-600 to-amber-700",
    gradient: "from-orange-600/20 via-red-950/40 to-black/90",
    bgAtmosphere: "radial-gradient(ellipse at 80% 50%, rgba(234, 88, 12, 0.28), rgba(17, 14, 14, 0.95))",
    badge: "Sigri Grilled Fresh",
    image: "/src/assets/images/faizi_bbq_tikka_banner_1790470141339.jpg",
    images: [
      "/src/assets/images/faizi_bbq_tikka_banner_1790470141339.jpg",
      "/src/assets/images/faizi_malai_tikka_1790470847454.jpg",
    ],
    imageAlt: "Sizzling Charcoal Chicken Tikka and Malai Boti Skewers over glowing embers",
    highlights: ["Slow Charcoal Roasted", "Authentic Bihari Marination", "Served with Puri Paratha & Mint Raita"],
    items: [
      { name: "Bihari Tikka Chest (3 Pcs)", price: "Rs. 550/-", description: "Melt-in-mouth bihari spices marinated chest portion", isPopular: true, badge: "Masterpiece" },
      { name: "Bihari Tikka Leg (3 Pcs)", price: "Rs. 500/-", description: "Smoky, tender bihari leg quarters" },
      { name: "Chicken Malai Tikka", price: "Rs. 500/-", description: "Velvety cream, cashew paste and mild green herbs", isPopular: true },
      { name: "Chicken Tikka (Chest)", price: "Rs. 450/-", description: "Traditional fiery red tandoori spiced chest piece" },
      { name: "Chicken Tikka (Leg)", price: "Rs. 400/-", description: "Juicy charred leg quarter seasoned with red masala" },
      { name: "Chicken Malai Boti (Full / Half)", price: "Rs. 550 / 280", description: "Silky soft boneless chunks in rich cream marinade", isPopular: true },
      { name: "Chicken Boti (Full / Half)", price: "Rs. 500 / 250", description: "Traditional charred boneless chicken cubes" },
      { name: "Beef Boti (Full / Half)", price: "Rs. 450 / 230", description: "Tender beef cubes slow roasted over live embers" },
    ],
  },
  {
    id: "kabab",
    name: "SIZZLING KABAB SPECIALS",
    category: "Charcoal Sigri Kababs",
    tagline: "Authentic Charcoal Smoke & Melt-in-Mouth Tradition",
    secondaryTagline: "Minced with artisan suet, coriander, green chilies, and hand-ground spices",
    accentColor: "from-amber-600 via-rose-700 to-zinc-800",
    gradient: "from-rose-600/20 via-zinc-900/50 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(190, 18, 60, 0.25), rgba(15, 15, 18, 0.95))",
    badge: "Melt In Mouth",
    image: "/src/assets/images/faizi_dhaga_kabab_banner_1790470230773.jpg",
    images: [
      "/src/assets/images/faizi_dhaga_kabab_banner_1790470230773.jpg",
    ],
    imageAlt: "Smoky Dhaga Kabab and Gola Kabab on sizzler with onion rings and lime",
    highlights: ["Hand-Tied Thread Dhaga Kabab", "Succulent Spiced Gola Kabab", "Melt-in-Mouth Texture"],
    items: [
      { name: "Dhaga Kabab (Full Plate)", price: "Rs. 380/-", description: "Silky spiced mince tied with thread & roasted on sigri", isPopular: true, badge: "Karachi Legend" },
      { name: "Dhaga Kabab (Half Plate)", price: "Rs. 190/-", description: "Single-serving portion with sliced onions & lemon" },
      { name: "Gola Kabab (Full Plate)", price: "Rs. 450/-", description: "Plump, rounded skewers bursting with juices", isPopular: true },
      { name: "Gola Kabab (Half Plate)", price: "Rs. 220/-", description: "Authentic spicy round kababs with mint chutney" },
    ],
  },
  {
    id: "pasta_lasagne",
    name: "PASTA & BAKED LASAGNE",
    category: "Italian Sizzler Kitchen",
    tagline: "Rich, Cheesy Indulgence in Every Heavenly Bite",
    secondaryTagline: "Oven-baked al dente penne and sheet pasta drowning in béchamel and marinara",
    accentColor: "from-rose-500 via-amber-600 to-orange-600",
    gradient: "from-rose-600/20 via-zinc-900/50 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(225, 29, 72, 0.25), rgba(15, 15, 18, 0.95))",
    badge: "Cheesy Overload",
    image: "/src/assets/images/faizi_pasta_lasagne_banner_1790470186772.jpg",
    images: [
      "/src/assets/images/faizi_pasta_lasagne_banner_1790470186772.jpg",
    ],
    imageAlt: "Golden bubbling baked lasagne with layers of meat sauce and mozzarella pull",
    highlights: ["Bubbling Mozzarella Top", "Rich Béchamel Sauce", "Half & Full Serving Portions"],
    items: [
      { name: "Chicken Lasagne (Full)", price: "Rs. 700/-", description: "Multi-layered pasta with minced chicken & melted cheese", isPopular: true, badge: "Customer Pick" },
      { name: "Chicken Lasagne (Half)", price: "Rs. 450/-", description: "Single-serving baked pasta tray with cheese crust" },
      { name: "Beef Lasagne (Full)", price: "Rs. 700/-", description: "Hearty Bolognese-style beef layers baked to perfection" },
      { name: "Beef Lasagne (Half)", price: "Rs. 450/-", description: "Rich seasoned minced beef lasagne" },
      { name: "Creamy Pasta (Full)", price: "Rs. 700/-", description: "White sauce alfredo style penne with tender chicken cubes", isPopular: true },
      { name: "Creamy Pasta (Half)", price: "Rs. 450/-", description: "Rich velvety white sauce chicken pasta" },
      { name: "Bar BQ Pasta (Full)", price: "Rs. 700/-", description: "Smoky spicy BBQ sauce blended with melted cheddar" },
      { name: "Bar BQ Pasta (Half)", price: "Rs. 450/-", description: "Zesty BBQ tossed pasta with chicken chunks" },
    ],
  },
  {
    id: "fries_appetizers",
    name: "CRUNCHY FRIES & PIZZA FRIES",
    category: "Showroom Snack Station",
    tagline: "Crunchy, Cheesy, Irresistible Comfort Food",
    secondaryTagline: "Crisp potato fries loaded with seasoned chicken, melting cheese and spicy dips",
    accentColor: "from-yellow-400 via-amber-500 to-orange-500",
    gradient: "from-yellow-500/20 via-stone-900/50 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(245, 158, 11, 0.25), rgba(15, 15, 18, 0.95))",
    badge: "Must-Have Sides",
    image: "/src/assets/images/faizi_pizza_fries_banner_1790470201708.jpg",
    images: [
      "/src/assets/images/faizi_pizza_fries_banner_1790470201708.jpg",
    ],
    imageAlt: "Loaded Pizza Fries skillet with melted cheese, olives, and chicken chunks",
    highlights: ["Loaded Melted Mozzarella", "Secret Masala Dust", "Pure Crispy Potato"],
    items: [
      { name: "Pizza Fries (Full Plate)", price: "Rs. 600/-", description: "Smothered in pizza sauce, mozzarella cheese, chicken chunks & olives", isPopular: true, badge: "Must Try" },
      { name: "Pizza Fries (Half Plate)", price: "Rs. 400/-", description: "Personal tray of baked cheesy pizza fries" },
      { name: "Mayo Fries", price: "Rs. 150/-", description: "Crispy golden fries drizzled with homemade garlic mayo" },
      { name: "Masala Fries", price: "Rs. 130/-", description: "Spicy chaat masala tossed golden potato fingers" },
      { name: "French Fries", price: "Rs. 130/-", description: "Classic lightly salted crisp potato sticks" },
    ],
  },
  {
    id: "mocktails_chillers",
    name: "CHILLERS & GOURMET SODA",
    category: "Showroom Refreshment Bar",
    tagline: "Burst of Chilled Refreshment with Every Sip",
    secondaryTagline: "Over 25+ handcrafted sparkling fruit mocktails, mojitos, punches and margaritas",
    accentColor: "from-cyan-400 via-blue-500 to-indigo-600",
    gradient: "from-cyan-500/25 via-blue-950/40 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(6, 182, 212, 0.28), rgba(10, 14, 25, 0.95))",
    badge: "Instant Thirst Quencher",
    image: "/src/assets/images/faizi_chillers_soda_banner_1790470217171.jpg",
    images: [
      "/src/assets/images/faizi_chillers_soda_banner_1790470217171.jpg",
    ],
    imageAlt: "Condensation frosted glasses of ice cold blue punch, mango mojito and strawberry chillers",
    highlights: ["Crushed Ice Soda Base", "25+ Signature Flavors", "Special Mint Lemonade & Shakes"],
    items: [
      { name: "Faizi Signature Mint Lemonade", price: "Rs. 150/-", description: "Real crushed garden mint, tangy lemon and chilled soda", isPopular: true, badge: "Showroom Hit" },
      { name: "Faizi Special Drink", price: "Rs. 150/-", description: "Chef's secret layered tropical fruit infusion", isPopular: true },
      { name: "Mango Mojito / Lemon Martini", price: "Rs. 100/-", description: "Sparkling crushed ice citrus and mango bliss" },
      { name: "Blue Punch / Blue Berry", price: "Rs. 100/-", description: "Electric blue curacao style icy cooler", isPopular: true },
      { name: "Pink Lady / Strawberry", price: "Rs. 100/-", description: "Sweet berry rush with sparkling soda" },
      { name: "Pomegranate Margarita", price: "Rs. 100/-", description: "Rich ruby red pomegranate with lime kick" },
      { name: "Green Pakola Cooler", price: "Rs. 100/-", description: "Nostalgic cream soda ice sensation" },
      { name: "Peach Bliss / Butter Scotch", price: "Rs. 100/-", description: "Velvety sweet caramel & peach aromatic soda" },
      { name: "Smoothies & Flavored Milk", price: "Rs. 200/-", description: "Thick chilled shakes made with rich ice cream base" },
      { name: "Doodh Sooda / Sting Soda", price: "Rs. 200/-", description: "Karachi's cult favorite milk soda & energy spritzers" },
      { name: "Special Fruit Slush", price: "Rs. 150/-", description: "Ultra fine crushed icy slush in assorted fruit syrups" },
    ],
  },
  {
    id: "gola_ganda",
    name: "KARACHI GOLA GANDA",
    category: "Heritage Shaved Ice Dessert",
    tagline: "Karachi's Favorite Sweet Shaved Ice Extravaganza",
    secondaryTagline: "Drizzled with multi-colored fruit syrups, pineapple chunks, sweet condensed milk and nuts",
    accentColor: "from-pink-500 via-purple-600 to-amber-500",
    gradient: "from-pink-600/25 via-purple-950/40 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(236, 72, 153, 0.28), rgba(18, 10, 24, 0.95))",
    badge: "Heritage Sweet Treat",
    image: "/src/assets/images/faizi_gola_ganda_banner_1790470245625.jpg",
    images: [
      "/src/assets/images/faizi_gola_ganda_banner_1790470245625.jpg",
    ],
    imageAlt: "Rainbow shaved snow ice bowl loaded with condensed milk, fruit syrups and tutti frutti",
    highlights: ["Finely Shaved Snow Ice", "Double Comelle Sweet Milk", "Pineapple & Tutti Frutti Toppings"],
    items: [
      { name: "Double Comelle Gola", price: "Rs. 200/-", description: "Generous drizzle of Comelle sweetened condensed milk, pineapple and syrups", isPopular: true, badge: "Super Sweet" },
      { name: "Stick Gola", price: "Rs. 200/-", description: "Classic ice pop stick drenched in lemon, rose & blueberry syrups" },
      { name: "Simple Gola", price: "Rs. 150/-", description: "Traditional shaved ice cup with refreshing triple-color flavors" },
    ],
  },
  {
    id: "beverages_sides",
    name: "BEVERAGES & TRADITIONAL SIDES",
    category: "Chilled Sodas & Traditional Sides",
    tagline: "The Perfect Finish to Your Royal Feast",
    secondaryTagline: "Ice-cold bottled beverages, fresh tandoor breads, spicy raitas and dips",
    accentColor: "from-zinc-400 via-neutral-600 to-emerald-600",
    gradient: "from-neutral-700/20 via-zinc-900/60 to-black/95",
    bgAtmosphere: "radial-gradient(ellipse at 75% 50%, rgba(100, 116, 139, 0.25), rgba(12, 12, 14, 0.95))",
    badge: "Essential Complements",
    image: "/src/assets/images/faizi_beverages_sides_banner_1790470258809.jpg",
    images: [
      "/src/assets/images/faizi_beverages_sides_banner_1790470258809.jpg",
    ],
    imageAlt: "Ice cold bottled sodas, hot flaky puri paratha, fresh mint raita and garlic dip",
    highlights: ["Chilled To Sub-Zero", "Crispy Hot Parathas", "Homemade Mayo Garlic Dips"],
    items: [
      { name: "Colddrink Jumbo Bottle", price: "Rs. 280/-", description: "Family jumbo size chilled carbonated soft drink" },
      { name: "Colddrink 1.5 Ltr", price: "Rs. 220/-", description: "1.5L bottle of your choice (Coke, Sprite, Fanta, etc.)" },
      { name: "Sting 500ml", price: "Rs. 130/-", description: "Ice-cold berry energy boost" },
      { name: "Colddrink 500ml", price: "Rs. 110/-", description: "Chilled individual 500ml bottle" },
      { name: "Sting Buddy Pack", price: "Rs. 110/-", description: "Compact buddy bottle of chilled Sting" },
      { name: "Colddrink Buddy Pack", price: "Rs. 90/-", description: "Grab-and-go mini cold soda bottle" },
      { name: "Paratha (Large / Small)", price: "Rs. 100 / 50", description: "Hot, flaky golden puri paratha fried fresh", isPopular: true },
      { name: "Chapati", price: "Rs. 20/-", description: "Soft, light whole wheat flatbread" },
      { name: "Mayo Garlic Dip / Cheese Slice", price: "Rs. 50 / 50", description: "Extra creamy dip or melted cheese add-on" },
      { name: "Fresh Salad & Mint Raita", price: "Rs. 50 / 50", description: "Cool cucumber mint yogurt & crisp chopped salad" },
    ],
  },
];
