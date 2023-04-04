import getDisplayStyles from '../getDisplayStyles';

describe('getDisplayStyles', () => {
	it('Get a correct display styles', () => {
		const object = {
			'_d-general': 'block',
			'_d-xxl': 'block',
			'_d-xl': 'block',
			'_d-l': 'block',
			'_d-m': 'flex',
			'_d-s': 'flex',
			'_d-xs': 'flex',
		};

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
	});
});
