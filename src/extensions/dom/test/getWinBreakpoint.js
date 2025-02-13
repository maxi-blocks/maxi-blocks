import getWinBreakpoint from '@extensions/dom/getWinBreakpoint';

describe('getWinBreakpoint', () => {
	it('Returns the correct breakpoint', () => {
		expect(getWinBreakpoint(1025)).toBe('l');
		expect(getWinBreakpoint(1024)).toBe('m');
		expect(getWinBreakpoint(767)).toBe('s');
		expect(getWinBreakpoint(480)).toBe('xs');
	});

	it('Should return the correct breakpoint with custom breakpoints', () => {
		expect(getWinBreakpoint(1, { xl: 1, xxl: 2 })).toBe('xl');
	});
});
