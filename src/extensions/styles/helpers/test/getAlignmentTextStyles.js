import getAlignmentTextStyles from '@extensions/styles/helpers/getAlignmentTextStyles';

describe('getAlignmentTextStyles', () => {
	it('Get a correct alignment text styles', () => {
		const object = {
			'text-alignment-general': 'right',
			'text-alignment-xxl': 'left',
			'text-alignment-xl': 'right',
			'text-alignment-l': 'left',
			'text-alignment-m': 'right',
			'text-alignment-s': 'left',
			'text-alignment-xs': 'right',
		};

		const result = getAlignmentTextStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct alignment text styles for a list', () => {
		const object = {
			'text-alignment-general': 'right',
			'text-alignment-xxl': 'center',
			'text-alignment-l': 'justify',
		};

		const result = getAlignmentTextStyles(object, 'list');
		expect(result).toMatchSnapshot();
	});
});
