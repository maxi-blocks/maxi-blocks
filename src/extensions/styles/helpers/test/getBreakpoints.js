import getBreakpoints from '../getBreakpoints';
import '../../../store';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';

describe('getBreakpoints', () => {
	it('Get a correct breakpoint', () => {
		const object = parseLongAttrObj({
			'_bp-general': 1800,
			'_bp-xl': 2000,
			'_bp-l': 1300,
			'_bp-m': 1000,
			'_bp-s': 800,
			'_bp-xs': 500,
		});

		const result = getBreakpoints(object);
		expect(result).toMatchSnapshot();
	});
});
