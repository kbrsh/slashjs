const Slash = require("../dist/slash.js");

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if(condition === true) {
    passed++;
    console.log(`\x1b[32m✔️ ${message}\x1b[0m`);
  } else {
    failed++;
    console.log(`\x1b[31m❌ ${message}\x1b[0m`);
  }
}

const finish = () => {
  console.log("\n");
  if(failed > 0) {
    console.log(`\x1b[31mFAIL ${passed} tests passing, ${failed} tests failing\x1b[0m`);
  } else {
    console.log(`\x1b[32mSUCCESS ${passed} tests passing\x1b[0m`);
  }
}

const eightSeperator = /(?=(?:........)*$)/
const split = (bin) => {
  return bin.split(eightSeperator).reverse();
}

let bytes = [];
let results = [];
let result = null;
for(let i = 0, j = 0; i < 256; i++, j += 8) {
  bytes.push(i);
  result = Slash(bytes, 2);
  results = results.concat(split(result));
}

results = results.map((item) => {
  return parseInt(item, 2);
});

const verificationHash = Slash(results, 16);
assert(verificationHash === "78EC56964338E9C8", "Passes Slash Verification Test");

assert(typeof Slash("string", 10) === "string", "Can hash a string");
assert(typeof Slash(bytes, 10) === "string", "Can hash an array of bytes");

finish();
