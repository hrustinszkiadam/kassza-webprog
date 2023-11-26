//#region INIT
import items from "./modules/items.js";
import { addToCart, updateItem, getFinalPrice, clearCart } from "./modules/cart.js";

const itemForm = document.querySelector("#items-form");
const selectItemForm = document.querySelector("#select-items-form");
const cartForm = document.querySelector("#cart-form");
cartForm.style.display = "none";
const cartList = document.querySelector("#cart-list");
const finalPriceText = document.querySelector("#final-price");
//build items
items.forEach(item => {
   itemForm.innerHTML += item.buildItem();
   selectItemForm.querySelector("#items-select").innerHTML += item.buildSelect();
});
//#endregion

//show/hide cartForm
const handleCartForm = (payment = false) => {
   if (payment) {
      finalPriceText.innerHTML = `Fizetendő összeg: ${getFinalPrice()} Ft`;
      cartForm.style.display = "none";
      cartForm.reset();
      return;
   }
   cartForm.style.display = cartForm.style.display === "none" ? "block" : null;
   finalPriceText.innerHTML = "Kosár tartalma:";
}

//click on item
itemForm.addEventListener("click", (event) => {
   event.preventDefault();
   if (event.target.type === "image") {

      handleCartForm();
      addToCart(cartList, items.find(item => `item-${item.id}` === event.target.name));
   }
});

selectItemForm.addEventListener("change", (event) => {
   event.preventDefault();
   if (event.target.type === "select-one") {

      handleCartForm();
      addToCart(cartList, items.find(item => `item-${item.id}` === event.target.value));
   }
});

//updated quantity in the cartForm (not by clicking on the item)
cartForm.addEventListener("change", (event) => {
   event.preventDefault();
   if (event.target.type === "number") {

      updateItem(cartList, items.find(item => `item-${item.id}` === event.target.name));
   }
});

//payment
cartForm.addEventListener("submit", (event) => {
   event.preventDefault();
   
   handleCartForm(true);
   clearCart(cartList);
});