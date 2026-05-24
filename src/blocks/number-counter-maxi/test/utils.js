import getNumberCounterDisplayValue, {
	getNumberCounterAnimationValue,
	getNumberCounterValueFromAnimation,
} from '@blocks/number-counter-maxi/utils';

describe('getNumberCounterDisplayValue', () => {
	it('preserves decimal number counter values', () => {
		expect(getNumberCounterDisplayValue(87.5)).toBe('87.5');
	});

	it('removes floating point precision noise', () => {
		expect(getNumberCounterDisplayValue(12.300000000000001)).toBe('12.3');
	});

	it('scales animation values to preserve sub-percent timing', () => {
		expect(getNumberCounterAnimationValue(0.5)).toBeCloseTo(1.8);
		expect(getNumberCounterValueFromAnimation(1.8)).toBeCloseTo(0.5);
	});

	it('formats decimal display values from scaled animation progress', () => {
		expect(
			getNumberCounterDisplayValue(
				getNumberCounterValueFromAnimation(
					getNumberCounterAnimationValue(12.3)
				)
			)
		).toBe('12.3');
	});
});
