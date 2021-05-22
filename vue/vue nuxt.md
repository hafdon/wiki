Lau Tiam Kok - Hands-on Nuxt.js Web Development_ Build universal and static-generated Vue.js applications using Nuxt.js-Packt Publishing (2020).pdf

difference between app/ and src/

app has config files in it (except package.json)- at least the nuxt config file
src does not have config files in it - at least the nuxt config file

## cross-env
Now, the baseURL option is set to localhost:3000, or whatever BASE_URL is if it is
defined. We can set BASE_URL in package.json, as follows:
// package.json "scripts": {
"start": "cross-env BASE_URL=https://your-domain-name.com nuxt start" }
You will need to install cross-env for the preceding example to work on Windows: $ npm i cross-env --save-dev 
p.64


---
**tags**
**links**
[[vue]] - [[nuxt]]