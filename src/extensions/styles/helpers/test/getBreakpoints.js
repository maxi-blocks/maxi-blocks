import getBreakpoints from '../getBreakpoints';
import '../../../store';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';

describe('getBreakpoints', () => {
	it('Get a correct breakpoint', () => {
		const object = parseLongAttrObj({
			'breakpoints-general': 1800,
			'breakpoints-xl': 2000,
			'breakpoints-l': 1300,
			'breakpoints-m': 1000,
			'breakpoints-s': 800,
			'breakpoints-xs': 500,
		});

		const result = getBreakpoints(object);
		expect(result).toMatchSnapshot();
	});
});
