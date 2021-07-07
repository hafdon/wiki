https://www.vuemastery.com/courses/watch-us-build-trello-clone/tour-of-the-app

I think these two syntaxes are equivalent, but is one of them best practice? (lesson code is at the bottom)

```js
// getters
getTask: state =>(id) => {
    for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) {
              return task
            }
          }
      }
}
```

**/src/store.js**

```javascript
  ...
  state: {
    board
  },
  getters: { // <-- Add a getter
    getTask (state) {
      return (id) => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) {
              return task
            }
          }
        }
      }
    }
  },
  mutations: {}
})
```