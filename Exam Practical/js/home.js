let products = seedIfEmpty();

const filters = {
  search: "",
  category: "all",
  sort: "none"
};

const el = {
  resultCount: document.getElementById("resultCount"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortSelect: document.getElementById("sortSelect"),
  productGrid: document.getElementById("productGrid"),
  emptyState: document.getElementById("emptyState")
};


function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  saveProducts(products);
  addProductToList();
}


function editProduct(id) {
  window.location.href = `form.html?edit=${encodeURIComponent(id)}`;
}


function refreshCategoryFilterOptions() {
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const current = el.categoryFilter.value || filters.category || "all";

  el.categoryFilter.innerHTML = `<option value="all">All categories</option>`;
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    el.categoryFilter.appendChild(opt);
  });

  if (categories.includes(current) || current === "all") {
    el.categoryFilter.value = current;
  } else {
    el.categoryFilter.value = "all";
    filters.category = "all";
  }
}

function getVisibleProducts() {
  let list = [...products];

  if (filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (filters.sort === "asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "desc") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

el.searchInput.addEventListener("input", (e) => {
  filters.search = e.target.value;
  addProductToList();
});
el.categoryFilter.addEventListener("change", (e) => {
  filters.category = e.target.value;
  addProductToList();
});
el.sortSelect.addEventListener("change", (e) => {
  filters.sort = e.target.value;
  addProductToList();
});


function addProductToList() {
  refreshCategoryFilterOptions();

  const visible = getVisibleProducts();
  el.resultCount.textContent = `${visible.length} dish${visible.length === 1 ? "" : "es"}`;
  el.productGrid.innerHTML = "";

  if (visible.length === 0) {
    el.emptyState.hidden = false;
    const title = el.emptyState.querySelector(".empty__title");
    const sub = el.emptyState.querySelector(".empty__sub");
    if (products.length === 0) {
      title.textContent = "Nothing here yet";
      sub.textContent = "Add your first dish to get the menu started.";
    } else {
      title.textContent = "No dishes match";
      sub.textContent = "Try a different search term or category.";
    }
    return;
  }
  el.emptyState.hidden = true;

  visible.forEach((product) => {
    el.productGrid.appendChild(renderCard(product));
  });
}

function renderCard(product) {
  const card = document.createElement("article");
  card.className = "card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "card__image-wrap";
  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.loading = "lazy";
    img.onerror = () => {
      imageWrap.querySelector("img")?.remove();
      const ph = document.createElement("span");
      ph.className = "card__placeholder";
      ph.textContent = "🍽️";
      imageWrap.appendChild(ph);
    };
    imageWrap.appendChild(img);
  } else {
    const ph = document.createElement("span");
    ph.className = "card__placeholder";
    ph.textContent = "🍽️";
    imageWrap.appendChild(ph);
  }
  const priceTag = document.createElement("span");
  priceTag.className = "card__price-tag";
  priceTag.textContent = `$${Number(product.price).toFixed(2)}`;
  imageWrap.appendChild(priceTag);

  const body = document.createElement("div");
  body.className = "card__body";
  body.innerHTML = `
    <span class="card__category ${categoryClass(product.category)}">${escapeHtml(product.category)}</span>
    <h3 class="card__title">${escapeHtml(product.title)}</h3>
  `;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const editBtn = document.createElement("button");
  editBtn.className = "card__action";
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editProduct(product.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card__action card__action--danger";
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    if (confirm(`Remove "${product.title}" from the menu?`)) {
      deleteProduct(product.id);
    }
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(imageWrap);
  card.appendChild(body);
  card.appendChild(actions);
  return card;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

addProductToList();