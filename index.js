const carShop = document.querySelector(".cart-items");
const priceOfPay = document.querySelector(".total-price");

const saveLs = () => {
//setea productos y precio total en localstorage
  localStorage.setItem("Product", carShop.innerHTML);
  localStorage.setItem("Price", priceOfPay.innerHTML);
};
//busca y trae los elementos del localstorage
const catchCarShop = () => {
  carShop.innerHTML = localStorage.getItem("Product");
  priceOfPay.innerHTML = localStorage.getItem("Price");
};
//calcula el precio de todos los items agregados al carrito
const totalPrice = async () => {
  let price = 0;
  const allCarShop = document.querySelectorAll(".cart-item");
  allCarShop.forEach((item) => {
    const priceTheItems = item.innerText.split("$");
    price += Number(priceTheItems[1]);
  });
  priceOfPay.innerHTML = `${Math.round(price)}`;
};
//crea la imagen de cada producto
function createProductImageElement(imageSource) {
  const img = document.createElement("img");
  img.className = "item-image";
  img.src = imageSource;
  return img;
}
//crea un elemento customizado
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
//elimina productos del carrito al hacer click. Modifica el precio total
function cartItemClickListener(event) {
  const evento = event.target;
  evento.remove();
  totalPrice();
  saveLs();
}

carShop.addEventListener("click", cartItemClickListener);

//crea los elementos en el carrito. Modifica el precio total
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
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

//Agrega el producto al carrito
const addCart = (event) => {
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
//vacia todo el carrito
const emptyCar = () => {
  carShop.innerHTML = "";
  totalPrice();
  saveLs();
};

buttonEmptyCar.addEventListener("click", emptyCar);

//Crea la "card" de cada item con su botón para agregar
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

//se conecta a la API y obtiene los elementos de consulta. Agrega cada Item
const fetchProducts = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`)
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

//función de búsqueda de productos. Con 'Enter' o Click en el botón
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
