import getAlignmentTextStyles from '../getAlignmentTextStyles';

describe('getAlignmentTextStyles', () => {
	it('Get a correct alignment text styles', () => {
		const object = {
			'_ta-general': 'right',
			'_ta-xxl': 'left',
			'_ta-xl': 'right',
			'_ta-l': 'left',
			'_ta-m': 'right',
			'_ta-s': 'left',
			'_ta-xs': 'right',
		};

		const result = getAlignmentTextStyles(object);
		expect(result).toMatchSnapshot();
	});
});
