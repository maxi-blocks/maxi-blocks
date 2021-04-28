import getAlignmentFlexStyles from '../getAlignmentFlexStyles';

describe('getAlignmentFlexStyles', () => {
	it('Get a correct alignment', () => {
		const object = {
			'text-alignment-general': 'right',
			'text-alignment-xxl': 'left',
			'text-alignment-xl': 'right',
			'text-alignment-l': 'left',
			'text-alignment-m': 'right',
			'text-alignment-s': 'left',
			'text-alignment-xs': 'right',
		};

		const result = getAlignmentFlexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
