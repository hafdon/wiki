# javascript info

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
