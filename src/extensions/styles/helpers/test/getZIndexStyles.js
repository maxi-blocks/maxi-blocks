import getZIndexStyles from '../getZIndexStyles';

describe('getZIndexStyle', () => {
	it('Get a correct z-index style', () => {
		const object = {
			'_zi-general': 1,
			'_zi-xxl': 2,
			'_zi-xl': 3,
			'_zi-l': 4,
			'_zi-m': 5,
			'_zi-s': 6,
			'_zi-xs': 7,
		};

		const result = getZIndexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
