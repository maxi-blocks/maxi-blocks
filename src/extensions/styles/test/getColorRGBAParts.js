import getColorRGBAParts from '@extensions/styles/getColorRGBAParts';

describe('getColorRGBAParts', () => {
	it('Returns a decomposed RGBA', () => {
		const color = 'rgba(255,0,0,0.3)';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: '255,0,0', opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA from HEX value', () => {
		const color = '#ff0000';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: '255,0,0', opacity: 1 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA color with variable', () => {
		const color = 'rgba(var(--maxi-light-color-8),0.3)';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: 8, opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA color with variable and backup', () => {
		const color = 'rgba(var(--maxi-light-color-8, 255,255,255),0.3)';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: 8, opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA with advanced division', () => {
		const color = 'rgba(255,0,0,0.3)';

		const result = getColorRGBAParts(color, true);
		const expectedResult = { r: 255, g: 0, b: 0, a: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns false if the color is empty or not a string', () => {
		expect(getColorRGBAParts('')).toStrictEqual(false);
		expect(getColorRGBAParts(null)).toStrictEqual(false);
	});
});
