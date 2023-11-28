export default class Item {
   constructor(id, name, price, img) {
      name = name.split(/[\s-]+/);
      if (name.length > 1) {
         name = name.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase());
         this.name = name.join(" ");
      } else this.name = name[0][0].toUpperCase() + name[0].slice(1).toLowerCase();
      
      this.id = id;
      this.price = price;
      this.img = img;
      this.quantity = 0;
   }

   buildItem() {
      const input = document.createElement("input");
      input.type = "image";
      input.name = `item-${this.id}`;
      input.alt = this.name;
      input.src = `./img/${this.img}`;
      input.className = "col-1 m-0 img-fluid";
      return input;
   }

   buildSelect() {
      const option = document.createElement("option");
      option.value = `item-${this.id}`;
      option.textContent = this.name;
      return option;
   }

   buildCart() {
      const li = document.createElement("li");
      li.className = "col-3 d-inline-block";
      li.innerHTML = `
         <img class="col-3 img-fluid" src="./img/${this.img}" alt="${this.name}"/>
         <label class="col-8 align-middle">
            <strong class="fs-5">${this.name}</strong>
            <br>
            Mennyiség: <input type="number" name="item-${this.id}" value="${this.quantity}">
            <p class="m-0 mt-1">
               Ár/db: ${this.price} FT  | <span id="item-${this.id}-ar"></span>
            </p>
         </label>`;
      return li;
   }
}