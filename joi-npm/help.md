# Allow any other object key

Use `object.unknown(true)`

```js
const schema = Joi.object().keys({
  a: Joi.string().required(),
  b: Joi.string().required()
}).unknown(true);
```

[Source](https://stackoverflow.com/questions/49897639/how-to-allow-any-other-key-in-joi/50283034)
