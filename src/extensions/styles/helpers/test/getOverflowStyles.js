import getOverflowStyles from '@extensions/styles/helpers/getOverflowStyles';

describe('getOverflowStyles', () => {
	it('Get a correct overflow styles with default values', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct overflow styles when all values visible', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'visible',
			'overflow-x-xxl': 'visible',
			'overflow-y-xxl': 'visible',
			'overflow-x-xl': 'visible',
			'overflow-y-xl': 'visible',
			'overflow-x-l': 'visible',
			'overflow-y-l': 'visible',
			'overflow-x-m': 'visible',
			'overflow-y-m': 'visible',
			'overflow-x-s': 'visible',
			'overflow-y-s': 'visible',
			'overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct overflow styles', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'hidden',
			'overflow-x-xxl': 'hidden',
			'overflow-y-xxl': 'visible',
			'overflow-x-xl': 'auto',
			'overflow-y-xl': 'clip',
			'overflow-x-l': 'clip',
			'overflow-y-l': 'auto',
			'overflow-x-m': 'scroll',
			'overflow-y-m': 'scroll',
			'overflow-x-s': 'auto',
			'overflow-y-s': 'auto',
			'overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
