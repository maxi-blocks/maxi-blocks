import getAlignmentFlexStyles from '@extensions/styles/helpers/getAlignmentFlexStyles';

describe('getAlignmentFlexStyles', () => {
	it('Get a correct alignment flex styles', () => {
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
