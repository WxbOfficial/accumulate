export function toPokemonUpperCase(input) {
	return input.replace(/([a-z]+)/g, s => s.toUpperCase());
}

export function clampInt(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

export function randGauss(value) {
	let rand = 0;
	for (var i = value; i > 0; i--)
		rand += Math.random();
	return rand / value;
}

export function padInt(value, length, padWith) {
	if (!padWith)
		padWith = '0';
	let valueStr = value.toString();
	while (valueStr.length < length)
		valueStr = `${padWith}${valueStr}`;
	return valueStr;
}

export function randInt(range, min) {
	if (!min)
		min = 0;
	return Math.floor(Math.random() * range) + min;
}

export function binToDec(input) {
	let place = [];
	let binary = [];

	let decimalNum = 0;

	for (let i = 0; i < input.length; i++) {
		binary.push(input[i]);
		place.push(Math.pow(2, i));
		decimalNum += place[i] * parseInt(binary[i]);
	}

	return decimalNum;
}

export function decToBin(input) {
	let bin = '';
	let intNum = input;
	while (intNum > 0) {
		bin = intNum % 2 ? `1${bin}` : `0${bin}`;
		intNum = Math.floor(intNum * 0.5);
	}

	return bin;
}

export function getEnumValues(enumType) {
	return Object.values(enumType).filter(v => !isNaN(parseInt(v.toString()))).map(v => parseInt(v.toString()));
}

export class IntegerHolder {
	constructor(value) {
		this.value = value;
	}
}