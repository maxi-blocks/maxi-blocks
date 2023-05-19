import getOverflowStyles from '../getOverflowStyles';

describe('getOverflowStyles', () => {
	it('Get a correct overflow styles with default values', () => {
		const object = {
			'_ox-general': 'visible',
			'_oy-general': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct overflow styles when all values visible', () => {
		const object = {
			'_ox-general': 'visible',
			'_oy-general': 'visible',
			'_ox-xxl': 'visible',
			'_oy-xxl': 'visible',
			'_ox-xl': 'visible',
			'_oy-xl': 'visible',
			'_ox-l': 'visible',
			'_oy-l': 'visible',
			'_ox-m': 'visible',
			'_oy-m': 'visible',
			'_ox-s': 'visible',
			'_oy-s': 'visible',
			'_ox-xs': 'visible',
			'_oy-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct overflow styles', () => {
		const object = {
			'_ox-general': 'visible',
			'_oy-general': 'hidden',
			'_ox-xxl': 'hidden',
			'_oy-xxl': 'visible',
			'_ox-xl': 'auto',
			'_oy-xl': 'clip',
			'_ox-l': 'clip',
			'_oy-l': 'auto',
			'_ox-m': 'scroll',
			'_oy-m': 'scroll',
			'_ox-s': 'auto',
			'_oy-s': 'auto',
			'_ox-xs': 'visible',
			'_oy-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
