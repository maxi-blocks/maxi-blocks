import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';

describe('getAttrKeyWithoutBreakpoint', () => {
	it('should return the key without the breakpoint', () => {
		expect(getAttrKeyWithoutBreakpoint('test')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-general')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-xxl')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-xl')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-l')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-m')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-s')).toBe('test');
		expect(getAttrKeyWithoutBreakpoint('test-xs')).toBe('test');

		expect(getAttrKeyWithoutBreakpoint('test-general-hover')).toBe(
			'test-hover'
		);
		expect(getAttrKeyWithoutBreakpoint('test-s-s-s')).toBe('test-s-s');
	});
});
