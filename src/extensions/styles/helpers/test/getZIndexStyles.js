import getZIndexStyles from '@extensions/styles/helpers/getZIndexStyles';

describe('getZIndexStyle', () => {
	it('Get a correct z-index style', () => {
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
