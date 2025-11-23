import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  console.log('Cart items from localStorage:', cartItems);
  console.log('Cart items length:', cartItems ? cartItems.length : 0);
  cartItemTotalCost(cartItems);
  cartfinalItemTotalCost(cartItems);

  if (!cartItems || cartItems.length === 0) {
    console.log('Cart is empty');
    document.querySelector(".product-list").innerHTML = "<p>This an alert because your cart is empty.</p>";
    return;
  }

  console.log('🔍 Cart items - rendering them');
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const imageSrc = item.Images ? item.Images.PrimarySmall : item.Image;
  const quantity = item.quantity || 1;
  const price = item.FinalPrice || item.SuggestedRetailPrice;
  const totalPrice = (price * quantity).toFixed(2);

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors ? item.Colors[0].ColorName : 'N/A'}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${totalPrice}</p>
</li>`;

  return newItem;
}

function cartItemTotalCost(cartItems) {
  let total = 0;
  cartItems.forEach((item) => {
    let cost = parseFloat(item.FinalPrice);
    const quantity = item.quantity || 1;
    total = total + (cost * quantity);
  });

  document.querySelector(".cart_total").innerHTML = `$${total.toFixed(2)}`;
  const classTotalShow = document.querySelector(".cart_footer");
  classTotalShow.classList.remove("cart_footer");
  classTotalShow.classList.toggle("cart_footer_show");
}

function cartfinalItemTotalCost(cartItems) {
  let total = 0;
  cartItems.forEach((item) => {
    let cost = parseFloat(item.FinalPrice);
    const quantity = item.quantity || 1;
    const itemTotal = cost * quantity;
    const tax = itemTotal * 0.16;
    total = total + tax + itemTotal;
  });

  total = total + 80;

  document.querySelector(".final_cart_total").innerHTML = `$${total.toFixed(2)}`;
}

renderCartContents();