import getBreakpoints from '@extensions/styles/helpers/getBreakpoints';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => ({
			receiveMaxiBreakpoints: jest.fn(),
		})),
	};
});

describe('getBreakpoints', () => {
	it('Get a correct breakpoint', () => {
		const object = {
			'breakpoints-general': 1800,
			'breakpoints-xl': 2000,
			'breakpoints-l': 1300,
			'breakpoints-m': 1000,
			'breakpoints-s': 800,
			'breakpoints-xs': 500,
		};
		const result = getBreakpoints(object);

		expect(result).toMatchSnapshot();
	});
});
