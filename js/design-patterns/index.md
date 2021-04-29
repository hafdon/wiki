# Javscript Design Patterns

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
- do: define interface for creating an object; the subclasses decide which class to instantiate
  - that is, subclasses can override the object-creation method to specify the type of factory product
  - quite useful if creation processis complex / depends on settings

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
