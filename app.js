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

const STORAGE_KEY = "seaglow-products";

const productGrid = document.getElementById("product-grid");

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

const createMedia = (product) => {
  if (product.video) {
    if (product.video.includes("youtube.com") || product.video.includes("youtu.be")) {
      return `<iframe src="${product.video}" title="${product.name} video" allowfullscreen></iframe>`;
    }
    return `<video src="${product.video}" controls></video>`;
  }

  return `<img src="${product.image}" alt="${product.name}" loading="lazy" />`;
};

const renderProducts = () => {
  const products = getProducts();
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-media">
          ${createMedia(product)}
        </div>
        <div class="product-body">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span class="product-highlight">${product.highlight || "Marine-grade performance"}</span>
        </div>
      </article>
    `
    )
    .join("");
};

renderProducts();
