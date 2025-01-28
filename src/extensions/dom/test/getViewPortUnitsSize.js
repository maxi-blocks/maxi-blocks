import getVwSize from '@extensions/dom/getViewPortUnitsSize';

describe('getViewPortUnitsSize', () => {
	it('Should return the correct size', () => {
		expect(getVwSize('xxl')).toBe(100);
	});
});
