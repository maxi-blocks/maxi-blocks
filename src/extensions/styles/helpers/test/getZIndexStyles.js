import getZIndexStyles from '../getZIndexStyles';

describe('getZIndexStyle', () => {
	it('Get a correct style', () => {
		const object = {
			'z-index-general': 1,
			'z-index-xxl': 2,
			'z-index-xl': 3,
			'z-index-l': 4,
			'z-index-m': 5,
			'z-index-s': 6,
			'z-index-xs': 7,
		};
		const result = getZIndexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
