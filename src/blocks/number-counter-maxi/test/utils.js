import getNumberCounterDisplayValue, {
	getNumberCounterAnimationValue,
	getNumberCounterValueFromAnimation,
	getDecimalPlaces,
} from '@blocks/number-counter-maxi/utils';

describe('getDecimalPlaces', () => {
	it('returns 0 for whole numbers', () => {
		expect(getDecimalPlaces(100)).toBe(0);
		expect(getDecimalPlaces(0)).toBe(0);
	});

	it('returns correct count for decimals', () => {
		expect(getDecimalPlaces(87.5)).toBe(1);
		expect(getDecimalPlaces(12.34)).toBe(2);
	});
});

describe('getNumberCounterDisplayValue', () => {
	it('rounds intermediate animation values to whole numbers by default', () => {
		// 124 / 3.6 = 34.4444... should display as "34" when precision is 0
		expect(getNumberCounterDisplayValue(34.4444444, 0)).toBe('34');
	});

	it('preserves decimal number counter values at matching precision', () => {
		expect(getNumberCounterDisplayValue(87.5, 1)).toBe('87.5');
	});

	it('rounds intermediate values to requested decimal places', () => {
		// 84.7222... should display as "84.7" with 1 decimal place
		expect(getNumberCounterDisplayValue(84.72222, 1)).toBe('84.7');
	});

	it('removes floating point precision noise', () => {
		expect(getNumberCounterDisplayValue(12.300000000000001, 1)).toBe(
			'12.3'
		);
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
				),
				1
			)
		).toBe('12.3');
	});

	it('whole-number end values produce clean integers during animation', () => {
		const endNumber = 100;
		const precision = getDecimalPlaces(endNumber);
		// Simulate an intermediate frame: count=124 in 360-scale
		const intermediateValue = getNumberCounterValueFromAnimation(124);
		expect(getNumberCounterDisplayValue(intermediateValue, precision)).toBe(
			'34'
		);
	});

	it('single-decimal end values produce clean decimals during animation', () => {
		const endNumber = 87.5;
		const precision = getDecimalPlaces(endNumber);
		// Simulate an intermediate frame: count=305 in 360-scale
		const intermediateValue = getNumberCounterValueFromAnimation(305);
		expect(getNumberCounterDisplayValue(intermediateValue, precision)).toBe(
			'84.7'
		);
	});
});
