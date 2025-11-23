import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Check if product already exists in cart
  const existingItemIndex = cartItems.findIndex(item => item.Id === product.Id);
  
  if (existingItemIndex !== -1) {
    // Item exists - increment quantity
    cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    alertMessage(`${product.Name} quantity updated! (Now ${cartItems[existingItemIndex].quantity})`, false);
  } else {
    // New item - add with quantity 1
    product.quantity = 1;
    cartItems.push(product);
    alertMessage(`${product.Name} added to cart!`, false);
  }

  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
