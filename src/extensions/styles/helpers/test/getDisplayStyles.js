import getDisplayStyles from '../getDisplayStyles';

describe('getDisplayStyles', () => {
	it('Get a correct display styles', () => {
		const object = {
			'display-general': 'block',
			'display-xxl': 'block',
			'display-xl': 'block',
			'display-l': 'block',
			'display-m': 'flex',
			'display-s': 'flex',
			'display-xs': 'flex',
		};

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
	});
});
