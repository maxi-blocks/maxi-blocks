import getBreakpoints from '../getBreakpoints';
import '@wordpress/block-editor';

describe('getBeakpoints', () => {
	it('Get a correct beakpoint', () => {
		const object = {
			'breakpoints-general': '1',
			'breakpoints-xl': '2',
			'breakpoints-l': '3',
			'breakpoints-m': '4',
			'breakpoints-s': '5',
			'breakpoints-xs': '6',
		};
		const result = getBreakpoints(object);
		expect(result).toMatchSnapshot();
	});
});
