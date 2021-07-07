# Javascript Design Patterns

## Implementations

### Creational Pattern

### Constructor Pattern
- Basic Constructors
- Constructors with Prototypes

### Singleton Pattern
- object literal with related methods and properties
- [[previous]], encapsulating 'private' ones inside a function closure and returning [[previous]]
- instatiate only when needed
- emulating static methods?

### Module Pattern

#### Modules
- Object Literals
- Module Pattern
  - uses object literals as return value from scoping function
  - exposes (returns) public API / interface
  - (not sure why this isn't still a singleton when using IIFE)
  - **disadvantages**
    - when you wish to change visibility, you have to make changes to each place the member was used
    - in methods that are added to the object at a later point, you can't access the private members coded originally
    - can't create automated unit tests for private members
    - complexity for bugs requiring hot fixes (you can't patch privates -- you would ahve to override all public methods that interact with the buggy privates)

### Revealing Module Pattern
- just like the Module Pattern, but for better readability you return an object literal where props are publicly accessible functions and variables
```js
return {
// these all have to be objects and passed by value
  set: setPerson,
  get: getPerson
}
```
- **disadvantages**
  - if private function refers to public function, public function can't be overriden if patch is necessary (private function will continue to refer to private implementation)
 
### Observer Pattern
- aka **Publish/Subscribe** pattern
- 'loose coupling'
- possible because functions are first-order 
- use cases
  - maintain consistency between related objects without making classes tightly coupled
  - where abstractions ahve more than one aspect, where one depends on the other (?)
- **disadvantages**
  - difficult to obtain guarantees that particular parts of application functioning as expected
  - observers don't know about one another; switching in the publisher can be computationally expensive
- sometimes **Mediators** are used with this:
  - widet publishes topic. mediator subscribes to that topic. mediator calls relevant methods on other components.
```js
  var grid = {
     refreshData: function(){
     console.log('retrieved latest data from data cache');
     console.log('updated grid component');
   },
     updateCounter: function(){
     console.log('data last updated at: ' + getCurrentTime());
   }
  };
  // a very basic mediator
  var gridUpdate = function(topics, data){
   grid.refreshData();
   grid.updateCounter();
  }
  var dataSubscription = PubSub.subscribe( 'dataUpdated', gridUpdate );
  PubSub.publish( 'dataUpdated', 'new stock data available!' );
  PubSub.publish( 'dataUpdated', 'new stock data available!' );
```
- 'publication' still calls lthe callback, but the callback looks to a shared object or array or something for the actual information (i.e. "new data is available!" and the subscriber has to check it out itself?)
- use case:
  - subscribe to an restapi endpoint, and then endpoint publishes notification and data whenever it's called?
    - we could have 10 different subscribers utilizing the data returned in different ways but as far as the Ajax-layer is concerned, it doesn't care. Its sole duty is to request and return data then pass it on to whoever wants to use it. This separation of concerns can make the overall design of your code a little cleaner.

```js
        $.subscribe('/search/tags', function(tags){
          $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',
            { tags: tags, tagmode: 'any', format: 'json'},
            
              function(data){
              if(!data.items.length){ return; }
                $.publish('/search/resultSet', [ data ]);
            });
         });
 ```

### Mediator Pattern
- "expose a unified interface _through which_ different parts of a system may communicate" ? -- so, a "controller" / switchboard?
- promotes "loose coupling"
- modules don't refer to each other explicitly
- example given: more like traffic control system 
- **implementation**: a shared subject(publisher) in the observer pattern
  - e.g. binding to DOM events rather than individual component events
  - **I don't understand the `context: this` bit**
- use case:
  - permissions management (mediator controls what messages can be subscribed to and which can be broadcast)
- **disadvantages**
  - introduce single point of failure
  - performance hit (modules communicating indirectly)
  - loose coupling systems are hard to predict their dehavior
- **advantages**
  - with tight coupling, if another module throws an exception, then that could have domino effect

#### Mediator vs. Facade
- mediator centralizes communication where explicitly referenced (multidirectional)
- facade defines simpler interface to module or system, but doesn't add additional functionality (unidirectional)

### Prototype Pattern

### Command Pattern
- decouple objects invoking actions from objects implemention actions (easier to swap out classes)
  - separate issuing commands from executing commands ?
- all Command objects with the same interface can be swapped as needed
- this is kind of how Vue `dispatch` and `commit` work
  ```js
    CarManager.execute("arrangeViewing", "Ferrari", "14523");
    CarManager.execute("requestInfo", "Ford Mondeo", "54323");
    CarManager.execute("requestInfo", "Ford Escort", "34232");
    CarManager.execute("buyVehicle", "Ford Escort", "34232");
    ```
### Facade Pattern
- simplifies the presented API
  - simplifies class interface
  - decouples class from code that uses it
- examples he presents are primarily about performing OS checks, checking for null vals (kind of like how they recommend using Proxies?)
  - "consume a feature without worrying about implementation details"

#### Module Pattern + Facade Pattern

### Factory Pattern
- lets you create objects without having to specify the exact class of object being created
- return 'custom version' of the thing being created
	- e.g. [mixin factories](https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api)
- do: define interface for creating an object; the subclasses decide which class to instantiate
  - that is, subclasses can override the object-creation method to specify the type of factory product
  - quite useful if 
    - creation processis complex / depends on settings
    - generate different instances depending on environment
    - working with many small objects that share same properties
    - composing classes with instanes of other classes that need only satisfy API contract (duck typing)
- Namespacing:
	- allows you to use namespaces (such as with a Vue2 mixin solution to prevent overrides)
		- **namespacing disadvantages:** 
			- Namespacing requires strong conventions and discipline.
			- some others?
- DON'T USE WHEN:
  - will add too much complexity
  - tests more difficult


#### Abstract Factory Pattern
- system independent from the *way* the objects it creates are generated
- e.g. vehicle factory (defines ways to get or register vehicle types)
	- allow definition of types of vehicle
	- concrete factories will implement only classes that fulfill vehicle contract

### Mixin Pattern
- mixin: classes which provide the functionality (i.e. functions / methods) to be inherited by a subclass
- instances of the receiving class do not pass `instanceof` for the mixin class; JS does not support multiple inheritance.
- you're just adding functions from one object to another object, programmatically, (with or without, depending on chosen behavior) overriding existing methods.
	- not sure how this is different than Object.assign

### Decorator Pattern
- def: "design pattern that allows behavior to be added to an existing object dynamically" -- but decoration isn't essential to base functionality of object (or you'd just add to prototype, presumably)

### Subclassing
- method/constructor chaining: when subclass B needs to invoke a method/constructor in superclass A that has been overriden

### Decorators
- use when you have to delegate responsibilities to an object where it doesn't make sense to subclass it 
	- e.g. number of features required demand for large quantity of subclasses 
- extend functionality of objects (rather than linear inheritance, more of progressive / additional capabilities)
- **at most basic**  it's functions that you add to a class instance (you can also add this.prop in function). and doing this doesn't change the base class (i.e. the function.prototype) 
- (macbook example)
	-  It's considered a decoration as the original Macbook object's constructor methods which are not overridden (e.g. screenSize()) as well as any other properties which we may define as a part of the Macbook remain unchanged and intact.
	-  but you _are_ overriding some methods (here, though there isn't an interface)
```js
	// Decorator 2
	function Engraving( macbook ){ 
		var v = macbook.cost(); 
		macbook.cost = function(){
			return v + 200; 
		};
	}
```
### Pseudo-Classical Decorators
#### Interfaces
- decorator: "transparently wrap objects inside other objects of hte same interface"
- interface: "way to define methods an object **should** have, and possibly the parameters"
- **disadvantage** no native support in JS
- ?????????????? there seems like such a better way of doing this
- https://jsmanifest.com/decorators-in-javascript/
- example of general idea:
	-  In the following example, we define three objects: defaults, options and settings. The aim of the task is to decorate the 'defaults' object with additional functionality found in 'options', which we'll make available through 'settings'. We must:
		-  (a) Leave 'defaults' in an untouched state where we don't lose the ability to access the properties or functions found in it a later point 
		-  (b) Gain the ability to use the decorated properties and functions found in 'options'
-   objects can be wrapped or 'decorated' with new behavior and then continue to be used without needing to worry about the base object being modi- fied.

### Flyweight
- Applying on the data layer 
	- large quantities of similar objects
	- two states
		- extrinsic
			- removed and stored externally
			- manager handles extrinsic states
		- intrinsic
			- required by internal methods in objects
			- objects with same intrinsic data can be replaced with single shared object from factory method
	- **example**
		- You are using thousands of book Objects to represent books in library would overwhelm memory
		- Separate into intrinsic data (title, author) and extrinsic (patron checked out to, due date)
		- patron related data now moved out and handled by manager
		- make a factory 
			- checks to see if book with identitcal props (i.e. isbn) already created in system
			- if not, create new instance and store
		- (so, basically, your Factory creates bib records and checks for duplication)
		- BookRecordManager has bookRecordDatabase  , which links bib records to patron info, and allows methods (update checkout status, isPastDue, etc)
		- moving function (pointers?) to Manager requires less memory
- DOM layer
	- goal: "make triggering objects have little to no responsibility for actions they perform; abstract thsi responsibility to global manager"
	- e.g.
		- fish opens mouth (event) - click
		- bubbles rise (bubbling) - bubbling up
		- fly flies away when bubbles reach surface (action) - function running
	- central event manager / centralized event handling
		- this is just listening for events on all child elements

### Iteration
- a subset of the facade that deals specifically with iteration

### Strategy
- script selects particular algorithm at runtime
- clearly define families of algorithms
- allows algorithms to vary independent of the clients that use them
![[Pasted image 20210429150834.png]]

### Proxy
- class that is interface to something else

### Builder
- abstracts steps involved in creating objects so that different implementation of steps can construct different representations of objects
- ?? representations ??

## Creational
- Based on the concept of creating an object.



### Class

#### Factory Method This makes an instance of several derived classes based on interfaced
data or events.
Object
Abstract Factory Creates an instance of several families of classes without detailing concrete classes.
Builder Separates object construction from its representation, always creates the
same type of object.
Prototype A fully initialized instance used for copying or cloning.
Singleton A class with only a single instance with global access points.

Structural Based on the idea of building blocks of objects
Class
Adapter Match interfaces of different classes therefore classes can work together
despite incompatible interfaces
Object
Adapter Match interfaces of different classes therefore classes can work together
despite incompatible interfaces
Bridge Separates an object's interface from its implementation so the two can
vary independently
Composite A structure of simple and composite objects which makes the total object
more than just the sum of its parts.
Decorator Dynamically add alternate processing to objects.
Facade A single class that hides the complexity of an entire subsystem.
Flyweight A fine-grained instance used for efficient sharing of information that is
contained elsewhere.
Proxy A place holder object representing the true object
Behavioral Based on the way objects play and work together.
Class
Interpreter A way to include language elements in an application to match the
grammar of the intended language.
Template Method Creates the shell of an algorithm in a method, then defer the exact steps
