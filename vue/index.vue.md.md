# vue information

## router

### optional slug
```js
  path: 'carryover/:row_id?',
```
## store

### access method of store parent
```vue
await dispatch(
  'collection/suggestion/splice',
  {
    suggestion: results.data,
  },
  { root: true }
)
```

### scoped slots
