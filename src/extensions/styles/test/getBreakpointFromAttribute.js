import { getBreakpointFromAttribute } from '../utils';

describe('getBreakpointFromAttribute', () => {
	it('Some examples', () => {
		expect(getBreakpointFromAttribute('testing-general')).toBe('general');
		expect(getBreakpointFromAttribute('test')).toBeFalsy();
		expect(getBreakpointFromAttribute('test-')).toBeFalsy();
	});
});
