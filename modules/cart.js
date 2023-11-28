const cart = [];

const addToCart = (cartList, item) => {
   if(!cart.includes(item)) {
      cart.push(item);
      cartList.appendChild(item.buildCart());
   }
   updateItem(cartList, item, 1);
};

const updateItem = (cartList, item, quantityIncrement = 0) => {
   item.quantity = parseInt(cartList.querySelector(`input[name="item-${item.id}"]`).value) + quantityIncrement;
   cart.forEach(item => {
      cartList.querySelector(`input[name="item-${item.id}"]`).value = item.quantity;
      cartList.querySelector(`#item-${item.id}-ar`).textContent = `Összesen: ${item.quantity * item.price} Ft`;
   });
};

const clearCart = (cartList) => {
   cart.forEach(item => {
      item.quantity = 0;
   });
   cart.splice(0, cart.length);

   cartList.querySelectorAll("li").forEach(li => li.remove());
};

const getFinalPrice = () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

export default cart;
export { addToCart, updateItem, clearCart, getFinalPrice };