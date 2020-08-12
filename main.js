const { log, clear, dir } = console;

// Model
class StockItem {
  // Schema: id, name, description, availability, price, stock
  constructor(data) {
    const { name, desc, price, stock = 0, availability } = data;

    //     Id Checks
    // if (!_id) {
    //   throw new Error(`No id provided: Received ${_id}`);
    // }
    // if (typeof _id !== "string") {
    //   throw new Error(`Id must be a string. Received ${_id}(${typeof _id})`);
    // }
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    this._id = uuidv4();

    //     Name checks
    if (!name) {
      throw new Error(`No name provided: Received ${name}`);
    }
    if (typeof name !== 'string') {
      throw new Error(
        `Name must be a string. Received ${name}(${typeof name})`
      );
    }
    this.name = name;

    //     Desc checks
    if (!desc) {
      throw new Error(`No description provided: Received ${desc}`);
    }
    if (typeof desc !== 'string') {
      throw new Error(
        `Description must be a string. Received ${desc}(${typeof desc})`
      );
    }
    this.desc = desc;

    // Price Checks
    if (!price) {
      throw new Error(`No price provided: Received ${price}`);
    }
    if (typeof price !== 'number') {
      throw new Error(
        `Price must be a number. Received ${price}(${typeof price})`
      );
    }
    this.price = price;

    //     Stock checks
    if (!stock) {
      throw new Error(`No stock provided: Received ${stock}`);
    }
    if (typeof stock !== 'number') {
      throw new Error(
        `Stock must be a number. Received ${stock}(${typeof stock})`
      );
    }
    this.stock = stock;

    //     Availability checks
    if (!availability) {
      throw new Error(`No availability provided: Received ${availability}`);
    }
    if (typeof availability !== 'boolean') {
      throw new Error(
        `Availability must be a boolean. Received ${availability}(${typeof availability})`
      );
    }
    this.availability = availability;
  }
  validate() {
    log('Validation Function');
  }
}

class Stock {
  #items = []; // Now a private field, so you can't tamper with it from outside this class
  constructor(itemsDataArray = []) {
    if (!Array.isArray(itemsDataArray)) {
      throw new Error(`Items must be an array. Received ${items}`);
    }

    for (const itemData of itemsDataArray) {
      this.#items.push(new StockItem(itemData));
    }
  }

  // GET a item record's index (by id)
  getItemIndex(id) {
    if (!id) {
      throw new Error(`An id must be provided to getItemIndex`);
    }
    if (typeof id !== 'string') {
      throw new Error(
        `The id provided to getItemIndex must be a string. Received ${id}(${typeof id})`
      );
    }
    const index = this.#items.findIndex((item) => {
      return item._id === id;
    });

    if (!~index) {
      log(`Item with _id of ${id} not found`);
    }
    return index;
  }

  // GET a item record
  getItem(id) {
    const index = this.getItemIndex(id);
    if (!~index) {
      return null;
    }
    const targetItem = this.#items[index];
    return { ...targetItem }; // return a copy, so it can't be affected outside
  }

  // GET ALL items
  getAllItems() {
    return this.#items.slice(); // return a copy, so it can't be affected outside
  }

  // CREATE a item
  addItem(itemData) {
    // Check if data provided
    if (!itemData) {
      throw new Error(`No data provided to addItem: received ${itemData}`);
    }

    // Create a new item
    const newItem = new StockItem(itemData);

    // push it into our internal array
    this.#items.push(newItem);

    // Return the finished product for reference
    return { ...newItem };
  }

  // UPDATE a item
  updateItem(updates = {}) {
    // Check id is correct
    const { _id: id } = updates;
    if (!id) {
      throw new Error(
        'An id of the item you want to change must be provided to updateItem'
      );
    }
    if (typeof id !== 'string') {
      throw new Error(`id must be a string. Received ${id}(${typeof id})`);
    }

    // Get old item
    const targetItemIndex = this.getItemIndex(id);
    const targetItem = this.#items[targetItemIndex];

    // Notify if not found (This should not happen, hence the error rather than just returning...)
    if (!targetItem) {
      throw new Error(`Item not found`);
    }

    // Create a new Item to validate
    const updatedItem = StockItem({ ...targetItem, ...updates });

    // Remove the old and insert the new
    this.#items.splice(targetItemIndex, 1, updatedItem);
    return { ...updatedItem }; // before returning the new item
  }

  // DELETE item
  removeItem(id) {
    if (!id) {
      throw new Error(`No id provided to removeItem: received ${id}`);
    }
    const index = this.getItemIndex(id);
    if (!~index) {
      return null; // throw err
    }
    return this.#items.splice(index, 1);
  }
}
// Run Time

const firstItem = new StockItem({
  name: 'shoe',
  price: 50,
  availability: true,
  desc: 'size 10',
  stock: 1,
});

console.log('firstItem', firstItem);
firstItem.validate();

const rawData = [
  {
    name: 'Bat',
    price: 70,
    availability: true,
    desc: 'Cricket Bat',
    stock: 1,
  },
];
const firstStock = new Stock(rawData);

log('Get all items', firstStock.getAllItems());

const added = firstStock.addItem({
  name: 'Ball',
  availability: true,
  desc: 'football',
  price: 20,
  stock: 2,
});

log('Get all items', firstStock.getAllItems());

// const updated = firstStock.updateItem({
//   price: 40,
// })

// log("Get all items", firstStock.getAllItems());

firstStock.removeItem('removing item', added._id);

log('Get all itmes', firstStock.getAllItems());
