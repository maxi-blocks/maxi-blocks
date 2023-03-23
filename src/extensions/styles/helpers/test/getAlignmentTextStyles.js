import parseLongAttrObj from '../../dictionary/parseLongAttrObj';
import getAlignmentTextStyles from '../getAlignmentTextStyles';

describe('getAlignmentTextStyles', () => {
	it('Get a correct alignment text styles', () => {
		const object = parseLongAttrObj({
			'text-alignment-general': 'right',
			'text-alignment-xxl': 'left',
			'text-alignment-xl': 'right',
			'text-alignment-l': 'left',
			'text-alignment-m': 'right',
			'text-alignment-s': 'left',
			'text-alignment-xs': 'right',
		});

		const result = getAlignmentTextStyles(object);
		expect(result).toMatchSnapshot();
	});
});
