class Calculator
constructor (){
		//Set the needed variables
		this.total = 0;
		this.lists = [];
		this.tbody = '';
		this.numberOfItems = 0;
	}

	add(item, qty, price){

		//Added item name. qty and price to the list

		this.lists.push({'item': item, 'qty': parseInt(qty), 'price': parseFloat(price)});
		//Current number of items in the list
		this.numberOfItems++;
	}

	totalSum(){
		//Sum up the current subtotal with the newly added item
		this.total += parseFloat(this.lists[this.numberOfItems - 1].price);
		return this.total;
	}

	tbodyBuild(){
		//Add the new item to the table
		this.tbody += `
						<tr>
							<td>${this.numberOfItems}</td>
							<td>${this.lists[this.numberOfItems - 1].item}</td>
							<td>${this.lists[this.numberOfItems - 1].qty}</td>
							<td>${this.lists[this.numberOfItems - 1].price}</td>
						</tr>
						`;

		return this.tbody;
	}

	reset(){
		//Reset the variables back to the initial value
		this.total = 0;
		this.numberOfItems = 0;
		this.tbody = '';
		this.lists = [];
	}
}

let calculator = new Calculator;

let item = document.getElementById('item');
let qty = document.getElementById('qty');
let price = document.getElementById('price');
let sum = document.getElementById('sum');
let tableBody = document.getElementById('table-body');
let addItem = document.getElementById('addItem');
let reset = document.getElementById('reset');

//EventListener
function cb_addEventListener(obj, evt, fnc){
    // Check if the broswer support addeventlistiner
    if (obj.addEventListener) {
        obj.addEventListener(evt, fnc, false);
    }
     //Else Check if the broswer support attachEvent
    else if (obj.attachEvent) {
        return obj.attachEvent('on' + evt, fnc);
    }
 }

 cb_addEventListener(addItem, 'click', function(){
   //Check if any of the variable is empty
    if(item.value === '' || qty.value === '' || price.value === '') return false;
 	calculator.add(item.value, qty.value, price.value);
 	tableBody.innerHTML = calculator.tbodyBuild();
 	sum.textContent = calculator.totalSum();
 	item.value = qty.value = price.value = '';
 });

 cb_addEventListener(reset, 'click', function(){
 	calculator.reset();
 	tableBody.innerHTML = '';
 	sum.textContent = 0;

 })
