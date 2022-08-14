const carShop = document.querySelector(".cart-items");
const priceOfPay = document.querySelector(".total-price");

const saveLs = () => {
  //Setea productos y precio total en localstorage
  localStorage.setItem("Product", carShop.innerHTML);
  localStorage.setItem("Price", priceOfPay.innerHTML);
};
//Busca y trae los elementos del localstorage
const catchCarShop = () => {
  carShop.innerHTML = localStorage.getItem("Product");
  priceOfPay.innerHTML = localStorage.getItem("Price");
};

const totalPrice = async () => {
  let price = 0;
  const allCarShop = document.querySelectorAll(".cart-item");
  allCarShop.forEach((item) => {
    const priceTheItems = item.innerText.split("$");
    price += Number(priceTheItems[1]);
  });
  priceOfPay.innerHTML = `${Math.round(price)}`;
};

function createProductImageElement(imageSource) {
  const img = document.createElement("img");
  img.className = "item-image";
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  //Elimina un elemento del carrito al hacer click
  const evento = event.target;
  evento.remove();
  totalPrice();
  saveLs();
}

carShop.addEventListener("click", cartItemClickListener);

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  //Crea el elemento en el carrito
  const li = document.createElement("li");
  li.className = "cart-item";
  li.innerText = `❌,  ${name}.

  Precio: $ ${salePrice}`;

  const getOl = document.querySelector(".cart-items");
  getOl.appendChild(li);
  totalPrice();
  saveLs();
}

function getSkuFromProductItem(item) {
  return item.querySelector("span.item-sku").innerText;
}

const addCart = (event) => {
  //Agrega el producto al carrito

  const sectionItem = event.target.parentNode;
  const id = getSkuFromProductItem(sectionItem);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      createCartItemElement(data);
      Swal.fire({
        icon: "success",
        title: "¡Producto agregado!",
        confirmButtonColor: "#444444",
      });
    })
    .catch((error) => {
      alert(error.message);
    });
};

const buttonEmptyCar = document.querySelector(".empty-cart");

const emptyCar = () => {
  //Vacia todo el carrito
  carShop.innerHTML = "";
  totalPrice();
  saveLs();
};

buttonEmptyCar.addEventListener("click", emptyCar);

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  //Crea la "card" de cada item con su botón para agregar
  const section = document.createElement("section");
  section.className = "item";

  const button = createCustomElement(
    "button",
    "item-add",
    "Agregar al carrito"
  );
  button.addEventListener("click", addCart);

  section.appendChild(createCustomElement("span", "item-sku", sku));
  section.appendChild(createCustomElement("span", "item-title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

const loadingId = document.querySelector(".loading");
const itemsSection = document.querySelector(".items");

const fetchProducts = (query) => {
  //Se conecta a la API y obtiene el elemento de consulta
  //Coloca el elemento dentro de .items
  fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`) // llama a la API
    .then((response) => response.json())
    .then((Products) => {
      Products.results.forEach((item) => {
        itemsSection.appendChild(createProductItemElement(item));
      });
      loadingId.remove();
    });
};

const getProducts = async () => {
  try {
    fetchProducts("gin"); // Conjunto de elementos para buscar. Por defecto Gin
  } catch (error) {
    alert("Se produjo un error al cargar los productos");
  }
};

// Funciones de búsqueda de productos. Con 'Enter' o Click
const searchInput = document.querySelector("#input-search");
const searchButton = document.querySelector(".button-search");
const search = (event) => {
  if (event.keyCode === 13) {
    const items = document.querySelectorAll(".item");
    const itemContainer = document.querySelector(".items");
    items.forEach((item) => itemContainer.removeChild(item));
    fetchProducts(searchInput.value);
    searchInput.value = "";
  }
  return 0;
};

const searchClick = (event) => {
  if (event.target) {
    const items = document.querySelectorAll(".item");
    const itemContainer = document.querySelector(".items");
    items.forEach((item) => itemContainer.removeChild(item));
    fetchProducts(searchInput.value);
    searchInput.value = "";
  }
  return 0;
};

searchInput.addEventListener("keyup", search);
searchButton.addEventListener("click", searchClick);

window.onload = () => {
  catchCarShop();
  getProducts();
};
