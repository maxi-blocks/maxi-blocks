import getAlignmentFlexStyles from '../getAlignmentFlexStyles';

describe('getAlignmentFlexStyles', () => {
	it('Get a correct alignment', () => {
		const object = {
			'alignment-general': 'right',
			'alignment-xxl': 'left',
			'alignment-xl': 'right',
			'alignment-l': 'left',
			'alignment-m': 'right',
			'alignment-s': 'left',
			'alignment-xs': 'right',
		};

		const result = getAlignmentFlexStyles(object);
		expect(result).toMatchSnapshot();
	});
});
