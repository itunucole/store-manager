class Item
  constructor(id, itemName, price, quantity) {
    this.id = id;
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

/* Model*/
class Model {
  constructor() {
    this.data = {
      items: [],
      totalCost: 0
    };
  }

  getTotalItemsCount() {
    return this.data.items.length;
  }

  getTotalCost() {
    let total = 0;
    this.data.items.forEach(item => {
      total += item.price * item.quantity;
    });
    this.data.totalCost = total;
    return this.data.totalCost;
  }

  getAllItems() {
    return this.data.items;
  }

  addNewItem(newItemName, newItemPrice, newItemQty) {
    let newItemId;

    // Assign ID to new Item by adding 1
    // to id of last element in items;
    if (this.data.items.length > 0) {
      newItemId = this.data.items[this.data.items.length - 1].id + 1;
    } else {
      newItemId = 0;
    }
    newItemName = newItemName.toString();
    newItemPrice = parseFloat(newItemPrice);
    newItemQty = parseInt(newItemQty);

    const newItemObj = new Item(
      newItemId,
      newItemName,
      newItemPrice,
      newItemQty
    );
    this.data.items.push(newItemObj);
    return newItemObj;
  }

  removeItem(itemId) {
    const ids = this.data.items.map(item => item.id);
    const index = ids.indexOf(parseInt(itemId));
    this.data.items.splice(index, 1);
  }

  clearCart() {
    this.data.items = [];
  }
}



//VIEW
class View {
  constructor() {
    this.UISelectors = {
      addNewBtn: ".btn-add-new",
      clearCartBtn: ".btn-clear-cart",
      newItemName: ".new-item__name",
      newItemPrice: ".new-item__price",
      newItemQty: ".new-item__qty",
      totalItemsCount: ".cart-summary__total-items-count",
      totalCost: ".cart-summary__total-cost",
      itemsList: ".cart-items",
      itemInList: ".item"
    };
  }

  getUISelectors() {
    return this.UISelectors;
  }

  getInputFieldValues() {
    return {
      itemName: document.querySelector(this.UISelectors.newItemName).value,
      price: document.querySelector(this.UISelectors.newItemPrice).value,
      quantity: document.querySelector(this.UISelectors.newItemQty).value
    };
  }

  renderItemsList(items) {
    let domContent = "";
    items.forEach(item => {
      let priceTotal = item.quantity * item.price;
      domContent += `
            <div class="item" data-id="${item.id}">
            <p class="item__remove">&times;</p>
            <img class="item__img" src="\ui\img" alt="${item.itemName}">
            <div>
                <p class="item__name">${item.itemName}</p>
                <p class="item__reference-sku">Ref: 0110152${item.id}</p>
            </div>
            <p class="item__quantity">${item.quantity}</p>
            <div class="item__price">
                <p class="item__price-total">${priceTotal}</p>
                <p class="item__price-unit">${item.price}/pc</p>
            </div>
        </div>
            `;
    });

    document.querySelector(this.UISelectors.itemsList).innerHTML = domContent;
  }

  renderNewItemToList(item) {
    document.querySelector(this.UISelectors.itemsList).style.display = "block";
    // create new div element
    const priceTotal = item.quantity * item.price;
    const div = document.createElement("div");
    div.className = "item";
    div.setAttribute("data-id", `${item.id}`);
    div.innerHTML = `<p class="item__remove">&times;</p>
        <img class="item__img" src="\ui\img" alt="${item.itemName}">
        <div>
            <p class="item__name">${item.itemName}</p>
            <p class="item__reference-sku">Ref: 0110152${item.id}</p>
        </div>
        <p class="item__quantity">${item.quantity}</p>
        <div class="item__price">
            <p class="item__price-total">${priceTotal}</p>
            <p class="item__price-unit">${item.price}/pc</p>
        </div>`;

    document
      .querySelector(this.UISelectors.itemsList)
      .insertAdjacentElement("beforeend", div);
  }

  renderNewTotalCost(totalCost) {
    document.querySelector(
      this.UISelectors.totalCost
    ).textContent = totalCost.toString();
  }

  renderNewTotalItemsCount(totalItemsCount) {
    document.querySelector(
      this.UISelectors.totalItemsCount
    ).textContent = totalItemsCount.toString();
  }

  clearInputFields() {
    const inputFields = [
      this.UISelectors.newItemName,
      this.UISelectors.newItemPrice,
      this.UISelectors.newItemQty
    ];
    inputFields.forEach(inputField => {
      document.querySelector(inputField).value = "";
    });
  }

  removeItemFromList(itemId) {
    const item = document.querySelector(`[data-id="${itemId}"]`);
    item.remove();
  }

  removeAllItemsInList() {
    let itemsInList = document.querySelectorAll(this.UISelectors.itemInList);

    // Convert nodelist to array
    itemsInList = Array.from(itemsInList);
    itemsInList.forEach(item => {
      item.remove();
    });
  }

  hideItemsList() {
    document.querySelector(this.UISelectors.itemsList).style.display = "none";
  }
}



//the contoller
class App {
  constructor(modelObj, viewObj) {
    this.modelObj = modelObj;
    this.viewObj = viewObj;
  }

  loadEventListeners() {
    const UISelectors = this.viewObj.getUISelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addNewBtn)
      .addEventListener("click", evt => {
        const input = this.viewObj.getInputFieldValues();
        if (
          input.itemName !== "" &&
          input.price !== "" &&
          input.quantity !== ""
        ) {
          const newItem = this.modelObj.addNewItem(
            input.itemName,
            input.price,
            input.quantity
          );
          const newTotalCost = this.modelObj.getTotalCost();
          const newTotalItemsCount = this.modelObj.getTotalItemsCount();
          this.viewObj.renderNewItemToList(newItem);
          this.viewObj.renderNewTotalCost(newTotalCost);
          this.viewObj.renderNewTotalItemsCount(newTotalItemsCount);
          this.viewObj.clearInputFields();
          evt.preventDefault();
        }
      });

    // Remove Item Event
    document.querySelector(UISelectors.itemsList).addEventListener('click', evt => {
      if (evt.target.className === 'item__remove') {
        const itemId = evt.target.parentNode.getAttribute("data-id");
        this.viewObj.removeItemFromList(itemId);
        this.modelObj.removeItem(itemId);
        const newTotalCost = this.modelObj.getTotalCost();
        const newTotalItemsCount = this.modelObj.getTotalItemsCount();
        this.viewObj.renderNewTotalCost(newTotalCost);
        this.viewObj.renderNewTotalItemsCount(newTotalItemsCount);
        if (newTotalItemsCount === 0) {
          this.viewObj.hideItemsList();
        }
        evt.preventDefault();
      }
    });

    // Clear Cart Event
    document
      .querySelector(UISelectors.clearCartBtn)
      .addEventListener("click", evt => {
        this.modelObj.clearCart();
        const newTotalCost = this.modelObj.getTotalCost();
        const newTotalItemsCount = this.modelObj.getTotalItemsCount();
        this.viewObj.renderNewTotalCost(newTotalCost);
        this.viewObj.renderNewTotalItemsCount(newTotalItemsCount);
        this.viewObj.removeAllItemsInList();
        this.viewObj.hideItemsList();
        evt.preventDefault();
      });
  }

  loadInit() {
    const items = this.modelObj.getAllItems();
    if (items.length === 0) {
      this.viewObj.hideItemsList();
    } else {
      const newTotalCost = this.modelObj.getTotalCost();
      const newTotalItemsCount = this.modelObj.getTotalItemsCount();
      this.viewObj.renderNewTotalCost(newTotalCost);
      this.viewObj.renderNewTotalItemsCount(newTotalItemsCount);
      this.viewObj.renderItemsList(items);
    }
  }

  run() {
    this.loadInit();
    this.loadEventListeners();
  }
}

const model = new Model();
const view = new View();
const app = new App(model, view);
app.run();
