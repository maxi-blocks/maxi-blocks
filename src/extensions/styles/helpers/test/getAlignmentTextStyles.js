import getAlignmentTextStyles from '../getAlignmentTextStyles';

describe('getAlignmentTextStyles', () => {
	it('Get a correct alignment text styles', () => {
		const object = {
			'ta-general': 'right',
			'ta-xxl': 'left',
			'ta-xl': 'right',
			'ta-l': 'left',
			'ta-m': 'right',
			'ta-s': 'left',
			'ta-xs': 'right',
		};

		const result = getAlignmentTextStyles(object);
		expect(result).toMatchSnapshot();
	});
});
