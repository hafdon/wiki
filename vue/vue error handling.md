https://www.vuemastery.com/courses/next-level-vue/404-error-handling

es6-string- highlighting?

eager vs. lazy (like lazy-loading)

## **JavaScript void Operator**

The void operator checks the given expression and then returns [**undefined**](https://appdividend.com/2019/02/15/javascript-typeof-example-typeof-operator-tutorial/).

You can use a void operator to get the value of **undefined**. This will work even if the global **window.undefined** value has been overwritten.

###  vue3
onRenderTrigger(ed)?

- Render functions
	- https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/how-to-use-render-functions
	- i don't understand how it's recursive

### animating vue
- https://www.vuemastery.com/courses/animating-vue/why-animate
- https://www.vuemastery.com/courses/animating-vue/transitions
	- `<transition name="e-g-fade">` component
		- `v-enter`, `v-enter-to` (default), `v-enter-active`
		- `v-leave` (default), `v-leave-to`, `v-leave-active`
 ```
<style>
.e-g-fade-enter .e-g-fade-leave-to {
opacity: 0;
}

.e-g-fade-enter-active,
.e-g-fade-leave-active{ 
transition: opacity 0.5s ease-out
}




```