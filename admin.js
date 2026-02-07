const STORAGE_KEY = "seaglow-products";

const form = document.getElementById("product-form");
const list = document.getElementById("admin-product-list");
const resetButton = document.getElementById("reset-products");

const DEFAULT_PRODUCTS = [
  {
    id: "sg-uw-01",
    name: "Triton Underwater Glow",
    description:
      "High-lumen underwater light with RGBW control for dramatic hull illumination.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    video: "",
    category: "Underwater",
    highlight: "RGBW + 3000 lumens",
  },
  {
    id: "sg-deck-02",
    name: "Coral Deck Strip",
    description:
      "Flexible deck and stair lighting strip with marine-grade adhesive backing.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    video: "",
    category: "Deck & Cabin",
    highlight: "IP68 flexible strip",
  },
  {
    id: "sg-dock-03",
    name: "Harbor Dock Bollards",
    description:
      "Low-profile dock bollard lights with anti-glare optics for safe mooring.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    video: "",
    category: "Dock & Marina",
    highlight: "Warm white 3000K",
  },
  {
    id: "sg-smart-04",
    name: "WaveSync Control Hub",
    description:
      "Smart controller with Bluetooth + Wi-Fi for zone and schedule automation.",
    image:
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1200&q=80",
    video: "",
    category: "Smart Control",
    highlight: "App + helm integration",
  },
];

const getProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Unable to parse products", error);
    return DEFAULT_PRODUCTS;
  }
};

const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const renderAdminList = () => {
  const products = getProducts();
  list.innerHTML = products
    .map(
      (product) => `
        <div class="admin-product-item">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <small>${product.category} • ${product.highlight || "Marine-grade performance"}</small>
          </div>
          <div class="admin-product-actions">
            <button type="button" data-id="${product.id}">Delete</button>
          </div>
        </div>
      `
    )
    .join("");
};

const handleDelete = (event) => {
  const { id } = event.target.dataset;
  if (!id) return;
  const updated = getProducts().filter((product) => product.id !== id);
  saveProducts(updated);
  renderAdminList();
};

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const product = {
    id: `sg-${Date.now()}`,
    name: formData.get("name").trim(),
    description: formData.get("description").trim(),
    image: formData.get("image").trim(),
    video: formData.get("video").trim(),
    category: formData.get("category"),
    highlight: formData.get("highlight").trim(),
  };

  if (!product.image && !product.video) {
    alert("Please provide at least an image or video URL.");
    return;
  }

  const updated = [product, ...getProducts()];
  saveProducts(updated);
  form.reset();
  renderAdminList();
};

const handleReset = () => {
  saveProducts(DEFAULT_PRODUCTS);
  renderAdminList();
};

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleDelete);
resetButton.addEventListener("click", handleReset);

renderAdminList();
