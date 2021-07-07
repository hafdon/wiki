So, another way of looking at a function:
```js
var Person = function( firstName , lastName ){ 
	this.firstName = firstName;
	this.lastName = lastName;
	this.gender = 'male' 
};
```
is that it can be used to assign those properties on `this` to whatever the function is called on:
```js
var Superhero = function( firstName, lastName , powers ){

// Invoke the superclass constructor on the new object  
// then use .call() to invoke the constructor as a method of 
// the object to be initialized.

Person.call(this, firstName, lastName);
// the function now has this.firstName, this.lastName, and this.gender
// so it's kind of like call the function and add any of its this members to 
// value of this, here

this.powers = powers; 
}
```

### `Object.prototype` vs. 
```js
let a = function(b, c) { this.d = b; this.e = c;}

let b = new a(1, 2)

a.prototype
// {constructor: ƒ}

b.prototype
// undefined

Object.getPrototypeOf(b)
// {constructor: ƒ}

Object.getPrototypeOf(a)
// ƒ () { [native code] }

Object.getPrototypeOf(b) === a.prototype
// true

Object.getPrototypeOf(a) === Object.getPrototypeOf(Object)
// true

Object.getPrototypeOf(new a(1, 2)) === Object.getPrototypeOf(b)
// true

// same thing
(new a(1,2)).prototype === b.prototype
// true

Object.getPrototypeOf(a(1,2))
/** VM941:1 Uncaught TypeError: Cannot convert undefined or null to object
    at Function.getPrototypeOf (<anonymous>)
    at <anonymous>:1:8 */
	
new(b)
/** VM973:1 Uncaught TypeError: b is not a constructor
    at <anonymous>:1:1 */
```