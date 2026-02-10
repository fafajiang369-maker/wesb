const form = document.getElementById("product-form");
const list = document.getElementById("admin-product-list");
const resetButton = document.getElementById("reset-products");

const getProducts = async () => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Unable to load products.");
  }
  return response.json();
};

const renderAdminList = async () => {
  try {
    const products = await getProducts();
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
  } catch (error) {
    list.innerHTML = "<p>Unable to load products right now.</p>";
  }
};

const handleDelete = async (event) => {
  const { id } = event.target.dataset;
  if (!id) return;
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  renderAdminList();
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const product = {
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

  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  form.reset();
  renderAdminList();
};

const handleReset = async () => {
  await fetch("/api/products/reset", { method: "POST" });
  renderAdminList();
};

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleDelete);
resetButton.addEventListener("click", handleReset);

renderAdminList();
