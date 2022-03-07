import getColumnSizeStyles from '../getColumnSizeStyles';

describe('getColumnSizeStyles', () => {
	it('Get a correct column size styles', () => {
		const object = {
			'column-size-general': '1',
			'column-size-xxl': '2',
			'column-size-xl': '3',
			'column-size-l': 'auto',
			'column-size-m': '1',
			'column-size-s': '2',
			'column-size-xs': '3',
		};

		const result = getColumnSizeStyles(object);
		expect(result).toMatchSnapshot();
	});
});
