import getDisplayStyles from '../getDisplayStyles';

describe('getDisplayStyles', () => {
	it('Get a correct Display Styles', () => {
		const object = {
			'display-general': 'test',
			'display-xxl': 'test',
			'display-xl': 'test',
			'display-l': 'test',
			'display-m': 'test',
			'display-s': 'test',
			'display-xs': 'test',
		};

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
	});
});
