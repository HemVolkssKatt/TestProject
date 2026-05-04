const baseProducts = [
  {
    name: "Syltherine",
    subtitle: "Stylish cafe chair",
    category: "living",
    price: 2500000,
    oldPrice: 3500000,
    badgeType: "sale",
    badgeText: "-30%",
    image: "../assets/syntenise.png",
    keywords: ["chair", "cafe", "stylish", "seating", "living"]
  },
  {
    name: "Leviosa",
    subtitle: "Stylish cafe chair",
    category: "living",
    price: 2500000,
    oldPrice: null,
    badgeType: null,
    badgeText: "",
    image: "../assets/leviosa.png",
    keywords: ["chair", "cafe", "stylish", "seating", "living"]
  },
  {
    name: "Lolito",
    subtitle: "Luxury big sofa",
    category: "living",
    price: 7000000,
    oldPrice: 14000000,
    badgeType: "sale",
    badgeText: "-50%",
    image: "../assets/lolito.png",
    keywords: ["sofa", "couch", "luxury", "big", "living room", "seating"]
  },
  {
    name: "Respira",
    subtitle: "Outdoor bar table and stool",
    category: "dining",
    price: 500000,
    oldPrice: null,
    badgeType: "new",
    badgeText: "New",
    image: "../assets/livingroom.jpg",
    keywords: ["table", "stool", "bar", "outdoor", "garden", "dining"]
  },
  {
    name: "Grifo",
    subtitle: "Night Lamp",
    category: "bedroom",
    price: 1500000,
    oldPrice: null,
    badgeType: null,
    badgeText: "",
    image: "../assets/Grifo.png",
    keywords: ["lamp", "night", "bedroom", "lighting"]
  },
  {
    name: "Muggo",
    subtitle: "Small mug",
    category: "dining",
    price: 150000,
    oldPrice: null,
    badgeType: "new",
    badgeText: "New",
    image: "../assets/muggo.png",
    keywords: ["mug", "cup", "dining", "kitchen"]
  },
  {
    name: "Pingky",
    subtitle: "Luxury big sofa",
    category: "living",
    price: 7000000,
    oldPrice: 14000000,
    badgeType: "sale",
    badgeText: "-50%",
    image: "../assets/pingky.jpg",
    keywords: ["sofa", "pink", "luxury", "living"]
  },
  {
    name: "Potty",
    subtitle: "Minimalist flower pot",
    category: "bedroom",
    price: 500000,
    oldPrice: null,
    badgeType: "new",
    badgeText: "New",
    image: "../assets/potty.jpg",
    keywords: ["pot", "plant", "bedroom", "garden"]
  }
];

// Generate 48 products based on the 8 core products
const products = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  ...baseProducts[i % 8],
  // Add some variety to names to show it's working
  name: i >= 8 ? `${baseProducts[i % 8].name} ${Math.floor(i / 8) + 1}` : baseProducts[i % 8].name
}));
