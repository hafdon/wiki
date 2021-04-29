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
  
  - consider defining a simple template (e.g. for namespacing, public, and private variables) ?
  - doesn't using iife make this still a singleton?

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
