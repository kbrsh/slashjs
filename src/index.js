const max = 0xFFFFFFFF;

const base = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const pad = (num) => {
  const length = num.length;
  if(length === 32) {
    return num;
  } else {
    const diff = 32 - length;
    let padded = "";

    for(let i = 0; i < diff; i++) {
      padded += "0";
    }

    return padded + num;
  }
}

const wrap = (str) => {
  let result = 0;

  for(let i = 0; i < str.length; i++) {
    result = ((result * 2) + (baseToInt[str[i]])) % max;
  }

  return result;
}

const add = (digits, amounts, length, radix) => {
  let carries = new Array(length);
  for(let i = length - 1; i >= 0; i--) {
    let current = digits[i];
    const amount = amounts[i];
    const carry = carries[i];

    if(current === undefined) {
      if(amount !== undefined) {
        digits[i] = amount;
      }

      if(carry !== undefined) {
        digits[i] = carry;
      }
    } else {
      current = current + amount;

      if(carry !== undefined) {
        current += carry;
      }

      if(current >= radix) {
        const previousIndex = i - 1;
        if(carries[previousIndex] === undefined) {
          carries[previousIndex] = 1;
        } else {
          carries[previousIndex] += 1;
        }

        digits[i] = current - radix;
      } else {
        digits[i] = current;
      }
    }
  }
}

function Long(high, low) {
  this.high = high;
  this.low = low;

  return this;
}

Long.prototype.toString = function(radix) {
  const binary = pad(this.high.toString(2)) + pad(this.low.toString(2));
  const resultLength = (((64 * Math.log(2)) / Math.log(radix)) | 0) + 1;
  let result = "";
  let resultDigits = new Array(resultLength);
  let power = new Array(resultLength);
  power[resultLength - 1] = 1;

  for(let i = 63; i >= 0; i--) {
    if(binary[i] === '1') {
      add(resultDigits, power, resultLength, radix);
    }

    add(power, power, resultLength, radix);
  }

  for(let i = 0; i < resultDigits.length; i++) {
    const digit = resultDigits[i];
    if(digit !== undefined) {
      result += base[digit];
    }
  }

  return result;
}

const Slash = (key, radix) => {
  if(radix === undefined) {
    radix = 36;
  }

  let result = new Long(0, 0);
  let i = 0;
  let bytes = key;

  if(typeof key === "string") {
    for(; i < key.length; i++) {
      bytes[i] = key.charCodeAt(i);
    }
  }

  for(i = 0; i < bytes.length; i++) {
    result = result.xor(bytes[i]).multiply(prime).rotateRight(7);
  }

  return result.toString(radix);
}
