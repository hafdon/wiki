# javascript coding tips

## destructuring

If `a` has property `b` which is `null`:  
`let a = {b: null}'`

and then you restructure `a` and provide a default value:  
`let {b = ''} : a`

this default value **is only assigned to `b`** if `b` is not a property of `a`  
and you will get errors if you try to treat `b` like a `string`  
because it is still a property with `value = null`
```
console.log(a)
-- {b : null}

b.replace('c', '')
-- TypeError: Cannot read property 'replace' of null
```

## function to write to file

```js
const fs = require('fs-extra');

const writeFile = async function(req, filename) {
    try {
        await fs.writeFile(
            `${filename}.json`,
            JSON.stringify({
                req_body: req.body,
                req_params: req.params,
                req_query: req.query,
            })
        );
        console.log('success!');
    } catch (err) {
        console.log(`Error writing to ${filename}`) 
        console.error(err);
    }
}
   ```
