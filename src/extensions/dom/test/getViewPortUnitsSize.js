import getVwSize from '@extensions/dom/getViewPortUnitsSize';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		receiveXXLSize: jest.fn(() => 100),
		receiveMaxiBreakpoints: jest.fn(() => ({
			xxl: 100,
			xl: 50,
			m: 25,
			s: 10,
		})),
	})),
}));

describe('getViewPortUnitsSize', () => {
	it('Should return 1/100 of the breakpoint width', () => {
		expect(getVwSize('xxl')).toBe(1);
		expect(getVwSize('xl')).toBe(0.5);
		expect(getVwSize('m')).toBe(0.25);
		expect(getVwSize('s')).toBe(0.1);
	});
});
