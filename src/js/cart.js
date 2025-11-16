import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  console.log('Cart items from localStorage:', cartItems);
  console.log('Cart items length:', cartItems ? cartItems.length : 0);

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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice || item.SuggestedRetailPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
