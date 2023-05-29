import getBreakpointFromAttribute from '../getBreakpointFromAttribute';

describe('getBreakpointFromAttribute', () => {
	it('Some examples', () => {
		expect(getBreakpointFromAttribute('testing-g')).toBe('g');
		expect(getBreakpointFromAttribute('test')).toBeFalsy();
		expect(getBreakpointFromAttribute('test-')).toBeFalsy();
	});
});
