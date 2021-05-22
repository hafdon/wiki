in the following, you only need to `return` what will be used in the `<template>`
```js
setup(props, context) {
	let fn1 = () => {}
	let fn2 = () => {}
//	[...]
	fn2()
	return {
		fn1
	}
}