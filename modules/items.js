import Item from "./Item.js";
import getItems from "./getData.js";

const items = [];
const FILE = "./items.json";

await getItems(FILE)
   .then(data => data.items.forEach(item => items.push(new Item(item.id, item.name, item.price, item.img))));
   
export default items;