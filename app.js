const productGrid = document.getElementById("product-grid");

const getProducts = async () => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Unable to load products.");
  }
  return response.json();
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

const renderProducts = async () => {
  try {
    const products = await getProducts();
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
  } catch (error) {
    productGrid.innerHTML =
      "<p>Unable to load products right now. Please check back shortly.</p>";
  }
};

renderProducts();
