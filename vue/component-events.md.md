
### differences between vue2 and vue3
#### emitting events
##### checkbox
```js
// vue2 convention
<input 
	@change="$emit('input', $event.target.checked)"
	:checked="value"
/>

// vue3 convention
// vue3 automatically detects 'update:modelValue' as component emission
<input 
	@change="$emit('update:modelValue', $event.target.checkbox)"
/>
// ..
export default {
	props: 
		{ modelValue: {} }
}
```

```js
@change (what the input naturally emits)
= "$emit('input', )" // 'input' is what v-model prop expects for v-model binding
```

### Customizing Component v-model
https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model