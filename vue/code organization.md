https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/code-organization

- check how this onMounted works when you extract it into a function

- refactoring code  based on features, rather than co-existing in a single component

- a "god function" a big function; a function that is too long

where to store reusable composition functions
- `use` directory
- `composition` directory
- no common convention so far

### other patterns
**extension between components**
- with options API, you have `extends`
- with composition API (`setup`) 
-  export function setup()
	-  include `setup` (no parens) in your `export default`
-  can import that exported `setup()` in other `.vue` files
	-  the api has supported this for some time, according to EY

## logic reuse
- https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/logic-reuse
- objectively better than mixins
- vue3: you can directly use text instead of a template, instead of requiring a root template ?

## composition api example
https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/Composition-api-example
`jsonplaceholder.` -- fake data urls
- reason for returning object of refs allows user to destructure
	- you can't destructure a reactive object without losing the reactivity on the props
	- you'd have to do `toRefs(state)` -- so just use `ref(x)` in the first place
	- you can then move that logic around
	- but if everything is refs, you can move it around better
	- remember that, in the `setup` function, you have to use `x.value` 
- if you have to cater to more diverse use case
	- with dynamic id in url, for instance, 
		- pass in a function: 
		- wrap the whole thing in `watchEffect` to register the dependency
		- remember to reset `isPending` state -- so like you do with an async function 
- `watchEffect` will also stop if the dependencies its watching are destroyed
	- so many  functions-as-arguments for this to work	

## vue3 getting familiar with sourcecode
- typescript
- type system serves as guide to follow along
- type information is additional documentation
- power of composition API, learning more:
	- no standar name convention yet
	- search 'vue composition' on github or npm
	- composition api, very similar to react hooks
		- any type of react hooks can be ported to vue composition api
- render functions: veutify source code. 100% written with render functions
- composition API: ??