import getAlignmentFlexStyles from '../getAlignmentFlexStyles';

describe('getAlignmentFlexStyles', () => {
	it('Get a correct alignment flex styles', () => {
		const object = {
			'_a-general': 'right',
			'_a-xxl': 'left',
			'_a-xl': 'right',
			'_a-l': 'left',
			'_a-m': 'right',
			'_a-s': 'left',
			'_a-xs': 'right',
		};

		const result = getAlignmentFlexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
