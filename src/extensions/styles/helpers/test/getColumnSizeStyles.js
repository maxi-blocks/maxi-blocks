import getColumnSizeStyles from '../getColumnSizeStyles';

const rowGapProps = {
	rowElements: ['', ''],
};

describe('getColumnSizeStyles', () => {
	it('Get a correct column size styles', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-size-l': 4,
			'column-size-m': 1,
			'column-size-s': 2,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some fit-content', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-fit-content-l': true,
			'column-size-s': 2,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some fullwidth columns', () => {
		const object = {
			'column-size-general': 100,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-fit-content-l': true,
			'column-size-s': 100,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with gap options', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-fit-content-l': true,
			'column-size-s': 2,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, {
			'row-gap-general': 20,
			'row-gap-unit-general': 'px',
			'column-gap-general': 2.5,
			'column-gap-unit-general': '%',
			'row-gap-xxl': 10,
			'row-gap-unit-xxl': 'px',
			'column-gap-xxl': 2.5,
			'column-gap-unit-xxl': 'px',
			rowElements: ['', ''],
		});
		expect(result).toMatchSnapshot();
	});
});
