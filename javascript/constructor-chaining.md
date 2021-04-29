# constructor chaining

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}
function Pizza(name, price) {
  Product.call(this, name, price);
  this.category = 'pizza';
}
function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}
var pizza = new Pizza('margherita', 50);
var toy = new Toy('robot', 40);
console.log(pizza) // Toy { name: 'robot', price: 40, category: 'toy' }
console.log(toy)   // Pizza { name: 'margherita', price: 50, category: 'pizza' }
```

This is an example of constructor chaining. 
As we can see, in every function the constructor of the Product is called, 
and using call the properties of the Product object are chained with the Pizza and Toy objects, respectively.

https://www.freecodecamp.org/news/how-to-use-the-apply-call-and-bind-methods-in-javascript-80a8e6096a90/
