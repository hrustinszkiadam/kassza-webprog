class Item {
   constructor(id, name, price, img) {
      name = name.split(" " || "-");
      if (name.length > 1) {
         name = name.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase());
         this.name = name.join(" ");
      } else this.name = name[0][0].toUpperCase() + name[0].slice(1).toLowerCase();
      
      this.id = id;
      this.price = price;
      this.img = img;
      this.quantity = 0;
   }

   build() {
      return `<input type="image" name="item-${this.id}" alt="${this.name}" src="./img/${this.img}" class="col-1 img-fluid">`;
   }

   buildCart() {
      return (
         `<li class="col-3 d-inline-block">
            <img class="col-3 img-fluid" src="./img/${this.img}" alt="${this.name}"/>
            <label class="col-8">
               ${this.name}
               <br>
               Mennyiség: <input type="number" name="item-${this.id}" value="0">
               <p>
                  Ár/db: ${this.price} FT  | <span id="item-${this.id}-ar"></span>
               </p>
            </label>
         </li>`
      );
   }
}

//#region INIT
const items = [];
const cart = [];

const itemForm = document.querySelector("#items-form");
const cartForm = document.querySelector("#cart-form");
const cartList = document.querySelector("#cart-list");
const finalPriceText = document.querySelector("#final-price");

document.addEventListener("DOMContentLoaded", () => {
   getItems()
      .then(() => items.forEach(item => itemForm.innerHTML += item.build()));

   cartForm.style.display = "none";
});
//#endregion

const getItems = async () => {
   try {
      await fetch('./items.json')
         .then(response => response.json())
         .then(data => data.forEach(item => items.push(new Item(item.id, item.name, item.price, item.img))));
   } catch (err) {
      console.warn(err);
   }
};

const addToCart = (item) => {
   if(!cart.includes(item)) {
      cart.push(item);
      cartList.innerHTML += item.buildCart();
   }
   updateItem(item, 1);
};

const updateItem = (item, quantityIncrement = 0) => {
   item.quantity = parseInt(cartList.querySelector(`input[name="item-${item.id}"]`).value) + quantityIncrement;
   cart.forEach(item => {
      cartList.querySelector(`input[name="item-${item.id}"]`).value = item.quantity;
      cartList.querySelector(`#item-${item.id}-ar`).innerHTML = `Összesen: ${item.quantity * item.price} Ft`;
   });
}

const clearCart = () => {
   cart.forEach(item => {
      item.quantity = 0;
   });
   cart.splice(0, cart.length);

   cartList.innerHTML = "";
   cartForm.reset();
};

const getFinalPrice = () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

//click on item
itemForm.addEventListener("click", (event) => {
   if (event.target.type === "image") {
      event.preventDefault();

      addToCart(items.find(item => `item-${item.id}` === event.target.name));

      cartForm.style.display = cartForm.style.display === "none" ? "block" : null;
      finalPriceText.innerHTML = "Kosár tartalma:";
   }
});

//updated quantity in the cartForm (not by clicking on the item)
cartForm.addEventListener("change", (event) => {
   if (event.target.type === "number") {
      event.preventDefault();

      updateItem(items.find(item => `item-${item.id}` === event.target.name));
   }
});

//payment
cartForm.addEventListener("submit", (event) => {
   event.preventDefault();
   
   finalPriceText.innerHTML = `Fizetendő összeg: ${getFinalPrice()} Ft`;
   cartForm.style.display = "none";
   clearCart();
});