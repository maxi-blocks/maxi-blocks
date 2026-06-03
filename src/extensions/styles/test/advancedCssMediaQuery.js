import {
	buildAdvancedCssMediaQueryTarget,
	isAdvancedCssMediaQueryTarget,
} from '@extensions/styles/advancedCssMediaQuery';

describe('advancedCssMediaQuery', () => {
	it('returns false for non-string media query targets', () => {
		expect(isAdvancedCssMediaQueryTarget(null)).toBe(false);
		expect(isAdvancedCssMediaQueryTarget(undefined)).toBe(false);
		expect(isAdvancedCssMediaQueryTarget({})).toBe(false);
	});

	it('detects built media query targets', () => {
		expect(
			isAdvancedCssMediaQueryTarget(
				buildAdvancedCssMediaQueryTarget('@media screen', ' .selector')
			)
		).toBe(true);
	});
});
