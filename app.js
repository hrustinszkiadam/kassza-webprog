//#region INIT
import items from "./modules/items.js";
import { addToCart, updateItem, getFinalPrice, clearCart } from "./modules/cart.js";

const itemForm = document.querySelector("#items-form");
const cartForm = document.querySelector("#cart-form");
cartForm.style.display = "none";
const cartList = document.querySelector("#cart-list");
const finalPriceText = document.querySelector("#final-price");

items.forEach(item => itemForm.innerHTML += item.build());
//#endregion

//click on item
itemForm.addEventListener("click", (event) => {
   if (event.target.type === "image") {
      event.preventDefault();

      cartForm.style.display = cartForm.style.display === "none" ? "block" : null;
      finalPriceText.innerHTML = "Kosár tartalma:";
      
      addToCart(cartList, items.find(item => `item-${item.id}` === event.target.name));
   }
});

//updated quantity in the cartForm (not by clicking on the item)
cartForm.addEventListener("change", (event) => {
   if (event.target.type === "number") {
      event.preventDefault();

      updateItem(cartList, items.find(item => `item-${item.id}` === event.target.name));
   }
});

//payment
cartForm.addEventListener("submit", (event) => {
   event.preventDefault();
   
   finalPriceText.innerHTML = `Fizetendő összeg: ${getFinalPrice()} Ft`;
   cartForm.style.display = "none";
   cartForm.reset();

   clearCart(cartList);
});