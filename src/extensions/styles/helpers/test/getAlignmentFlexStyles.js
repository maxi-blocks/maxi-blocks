import getAlignmentFlexStyles from '../getAlignmentFlexStyles';

describe('getAlignmentFlexStyles', () => {
	it('Get a correct alignment flex styles', () => {
		const object = {
			'a-general': 'right',
			'a-xxl': 'left',
			'a-xl': 'right',
			'a-l': 'left',
			'a-m': 'right',
			'a-s': 'left',
			'a-xs': 'right',
		};

		const result = getAlignmentFlexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
