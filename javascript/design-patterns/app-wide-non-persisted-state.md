in vue3

1. composition function
	1. (in composables folder)
		1. import that function into componenet
2. in composable file:
	1. 	import reactive ffrom vue
	2. e.g.	composition function returns Set, and Toggles
	3. put your `Set` outside the function so that there's only one instance of it (basically you're using the 'private variable' of the module pattern )
`let emails = reactive(new Set())`
1. organize component by feature
![[Pasted image 20210430014029.png]]
![[Pasted image 20210430014136.png]]
https://www.vuemastery.com/courses/vue-3-essentials/modularizing
	- best practice: show objects
	![[Pasted image 20210430014245.png]]

https://www.vuemastery.com/courses/build-a-gmail-clone-with-vue3/app-wide-non-persisted-state



![[Pasted image 20210430025626.png]]