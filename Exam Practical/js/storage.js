const STORAGE_KEY = "bloomKitchen.products";

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read products from local storage:", err);
    return [];
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error("Failed to save products to local storage:", err);
  }
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function categoryClass(category) {
  const map = {
    Starters: "cat-starters",
    Mains: "cat-mains",
    Salads: "cat-salads",
    Bakery: "cat-bakery",
    Desserts: "cat-desserts",
    Beverages: "cat-beverages"
  };
  return map[category] || "cat-other";
}


function seedIfEmpty() {
  let products = loadProducts();
  if (products.length > 0) return products;

  products = [
    {
      id: makeId(),
      title: "Roasted Beet & peanut Cheese Salad",
      price: 12.5,
      image: "https://i.pinimg.com/1200x/ca/31/10/ca311087257f39cc28f447f55815686a.jpg",
      category: "Salads"
    },
    {
      id: makeId(),
      title: "Wood-Fired Margherita Pizza",
      price: 16,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
      category: "Mains"
    },
    {
      id: makeId(),
      title: "Churros With Chocolate Dip",
      price: 7,
      image: "https://i.pinimg.com/1200x/e8/c4/b7/e8c4b70289f8272c766fe559f2d39f76.jpg",
      category: "Bakery"
    },
    {
      id: makeId(),
      title: "Crispy Chilly Potatoes with Honey Drizzeled",
      price: 10,
      image: "https://i.pinimg.com/736x/06/5d/bd/065dbdc7e651f7ff6f3f35093a54fa2b.jpg",
      category: "Starters"
    },
    {
      id: makeId(),
      title: "Molten Chocolate Lava Cake",
      price: 8,
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
      category: "Desserts"
    },
    {
      id: makeId(),
      title: "Fresh Watermelon Mint Cooler",
      price: 5.5,
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500",
      category: "Beverages"
    }
  ];
  saveProducts(products);
  return products;
}