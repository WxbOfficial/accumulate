/**
 * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
 * @param {number|string} number number to operate on
 * @param {number} fractionDigits number of fraction digits to "leave"
 * @return {number}
 */
const toFixed = codeMarkFunction((number, fractionDigits) => parseFloat(Number(number).toFixed(fractionDigits)), 'toFixed');

export { toFixed };
//# sourceMappingURL=toFixed.mjs.map
