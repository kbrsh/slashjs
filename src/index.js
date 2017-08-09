const max = 0xFFFFFFFF;

const baseToInt = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '13': 13,
  '14': 14,
  '15': 15,
  '16': 16,
  '17': 17,
  '18': 18,
  '19': 19,
  '20': 20,
  '21': 21,
  '22': 22,
  '23': 23,
  '24': 24,
  '25': 25,
  '26': 26,
  '27': 27,
  '28': 28,
  '29': 29,
  '30': 30,
  '31': 31,
  '32': 32,
  '33': 33,
  '34': 34,
  '35': 35
}

const intToBase = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 'A',
  '11': 'B',
  '12': 'C',
  '13': 'D',
  '14': 'E',
  '15': 'F',
  '16': 'G',
  '17': 'H',
  '18': 'I',
  '19': 'J',
  '20': 'K',
  '21': 'L',
  '22': 'M',
  '23': 'N',
  '24': 'O',
  '25': 'P',
  '26': 'Q',
  '27': 'R',
  '28': 'S',
  '29': 'T',
  '30': 'U',
  '31': 'V',
  '32': 'W',
  '33': 'X',
  '34': 'Y',
  '35': 'Z'
}

const pad = (str) => {
  const length = str.length;
  if(str.length === 32) {
    return str;
  } else {
    const diff = 32 - length;
    let padded = "";
    for(let i = 0; i < diff; i++) {
      padded += "0";
    }
    padded += str;
    return padded;
  }
}

const padRight = (str, amount) => {
  for(let i = 0; i < amount; i++) {
    str += "0";
  }

  return str;
}

const wrap = (str) => {
  let result = 0;

  for(let i = 0; i < str.length; i++) {
    result = ((result * 2) + (baseToInt[str[i]])) % max;
  }

  return result;
}

function Long(high, low) {
  this.high = high;
  this.low = low;

  this.__long__ = true;

  return this;
}

Long.prototype.or = function(value) {
  if(value.__long__ === undefined) {
    value = new Long(0, value);
  }

  return new Long((this.high | value.high) >>> 0, (this.low | value.low) >>> 0);
}

Long.prototype.xor = function(value) {
  if(value.__long__ === undefined) {
    value = new Long(0, value);
  }

  return new Long((this.high ^ value.high) >>> 0, (this.low ^ value.low) >>> 0);
}

Long.prototype.shiftLeft = function(value) {
  if(value < 32) {
    let shiftedHigh = (this.high << value) >>> 0;
    let shiftedLow = (this.low << value) >>> 0;

    if(shiftedHigh < 0) {
      shiftedHigh = wrap(padRight(this.high.toString(2), value));
    }

    if(shiftedLow < 0) {
      shiftedLow = wrap(padRight(this.low.toString(2), value));
    }

    return new Long((shiftedHigh) | (this.low >>> (32 - value)), shiftedLow);
  } else {
    let shiftBy = value - 32;
    let shiftedLow = (this.low << shiftBy) >>> 0;

    if(shiftedLow < 0) {
      shiftedLow = wrap(padRight(this.low.toString(2), shiftBy));
    }

    return new Long(shiftedLow, 0);
  }
}

Long.prototype.shiftRight = function(value) {
  return new Long(this.high >>> value, (this.low >>> value) | (this.high << (32 - value)));
}

Long.prototype.rotateRight = function(value) {
  return this.shiftRight(value).or(this.shiftLeft(64 - value));
}

Long.prototype.toString = function(radix) {
  if(radix === undefined) {
    radix = 10;
  }

  let binary = pad(this.high.toString(2)) + pad(this.low.toString(2));
  let result = "";
  let i = 0;
  let bit = 0;
  let end = [];
  let calc = 0;
  let quotient = 0;
  let remainder = 0;

  while(binary.length !== 0) {
    remainder = 0;
    end = [];
    for(i = 0; i < binary.length; i++) {
      bit = baseToInt[binary[i]];
      calc = bit + (remainder * 2);
      quotient = (calc / radix) | 0;
      remainder = calc % radix;
      if((end.length !== 0) || (quotient !== 0)) {
        end.push(quotient);
      }
    }
    binary = end;
    result = intToBase[remainder] + result;
  }

  return result;
}

const Slash = (key, radix) => {
  if(radix === undefined) {
    radix = 36;
  }

  let result = new Long(0, 1);
  let i = 0;
  let bytes = [];

  if(typeof key === "string") {
    for(; i < key.length; i++) {
      bytes[i] = key.charCodeAt(i);
    }
  } else {
    bytes = key;
  }

  for(i = 0; i < bytes.length; i++) {
    result = result.xor(result.shiftLeft(9).xor(result.shiftLeft(16).xor(result.shiftLeft(17).xor(result.shiftLeft(20).xor(result.shiftLeft(24).xor(result.shiftLeft(26).xor(result.shiftLeft(28).xor(result.shiftLeft(32).xor(result.shiftLeft(33).xor(result.shiftLeft(41).xor(result.shiftLeft(48).xor(result.shiftLeft(52).xor(result.shiftLeft(53).xor(result.shiftLeft(54).xor(result.shiftLeft(56).xor(result.shiftLeft(61).xor(result.shiftLeft(63)))))))))))))))))).xor(bytes[i]).rotateRight(7);
  }

  return result.toString(radix);
}
