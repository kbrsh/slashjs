# Slash

A fast, efficient hash in Javascript.

### Usage

```js
const Slash = require("slashjs");

const stringHash = Slash("Hello Slash!");
const byteHash = Slash([65, 10, 17]);

const stringHash10 = Slash("Hello Slash!", 10);
const byteHash10 = Slash([65, 10, 17], 10);
```

`Slash` can take a string or array of bytes, and will return a 64 bit string hash in base 36. An optional `radix` parameter can also be specified (up to 36), and the output will be a string in that radix.

### Implementation

The implementation was verified by using the verification technique detailed [here](https://github.com/kbrsh/slash#verification). The reason for using strings and having an in-house 64 bit number system is because Javascript can only support bitwise operators on 32 bit numbers. Slash is a hash that returns 64 bit unsigned numbers.

This might be a little slow due to the amount of shifts and a circular rotate, and the fastest version is written in [Assembly](https://github.com/kbrsh/slash).

### License

Licensed under the [MIT License](https://kbrsh.github.io/license) by [Kabir Shah](https://kabir.ml).
