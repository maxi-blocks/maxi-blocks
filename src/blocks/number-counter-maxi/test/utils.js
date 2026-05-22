import getNumberCounterDisplayValue from '@blocks/number-counter-maxi/utils';

describe('getNumberCounterDisplayValue', () => {
	it('preserves decimal number counter values', () => {
		expect(getNumberCounterDisplayValue(87.5)).toBe('87.5');
	});

	it('removes floating point precision noise', () => {
		expect(getNumberCounterDisplayValue(12.300000000000001)).toBe('12.3');
	});
});
