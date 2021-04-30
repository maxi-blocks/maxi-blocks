import getDisplayStyles from '../getDisplayStyles';

describe('getDisplayStyles', () => {
	it('Get a correct Display Styles', () => {
		const object = {
			'display-general': 'styles',
			'display-xxl': 'styles',
			'display-xl': 'styles',
			'display-l': 'styles',
			'display-m': 'styles',
			'display-s': 'styles',
			'display-xs': 'styles',
		};

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
	});
});
