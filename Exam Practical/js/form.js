let products = loadProducts();

const params = new URLSearchParams(window.location.search);
const editingId = params.get("edit"); // null when adding a brand-new dish
const editingProduct = editingId ? products.find((p) => p.id === editingId) : null;

const el = {
  form: document.getElementById("productForm"),
  pageTitle: document.getElementById("pageTitle"),
  formEmoji: document.getElementById("formEmoji"),
  formTitle: document.getElementById("formTitle"),
  formSub: document.getElementById("formSub"),
  titleInput: document.getElementById("titleInput"),
  priceInput: document.getElementById("priceInput"),
  imageInput: document.getElementById("imageInput"),
  categoryInput: document.getElementById("categoryInput"),
  titleError: document.getElementById("titleError"),
  priceError: document.getElementById("priceError"),
  submitBtn: document.getElementById("submitBtn"),
  cancelBtn: document.getElementById("cancelBtn"),
  imagePreviewWrap: document.getElementById("imagePreviewWrap"),
  imagePreview: document.getElementById("imagePreview")
};


if (editingProduct) {
  el.pageTitle.textContent = "Edit Dish — Bloom Kitchen";
  el.formEmoji.textContent = "✏️";
  el.formTitle.textContent = "Edit this dish";
  el.formSub.textContent = "Update the details below and save your changes.";
  el.submitBtn.textContent = "Save changes";
  el.cancelBtn.textContent = "Cancel";

  el.titleInput.value = editingProduct.title;
  el.priceInput.value = editingProduct.price;
  el.imageInput.value = editingProduct.image;
  el.categoryInput.value = editingProduct.category;

  updateImagePreview();
}


el.imageInput.addEventListener("input", updateImagePreview);

function updateImagePreview() {
  const url = el.imageInput.value.trim();
  if (!url) {
    el.imagePreviewWrap.hidden = true;
    return;
  }
  el.imagePreview.src = url;
  el.imagePreview.onload = () => { el.imagePreviewWrap.hidden = false; };
  el.imagePreview.onerror = () => { el.imagePreviewWrap.hidden = true; };
}


function validateForm(data) {
  let valid = true;
  el.titleError.textContent = "";
  el.priceError.textContent = "";
  el.titleInput.closest(".field").classList.remove("field--invalid");
  el.priceInput.closest(".field").classList.remove("field--invalid");

  if (!data.title.trim()) {
    el.titleError.textContent = "Please name the dish.";
    el.titleInput.closest(".field").classList.add("field--invalid");
    valid = false;
  }
  if (data.price === "" || Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
    el.priceError.textContent = "Enter a valid price.";
    el.priceInput.closest(".field").classList.add("field--invalid");
    valid = false;
  }
  return valid;
}


function addProduct(data) {
  const product = {
    id: makeId(),
    title: data.title.trim(),
    price: Number(data.price),
    image: data.image.trim(),
    category: data.category
  };
  products.push(product);
  saveProducts(products);
}

function updateProduct(id, data) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return;
  products[idx] = {
    ...products[idx],
    title: data.title.trim(),
    price: Number(data.price),
    image: data.image.trim(),
    category: data.category
  };
  saveProducts(products);
}


el.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: el.titleInput.value,
    price: el.priceInput.value,
    image: el.imageInput.value,
    category: el.categoryInput.value
  };

  if (!validateForm(data)) return;

  if (editingProduct) {
    updateProduct(editingProduct.id, data);
  
    window.location.href = "index.html";
    return;
  }

  addProduct(data);

 
  el.form.reset();
  el.imagePreviewWrap.hidden = true;
  showSuccessBanner();
  el.titleInput.focus();
});

function showSuccessBanner() {
  let banner = document.getElementById("successBanner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "successBanner";
    banner.style.cssText = `
      margin-top:14px; padding:12px 16px; border-radius:12px;
      background:var(--leaf-soft); color:var(--leaf); font-size:0.85rem;
      font-weight:600; text-align:center; transition:opacity 0.3s ease;
    `;
    el.form.appendChild(banner);
  }
  banner.textContent = "Dish added to the menu 🎉";
  banner.style.opacity = "1";
  clearTimeout(showSuccessBanner._t);
  showSuccessBanner._t = setTimeout(() => { banner.style.opacity = "0"; }, 2200);
}