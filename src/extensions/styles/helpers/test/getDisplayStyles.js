import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';
import getDisplayStyles from '../getDisplayStyles';

describe('getDisplayStyles', () => {
	it('Get a correct display styles', () => {
		const object = parseLongAttrObj({
			'd-general': 'block',
			'd-xxl': 'block',
			'd-xl': 'block',
			'd-l': 'block',
			'd-m': 'flex',
			'd-s': 'flex',
			'd-xs': 'flex',
		});

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
	});
});
