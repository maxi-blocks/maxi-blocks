import getColorRGBAParts from '../getColorRGBAParts';

describe('getColorRGBAParts', () => {
	it('Returns a decomposed RGBA', () => {
		const color = 'rgba(255,0,0,0.3)';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: '255,0,0', opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA color with variable', () => {
		const color = 'rgba(var(--maxi-light-color-8),0.3)';

		const result = getColorRGBAParts(color);
		const expectedResult = { color: 8, opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});

	it('Returns a decomposed RGBA with advanced division', () => {
		const color = 'rgba(255,0,0,0.3)';

		const result = getColorRGBAParts(color, true);
		const expectedResult = { r: 255, g: 0, b: 0, opacity: 0.3 };

		expect(result).toStrictEqual(expectedResult);
	});
});
